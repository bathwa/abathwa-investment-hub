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
  Calendar,
  Star,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ServiceProviderDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const serviceStats = [
    {
      title: "Total Earnings",
      value: "$12,450",
      change: "+18.2%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Projects",
      value: "5",
      change: "+2",
      icon: Briefcase,
      color: "text-blue-600"
    },
    {
      title: "Client Rating",
      value: "4.8/5",
      change: "+0.2",
      icon: Star,
      color: "text-purple-600"
    },
    {
      title: "Services Offered",
      value: "8",
      change: "+1",
      icon: Target,
      color: "text-orange-600"
    }
  ];

  const activeProjects = [
    {
      name: "GreenTech Solutions",
      service: "Financial Advisory",
      status: "In Progress",
      budget: "$5,000",
      progress: 75,
      daysLeft: 8
    },
    {
      name: "AgriTech Platform",
      service: "Legal Consultation",
      status: "Review",
      budget: "$3,500",
      progress: 90,
      daysLeft: 3
    },
    {
      name: "FinTech Startup",
      service: "Business Strategy",
      status: "Planning",
      budget: "$7,200",
      progress: 25,
      daysLeft: 15
    }
  ];

  const serviceRequests = [
    {
      title: "Legal Documentation",
      client: "TechStart Inc",
      budget: "$2,500 - $4,000",
      deadline: "2 weeks",
      status: "New"
    },
    {
      title: "Financial Modeling",
      client: "EcoVentures",
      budget: "$3,000 - $5,000",
      deadline: "1 month",
      status: "Reviewing"
    },
    {
      title: "Market Research",
      client: "HealthTech Solutions",
      budget: "$1,800 - $3,200",
      deadline: "3 weeks",
      status: "New"
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
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Service Provider Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage your services and projects</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="border-2">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge className="bg-teal-100 text-teal-600 border-teal-200">
                Verified Provider
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
          <h2 className="text-3xl font-bold mb-2">Your Professional Services</h2>
          <p className="text-muted-foreground">Track your projects and manage client relationships.</p>
        </div>

        {/* Service Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {serviceStats.map((stat, index) => (
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
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Your current client engagements</CardDescription>
                </div>
                <Button size="sm" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Service
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProjects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge 
                            variant={
                              project.status === "In Progress" ? "default" :
                              project.status === "Review" ? "secondary" : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>{project.service}</span>
                          <span className="mx-2">•</span>
                          <span>Budget: {project.budget}</span>
                          <span className="mx-2">•</span>
                          <span>{project.daysLeft} days left</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
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

          {/* Service Requests */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>New client inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.map((request, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{request.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Client: {request.client}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Budget: {request.budget}</div>
                        <div>Deadline: {request.deadline}</div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" className="text-xs">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Decline
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

export default ServiceProviderDashboard; 