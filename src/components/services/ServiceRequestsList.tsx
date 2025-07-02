
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, FileText, User, Clock } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import type { ServiceRequest, ServiceRequestStatus } from '@/types/services';

interface ServiceRequestsListProps {
  status?: ServiceRequestStatus;
  showActions?: boolean;
  title?: string;
}

const getStatusColor = (status: ServiceRequestStatus) => {
  switch (status) {
    case 'pending_acceptance':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'declined':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'negotiating':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'completed':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatStatus = (status: ServiceRequestStatus) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const ServiceRequestsList: React.FC<ServiceRequestsListProps> = ({
  status,
  showActions = true,
  title = 'Service Requests',
}) => {
  const { useServiceRequests, updateServiceRequestStatus } = useServices();
  const { data: requests, isLoading, error } = useServiceRequests(status);

  const handleStatusUpdate = async (id: string, newStatus: ServiceRequestStatus) => {
    try {
      await updateServiceRequestStatus.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading service requests</p>
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
              <p className="text-muted-foreground">No service requests found</p>
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
                          {request.service_category?.name || 'Unknown Category'}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {formatStatus(request.status)}
                        </Badge>
                      </div>
                    </div>
                    {request.proposed_budget && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {request.currency} {request.proposed_budget.toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {request.scope_description}
                  </p>

                  {request.deliverables.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Deliverables:</h4>
                      <div className="flex flex-wrap gap-1">
                        {request.deliverables.slice(0, 3).map((deliverable, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                        {request.deliverables.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{request.deliverables.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(request.created_at).toLocaleDateString()}
                      </div>
                      {request.start_date && request.end_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(request.start_date).toLocaleDateString()} - 
                          {new Date(request.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {request.broadcast_to_all && (
                      <Badge variant="outline" className="text-xs">
                        Broadcast
                      </Badge>
                    )}
                  </div>

                  {showActions && request.status === 'pending_acceptance' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, 'cancelled')}
                        disabled={updateServiceRequestStatus.isPending}
                      >
                        Cancel Request
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
