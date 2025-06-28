import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, X, Loader2, File, Image, FileText, Video, Music } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

interface MediaUploadProps {
  bucket: string;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
  multiple?: boolean;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  title?: string;
  description?: string;
  accept?: string;
  showPreview?: boolean;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  bucket,
  folder = '',
  allowedTypes = ['image/*', 'application/pdf', 'text/plain'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  onUploadComplete,
  onUploadError,
  title = 'Upload Media',
  description = 'Select files to upload',
  accept,
  showPreview = true
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFiles, setPreviewFiles] = useState<Array<{ file: File; preview?: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (file.type.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (file.type.startsWith('audio/')) return <Music className="w-6 h-6" />;
    if (file.type === 'application/pdf') return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles: Array<{ file: File; preview?: string }> = [];
    
    for (const file of files) {
      // Check file type
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an allowed file type`,
          variant: "destructive",
        });
        continue;
      }

      // Check file size
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${formatFileSize(maxSize)}`,
          variant: "destructive",
        });
        continue;
      }

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/') && showPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview = e.target?.result as string;
          setPreviewFiles(prev => 
            prev.map(pf => 
              pf.file === file ? { ...pf, preview } : pf
            )
          );
        };
        reader.readAsDataURL(file);
      }

      validFiles.push({ file, preview });
    }

    if (validFiles.length > 0) {
      setPreviewFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    }
  };

  const uploadFiles = async () => {
    if (previewFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < previewFiles.length; i++) {
        const { file } = previewFiles[i];
        
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const fileName = `${timestamp}-${randomId}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);

        // Update progress
        const progress = ((i + 1) / previewFiles.length) * 100;
        setUploadProgress(progress);
      }

      // Call success callback
      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }

      toast({
        title: "Success",
        description: `Successfully uploaded ${uploadedUrls.length} file(s)`,
      });

      // Clear previews
      setPreviewFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload files';
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setPreviewFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || allowedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="w-full"
        >
          <Camera className="w-4 h-4 mr-2" />
          Choose Files
        </Button>

        {/* File Requirements */}
        <div className="text-xs text-muted-foreground">
          <p>Allowed types: {allowedTypes.join(', ')}</p>
          <p>Maximum size: {formatFileSize(maxSize)}</p>
          {multiple && <p>Multiple files allowed</p>}
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* File Previews */}
        {previewFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Selected Files ({previewFiles.length})</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={uploading}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              {previewFiles.map(({ file, preview }, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                      {getFileIcon(file)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <Button
              onClick={uploadFiles}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {previewFiles.length} File{previewFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 