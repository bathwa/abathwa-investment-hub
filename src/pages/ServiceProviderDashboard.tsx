import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  Building,
  Plus,
  Eye,
  Users,
  FileText,
  Calendar,
  Star,
  Briefcase,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { DashboardHeader } from '../components/DashboardHeader';

interface ServiceStats {
  totalEarnings: number;
  activeProjects: number;
  clientRating: number;
  servicesOffered: number;
}

interface Project {
  id: string;
  name: string;
  service_type: string;
  status: string;
  budget: number;
  progress: number;
  days_left: number;
  created_at: string;
}

interface ServiceRequest {
  id: string;
  title: string;
  client_name: string;
  budget_range: string;
  deadline: string;
  status: string;
  created_at: string;
}

export const ServiceProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [serviceStats, setServiceStats] = useState<ServiceStats>({
    totalEarnings: 0,
    activeProjects: 0,
    clientRating: 0,
    servicesOffered: 0
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('service_projects')
        .select('*')
        .eq('service_provider_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } else {
        setProjects(projectsData || []);
      }

      // Fetch service requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select('*')
        .eq('service_provider_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (requestsError) {
        console.error('Error fetching service requests:', requestsError);
      } else {
        setServiceRequests(requestsData || []);
      }

      // Calculate service stats
      if (projectsData) {
        const totalEarnings = projectsData.reduce((sum, project) => sum + (project.budget || 0), 0);
        const activeProjects = projectsData.filter(project => 
          ['in_progress', 'review'].includes(project.status)
        ).length;
        
        // Get average rating
        const { data: ratingsData } = await supabase
          .from('service_ratings')
          .select('rating')
          .eq('service_provider_id', user.id);
        
        const averageRating = ratingsData && ratingsData.length > 0 
          ? ratingsData.reduce((sum, rating) => sum + rating.rating, 0) / ratingsData.length
          : 0;
        
        // Get unique services count
        const uniqueServices = new Set(projectsData.map(project => project.service_type)).size;

        setServiceStats({
          totalEarnings,
          activeProjects,
          clientRating: averageRating,
          servicesOffered: uniqueServices
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
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
      case 'in_progress': return 'default';
      case 'review': return 'secondary';
      case 'planning': return 'outline';
      case 'new': return 'outline';
      case 'reviewing': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'review': return 'Review';
      case 'planning': return 'Planning';
      case 'new': return 'New';
      case 'reviewing': return 'Reviewing';
      default: return status;
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
        title="Service Provider Dashboard" 
        subtitle="Manage your professional services"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-green-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(serviceStats.totalEarnings)}</div>
              <p className="text-xs text-green-600 font-medium">
                From completed projects
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-blue-600">
                <Briefcase className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{serviceStats.activeProjects}</div>
              <p className="text-xs text-blue-600 font-medium">
                Currently working on
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Client Rating
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-purple-600">
                <Star className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{serviceStats.clientRating.toFixed(1)}</div>
              <p className="text-xs text-purple-600 font-medium">
                Average rating
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Services Offered
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-orange-600">
                <Target className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{serviceStats.servicesOffered}</div>
              <p className="text-xs text-orange-600 font-medium">
                Different service types
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects and Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Projects you're currently working on</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {project.service_type} • {formatCurrency(project.budget)}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {getStatusDisplayName(project.status)}
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
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active projects</p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Your First Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Requests */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>Recent requests from clients</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {serviceRequests.length > 0 ? (
                <div className="space-y-4">
                  {serviceRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {request.client_name} • {request.budget_range}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: {formatDate(request.deadline)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {getStatusDisplayName(request.status)}
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