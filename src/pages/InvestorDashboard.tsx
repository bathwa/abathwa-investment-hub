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
  PieChart,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { DashboardHeader } from '../components/DashboardHeader';

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
  const { user } = useAuth();
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
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      case 'active': return 'default';
      case 'confirmed': return 'default';
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
        title="Investor Dashboard" 
        subtitle="Track your investments and portfolio"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
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
                Across all investments
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Investments
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-blue-600">
                <TrendingUp className="w-4 h-4" />
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
                Total Returns
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-purple-600">
                <PieChart className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(investmentStats.totalReturns)}</div>
              <p className="text-xs text-purple-600 font-medium">
                Expected returns
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
              <div className="p-2 rounded-lg bg-background text-orange-600">
                <BarChart3 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{formatCurrency(investmentStats.portfolioValue)}</div>
              <p className="text-xs text-orange-600 font-medium">
                Total portfolio value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Investments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Investments</CardTitle>
                  <CardDescription>Your latest investment activities</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{investment.opportunity_title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(investment.amount)} • {formatDate(investment.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(investment.status)}>
                          {investment.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {investment.expected_roi}% ROI
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No investments yet</p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Investing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Investment Pools */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Investment Pools</CardTitle>
                  <CardDescription>Pools you're participating in</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Join Pool
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pools.length > 0 ? (
                <div className="space-y-4">
                  {pools.slice(0, 5).map((pool) => (
                    <div key={pool.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{pool.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {pool.total_members} members • {pool.category}
                        </p>
                      </div>
                      <Badge variant={pool.status === 'active' ? 'default' : 'secondary'}>
                        {pool.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Not part of any pools yet</p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Join a Pool
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

export default InvestorDashboard;
