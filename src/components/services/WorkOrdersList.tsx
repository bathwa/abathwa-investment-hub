
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, FileText, Plus, CheckCircle } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import { CreateJobCardModal } from './CreateJobCardModal';
import type { WorkOrder, WorkOrderStatus } from '@/types/services';

interface WorkOrdersListProps {
  isProvider?: boolean;
  title?: string;
}

const getStatusColor = (status: WorkOrderStatus) => {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending_delivery':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'under_review':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatStatus = (status: WorkOrderStatus) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const WorkOrdersList: React.FC<WorkOrdersListProps> = ({
  isProvider = false,
  title = 'Work Orders',
}) => {
  const { useWorkOrders } = useServices();
  const { data: workOrders, isLoading, error } = useWorkOrders(isProvider);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading work orders</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <LoadingWrapper loading={isLoading}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="outline">{workOrders?.length || 0} work orders</Badge>
        </div>

        {workOrders?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No work orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {workOrders?.map((workOrder) => (
              <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {workOrder.service_request?.title || 'Work Order'}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {workOrder.service_request?.service_category?.name || 'Unknown Category'}
                        </Badge>
                        <Badge className={getStatusColor(workOrder.status)}>
                          {formatStatus(workOrder.status)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Payment: {workOrder.payment_status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    {workOrder.agreed_fee && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {workOrder.currency} {workOrder.agreed_fee.toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {workOrder.agreed_scope}
                  </p>

                  {workOrder.agreed_deliverables.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Agreed Deliverables:</h4>
                      <div className="flex flex-wrap gap-1">
                        {workOrder.agreed_deliverables.slice(0, 3).map((deliverable, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                        {workOrder.agreed_deliverables.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{workOrder.agreed_deliverables.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(workOrder.created_at).toLocaleDateString()}
                      </div>
                      {workOrder.agreed_start_date && workOrder.agreed_end_date && (
                        <div>
                          Timeline: {new Date(workOrder.agreed_start_date).toLocaleDateString()} - 
                          {new Date(workOrder.agreed_end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {workOrder.terms_agreed_at && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Terms agreed {new Date(workOrder.terms_agreed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    {isProvider && (
                      <CreateJobCardModal
                        workOrderId={workOrder.id}
                        trigger={
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Create Job Card
                          </Button>
                        }
                      />
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Manage Job Cards
                    </Button>
                    {workOrder.status === 'completed' && workOrder.payment_status === 'unpaid' && (
                      <Button variant="outline" size="sm">
                        Request Payment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </LoadingWrapper>
  );
};
