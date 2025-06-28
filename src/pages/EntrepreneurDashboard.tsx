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
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface BusinessStats {
  totalFunding: number;
  activeOpportunities: number;
  investorsEngaged: number;
  milestonesCompleted: number;
}

interface Opportunity {
  id: string;
  name: string;
  status: string;
  target_amount: number;
  raised_amount: number;
  investors_count: number;
  days_left: number;
  created_at: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  status: 'success' | 'info' | 'warning';
}

export const EntrepreneurDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    totalFunding: 0,
    activeOpportunities: 0,
    investorsEngaged: 0,
    milestonesCompleted: 0
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch opportunities
      const { data: opportunitiesData, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select('*')
        .eq('entrepreneur_id', user.id)
        .order('created_at', { ascending: false });

      if (opportunitiesError) {
        console.error('Error fetching opportunities:', opportunitiesError);
        toast({
          title: "Error",
          description: "Failed to load opportunities",
          variant: "destructive",
        });
      } else {
        setOpportunities(opportunitiesData || []);
      }

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
      } else {
        setActivities(activitiesData || []);
      }

      // Calculate business stats
      if (opportunitiesData) {
        const totalFunding = opportunitiesData.reduce((sum, opp) => sum + (opp.raised_amount || 0), 0);
        const activeOpportunities = opportunitiesData.filter(opp => 
          ['published', 'funding_in_progress'].includes(opp.status)
        ).length;
        
        // Get unique investors count
        const { data: investorsData } = await supabase
          .from('investments')
          .select('investor_id')
          .in('opportunity_id', opportunitiesData.map(opp => opp.id));
        
        const uniqueInvestors = new Set(investorsData?.map(inv => inv.investor_id) || []).size;
        
        // Get milestones count
        const { data: milestonesData } = await supabase
          .from('milestones')
          .select('id')
          .in('opportunity_id', opportunitiesData.map(opp => opp.id))
          .eq('status', 'completed');

        setBusinessStats({
          totalFunding,
          activeOpportunities,
          investorsEngaged: uniqueInvestors,
          milestonesCompleted: milestonesData?.length || 0
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'funding_in_progress': return 'default';
      case 'published': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'funding_in_progress': return 'Funding in Progress';
      case 'published': return 'Published';
      case 'draft': return 'Draft';
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
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Entrepreneur Dashboard</h1>
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
              <Badge className="bg-orange-100 text-orange-600 border-orange-200">
                {user?.verification_status === 'verified' ? 'Verified Entrepreneur' : 'Entrepreneur'}
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
          <h2 className="text-3xl font-bold mb-2">Your Business Ventures</h2>
          <p className="text-muted-foreground">Track your funding progress and manage opportunities.</p>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Funding Raised
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-green-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(businessStats.totalFunding)}</div>
              <p className="text-xs text-green-600 font-medium">
                From {opportunities.length} opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Opportunities
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-blue-600">
                <Target className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{businessStats.activeOpportunities}</div>
              <p className="text-xs text-blue-600 font-medium">
                Currently seeking funding
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Investors Engaged
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-purple-600">
                <Users className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{businessStats.investorsEngaged}</div>
              <p className="text-xs text-purple-600 font-medium">
                Across all opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Milestones Completed
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-orange-600">
                <Calendar className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{businessStats.milestonesCompleted}</div>
              <p className="text-xs text-orange-600 font-medium">
                Project milestones achieved
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Opportunities */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Opportunities</CardTitle>
                  <CardDescription>
                    {opportunities.length === 0 ? 'No opportunities yet' : 'Your current funding campaigns'}
                  </CardDescription>
                </div>
                <Button size="sm" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </CardHeader>
              <CardContent>
                {opportunities.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No opportunities created yet</p>
                    <Button size="sm" className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Opportunity
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{opportunity.name}</h4>
                            <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                              {getStatusDisplayName(opportunity.status)}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span>Target: {formatCurrency(opportunity.target_amount)}</span>
                            <span className="mx-2">•</span>
                            <span>Raised: {formatCurrency(opportunity.raised_amount)}</span>
                            <span className="mx-2">•</span>
                            <span>{opportunity.investors_count} investors</span>
                          </div>
                          {opportunity.days_left > 0 && (
                            <div className="mt-2 text-xs text-orange-600">
                              {opportunity.days_left} days left
                            </div>
                          )}
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

          {/* Recent Activities */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  {activities.length === 0 ? 'No recent activity' : 'Latest updates on your ventures'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activities</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'info' ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.type}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(activity.created_at)}
                          </p>
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

export default EntrepreneurDashboard; 