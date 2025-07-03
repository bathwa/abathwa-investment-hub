
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <Card 
      className={cn(
        "glass-card border-slate-700/50 bg-slate-800/40 backdrop-blur-sm",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
};
