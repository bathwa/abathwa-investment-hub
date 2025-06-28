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
  Loader2,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface InvestmentStats {
  totalInvested: number;
  activeInvestments: number;
  totalReturns: number;
  portfolioValue: number;
}

interface Investment {
  id: string;
  opportunity_title: string;
  amount: number;
  status: string;
  created_at: string;
  expected_roi: number;
  investment_term_months: number;
}

interface Pool {
  id: string;
  name: string;
  category: string;
  total_members: number;
  total_invested: number;
  status: string;
}

export const InvestorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [investmentStats, setInvestmentStats] = useState<InvestmentStats>({
    totalInvested: 0,
    activeInvestments: 0,
    totalReturns: 0,
    portfolioValue: 0
  });
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch investments
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          status,
          created_at,
          opportunities!inner(
            title,
            expected_roi,
            investment_term_months
          )
        `)
        .eq('from_user_id', user.id)
        .eq('type', 'investment')
        .order('created_at', { ascending: false });

      if (investmentsError) {
        console.error('Error fetching investments:', investmentsError);
        toast({
          title: "Error",
          description: "Failed to load investments",
          variant: "destructive",
        });
      } else {
        const formattedInvestments = investmentsData?.map(inv => ({
          id: inv.id,
          opportunity_title: inv.opportunities?.title || 'Unknown Opportunity',
          amount: inv.amount,
          status: inv.status,
          created_at: inv.created_at,
          expected_roi: inv.opportunities?.expected_roi || 0,
          investment_term_months: inv.opportunities?.investment_term_months || 0
        })) || [];
        
        setInvestments(formattedInvestments);
      }

      // Fetch pools
      const { data: poolsData, error: poolsError } = await supabase
        .from('pool_members')
        .select(`
          pool_id,
          investment_pools!inner(
            id,
            name,
            category,
            status
          )
        `)
        .eq('user_id', user.id);

      if (poolsError) {
        console.error('Error fetching pools:', poolsError);
      } else {
        // Get pool statistics
        const poolIds = poolsData?.map(p => p.pool_id) || [];
        const { data: poolStats } = await supabase
          .from('pool_members')
          .select('pool_id')
          .in('pool_id', poolIds);

        const poolMemberCounts = poolStats?.reduce((acc, member) => {
          acc[member.pool_id] = (acc[member.pool_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const formattedPools = poolsData?.map(pool => ({
          id: pool.pool_id,
          name: pool.investment_pools?.name || 'Unknown Pool',
          category: pool.investment_pools?.category || 'general',
          total_members: poolMemberCounts[pool.pool_id] || 0,
          total_invested: 0, // Would need to calculate from transactions
          status: pool.investment_pools?.status || 'active'
        })) || [];
        
        setPools(formattedPools);
      }

      // Calculate investment stats
      if (investmentsData) {
        const totalInvested = investmentsData.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        const activeInvestments = investmentsData.filter(inv => 
          ['pending', 'confirmed', 'active'].includes(inv.status)
        ).length;
        
        // Calculate returns (simplified - would need more complex logic)
        const totalReturns = investmentsData.reduce((sum, inv) => {
          const roi = inv.opportunities?.expected_roi || 0;
          return sum + ((inv.amount || 0) * roi / 100);
        }, 0);

        setInvestmentStats({
          totalInvested,
          activeInvestments,
          totalReturns,
          portfolioValue: totalInvested + totalReturns
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'outline';
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
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Investor Dashboard</h1>
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
              <Badge className="bg-blue-100 text-blue-600 border-blue-200">
                {user?.verification_status === 'verified' ? 'Verified Investor' : 'Investor'}
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
          <h2 className="text-3xl font-bold mb-2">Your Investment Portfolio</h2>
          <p className="text-muted-foreground">Track your investments and discover new opportunities.</p>
        </div>

        {/* Investment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-green-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(investmentStats.totalInvested)}</div>
              <p className="text-xs text-green-600 font-medium">
                Across {investments.length} investments
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Investments
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-blue-600">
                <Target className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{investmentStats.activeInvestments}</div>
              <p className="text-xs text-blue-600 font-medium">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-purple-600">
                <PieChart className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(investmentStats.portfolioValue)}</div>
              <p className="text-xs text-purple-600 font-medium">
                Including returns
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Investment Pools
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-orange-600">
                <Users className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{pools.length}</div>
              <p className="text-xs text-orange-600 font-medium">
                Pool memberships
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Investments */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Investments</CardTitle>
                  <CardDescription>
                    {investments.length === 0 ? 'No investments yet' : 'Your recent investment activities'}
                  </CardDescription>
                </div>
                <Button size="sm" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Opportunities
                </Button>
              </CardHeader>
              <CardContent>
                {investments.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No investments made yet</p>
                    <Button size="sm" className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Investing
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {investments.map((investment) => (
                      <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{investment.opportunity_title}</h4>
                            <Badge variant={getStatusBadgeVariant(investment.status)}>
                              {investment.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span>Amount: {formatCurrency(investment.amount)}</span>
                            <span className="mx-2">•</span>
                            <span>Expected ROI: {investment.expected_roi}%</span>
                            <span className="mx-2">•</span>
                            <span>Term: {investment.investment_term_months} months</span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Invested on {formatDate(investment.created_at)}
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

          {/* Investment Pools */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Investment Pools</CardTitle>
                <CardDescription>
                  {pools.length === 0 ? 'No pool memberships' : 'Pools you\'re part of'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pools.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Not part of any pools yet</p>
                    <Button size="sm" className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Join a Pool
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pools.map((pool) => (
                      <div key={pool.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{pool.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {pool.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Category: {pool.category}</div>
                          <div>Members: {pool.total_members}</div>
                          <div>Total Invested: {formatCurrency(pool.total_invested)}</div>
                        </div>
                        <div className="mt-3">
                          <Button size="sm" className="text-xs w-full">
                            View Pool
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

export default InvestorDashboard;
