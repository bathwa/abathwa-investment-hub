
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Briefcase, 
  ClipboardList, 
  Construction,
  Database 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const ServiceManagementDashboard: React.FC = () => {
  const { user } = useAuth();
  
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
      </div>

      {/* Construction Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Construction className="h-5 w-5" />
            Service Management Under Development
          </CardTitle>
        </CardHeader>
        <CardContent className="text-orange-700">
          <p className="mb-4">
            The Service Management module is currently being developed. This comprehensive system will include:
          </p>
          <ul className="space-y-2 list-disc list-inside mb-4">
            <li><strong>Service Requests:</strong> Create and manage service requests for legal, accounting, due diligence, and other professional services</li>
            <li><strong>Work Orders:</strong> Structured agreements between requestors and service providers</li>
            <li><strong>Job Cards:</strong> Granular task management within work orders</li>
            <li><strong>Provider Matching:</strong> AI-powered matching of service requests to qualified providers</li>
            <li><strong>Template System:</strong> Standardized templates for different service categories</li>
          </ul>
          <div className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4" />
            <span>Database schema deployment required for full functionality</span>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Service Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">Coming Soon</div>
            <p className="text-xs text-muted-foreground">
              Create and manage service requests
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Work Orders</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">Coming Soon</div>
            <p className="text-xs text-muted-foreground">
              Structured service agreements
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Job Cards</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">Coming Soon</div>
            <p className="text-xs text-muted-foreground">
              Granular task management
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role-based Information */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Your Role: {user.role.replace('_', ' ').toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your role, you will have access to the following features when the Service Management module is deployed:
            </p>
            {user.role === 'entrepreneur' || user.role === 'investor' ? (
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li>Request professional services for your opportunities</li>
                <li>Browse and select qualified service providers</li>
                <li>Monitor work progress through job cards</li>
                <li>Manage payments and service completion</li>
              </ul>
            ) : user.role === 'service_provider' ? (
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li>Receive and accept service requests</li>
                <li>Create and manage work orders</li>
                <li>Break down work into detailed job cards</li>
                <li>Track progress and communicate with clients</li>
              </ul>
            ) : (
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li>Oversee all service management activities</li>
                <li>Configure service categories and templates</li>
                <li>Monitor system performance and usage</li>
                <li>Manage service provider qualifications</li>
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
