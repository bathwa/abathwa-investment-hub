
import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Building,
  PieChart,
  BarChart3,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Pools",
      value: "45",
      change: "+8%",
      icon: Building,
      color: "text-green-600"
    },
    {
      title: "Total Investments",
      value: "$2.4M",
      change: "+15%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "-5%",
      icon: AlertCircle,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      href: "/admin-user-management",
      icon: Users
    },
    {
      title: "Pool Management",
      description: "Create and manage investment pools",
      href: "/admin-pool-management",
      icon: Building
    },
    {
      title: "Investment Overview",
      description: "Monitor all investment activities",
      href: "/admin-investments",
      icon: TrendingUp
    }
  ];

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      description="System overview and management tools"
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
                <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                  {stat.change} from last month
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks and system management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <action.icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                      </div>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New user registration", user: "john@example.com", time: "2 minutes ago" },
                { action: "Pool created", user: "admin@abathwa.com", time: "15 minutes ago" },
                { action: "Investment submitted", user: "investor@example.com", time: "1 hour ago" },
                { action: "User role updated", user: "admin@abathwa.com", time: "2 hours ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">by {activity.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
