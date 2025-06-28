import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  Shield,
  Building,
  BarChart3,
  FileText,
  CreditCard,
  Loader2,
  Plus,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { DashboardHeader } from '../components/DashboardHeader';
import { validateApiResponse, filterMockData } from '../lib/validation';

interface PlatformStats {
  totalUsers: number;
  activeInvestments: number;
  platformRevenue: number;
  investmentPools: number;
  pendingApprovals: number;
  activeOpportunities: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    activeInvestments: 0,
    platformRevenue: 0,
    investmentPools: 0,
    pendingApprovals: 0,
    activeOpportunities: 0
  });

  useEffect(() => {
    if (user) {
      fetchPlatformStats();
    }
  }, [user]);

  const fetchPlatformStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch total users
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (userError) {
        console.error('Error fetching users:', userError);
        toast({
          title: "Warning",
          description: "Failed to load user statistics",
          variant: "destructive",
        });
      }

      // Fetch total investment amount (not count)
      const { data: investmentData, error: investmentError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'investment')
        .in('status', ['pending', 'processing', 'completed']);

      if (investmentError) {
        console.error('Error fetching investments:', investmentError);
        toast({
          title: "Warning",
          description: "Failed to load investment statistics",
          variant: "destructive",
        });
      }

      // Filter out any mock data
      const cleanInvestmentData = filterMockData(investmentData || []);
      const totalInvestmentAmount = cleanInvestmentData.reduce((sum, tx) => sum + (tx.amount || 0), 0);

      // Fetch investment pools
      const { count: poolCount, error: poolError } = await supabase
        .from('investment_pools')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (poolError) {
        console.error('Error fetching pools:', poolError);
        toast({
          title: "Warning",
          description: "Failed to load pool statistics",
          variant: "destructive",
        });
      }

      // Fetch pending approvals
      const { count: pendingCount, error: pendingError } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_approval');

      if (pendingError) {
        console.error('Error fetching pending approvals:', pendingError);
        toast({
          title: "Warning",
          description: "Failed to load approval statistics",
          variant: "destructive",
        });
      }

      // Fetch active opportunities
      const { count: activeOpportunitiesCount, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .in('status', ['published', 'funding_in_progress']);

      if (opportunitiesError) {
        console.error('Error fetching opportunities:', opportunitiesError);
        toast({
          title: "Warning",
          description: "Failed to load opportunity statistics",
          variant: "destructive",
        });
      }

      // Calculate platform revenue from completed transactions
      const { data: revenueData, error: revenueError } = await supabase
        .from('transactions')
        .select('platform_fee')
        .eq('status', 'completed');

      if (revenueError) {
        console.error('Error fetching revenue:', revenueError);
        toast({
          title: "Warning",
          description: "Failed to load revenue statistics",
          variant: "destructive",
        });
      }

      // Filter out any mock data from revenue
      const cleanRevenueData = filterMockData(revenueData || []);
      const platformRevenue = cleanRevenueData.reduce((sum, tx) => sum + (tx.platform_fee || 0), 0);

      setStats({
        totalUsers: userCount || 0,
        activeInvestments: totalInvestmentAmount,
        platformRevenue,
        investmentPools: poolCount || 0,
        pendingApprovals: pendingCount || 0,
        activeOpportunities: activeOpportunitiesCount || 0
      });

    } catch (error) {
      console.error('Error fetching platform stats:', error);
      toast({
        title: "Error",
        description: "Failed to load platform statistics",
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
        title="Admin Dashboard" 
        subtitle="Platform overview and management"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stats.totalUsers}</div>
              <p className="text-xs text-blue-600 font-medium">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Investments
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-green-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(stats.activeInvestments)}</div>
              <p className="text-xs text-green-600 font-medium">
                Total invested amount
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Platform Revenue
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-purple-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(stats.platformRevenue)}</div>
              <p className="text-xs text-purple-600 font-medium">
                From completed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Investment Pools
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-orange-600">
                <Building className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stats.investmentPools}</div>
              <p className="text-xs text-orange-600 font-medium">
                Active pools
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approvals
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-yellow-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stats.pendingApprovals}</div>
              <p className="text-xs text-yellow-600 font-medium">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Opportunities
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-indigo-600">
                <BarChart3 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stats.activeOpportunities}</div>
              <p className="text-xs text-indigo-600 font-medium">
                Currently funding
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigate('/admin-user-management')}
            className="h-20 flex flex-col items-center justify-center space-y-2 border-2"
          >
            <Users className="w-6 h-6" />
            <span>User Management</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin-pool-management')}
            className="h-20 flex flex-col items-center justify-center space-y-2 border-2"
          >
            <Building className="w-6 h-6" />
            <span>Pool Management</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin-investments')}
            className="h-20 flex flex-col items-center justify-center space-y-2 border-2"
          >
            <CreditCard className="w-6 h-6" />
            <span>Investment Review</span>
          </Button>
          
          <Button 
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 border-2"
          >
            <Settings className="w-6 h-6" />
            <span>Platform Settings</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
