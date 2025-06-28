import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  Building,
  Eye,
  Users,
  FileText,
  Calendar,
  Loader2,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { DashboardHeader } from '../components/DashboardHeader';

interface ObservedEntity {
  id: string;
  name: string;
  type: 'opportunity' | 'investment_pool' | 'company';
  status: string;
  last_activity: string;
  risk_level: string;
  alerts_count: number;
}

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
}

export const ObserverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
          if (observer.opportunities && Array.isArray(observer.opportunities) && observer.opportunities.length > 0) {
            const opportunity = observer.opportunities[0];
            entities.push({
              id: opportunity.id,
              name: opportunity.title,
              type: 'opportunity',
              status: opportunity.status,
              last_activity: opportunity.updated_at,
              risk_level: 'Low', // Would be calculated based on risk score
              alerts_count: 0 // Would be calculated based on alerts
            });
          } else if (observer.investment_pools && Array.isArray(observer.investment_pools) && observer.investment_pools.length > 0) {
            const pool = observer.investment_pools[0];
            entities.push({
              id: pool.id,
              name: pool.name,
              type: 'investment_pool',
              status: pool.status,
              last_activity: pool.updated_at,
              risk_level: 'Low',
              alerts_count: 0
            });
          } else if (observer.users && Array.isArray(observer.users) && observer.users.length > 0) {
            const user = observer.users[0];
            entities.push({
              id: user.id,
              name: user.full_name,
              type: 'company',
              status: user.status,
              last_activity: user.updated_at,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'published': return 'default';
      case 'pending': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Target;
      case 'investment_pool': return Building;
      case 'company': return Users;
      default: return Eye;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Observer Dashboard" 
        subtitle="Monitor and oversee platform activities"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Observed Entities
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-blue-600">
                <Eye className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{observedEntities.length}</div>
              <p className="text-xs text-blue-600 font-medium">
                Under observation
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Alerts
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {observedEntities.reduce((sum, entity) => sum + entity.alerts_count, 0)}
              </div>
              <p className="text-xs text-red-600 font-medium">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reports Generated
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-purple-600">
                <FileText className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{reports.length}</div>
              <p className="text-xs text-purple-600 font-medium">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Compliance Score
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-green-600">
                <Shield className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">98%</div>
              <p className="text-xs text-green-600 font-medium">
                Platform compliance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Observed Entities and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Observed Entities */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Observed Entities</CardTitle>
                  <CardDescription>Entities under your oversight</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {observedEntities.length > 0 ? (
                <div className="space-y-4">
                  {observedEntities.slice(0, 5).map((entity) => {
                    const EntityIcon = getEntityIcon(entity.type);
                    return (
                      <div key={entity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <EntityIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{entity.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {entity.type.replace('_', ' ')} • {formatDate(entity.last_activity)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadgeVariant(entity.status)}>
                            {entity.status}
                          </Badge>
                          <span className={`text-xs font-medium ${getRiskLevelColor(entity.risk_level)}`}>
                            {entity.risk_level} Risk
                          </span>
                          {entity.alerts_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {entity.alerts_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No entities under observation</p>
                  <Button className="mt-4">
                    <Eye className="w-4 h-4 mr-2" />
                    Add Entity to Observe
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Generated oversight reports</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • {formatDate(report.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(report.status)}>
                          {report.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reports generated yet</p>
                  <Button className="mt-4">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate First Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ObserverDashboard; 