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
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { DashboardHeader } from '../components/DashboardHeader';
import { Opportunity, Activity } from '../shared/types';

interface BusinessStats {
  totalFunding: number;
  activeOpportunities: number;
  investorsEngaged: number;
  milestonesCompleted: number;
}

export const EntrepreneurDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    totalFunding: 0,
    activeOpportunities: 0,
    investorsEngaged: 0,
    milestonesCompleted: 0
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

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
      // Fetch opportunities with proper type handling
      const { data: opportunitiesData, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select('*')
        .eq('entrepreneur_id', user.id)
        .order('created_at', { ascending: false });

      if (opportunitiesError) {
        console.error('Error fetching opportunities:', opportunitiesError);
        if (isOnline) {
          toast({
            title: "Error",
            description: "Failed to load opportunities",
            variant: "destructive",
          });
        }
      } else {
        // Map the database data to include computed fields and handle Json types
        const mappedOpportunities: Opportunity[] = (opportunitiesData || []).map(opp => ({
          ...opp,
          ai_insights: typeof opp.ai_insights === 'object' ? opp.ai_insights as Record<string, any> : {},
          raised_amount: 0, // TODO: Calculate from transactions
          investors_count: 0, // TODO: Calculate from investment_offers
          days_left: 30 // TODO: Calculate from expires_at
        }));
        setOpportunities(mappedOpportunities);
      }

      // Create mock activities for now
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'opportunity_created',
          description: 'New opportunity "Tech Startup Funding" created',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'investment_received',
          description: 'Investment of $5,000 received from John Doe',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          type: 'milestone_completed',
          description: 'Product Development milestone completed',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setActivities(mockActivities);

      // Calculate business stats
      if (opportunitiesData) {
        const totalFunding = 0; // TODO: Calculate from transactions
        const activeOpportunities = opportunitiesData.filter(opp => 
          ['published', 'funding_in_progress'].includes(opp.status)
        ).length;
        
        // Get unique investors count from investment offers
        const { data: investorsData } = await supabase
          .from('investment_offers')
          .select('investor_id')
          .in('opportunity_id', opportunitiesData.map(opp => opp.id));
        
        const uniqueInvestors = new Set(investorsData?.map(inv => inv.investor_id) || []).size;
        
        // Get milestones count from opportunity_milestones
        const { data: milestonesData } = await supabase
          .from('opportunity_milestones')
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
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading your Ubuntu dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-amber-900/20">
      {/* Network Status Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 h-1 ${isOnline ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-300`}></div>
      
      <DashboardHeader 
        title="Ubuntu Entrepreneur Dashboard" 
        subtitle="Build your vision with community support"
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
                Total Funding
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{formatCurrency(businessStats.totalFunding)}</div>
              <p className="text-xs text-green-600 font-medium">
                Raised across all opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Opportunities
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{businessStats.activeOpportunities}</div>
              <p className="text-xs text-blue-600 font-medium">
                Currently seeking funding
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Community Investors
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{businessStats.investorsEngaged}</div>
              <p className="text-xs text-purple-600 font-medium">
                Ubuntu community members
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Milestones Achieved
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gradient">{businessStats.milestonesCompleted}</div>
              <p className="text-xs text-orange-600 font-medium">
                Progress milestones completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Opportunities */}
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient">Your Opportunities</CardTitle>
                  <CardDescription>Manage your funding opportunities</CardDescription>
                </div>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Opportunity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {opportunities.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.slice(0, 5).map((opportunity) => (
                    <div key={opportunity.id} className="flex items-center justify-between p-3 border rounded-lg glass-card">
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
                  <Button className="mt-4 btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Opportunity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient">Ubuntu Activities</CardTitle>
                  <CardDescription>Latest community updates</CardDescription>
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
                    <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg glass-card">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
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
