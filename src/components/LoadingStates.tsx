
import React from 'react';
import { Loader2, Building2, TrendingUp, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary', 
        sizeClasses[size], 
        className
      )} 
    />
  );
};

interface PageLoadingProps {
  message?: string;
  icon?: React.ReactNode;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...', 
  icon 
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {icon || <LoadingSpinner size="lg" />}
        </div>
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  );
};

interface DashboardLoadingProps {
  role?: string;
}

export const DashboardLoading: React.FC<DashboardLoadingProps> = ({ role }) => {
  const getIcon = () => {
    switch (role) {
      case 'super_admin':
        return <Settings className="h-8 w-8 text-primary animate-pulse" />;
      case 'investor':
        return <TrendingUp className="h-8 w-8 text-primary animate-pulse" />;
      case 'entrepreneur':
        return <Building2 className="h-8 w-8 text-primary animate-pulse" />;
      case 'service_provider':
        return <Users className="h-8 w-8 text-primary animate-pulse" />;
      default:
        return <LoadingSpinner size="lg" />;
    }
  };

  return (
    <PageLoading
      message={`Loading your ${role?.replace('_', ' ')} dashboard...`}
      icon={getIcon()}
    />
  );
};

interface CardLoadingProps {
  className?: string;
  rows?: number;
}

export const CardLoading: React.FC<CardLoadingProps> = ({ 
  className, 
  rows = 3 
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="rounded-full bg-muted h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TableLoadingProps {
  columns?: number;
  rows?: number;
}

export const TableLoading: React.FC<TableLoadingProps> = ({ 
  columns = 4, 
  rows = 5 
}) => {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {/* Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded"></div>
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ButtonLoadingProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  children,
  loading = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};
