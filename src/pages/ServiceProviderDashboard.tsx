
import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Handshake, 
  Star,
  DollarSign,
  Clock,
  CheckCircle,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

const ServiceProviderDashboard = () => {
  const stats = [
    {
      title: "Active Contracts",
      value: "8",
      change: "3 pending approval",
      icon: Handshake,
      color: "text-blue-600"
    },
    {
      title: "Total Earnings",
      value: "$12,450",
      change: "+18% this month",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Client Rating",
      value: "4.8/5",
      change: "From 24 reviews",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "Trust Score",
      value: "95%",
      change: "Excellent standing",
      icon: Award,
      color: "text-purple-600"
    }
  ];

  const services = [
    {
      title: "Legal Advisory Services",
      category: "Legal",
      rate: "$150/hour",
      clients: 12,
      rating: 4.9,
      status: "Active"
    },
    {
      title: "Financial Consulting",
      category: "Finance",
      rate: "$120/hour",
      clients: 8,
      rating: 4.7,
      status: "Active"
    },
    {
      title: "Business Strategy Consultation",
      category: "Strategy",
      rate: "$200/hour",
      clients: 15,
      rating: 4.8,
      status: "Active"
    }
  ];

  const recentProjects = [
    {
      client: "EcoTech Solutions",
      service: "Legal Advisory",
      amount: "$2,400",
      status: "Completed",
      date: "2 days ago"
    },
    {
      client: "Mobile Banking Startup",
      service: "Financial Consulting",
      amount: "$1,800",
      status: "In Progress",
      date: "1 week ago"
    },
    {
      client: "AgTech Innovators",
      service: "Business Strategy",
      amount: "$3,200",
      status: "Pending Review",
      date: "3 days ago"
    }
  ];

  const opportunities = [
    {
      title: "Due Diligence for Tech Startup",
      category: "Legal",
      budget: "$5,000 - $8,000",
      deadline: "2 weeks",
      proposals: 4
    },
    {
      title: "Financial Audit for Agriculture Fund",
      category: "Finance",
      budget: "$3,000 - $5,000",
      deadline: "1 month",
      proposals: 7
    },
    {
      title: "Market Analysis for FinTech",
      category: "Research",
      budget: "$2,500 - $4,000",
      deadline: "3 weeks",
      proposals: 12
    }
  ];

  return (
    <DashboardLayout 
      title="Service Provider Dashboard" 
      description="Manage your services and grow your professional network"
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

        {/* My Services */}
        <Card>
          <CardHeader>
            <CardTitle>My Services</CardTitle>
            <CardDescription>Manage your professional service offerings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{service.title}</h3>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-medium">{service.rate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Clients</p>
                      <p className="font-medium">{service.clients}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{service.rating}</span>
                      </div>
                    </div>
                    <div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Track your ongoing and completed work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{project.client}</h3>
                    <p className="text-sm text-muted-foreground">{project.service}</p>
                    <p className="text-xs text-muted-foreground">{project.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{project.amount}</p>
                    <Badge 
                      variant={project.status === 'Completed' ? 'default' : 'secondary'}
                      className={project.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {project.status === 'Completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {project.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>New Opportunities</CardTitle>
            <CardDescription>Browse available projects that match your expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{opportunity.title}</h3>
                    <Badge variant="outline">{opportunity.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">{opportunity.budget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium">{opportunity.deadline}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Proposals</p>
                      <p className="font-medium">{opportunity.proposals} submitted</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Submit Proposal</Button>
                    <Button size="sm" variant="outline">View Details</Button>
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

export default ServiceProviderDashboard;
