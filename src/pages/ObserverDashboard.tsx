
import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Building
} from 'lucide-react';

const ObserverDashboard = () => {
  const marketStats = [
    {
      title: "Total Market Value",
      value: "$15.2M",
      change: "+5.2%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Pools",
      value: "67",
      change: "+8 this month",
      icon: Building,
      color: "text-blue-600"
    },
    {
      title: "Total Investors",
      value: "1,234",
      change: "+12% growth",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "78%",
      change: "Above benchmark",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const topPerformingPools = [
    {
      name: "FinTech Innovation Hub",
      category: "Technology",
      value: "$2.4M",
      returns: "+24.5%",
      investors: 145,
      status: "Performing"
    },
    {
      name: "Green Energy Collective",
      category: "Renewable Energy",
      value: "$1.8M",
      returns: "+18.2%",
      investors: 98,
      status: "Stable"
    },
    {
      name: "Healthcare Solutions Pool",
      category: "Healthcare",
      value: "$1.5M",
      returns: "+15.7%",
      investors: 87,
      status: "Growing"
    }
  ];

  const recentActivity = [
    {
      type: "investment",
      description: "New $50K investment in AgTech Ventures",
      time: "15 minutes ago",
      impact: "positive"
    },
    {
      type: "pool",
      description: "EduTech Pool reached funding target",
      time: "2 hours ago",
      impact: "positive"
    },
    {
      type: "milestone",
      description: "Healthcare Solutions achieved 20% ROI",
      time: "1 day ago",
      impact: "positive"
    },
    {
      type: "alert",
      description: "Market volatility detected in Tech sector",
      time: "2 days ago",
      impact: "neutral"
    }
  ];

  const sectorBreakdown = [
    { sector: "Technology", percentage: 35, value: "$5.3M" },
    { sector: "Healthcare", percentage: 22, value: "$3.3M" },
    { sector: "Renewable Energy", percentage: 18, value: "$2.7M" },
    { sector: "Agriculture", percentage: 15, value: "$2.3M" },
    { sector: "Education", percentage: 10, value: "$1.6M" }
  ];

  return (
    <DashboardLayout 
      title="Observer Dashboard" 
      description="Market insights and investment ecosystem overview"
    >
      <div className="space-y-8">
        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Pools */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pools</CardTitle>
              <CardDescription>Best performing investment pools this quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingPools.map((pool, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-sm">{pool.name}</h3>
                      <p className="text-xs text-muted-foreground">{pool.category}</p>
                      <p className="text-xs">{pool.investors} investors</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{pool.value}</p>
                      <p className="text-sm text-green-600">{pool.returns}</p>
                      <Badge variant="outline" className="text-xs">{pool.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sector Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Breakdown</CardTitle>
              <CardDescription>Investment distribution across sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorBreakdown.map((sector, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{sector.sector}</span>
                      <span className="font-medium">{sector.value} ({sector.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${sector.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Market Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Market Activity</CardTitle>
            <CardDescription>Latest transactions and market movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 py-2 border-b last:border-b-0">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.impact === 'positive' ? 'bg-green-500' : 
                    activity.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Key trends and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Growth Trend</h3>
                <p className="text-sm text-muted-foreground">15% increase in new investments this month</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <PieChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Diversification</h3>
                <p className="text-sm text-muted-foreground">Well-balanced portfolio across 5 key sectors</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Activity Level</h3>
                <p className="text-sm text-muted-foreground">High engagement with 78% investor participation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ObserverDashboard;
