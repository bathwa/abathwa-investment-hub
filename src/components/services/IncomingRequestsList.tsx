
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, User, DollarSign, CheckCircle } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';

interface IncomingRequestsListProps {
  showActions?: boolean;
  title?: string;
}

export const IncomingRequestsList: React.FC<IncomingRequestsListProps> = ({
  showActions = true,
  title = 'Incoming Service Requests',
}) => {
  const { useIncomingServiceRequests, acceptServiceRequest } = useServices();
  const { data: requests, isLoading, error } = useIncomingServiceRequests();

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptServiceRequest.mutateAsync({ requestId });
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading incoming requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <LoadingWrapper loading={isLoading}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="outline">{requests?.length || 0} requests</Badge>
        </div>

        {requests?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No incoming requests found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests?.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {request.service_type}
                        </Badge>
                        <Badge variant="secondary">
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    {request.budget_range && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        ${request.budget_range.min} - ${request.budget_range.max}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {request.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(request.created_at).toLocaleDateString()}
                      </div>
                      {request.deadline && (
                        <div className="flex items-center gap-1">
                          Deadline: {new Date(request.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {showActions && request.status === 'open' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={acceptServiceRequest.isPending}
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept Request
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
