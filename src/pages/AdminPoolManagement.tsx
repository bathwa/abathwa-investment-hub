
import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Search,
  Plus,
  MoreHorizontal,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminPoolManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const pools = [
    {
      id: '1',
      name: 'FinTech Innovation Hub',
      category: 'Technology',
      status: 'active',
      targetAmount: 500000,
      raisedAmount: 350000,
      investors: 45,
      created: '2024-01-15',
      creator: 'TechVentures Ltd',
      roi: '+15.2%',
      riskLevel: 'Medium'
    },
    {
      id: '2',
      name: 'Green Energy Collective',
      category: 'Renewable Energy',
      status: 'active',
      targetAmount: 1200000,
      raisedAmount: 800000,
      investors: 120,
      created: '2024-02-01',
      creator: 'EcoSolutions Inc',
      roi: '+12.8%',
      riskLevel: 'Low'
    },
    {
      id: '3',
      name: 'African Agriculture Fund',
      category: 'Agriculture',
      status: 'pending',
      targetAmount: 750000,
      raisedAmount: 0,
      investors: 0,
      created: '2024-03-20',
      creator: 'AgriTech Solutions',
      roi: 'TBD',
      riskLevel: 'High'
    },
    {
      id: '4',
      name: 'Healthcare Innovation Pool',
      category: 'Healthcare',
      status: 'completed',
      targetAmount: 300000,
      raisedAmount: 300000,
      investors: 78,
      created: '2023-11-10',
      creator: 'MedTech Ventures',
      roi: '+22.5%',
      riskLevel: 'Medium'
    }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    suspended: 'bg-red-100 text-red-800'
  };

  const riskColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  };

  return (
    <DashboardLayout 
      title="Pool Management" 
      description="Create and manage investment pools"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pools</p>
                  <p className="text-2xl font-bold">67</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Pools</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">$15.2M</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
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
                    placeholder="Search pools by name or creator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-input rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Education">Education</option>
                </select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pool
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPools.map((pool) => (
            <Card key={pool.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pool.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Created by {pool.creator} • {pool.created}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Pool</DropdownMenuItem>
                      <DropdownMenuItem>View Investors</DropdownMenuItem>
                      <DropdownMenuItem>Generate Report</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Suspend Pool
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{pool.category}</Badge>
                  <Badge className={statusColors[pool.status as keyof typeof statusColors]}>
                    {pool.status.toUpperCase()}
                  </Badge>
                  <Badge className={riskColors[pool.riskLevel as keyof typeof riskColors]}>
                    {pool.riskLevel} Risk
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Funding Progress</span>
                    <span>{getProgressPercentage(pool.raisedAmount, pool.targetAmount).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgressPercentage(pool.raisedAmount, pool.targetAmount)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1 text-muted-foreground">
                    <span>{formatCurrency(pool.raisedAmount)}</span>
                    <span>{formatCurrency(pool.targetAmount)}</span>
                  </div>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-muted-foreground mr-1" />
                    </div>
                    <p className="text-sm font-medium">{pool.investors}</p>
                    <p className="text-xs text-muted-foreground">Investors</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="w-4 h-4 text-muted-foreground mr-1" />
                    </div>
                    <p className="text-sm font-medium text-green-600">{pool.roi}</p>
                    <p className="text-xs text-muted-foreground">ROI</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <AlertCircle className="w-4 h-4 text-muted-foreground mr-1" />
                    </div>
                    <p className="text-sm font-medium">{pool.riskLevel}</p>
                    <p className="text-xs text-muted-foreground">Risk</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPools.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No pools found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or create a new pool.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Pool
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPoolManagement;
