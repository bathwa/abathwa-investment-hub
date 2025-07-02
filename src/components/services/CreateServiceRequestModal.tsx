
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, FileText, Plus, X } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import type { CreateServiceRequestData } from '@/types/services';

interface CreateServiceRequestModalProps {
  trigger: React.ReactNode;
  associatedEntityId?: string;
  associatedEntityType?: 'opportunity' | 'investment';
  onSuccess?: () => void;
}

export const CreateServiceRequestModal: React.FC<CreateServiceRequestModalProps> = ({
  trigger,
  associatedEntityId,
  associatedEntityType,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { useServiceCategories, createServiceRequest } = useServices();
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories();

  const form = useForm<CreateServiceRequestData>({
    defaultValues: {
      associated_entity_id: associatedEntityId,
      associated_entity_type: associatedEntityType,
      currency: 'USD',
      broadcast_to_all: false,
      deliverables: [],
    },
  });

  const selectedCategoryData = categories?.find(cat => cat.id === selectedCategory);

  const handleAddDeliverable = () => {
    if (newDeliverable.trim() && !deliverables.includes(newDeliverable.trim())) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleAddDefaultDeliverable = (deliverable: string) => {
    if (!deliverables.includes(deliverable)) {
      setDeliverables([...deliverables, deliverable]);
    }
  };

  const onSubmit = async (data: CreateServiceRequestData) => {
    try {
      await createServiceRequest.mutateAsync({
        ...data,
        deliverables,
        service_category_id: selectedCategory,
      });
      
      setOpen(false);
      form.reset();
      setDeliverables([]);
      setSelectedCategory('');
      onSuccess?.(
      );
    } catch (error) {
      console.error('Error creating service request:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Service Request
          </DialogTitle>
        </DialogHeader>

        <LoadingWrapper loading={categoriesLoading}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Service Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{category.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Request Title *</Label>
              <Input
                {...form.register('title', { required: 'Title is required' })}
                placeholder="Brief title for your service request"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Scope Description */}
            <div className="space-y-2">
              <Label htmlFor="scope">Detailed Scope Description *</Label>
              <Textarea
                {...form.register('scope_description', { 
                  required: 'Scope description is required' 
                })}
                placeholder="Provide a comprehensive description of the work you need done..."
                className="min-h-[100px]"
              />
              {form.formState.errors.scope_description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.scope_description.message}
                </p>
              )}
            </div>

            {/* Deliverables */}
            <div className="space-y-4">
              <Label>Expected Deliverables</Label>
              
              {/* Default deliverables from category */}
              {selectedCategoryData?.default_deliverables.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Suggested Deliverables for {selectedCategoryData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedCategoryData.default_deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{deliverable}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddDefaultDeliverable(deliverable)}
                          disabled={deliverables.includes(deliverable)}
                        >
                          {deliverables.includes(deliverable) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Custom deliverable input */}
              <div className="flex gap-2">
                <Input
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  placeholder="Add a specific deliverable..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddDeliverable}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected deliverables */}
              {deliverables.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {deliverables.map((deliverable, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {deliverable}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleRemoveDeliverable(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  type="date"
                  {...form.register('start_date')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  type="date"
                  {...form.register('end_date')}
                />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Proposed Budget (Optional)</Label>
              <div className="flex gap-2">
                <Select defaultValue="USD" onValueChange={(value) => form.setValue('currency', value)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="ZWL">ZWL</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register('proposed_budget', { valueAsNumber: true })}
                  placeholder="Enter proposed budget"
                />
              </div>
              {selectedCategoryData?.expected_budget_range && (
                <p className="text-sm text-muted-foreground">
                  Typical range: ${selectedCategoryData.expected_budget_range.min} - 
                  ${selectedCategoryData.expected_budget_range.max}
                </p>
              )}
            </div>

            {/* Broadcast option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="broadcast"
                {...form.register('broadcast_to_all')}
              />
              <Label htmlFor="broadcast" className="text-sm">
                Broadcast to all relevant service providers
              </Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createServiceRequest.isPending || !selectedCategory}
              >
                {createServiceRequest.isPending ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </form>
        </LoadingWrapper>
      </DialogContent>
    </Dialog>
  );
};
