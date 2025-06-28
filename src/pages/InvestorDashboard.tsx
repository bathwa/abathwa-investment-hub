
import React from 'react';
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
  PieChart,
  Plus,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InvestorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const portfolioStats = [
    {
      title: "Total Portfolio Value",
      value: "$125,400",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Investments",
      value: "8",
      change: "+2",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Monthly Returns",
      value: "8.2%",
      change: "+1.1%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Investment Pools",
      value: "3",
      change: "+1",
      icon: Building,
      color: "text-orange-600"
    }
  ];

  const recentInvestments = [
    {
      name: "GreenTech Solutions",
      amount: "$25,000",
      returns: "+15.2%",
      status: "Active",
      type: "Individual"
    },
    {
      name: "AgriTech Pool",
      amount: "$15,000",
      returns: "+8.5%",
      status: "Active",
      type: "Pool"
    },
    {
      name: "FinTech Startup",
      amount: "$30,000",
      returns: "+22.1%",
      status: "Completed",
      type: "Individual"
    }
  ];

  const availableOpportunities = [
    {
      name: "EcoWaste Management",
      sector: "Environmental",
      minInvestment: "$5,000",
      expectedReturn: "18-25%",
      funding: "65%"
    },
    {
      name: "EdTech Platform",
      sector: "Education",
      minInvestment: "$10,000",
      expectedReturn: "15-20%",
      funding: "40%"
    },
    {
      name: "Healthcare Innovation",
      sector: "Healthcare",
      minInvestment: "$20,000",
      expectedReturn: "20-30%",
      funding: "25%"
    }
  ];

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
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Investor Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, Investor</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="border-2">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge className="bg-blue-100 text-blue-600 border-blue-200">
                Verified Investor
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

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {portfolioStats.map((stat, index) => (
            <Card key={index} className="border-2 card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-background ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">
                  {stat.change} this month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Investments */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Investments</CardTitle>
                  <CardDescription>Your latest investment activities</CardDescription>
                </div>
                <Button size="sm" className="btn-primary">
                  <PieChart className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvestments.map((investment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                          investment.type === 'Pool' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {investment.type === 'Pool' ? 
                            <Building className="w-5 h-5" /> : 
                            <Target className="w-5 h-5" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{investment.name}</p>
                          <p className="text-sm text-muted-foreground">{investment.type} Investment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{investment.amount}</p>
                        <p className={`text-sm ${investment.returns.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {investment.returns}
                        </p>
                      </div>
                      <Badge variant={investment.status === 'Active' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Opportunities */}
          <div>
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>New Opportunities</CardTitle>
                  <CardDescription>Discover investment opportunities</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="border-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{opportunity.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {opportunity.sector}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Min. Investment:</span>
                          <span className="font-medium">{opportunity.minInvestment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Return:</span>
                          <span className="font-medium text-green-600">{opportunity.expectedReturn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Funding Progress:</span>
                          <span className="font-medium">{opportunity.funding}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="btn-primary flex-1 text-xs">
                          Invest Now
                        </Button>
                        <Button size="sm" variant="outline" className="border-2">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
