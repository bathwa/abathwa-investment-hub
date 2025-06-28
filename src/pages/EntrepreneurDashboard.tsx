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
  Plus,
  Eye,
  Users,
  FileText,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EntrepreneurDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const businessStats = [
    {
      title: "Total Funding Raised",
      value: "$450,000",
      change: "+25.3%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Opportunities",
      value: "3",
      change: "+1",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Investors Engaged",
      value: "24",
      change: "+8",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Milestones Completed",
      value: "12",
      change: "+3",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const activeOpportunities = [
    {
      name: "GreenTech Solutions",
      status: "Funding in Progress",
      target: "$500,000",
      raised: "$350,000",
      investors: 18,
      daysLeft: 15
    },
    {
      name: "AgriTech Platform",
      status: "Published",
      target: "$300,000",
      raised: "$120,000",
      investors: 12,
      daysLeft: 30
    },
    {
      name: "FinTech Innovation",
      status: "Draft",
      target: "$750,000",
      raised: "$0",
      investors: 0,
      daysLeft: 0
    }
  ];

  const recentActivities = [
    {
      type: "Investment Received",
      description: "New investment of $25,000 in GreenTech Solutions",
      time: "2 hours ago",
      status: "success"
    },
    {
      type: "Milestone Completed",
      description: "Product development phase completed",
      time: "1 day ago",
      status: "info"
    },
    {
      type: "Investor Inquiry",
      description: "New investor interested in AgriTech Platform",
      time: "3 days ago",
      status: "warning"
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
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Entrepreneur Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage your ventures and funding</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="border-2">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge className="bg-orange-100 text-orange-600 border-orange-200">
                Verified Entrepreneur
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
          <h2 className="text-3xl font-bold mb-2">Your Business Ventures</h2>
          <p className="text-muted-foreground">Track your funding progress and manage opportunities.</p>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {businessStats.map((stat, index) => (
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
          {/* Active Opportunities */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Opportunities</CardTitle>
                  <CardDescription>Your current funding campaigns</CardDescription>
                </div>
                <Button size="sm" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{opportunity.name}</h4>
                          <Badge 
                            variant={
                              opportunity.status === "Funding in Progress" ? "default" :
                              opportunity.status === "Published" ? "secondary" : "outline"
                            }
                          >
                            {opportunity.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>Target: {opportunity.target}</span>
                          <span className="mx-2">•</span>
                          <span>Raised: {opportunity.raised}</span>
                          <span className="mx-2">•</span>
                          <span>{opportunity.investors} investors</span>
                        </div>
                        {opportunity.daysLeft > 0 && (
                          <div className="mt-2 text-xs text-orange-600">
                            {opportunity.daysLeft} days left
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates on your ventures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'info' ? 'bg-blue-500' : 'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.type}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
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

export default EntrepreneurDashboard; 