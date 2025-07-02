
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Briefcase, 
  ClipboardList, 
  Plus, 
  Users, 
  TrendingUp,
  DollarSign 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CreateServiceRequestModal } from './CreateServiceRequestModal';
import { ServiceRequestsList } from './ServiceRequestsList';
import { IncomingRequestsList } from './IncomingRequestsList';
import { WorkOrdersList } from './WorkOrdersList';
import { JobCardsList } from './JobCardsList';

export const ServiceManagementDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Determine user capabilities based on role
  const canRequestServices = user?.role === 'entrepreneur' || user?.role === 'investor';
  const canProvideServices = user?.role === 'service_provider';
  const isAdmin = user?.role === 'super_admin';

  // Quick stats cards (placeholder - would be connected to real data)
  const QuickStats: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            +1 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">
            2 completed this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Job Cards</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            8 in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$12,450</div>
          <p className="text-xs text-muted-foreground">
            +20% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Management</h1>
          <p className="text-muted-foreground">
            Manage service requests, work orders, and job cards
          </p>
        </div>
        
        {canRequestServices && (
          <CreateServiceRequestModal
            trigger={
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Request Service
              </Button>
            }
          />
        )}
      </div>

      <QuickStats />

      <Tabs defaultValue={canRequestServices ? "requests" : "incoming"} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {canRequestServices && (
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Requests
            </TabsTrigger>
          )}
          
          {canProvideServices && (
            <TabsTrigger value="incoming" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Incoming
            </TabsTrigger>
          )}
          
          <TabsTrigger value="work-orders" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Work Orders
          </TabsTrigger>
          
          <TabsTrigger value="job-cards" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Job Cards
          </TabsTrigger>
        </TabsList>

        {canRequestServices && (
          <TabsContent value="requests" className="space-y-4">
            <ServiceRequestsList 
              title="My Service Requests"
              showActions={true}
            />
          </TabsContent>
        )}

        {canProvideServices && (
          <TabsContent value="incoming" className="space-y-4">
            <IncomingRequestsList />
          </TabsContent>
        )}

        <TabsContent value="work-orders" className="space-y-4">
          <WorkOrdersList 
            isProvider={canProvideServices}
            title="Work Orders"
          />
        </TabsContent>

        <TabsContent value="job-cards" className="space-y-4">
          <JobCardsList 
            title="Job Cards"
            showActions={canProvideServices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
