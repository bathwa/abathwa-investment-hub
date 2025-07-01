
import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  BarChart3,
  PieChart,
  Calendar,
  Filter
} from 'lucide-react';

const AdminInvestments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const investmentStats = [
    {
      title: "Total Investments",
      value: "$2,450,000",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Investments",
      value: "156",
      change: "+8",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Average ROI",
      value: "15.2%",
      change: "+2.1%",
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "87%",
      change: "+3%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentInvestments = [
    {
      id: '1',
      investor: 'John Smith',
      pool: 'FinTech Innovation Hub',
      amount: 25000,
      date: '2024-03-15',
      status: 'completed',
      roi: '+18.5%'
    },
    {
      id: '2',
      investor: 'Sarah Johnson',
      pool: 'Green Energy Collective',
      amount: 50000,
      date: '2024-03-14',
      status: 'pending',
      roi: 'TBD'
    },
    {
      id: '3',
      investor: 'Mike Davis',
      pool: 'Healthcare Solutions',
      amount: 15000,
      date: '2024-03-13',
      status: 'completed',
      roi: '+12.3%'
    },
    {
      id: '4',
      investor: 'Lisa Brown',
      pool: 'EdTech Ventures',
      amount: 30000,
      date: '2024-03-12',
      status: 'active',
      roi: '+22.1%'
    }
  ];

  const topPerformers = [
    {
      pool: 'FinTech Innovation Hub',
      totalInvested: '$450,000',
      investors: 45,
      roi: '+24.5%',
      status: 'Excellent'
    },
    {
      pool: 'Healthcare Solutions',
      totalInvested: '$320,000',
      investors: 32,
      roi: '+19.8%',
      status: 'Very Good'
    },
    {
      pool: 'Green Energy Collective',
      totalInvested: '$680,000',
      investors: 68,
      roi: '+15.2%',
      status: 'Good'
    }
  ];

  const sectorData = [
    { sector: 'Technology', investments: 45, amount: '$890,000', percentage: 36 },
    { sector: 'Healthcare', investments: 32, amount: '$650,000', percentage: 27 },
    { sector: 'Energy', investments: 28, amount: '$520,000', percentage: 21 },
    { sector: 'Agriculture', investments: 25, amount: '$390,000', percentage: 16 }
  ];

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DashboardLayout 
      title="Investment Overview" 
      description="Monitor and analyze all investment activities"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {investmentStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Investments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Investments</CardTitle>
                  <CardDescription>Latest investment activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInvestments.map((investment) => (
                      <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-sm">{investment.investor}</h3>
                          <p className="text-xs text-muted-foreground">{investment.pool}</p>
                          <p className="text-xs text-muted-foreground">{investment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(investment.amount)}</p>
                          <Badge className={statusColors[investment.status as keyof typeof statusColors]}>
                            {investment.status}
                          </Badge>
                          <p className="text-xs text-green-600">{investment.roi}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Pools</CardTitle>
                  <CardDescription>Best ROI this quarter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{performer.pool}</h3>
                          <Badge variant="outline">{performer.status}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-medium">{performer.totalInvested}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Investors</p>
                            <p className="font-medium">{performer.investors}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI</p>
                            <p className="font-medium text-green-600">{performer.roi}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-input rounded-md">
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                    </select>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Complete investment transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvestments.map((investment) => (
                    <div key={investment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{investment.investor}</h3>
                            <p className="text-sm text-muted-foreground">{investment.pool}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{formatCurrency(investment.amount)}</p>
                          <Badge className={statusColors[investment.status as keyof typeof statusColors]}>
                            {investment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{investment.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ROI</p>
                          <p className="font-medium text-green-600">{investment.roi}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Transaction ID</p>
                          <p className="font-medium">TXN-{investment.id.padStart(6, '0')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average ROI</span>
                        <span className="text-green-600">15.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Success Rate</span>
                        <span className="text-blue-600">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Portfolio Diversification</span>
                        <span className="text-purple-600">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>Portfolio risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Low Risk</p>
                        <p className="text-sm text-muted-foreground">Stable investments</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">45%</p>
                        <p className="text-xs text-muted-foreground">$1.1M</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Medium Risk</p>
                        <p className="text-sm text-muted-foreground">Balanced growth</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">35%</p>
                        <p className="text-xs text-muted-foreground">$850K</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">High Risk</p>
                        <p className="text-sm text-muted-foreground">High growth potential</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">20%</p>
                        <p className="text-xs text-muted-foreground">$500K</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
                <CardDescription>Investment allocation across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectorData.map((sector, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{sector.sector}</span>
                        <span>{sector.amount} ({sector.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${sector.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{sector.investments} investments</span>
                        <span>{sector.percentage}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminInvestments;
