
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Calendar } from 'lucide-react';

export const UserWelcome: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const roleDisplayNames = {
    'super_admin': 'Super Administrator',
    'investor': 'Investor',
    'entrepreneur': 'Entrepreneur',
    'service_provider': 'Service Provider',
    'observer': 'Observer'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Welcome back, {user.full_name || 'User'}!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          <Badge variant="secondary">
            {roleDisplayNames[user.role] || user.role}
          </Badge>
        </div>
        
        {user.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since {formatDate(user.created_at)}</span>
          </div>
        )}

        {user.bio && (
          <p className="text-sm text-muted-foreground">{user.bio}</p>
        )}
      </CardContent>
    </Card>
  );
};
