import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface Investment {
  id: string;
  reference_number: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  from_user: {
    full_name: string;
    email: string;
  };
  opportunity: {
    title: string;
    entrepreneur: {
      full_name: string;
    };
  };
}

export const AdminInvestments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState({
    totalInvestments: 0,
    totalAmount: 0,
    pendingInvestments: 0,
    completedInvestments: 0
  });

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  }, [user]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          reference_number,
          amount,
          currency,
          status,
          created_at,
          from_user_id,
          opportunity_id,
          users!transactions_from_user_id_fkey(full_name, email),
          opportunities!transactions_opportunity_id_fkey(
            title,
            entrepreneur_id,
            users!opportunities_entrepreneur_id_fkey(full_name)
          )
        `)
        .eq('type', 'investment')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching investments:', error);
        toast({
          title: "Error",
          description: "Failed to load investments",
          variant: "destructive",
        });
        return;
      }

      const formattedInvestments = data?.map(inv => ({
        id: inv.id,
        reference_number: inv.reference_number,
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        created_at: inv.created_at,
        from_user: {
          full_name: inv.users?.full_name || 'Unknown User',
          email: inv.users?.email || 'unknown@email.com'
        },
        opportunity: {
          title: inv.opportunities?.title || 'Unknown Opportunity',
          entrepreneur: {
            full_name: inv.opportunities?.users?.full_name || 'Unknown Entrepreneur'
          }
        }
      })) || [];

      setInvestments(formattedInvestments);

      // Calculate stats
      const totalAmount = formattedInvestments.reduce((sum, inv) => sum + inv.amount, 0);
      const pendingCount = formattedInvestments.filter(inv => inv.status === 'pending').length;
      const completedCount = formattedInvestments.filter(inv => inv.status === 'completed').length;

      setStats({
        totalInvestments: formattedInvestments.length,
        totalAmount,
        pendingInvestments: pendingCount,
        completedInvestments: completedCount
      });

    } catch (error) {
      console.error('Error fetching investments:', error);
      toast({
        title: "Error",
        description: "Failed to load investments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin-dashboard');
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading investments...</span>
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
              <div>
                <h1 className="text-xl font-bold">Investment Management</h1>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage all investment activities
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investments
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvestments}</div>
              <p className="text-xs text-blue-600 font-medium">
                All time investments
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              <p className="text-xs text-green-600 font-medium">
                Total invested amount
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Calendar className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingInvestments}</div>
              <p className="text-xs text-orange-600 font-medium">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedInvestments}</div>
              <p className="text-xs text-purple-600 font-medium">
                Successfully processed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investments Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Investments</CardTitle>
            <CardDescription>
              Latest investment transactions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No investments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{investment.opportunity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {investment.from_user.full_name} → {investment.opportunity.entrepreneur.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {investment.reference_number} • {formatDate(investment.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(investment.amount, investment.currency)}</p>
                        <Badge variant={getStatusBadgeVariant(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
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
  );
};

export default AdminInvestments; 