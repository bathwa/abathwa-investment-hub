
import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Target,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

const EntrepreneurDashboard = () => {
  const stats = [
    {
      title: "Active Proposals",
      value: "3",
      change: "2 pending review",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Total Funding Raised",
      value: "$45,000",
      change: "From 2 successful pools",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Interested Investors",
      value: "28",
      change: "+5 this week",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "67%",
      change: "Above average",
      icon: Target,
      color: "text-orange-600"
    }
  ];

  const proposals = [
    {
      title: "EcoTech Solutions Platform",
      category: "Technology",
      requested: "$100,000",
      raised: "$65,000",
      status: "Active",
      investors: 12,
      daysLeft: 15
    },
    {
      title: "Mobile Banking for Rural Areas",
      category: "FinTech",
      requested: "$250,000",
      raised: "$180,000",
      status: "Active",
      investors: 25,
      daysLeft: 8
    },
    {
      title: "Sustainable Agriculture App",
      category: "Agriculture",
      requested: "$75,000",
      raised: "$75,000",
      status: "Completed",
      investors: 18,
      daysLeft: 0
    }
  ];

  const recentActivity = [
    { action: "New investor joined EcoTech Solutions", time: "2 hours ago", type: "investor" },
    { action: "Funding milestone reached for Mobile Banking", time: "1 day ago", type: "milestone" },
    { action: "Proposal approved by review committee", time: "3 days ago", type: "approval" },
    { action: "New message from potential co-founder", time: "5 days ago", type: "message" }
  ];

  return (
    <DashboardLayout 
      title="Entrepreneur Dashboard" 
      description="Manage your business proposals and track funding progress"
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your entrepreneurial journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col">
                <PlusCircle className="w-6 h-6 mb-2" />
                Create New Proposal
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                Find Co-Founders
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                View Market Insights
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Proposals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Proposals</CardTitle>
                <CardDescription>Track your funding campaigns and investor interest</CardDescription>
              </div>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                New Proposal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposals.map((proposal, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{proposal.title}</h3>
                      <Badge variant="outline" className="mt-1">{proposal.category}</Badge>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={proposal.status === 'Completed' ? 'default' : 'secondary'}
                        className={proposal.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {proposal.status === 'Completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {proposal.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Requested</p>
                      <p className="font-medium">{proposal.requested}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Raised</p>
                      <p className="font-medium text-green-600">{proposal.raised}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Investors</p>
                      <p className="font-medium">{proposal.investors}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {proposal.status === 'Completed' ? 'Completed' : 'Days Left'}
                      </p>
                      <p className="font-medium">
                        {proposal.status === 'Completed' ? '✓' : proposal.daysLeft}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Message Investors</Button>
                    {proposal.status === 'Active' && (
                      <Button size="sm" variant="outline">Update Progress</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates on your proposals and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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

export default EntrepreneurDashboard;
