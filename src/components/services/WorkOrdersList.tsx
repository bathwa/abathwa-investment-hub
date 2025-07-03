
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, User, Clock, DollarSign } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';

interface WorkOrdersListProps {
  showActions?: boolean;
  title?: string;
}

export const WorkOrdersList: React.FC<WorkOrdersListProps> = ({
  showActions = true,
  title = 'Work Orders',
}) => {
  const { useWorkOrders } = useServices();
  const { data: workOrders, isLoading, error } = useWorkOrders();

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
          <Badge variant="outline">{workOrders?.length || 0} orders</Badge>
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
            {workOrders?.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Work Order #{order.id.slice(-8)}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {order.status}
                        </Badge>
                        <Badge variant="secondary">
                          {order.payment_status}
                        </Badge>
                      </div>
                    </div>
                    {order.agreed_fee && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {order.agreed_fee} {order.currency}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {order.agreed_scope}
                  </p>

                  {order.agreed_deliverables && order.agreed_deliverables.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Deliverables:</h4>
                      <div className="flex flex-wrap gap-1">
                        {order.agreed_deliverables.map((deliverable, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      {order.agreed_start_date && order.agreed_end_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.agreed_start_date).toLocaleDateString()} - {new Date(order.agreed_end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {showActions && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Manage Job Cards
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
