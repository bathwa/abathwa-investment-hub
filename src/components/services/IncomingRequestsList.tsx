
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, DollarSign, FileText, User, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import { useForm } from 'react-hook-form';
import type { ServiceRequest } from '@/types/services';

interface AcceptRequestForm {
  agreed_scope: string;
  agreed_deliverables: string[];
  agreed_fee?: number;
  agreed_start_date?: string;
  agreed_end_date?: string;
}

export const IncomingRequestsList: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [deliverables, setDeliverables] = useState<string[]>([]);

  const { useIncomingServiceRequests, acceptServiceRequest, updateServiceRequestStatus } = useServices();
  const { data: requests, isLoading, error } = useIncomingServiceRequests();

  const acceptForm = useForm<AcceptRequestForm>();

  const handleAcceptClick = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDeliverables([...request.deliverables]);
    acceptForm.reset({
      agreed_scope: request.scope_description,
      agreed_deliverables: request.deliverables,
      agreed_start_date: request.start_date,
      agreed_end_date: request.end_date,
    });
    setAcceptDialogOpen(true);
  };

  const handleAcceptSubmit = async (data: AcceptRequestForm) => {
    if (!selectedRequest) return;

    try {
      await acceptServiceRequest.mutateAsync({
        requestId: selectedRequest.id,
        agreedScope: data.agreed_scope,
        agreedDeliverables: deliverables,
        agreedFee: data.agreed_fee,
        agreedStartDate: data.agreed_start_date,
        agreedEndDate: data.agreed_end_date,
      });
      
      setAcceptDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await updateServiceRequestStatus.mutateAsync({ 
        id: requestId, 
        status: 'declined' 
      });
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  // Filter requests
  const broadcastRequests = requests?.filter(r => r.broadcast_to_all && r.status === 'pending_acceptance') || [];
  const directRequests = requests?.filter(r => !r.broadcast_to_all && r.status === 'pending_acceptance') || [];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading incoming requests</p>
        </CardContent>
      </Card>
    );
  }

  const RequestCard: React.FC<{ request: ServiceRequest }> = ({ request }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{request.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {request.service_category?.name || 'Unknown Category'}
              </Badge>
              {request.broadcast_to_all && (
                <Badge variant="secondary">Broadcast</Badge>
              )}
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
            <h4 className="text-sm font-medium mb-2">Expected Deliverables:</h4>
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
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Created {new Date(request.created_at).toLocaleDateString()}
          </div>
          {request.start_date && request.end_date && (
            <div>
              Timeline: {new Date(request.start_date).toLocaleDateString()} - 
              {new Date(request.end_date).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            size="sm"
            onClick={() => handleAcceptClick(request)}
            disabled={acceptServiceRequest.isPending}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDecline(request.id)}
            disabled={updateServiceRequestStatus.isPending}
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Counter-propose
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <LoadingWrapper loading={isLoading}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Incoming Service Requests</h2>
          <Badge variant="outline">
            {(broadcastRequests.length + directRequests.length)} pending
          </Badge>
        </div>

        <Tabs defaultValue="directed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="directed" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Directed to Me ({directRequests.length})
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Open Requests ({broadcastRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directed" className="space-y-4">
            {directRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No direct requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {directRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="broadcast" className="space-y-4">
            {broadcastRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No open requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {broadcastRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Accept Request Dialog */}
        <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Accept Service Request</DialogTitle>
            </DialogHeader>

            {selectedRequest && (
              <form onSubmit={acceptForm.handleSubmit(handleAcceptSubmit)} className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold">{selectedRequest.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRequest.service_category?.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agreed_scope">Agreed Scope</Label>
                  <Textarea
                    {...acceptForm.register('agreed_scope', { required: true })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Agreed Deliverables</Label>
                  <div className="flex flex-wrap gap-2">
                    {deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="secondary">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agreed_start_date">Start Date</Label>
                    <Input
                      type="date"
                      {...acceptForm.register('agreed_start_date')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreed_end_date">End Date</Label>
                    <Input
                      type="date"
                      {...acceptForm.register('agreed_end_date')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agreed_fee">Agreed Fee (Optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...acceptForm.register('agreed_fee', { valueAsNumber: true })}
                    placeholder="Enter agreed fee"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAcceptDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={acceptServiceRequest.isPending}
                  >
                    {acceptServiceRequest.isPending ? 'Creating Work Order...' : 'Accept & Create Work Order'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LoadingWrapper>
  );
};
