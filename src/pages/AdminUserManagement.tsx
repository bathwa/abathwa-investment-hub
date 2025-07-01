
import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const users = [
    {
      id: '1',
      name: 'John Investor',
      email: 'john@example.com',
      role: 'investor',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2 hours ago',
      investments: 5,
      totalInvested: '$45,000'
    },
    {
      id: '2',
      name: 'Sarah Entrepreneur',
      email: 'sarah@startup.com',
      role: 'entrepreneur',
      status: 'active',
      joinDate: '2024-02-20',
      lastLogin: '1 day ago',
      proposals: 3,
      fundingRaised: '$125,000'
    },
    {
      id: '3',
      name: 'Mike Consultant',
      email: 'mike@consulting.com',
      role: 'service_provider',
      status: 'pending',
      joinDate: '2024-03-10',
      lastLogin: '3 days ago',
      services: 2,
      earnings: '$8,500'
    },
    {
      id: '4',
      name: 'Lisa Observer',
      email: 'lisa@research.com',
      role: 'observer',
      status: 'active',
      joinDate: '2024-01-05',
      lastLogin: '5 hours ago',
      reports: 12,
      insights: 45
    }
  ];

  const roleColors = {
    investor: 'bg-blue-100 text-blue-800',
    entrepreneur: 'bg-green-100 text-green-800',
    service_provider: 'bg-purple-100 text-purple-800',
    observer: 'bg-orange-100 text-orange-800',
    super_admin: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800'
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout 
      title="User Management" 
      description="Manage user accounts, roles, and permissions"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">1,156</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">+89</p>
                </div>
                <UserPlus className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-input rounded-md"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="investor">Investors</option>
                  <option value="entrepreneur">Entrepreneurs</option>
                  <option value="service_provider">Service Providers</option>
                  <option value="observer">Observers</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Manage user accounts and their access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={`ml-2 ${statusColors[user.status as keyof typeof statusColors]}`}>
                          {user.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Joined</p>
                      <p className="font-medium">{user.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Login</p>
                      <p className="font-medium">{user.lastLogin}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {user.role === 'investor' ? 'Investments' : 
                         user.role === 'entrepreneur' ? 'Proposals' :
                         user.role === 'service_provider' ? 'Services' : 'Reports'}
                      </p>
                      <p className="font-medium">
                        {user.investments || user.proposals || user.services || user.reports || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {user.role === 'investor' ? 'Total Invested' : 
                         user.role === 'entrepreneur' ? 'Funding Raised' :
                         user.role === 'service_provider' ? 'Earnings' : 'Insights'}
                      </p>
                      <p className="font-medium">
                        {user.totalInvested || user.fundingRaised || user.earnings || user.insights || 'N/A'}
                      </p>
                    </div>
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

export default AdminUserManagement;
