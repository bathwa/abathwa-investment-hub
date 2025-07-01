
import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Eye,
  PlusCircle,
  Target,
  BarChart3,
  Wallet,
  Activity
} from 'lucide-react';

const InvestorDashboard = () => {
  const portfolioStats = [
    {
      title: "Total Portfolio Value",
      value: "$125,430",
      change: "+8.2%",
      icon: Wallet,
      color: "text-green-600"
    },
    {
      title: "Active Investments",
      value: "12",
      change: "+2",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Monthly Returns",
      value: "$3,420",
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Available Balance",
      value: "$25,000",
      change: "Ready to invest",
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  const opportunities = [
    {
      title: "Tech Startup Accelerator Pool",
      category: "Technology",
      target: "$500,000",
      raised: "$350,000",
      investors: 45,
      roi: "15-25%",
      status: "Active"
    },
    {
      title: "Green Energy Initiative",
      category: "Renewable Energy",
      target: "$1,200,000",
      raised: "$800,000",
      investors: 120,
      roi: "12-18%",
      status: "Active"
    },
    {
      title: "African Agriculture Fund",
      category: "Agriculture",
      target: "$750,000",
      raised: "$450,000",
      investors: 78,
      roi: "10-20%",
      status: "Active"
    }
  ];

  const myInvestments = [
    {
      name: "FinTech Innovation Pool",
      amount: "$10,000",
      returns: "+15.2%",
      status: "Performing"
    },
    {
      name: "Healthcare Solutions",
      amount: "$15,000",
      returns: "+8.7%",
      status: "Stable"
    },
    {
      name: "EdTech Ventures",
      amount: "$8,000",
      returns: "+22.1%",
      status: "Excellent"
    }
  ];

  return (
    <DashboardLayout 
      title="Investor Dashboard" 
      description="Track your investments and discover new opportunities"
    >
      <div className="space-y-8">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Opportunities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Investment Opportunities</CardTitle>
                <CardDescription>Discover new pools and investment options</CardDescription>
              </div>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Browse All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{opportunity.title}</h3>
                    <Badge variant="outline">{opportunity.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-medium">{opportunity.target}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Raised</p>
                      <p className="font-medium">{opportunity.raised}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected ROI</p>
                      <p className="font-medium text-green-600">{opportunity.roi}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Investments */}
        <Card>
          <CardHeader>
            <CardTitle>My Investments</CardTitle>
            <CardDescription>Track your current investment performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myInvestments.map((investment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{investment.name}</h3>
                    <p className="text-sm text-muted-foreground">Investment: {investment.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{investment.returns}</p>
                    <Badge variant="outline">{investment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;
