
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, FileText, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import type { JobCard, JobCardStatus } from '@/types/services';

interface JobCardsListProps {
  workOrderId?: string;
  title?: string;
  showActions?: boolean;
}

const getStatusColor = (status: JobCardStatus) => {
  switch (status) {
    case 'not_started':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'awaiting_client_input':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'blocked':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatStatus = (status: JobCardStatus) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const StatusIcon: React.FC<{ status: JobCardStatus }> = ({ status }) => {
  switch (status) {
    case 'not_started':
      return <Clock className="h-4 w-4" />;
    case 'in_progress':
      return <MessageSquare className="h-4 w-4" />;
    case 'awaiting_client_input':
      return <AlertCircle className="h-4 w-4" />;
    case 'completed':
      return <FileText className="h-4 w-4" />;
    case 'blocked':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const JobCardsList: React.FC<JobCardsListProps> = ({
  workOrderId,
  title = 'Job Cards',
  showActions = true,
}) => {
  const [selectedCard, setSelectedCard] = useState<JobCard | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState<JobCardStatus>('not_started');

  const { useJobCards, updateJobCard } = useServices();
  const { data: jobCards, isLoading, error } = useJobCards(workOrderId);

  const handleUpdateClick = (card: JobCard) => {
    setSelectedCard(card);
    setNewStatus(card.status);
    setNewNote('');
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedCard) return;

    const progressNotes = newNote.trim() 
      ? [
          ...selectedCard.progress_notes,
          {
            note: newNote,
            timestamp: new Date().toISOString(),
          }
        ]
      : selectedCard.progress_notes;

    try {
      await updateJobCard.mutateAsync({
        id: selectedCard.id,
        data: {
          status: newStatus,
          progress_notes: progressNotes,
        },
      });
      
      setUpdateDialogOpen(false);
      setSelectedCard(null);
    } catch (error) {
      console.error('Error updating job card:', error);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading job cards</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <LoadingWrapper loading={isLoading}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="outline">{jobCards?.length || 0} job cards</Badge>
        </div>

        {jobCards?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No job cards found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobCards?.map((card) => (
              <Card key={card.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <StatusIcon status={card.status} />
                        {card.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(card.status)}>
                          {formatStatus(card.status)}
                        </Badge>
                        {card.due_date && (
                          <Badge variant="outline" className="text-xs">
                            Due: {new Date(card.due_date).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {card.description && (
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  )}

                  {card.progress_notes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recent Updates:</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {card.progress_notes.slice(-3).map((note, index) => (
                          <div key={index} className="text-xs bg-muted p-2 rounded">
                            <p className="text-muted-foreground mb-1">
                              {new Date(note.timestamp).toLocaleString()}
                            </p>
                            <p>{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(card.created_at).toLocaleDateString()}
                    </div>
                    {card.progress_notes.length > 0 && (
                      <div>
                        {card.progress_notes.length} update{card.progress_notes.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {showActions && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateClick(card)}
                      >
                        Update Progress
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Update Job Card Dialog */}
        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Job Card</DialogTitle>
            </DialogHeader>

            {selectedCard && (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <h3 className="font-semibold">{selectedCard.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Current status: {formatStatus(selectedCard.status)}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as JobCardStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="awaiting_client_input">Awaiting Client Input</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Progress Note</label>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Describe the progress made, issues encountered, or next steps..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setUpdateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateSubmit}
                    disabled={updateJobCard.isPending}
                  >
                    {updateJobCard.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LoadingWrapper>
  );
};
