
import React from 'react';
import { ServiceManagementDashboard } from '@/components/services/ServiceManagementDashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const ServiceManagement: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-6">
        <ServiceManagementDashboard />
      </div>
    </ErrorBoundary>
  );
};

export default ServiceManagement;
