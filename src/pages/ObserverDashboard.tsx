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
  BarChart3,
  Activity,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ObserverDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const observerStats = [
    {
      title: "Monitored Entities",
      value: "12",
      change: "+3",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Reports Generated",
      value: "28",
      change: "+8",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Active Observations",
      value: "5",
      change: "+2",
      icon: Activity,
      color: "text-purple-600"
    },
    {
      title: "Alerts Triggered",
      value: "3",
      change: "-1",
      icon: Bell,
      color: "text-orange-600"
    }
  ];

  const monitoredEntities = [
    {
      name: "GreenTech Solutions",
      type: "Opportunity",
      status: "Active",
      lastActivity: "2 hours ago",
      riskLevel: "Low",
      alerts: 0
    },
    {
      name: "AgriTech Platform",
      type: "Opportunity",
      status: "Active",
      lastActivity: "1 day ago",
      riskLevel: "Medium",
      alerts: 2
    },
    {
      name: "TechStart Inc",
      type: "Company",
      status: "Active",
      lastActivity: "3 days ago",
      riskLevel: "Low",
      alerts: 0
    },
    {
      name: "EcoVentures Pool",
      type: "Investment Pool",
      status: "Active",
      lastActivity: "5 days ago",
      riskLevel: "High",
      alerts: 5
    }
  ];

  const recentReports = [
    {
      title: "Monthly Performance Report",
      entity: "GreenTech Solutions",
      type: "Financial",
      generated: "2 days ago",
      status: "Completed"
    },
    {
      title: "Risk Assessment Report",
      entity: "EcoVentures Pool",
      type: "Risk Analysis",
      generated: "1 week ago",
      status: "Completed"
    },
    {
      title: "Compliance Check Report",
      entity: "AgriTech Platform",
      type: "Compliance",
      generated: "2 weeks ago",
      status: "Pending Review"
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
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Observer Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Monitor and report on activities</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="border-2">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                Observer
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
          <h2 className="text-3xl font-bold mb-2">Monitoring & Reporting</h2>
          <p className="text-muted-foreground">Track activities and generate comprehensive reports.</p>
        </div>

        {/* Observer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {observerStats.map((stat, index) => (
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
          {/* Monitored Entities */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Monitored Entities</CardTitle>
                  <CardDescription>Entities under your observation</CardDescription>
                </div>
                <Button size="sm" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entity
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoredEntities.map((entity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{entity.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {entity.type}
                          </Badge>
                          <Badge 
                            variant={
                              entity.status === "Active" ? "default" : "secondary"
                            }
                          >
                            {entity.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>Last Activity: {entity.lastActivity}</span>
                          <span className="mx-2">•</span>
                          <span>Risk Level: {entity.riskLevel}</span>
                          {entity.alerts > 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-orange-600">{entity.alerts} alerts</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Generated reports and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{report.title}</h4>
                        <Badge 
                          variant={report.status === "Completed" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Entity: {report.entity}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Type: {report.type}</div>
                        <div>Generated: {report.generated}</div>
                      </div>
                      <div className="mt-3">
                        <Button size="sm" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          Download
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

export default ObserverDashboard; 