import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Star, 
  Clock,
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  CheckCircle,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { DashboardHeader } from '../components/DashboardHeader';
import { ServiceRequest, Project } from '../shared/types';

interface ServiceStats {
  totalEarnings: number;
  activeProjects: number;
  averageRating: number;
  completionRate: number;
}

export const ServiceProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serviceStats, setServiceStats] = useState<ServiceStats>({
    totalEarnings: 0,
    activeProjects: 0,
    averageRating: 0,
    completionRate: 0
  });
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch service requests with proper type mapping
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching service requests:', requestsError);
        if (isOnline) {
          toast({
            title: "Error",
            description: "Failed to load service requests",
            variant: "destructive",
          });
        }
      } else {
        // Map the database data to ServiceRequest type
        const mappedRequests: ServiceRequest[] = (requestsData || []).map(req => ({
          ...req,
          budget_range: typeof req.budget_range === 'object' ? req.budget_range as Record<string, any> : {}
        }));
        setServiceRequests(mappedRequests);
      }

      // Create mock projects for now since service_projects table doesn't exist
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Business Plan Development',
          service_type: 'Consulting',
          status: 'in_progress',
          budget: 2500,
          progress: 75,
          days_left: 5,
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Financial Advisory',
          service_type: 'Finance',
          status: 'completed',
          budget: 1800,
          progress: 100,
          days_left: 0,
          created_at: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ];
      setProjects(mockProjects);

      // Calculate service stats
      const totalEarnings = mockProjects
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.budget, 0);
      
      const activeProjects = mockProjects.filter(p => p.status === 'in_progress').length;
      
      // Get service provider rating
      const { data: providerData } = await supabase
        .from('service_providers')
        .select('rating, total_projects')
        .eq('user_id', user.id)
        .single();

      const averageRating = providerData?.rating || 0;
      const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
      const completionRate = mockProjects.length > 0 ? (completedProjects / mockProjects.length) * 100 : 0;

      setServiceStats({
        totalEarnings,
        activeProjects,
        averageRating,
        completionRate
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (isOnline) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'open': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading your Ubuntu service dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-amber-900/20">
      {/* Network Status Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 h-1 ${isOnline ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-300`}></div>
      
      <DashboardHeader 
        title="Ubuntu Service Provider Dashboard" 
        subtitle="Build your expertise and serve the community"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Network Status Indicator */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {isOnline ? 'Connected' : 'Offline Mode'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card card-hover border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{formatCurrency(serviceStats.totalEarnings)}</div>
              <p className="text-xs text-green-600 font-medium">
                From completed projects
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{serviceStats.activeProjects}</div>
              <p className="text-xs text-blue-600 font-medium">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
              <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{serviceStats.averageRating.toFixed(1)}</div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(serviceStats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{Math.round(serviceStats.completionRate)}%</div>
              <Progress value={serviceStats.completionRate} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Projects and Service Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient">Your Projects</CardTitle>
                  <CardDescription>Manage your service projects</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg glass-card">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(project.budget)} • {project.service_type}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Progress value={project.progress} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active projects</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Requests */}
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient">Service Requests</CardTitle>
                  <CardDescription>Incoming service opportunities</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {serviceRequests.length > 0 ? (
                <div className="space-y-4">
                  {serviceRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg glass-card">
                      <div className="flex-1">
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {request.service_type} • {formatDate(request.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status}
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
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No service requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderDashboard;
