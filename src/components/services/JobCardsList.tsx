
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, User, Clock, CheckCircle } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';

interface JobCardsListProps {
  workOrderId?: string;
  showActions?: boolean;
  title?: string;
}

export const JobCardsList: React.FC<JobCardsListProps> = ({
  workOrderId,
  showActions = true,
  title = 'Job Cards',
}) => {
  const { useJobCards } = useServices();
  const { data: jobCards, isLoading, error } = useJobCards(workOrderId);

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
          <Badge variant="outline">{jobCards?.length || 0} cards</Badge>
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
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {card.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {card.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {card.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(card.created_at).toLocaleDateString()}
                      </div>
                      {card.due_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due {new Date(card.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {card.progress_notes && card.progress_notes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Latest Progress:</h4>
                      <p className="text-xs text-muted-foreground">
                        {card.progress_notes[card.progress_notes.length - 1]?.note}
                      </p>
                    </div>
                  )}

                  {showActions && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm">
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
      </div>
    </LoadingWrapper>
  );
};
