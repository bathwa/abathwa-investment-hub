import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  FileText, 
  AlertTriangle,
  LogOut,
  ArrowLeft,
  Bell,
  Users,
  Building,
  Target,
  Loader2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface ObservedEntity {
  id: string;
  name: string;
  type: 'opportunity' | 'company' | 'investment_pool';
  status: string;
  last_activity: string;
  risk_level: string;
  alerts_count: number;
}

interface Report {
  id: string;
  title: string;
  entity_name: string;
  type: string;
  generated_at: string;
  status: string;
}

export const ObserverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [observedEntities, setObservedEntities] = useState<ObservedEntity[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (user) {
      fetchObserverData();
    }
  }, [user]);

  const fetchObserverData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch observed entities
      const { data: observersData, error: observersError } = await supabase
        .from('observers')
        .select(`
          id,
          scope,
          opportunity_id,
          pool_id,
          observed_user_id,
          opportunities!left(
            id,
            title,
            status,
            updated_at
          ),
          investment_pools!left(
            id,
            name,
            status,
            updated_at
          ),
          users!left(
            id,
            full_name,
            status,
            updated_at
          )
        `)
        .eq('observer_id', user.id);

      if (observersError) {
        console.error('Error fetching observed entities:', observersError);
        toast({
          title: "Error",
          description: "Failed to load observed entities",
          variant: "destructive",
        });
      } else {
        const entities: ObservedEntity[] = [];
        
        observersData?.forEach(observer => {
          if (observer.opportunities) {
            entities.push({
              id: observer.opportunities.id,
              name: observer.opportunities.title,
              type: 'opportunity',
              status: observer.opportunities.status,
              last_activity: observer.opportunities.updated_at,
              risk_level: 'Low', // Would be calculated based on risk score
              alerts_count: 0 // Would be calculated based on alerts
            });
          } else if (observer.investment_pools) {
            entities.push({
              id: observer.investment_pools.id,
              name: observer.investment_pools.name,
              type: 'investment_pool',
              status: observer.investment_pools.status,
              last_activity: observer.investment_pools.updated_at,
              risk_level: 'Low',
              alerts_count: 0
            });
          } else if (observer.users) {
            entities.push({
              id: observer.users.id,
              name: observer.users.full_name,
              type: 'company',
              status: observer.users.status,
              last_activity: observer.users.updated_at,
              risk_level: 'Low',
              alerts_count: 0
            });
          }
        });
        
        setObservedEntities(entities);
      }

      // Fetch reports (placeholder - would need reports table)
      setReports([]);

    } catch (error) {
      console.error('Error fetching observer data:', error);
      toast({
        title: "Error",
        description: "Failed to load observer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Target;
      case 'company': return Building;
      case 'investment_pool': return Users;
      default: return Eye;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading observer dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="border-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 investment-gradient rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Observer Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.first_name || user?.email}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="border-2">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge className="bg-purple-100 text-purple-600 border-purple-200">
                Observer
              </Badge>
              <Button 
                onClick={handleLogout}
                className="btn-secondary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Observed Entities</h2>
          <p className="text-muted-foreground">Monitor the entities you have permission to observe.</p>
        </div>

        {/* Observed Entities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Monitored Entities</CardTitle>
                <CardDescription>
                  {observedEntities.length === 0 ? 'No entities to observe' : 'Entities you are monitoring'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {observedEntities.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No entities assigned for observation</p>
                    <p className="text-sm text-muted-foreground">
                      Contact an administrator to be assigned as an observer for specific entities.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {observedEntities.map((entity) => {
                      const EntityIcon = getEntityIcon(entity.type);
                      return (
                        <div key={entity.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <EntityIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold">{entity.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {entity.type.replace('_', ' ')}
                                </Badge>
                                <Badge className={`text-xs ${getRiskLevelColor(entity.risk_level)}`}>
                                  {entity.risk_level} Risk
                                </Badge>
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                <span>Status: {entity.status}</span>
                                <span className="mx-2">•</span>
                                <span>Last activity: {formatTimeAgo(entity.last_activity)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {entity.alerts_count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {entity.alerts_count} alerts
                              </Badge>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                  {reports.length === 0 ? 'No reports available' : 'Latest reports for observed entities'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reports available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{report.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Entity: {report.entity_name}
                        </p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Type: {report.type}</div>
                          <div>Generated: {formatTimeAgo(report.generated_at)}</div>
                        </div>
                        <div className="mt-3">
                          <Button size="sm" className="text-xs w-full">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObserverDashboard; 