
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

        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Work Orders will be available once database schema is deployed</p>
          </CardContent>
        </Card>
      </div>
    </LoadingWrapper>
  );
};
