import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  Building,
  LogOut,
  ArrowLeft,
  Bell,
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
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Service Provider Dashboard</h1>
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
              <Badge className="bg-teal-100 text-teal-600 border-teal-200">
                {user?.verification_status === 'verified' ? 'Verified Provider' : 'Service Provider'}
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
          <h2 className="text-3xl font-bold mb-2">Your Professional Services</h2>
          <p className="text-muted-foreground">Track your projects and manage client relationships.</p>
        </div>

        {/* Service Stats */}
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
                From {projects.length} projects
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
                Currently in progress
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
              <div className="text-2xl font-bold mb-1">{serviceStats.clientRating.toFixed(1)}/5</div>
              <p className="text-xs text-purple-600 font-medium">
                Average client rating
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>
                    {projects.length === 0 ? 'No projects yet' : 'Your current client engagements'}
                  </CardDescription>
                </div>
                <Button size="sm" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Service
                </Button>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Button size="sm" className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{project.name}</h4>
                            <Badge variant={getStatusBadgeVariant(project.status)}>
                              {getStatusDisplayName(project.status)}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span>{project.service_type}</span>
                            <span className="mx-2">•</span>
                            <span>Budget: {formatCurrency(project.budget)}</span>
                            <span className="mx-2">•</span>
                            <span>{project.days_left} days left</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Service Requests */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>
                  {serviceRequests.length === 0 ? 'No requests yet' : 'New client inquiries'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No service requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <div key={request.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{request.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getStatusDisplayName(request.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Client: {request.client_name}
                        </p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Budget: {request.budget_range}</div>
                          <div>Deadline: {request.deadline}</div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" className="text-xs">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Decline
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

export default ServiceProviderDashboard; 