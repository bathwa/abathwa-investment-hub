
import React from 'react';
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
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const stats = [
    {
      title: "Total Users",
      value: "1,284",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Investments",
      value: "$2.4M",
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Revenue",
      value: "$124K",
      change: "+23.1%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Investment Pools",
      value: "47",
      change: "+5.3%",
      icon: Building,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      onClick: () => console.log('User Management')
    },
    {
      title: "Investment Oversight",
      description: "Monitor all investment activities",
      icon: BarChart3,
      color: "bg-green-100 text-green-600",
      onClick: () => console.log('Investment Oversight')
    },
    {
      title: "Platform Settings",
      description: "Configure system settings",
      icon: Settings,
      color: "bg-purple-100 text-purple-600",
      onClick: () => console.log('Platform Settings')
    },
    {
      title: "Reports & Analytics",
      description: "View detailed reports and analytics",
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
      onClick: () => console.log('Reports & Analytics')
    },
    {
      title: "Payment Gateway",
      description: "Manage payment integrations",
      icon: CreditCard,
      color: "bg-teal-100 text-teal-600",
      onClick: () => console.log('Payment Gateway')
    },
    {
      title: "Security & Compliance",
      description: "Security settings and compliance",
      icon: Shield,
      color: "bg-red-100 text-red-600",
      onClick: () => console.log('Security')
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
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Super Administrator</p>
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
          <h2 className="text-3xl font-bold mb-2">Welcome back, Administrator</h2>
          <p className="text-muted-foreground">Here's what's happening with your investment platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="border-2 card-hover cursor-pointer" onClick={action.onClick}>
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
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>Latest activities across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New user registration", user: "John Doe", time: "2 minutes ago", type: "user" },
                { action: "Investment pool created", user: "Tech Innovators Pool", time: "15 minutes ago", type: "pool" },
                { action: "Opportunity published", user: "Sarah Chen", time: "1 hour ago", type: "opportunity" },
                { action: "Payment processed", user: "$25,000 investment", time: "2 hours ago", type: "payment" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'pool' ? 'bg-green-100 text-green-600' :
                      activity.type === 'opportunity' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
