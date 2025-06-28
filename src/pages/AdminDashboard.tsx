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
  LogOut,
  ArrowLeft,
  Bell,
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
import { validateApiResponse, filterMockData } from '../lib/validation';

interface PlatformStats {
  totalUsers: number;
  activeInvestments: number;
  platformRevenue: number;
  investmentPools: number;
  pendingApprovals: number;
  activeOpportunities: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuickAction = (route: string) => {
    // Navigate to specific admin sections
    switch (route) {
      case '/admin/users':
        navigate('/admin-user-management');
        break;
      case '/admin/pools':
        navigate('/admin-pool-management');
        break;
      case '/admin/investments':
        navigate('/admin-investments');
        break;
      case '/admin/settings':
        navigate('/admin-settings');
        break;
      case '/admin/reports':
        navigate('/admin-reports');
        break;
      case '/admin/payments':
        navigate('/admin-payments');
        break;
      case '/admin/security':
        navigate('/admin-security');
        break;
      case '/admin/approvals':
        navigate('/admin-approvals');
        break;
      default:
        toast({
          title: "Coming Soon",
          description: "This feature is under development",
        });
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

  const quickActions: QuickAction[] = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      route: "/admin/users"
    },
    {
      title: "Pool Management",
      description: "Manage investment pools",
      icon: Building,
      color: "bg-green-100 text-green-600",
      route: "/admin/pools"
    },
    {
      title: "Investment Oversight",
      description: "Monitor all investment activities",
      icon: BarChart3,
      color: "bg-purple-100 text-purple-600",
      route: "/admin/investments"
    },
    {
      title: "Platform Settings",
      description: "Configure system settings",
      icon: Settings,
      color: "bg-orange-100 text-orange-600",
      route: "/admin/settings"
    },
    {
      title: "Reports & Analytics",
      description: "View detailed reports and analytics",
      icon: FileText,
      color: "bg-teal-100 text-teal-600",
      route: "/admin/reports"
    },
    {
      title: "Security & Compliance",
      description: "Security settings and compliance",
      icon: Shield,
      color: "bg-red-100 text-red-600",
      route: "/admin/security"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading admin dashboard...</span>
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
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Super Admin
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
          <h2 className="text-3xl font-bold mb-2">Platform Overview</h2>
          <p className="text-muted-foreground">Here's what's happening with your investment platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <div className="text-2xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</div>
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
                Total fees collected
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
        </div>

        {/* Pending Approvals Alert */}
        {stats.pendingApprovals > 0 && (
          <Card className="border-2 border-yellow-200 bg-yellow-50 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">
                      {stats.pendingApprovals} Pending Approvals
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Opportunities and requests require your attention
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuickAction('/admin/approvals')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="border-2 card-hover cursor-pointer" 
                onClick={() => handleQuickAction(action.route)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>Latest user signups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">User management functionality coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Platform notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No alerts at this time</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
