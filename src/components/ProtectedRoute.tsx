import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../shared/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
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