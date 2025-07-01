
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '../shared/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-amber-900/20">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have required role, redirect
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const roleDashboardMap: Record<UserRole, string> = {
      'super_admin': '/admin-dashboard',
      'investor': '/investor-dashboard',
      'entrepreneur': '/entrepreneur-dashboard',
      'service_provider': '/service-provider-dashboard',
      'observer': '/observer-dashboard'
    };

    const userDashboard = roleDashboardMap[user.role];
    return <Navigate to={userDashboard} replace />;
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
