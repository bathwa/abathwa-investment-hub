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
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { DashboardHeader } from '../components/DashboardHeader';

interface BusinessStats {
  totalFunding: number;
  activeOpportunities: number;
  investorsEngaged: number;
  milestonesCompleted: number;
}

interface Opportunity {
  id: string;
  title: string;
  status: string;
  funding_target: number;
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
}

export const EntrepreneurDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
          .from('transactions')
          .select('from_user_id')
          .eq('type', 'investment')
          .in('opportunity_id', opportunitiesData.map(opp => opp.id));
        
        const uniqueInvestors = new Set(investorsData?.map(inv => inv.from_user_id) || []).size;
        
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
      case 'published': return 'default';
      case 'funding_in_progress': return 'secondary';
      case 'draft': return 'outline';
      case 'pending_approval': return 'outline';
      case 'completed': return 'default';
      default: return 'outline';
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
        title="Entrepreneur Dashboard" 
        subtitle="Manage your business opportunities"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Funding
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-green-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(businessStats.totalFunding)}</div>
              <p className="text-xs text-green-600 font-medium">
                Raised across all opportunities
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
                Currently funding
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

        {/* Opportunities and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Opportunities */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Opportunities</CardTitle>
                  <CardDescription>Manage your funding opportunities</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Opportunity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {opportunities.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.slice(0, 5).map((opportunity) => (
                    <div key={opportunity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(opportunity.funding_target)} target • {formatDate(opportunity.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                          {opportunity.status.replace('_', ' ')}
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
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No opportunities yet</p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Opportunity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest updates and milestones</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EntrepreneurDashboard; 