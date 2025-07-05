import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  variant?: 'glass' | 'solid' | 'gradient';
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  className, 
  elevation = 'medium',
  variant = 'glass',
  ...props 
}) => {
  const elevationClasses = {
    low: 'shadow-lg hover:shadow-xl',
    medium: 'shadow-xl hover:shadow-2xl',
    high: 'shadow-2xl hover:shadow-3xl'
  };

  const variantClasses = {
    glass: 'glass-card border-white/20 bg-white/10 backdrop-blur-lg',
    solid: 'bg-card border-border',
    gradient: 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20'
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:-translate-y-1",
        elevationClasses[elevation],
        variantClasses[variant],
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
};