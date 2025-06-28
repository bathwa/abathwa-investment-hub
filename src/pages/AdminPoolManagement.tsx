import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign,
  ArrowLeft,
  Filter,
  Calendar,
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  UserPlus,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { InvestmentPool, PoolCategory, User } from '../shared/types';

interface PoolWithMembers extends InvestmentPool {
  pool_members?: {
    id: string;
    user_id: string;
    role: string;
    contribution_amount: number;
    users: {
      full_name: string;
      email: string;
    };
  }[];
  created_by_user?: {
    full_name: string;
    email: string;
  };
}

export const AdminPoolManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [pools, setPools] = useState<PoolWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPool, setSelectedPool] = useState<PoolWithMembers | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'syndicate' as PoolCategory,
    target_amount: 0,
    currency: 'USD',
    minimum_contribution: 0,
    maximum_contribution: 0,
  });

  useEffect(() => {
    if (currentUser) {
      fetchPools();
    }
  }, [currentUser]);

  const fetchPools = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('investment_pools')
        .select(`
          *,
          pool_members (
            id,
            user_id,
            role,
            contribution_amount,
            users (
              full_name,
              email
            )
          ),
          created_by_user:users!investment_pools_created_by_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pools:', error);
        toast({
          title: "Error",
          description: "Failed to load investment pools",
          variant: "destructive",
        });
      } else {
        setPools(data || []);
      }
    } catch (error) {
      console.error('Error fetching pools:', error);
      toast({
        title: "Error",
        description: "Failed to load investment pools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPools = pools.filter(pool => {
    const matchesSearch = 
      pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.created_by_user?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || pool.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || pool.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreatePool = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_pools')
        .insert([{
          name: formData.name,
          description: formData.description,
          category: formData.category,
          target_amount: formData.target_amount,
          currency: formData.currency,
          current_amount: 0,
          minimum_contribution: formData.minimum_contribution,
          maximum_contribution: formData.maximum_contribution,
          status: 'active',
          created_by: currentUser?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Investment pool created successfully",
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPools();
    } catch (error) {
      console.error('Error creating pool:', error);
      toast({
        title: "Error",
        description: "Failed to create investment pool",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePool = async () => {
    if (!selectedPool) return;

    try {
      const { error } = await supabase
        .from('investment_pools')
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          target_amount: formData.target_amount,
          currency: formData.currency,
          minimum_contribution: formData.minimum_contribution,
          maximum_contribution: formData.maximum_contribution,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedPool.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Investment pool updated successfully",
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      fetchPools();
    } catch (error) {
      console.error('Error updating pool:', error);
      toast({
        title: "Error",
        description: "Failed to update investment pool",
        variant: "destructive",
      });
    }
  };

  const handleDeletePool = async () => {
    if (!selectedPool) return;

    try {
      const { error } = await supabase
        .from('investment_pools')
        .update({
          status: 'deleted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedPool.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Investment pool deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      fetchPools();
    } catch (error) {
      console.error('Error deleting pool:', error);
      toast({
        title: "Error",
        description: "Failed to delete investment pool",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (poolId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('investment_pools')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', poolId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Pool status updated to ${newStatus}`,
      });
      
      fetchPools();
    } catch (error) {
      console.error('Error updating pool status:', error);
      toast({
        title: "Error",
        description: "Failed to update pool status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'syndicate',
      target_amount: 0,
      currency: 'USD',
      minimum_contribution: 0,
      maximum_contribution: 0,
    });
  };

  const openEditDialog = (pool: PoolWithMembers) => {
    setSelectedPool(pool);
    setFormData({
      name: pool.name,
      description: pool.description || '',
      category: pool.category,
      target_amount: pool.target_amount,
      currency: pool.currency,
      minimum_contribution: pool.minimum_contribution || 0,
      maximum_contribution: pool.maximum_contribution || 0,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (pool: PoolWithMembers) => {
    setSelectedPool(pool);
    setIsDeleteDialogOpen(true);
  };

  const getCategoryColor = (category: PoolCategory) => {
    switch (category) {
      case 'syndicate': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'collective': return 'bg-green-100 text-green-600 border-green-200';
      case 'community_development_initiative': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'company': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600 border-green-200';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-600 border-red-200';
      case 'deleted': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading pool management...</span>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate('/admin-dashboard')}
                className="border-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 investment-gradient rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Investment Pool Management</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage investment pools and members
                  </p>
                </div>
              </div>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pool
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Investment Pool</DialogTitle>
                  <DialogDescription>
                    Create a new investment pool for collective investing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pool-name">Pool Name</Label>
                    <Input
                      id="pool-name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pool-description">Description</Label>
                    <Textarea
                      id="pool-description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pool-category">Category</Label>
                    <Select value={formData.category} onValueChange={(value: PoolCategory) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="syndicate">Syndicate</SelectItem>
                        <SelectItem value="collective">Collective</SelectItem>
                        <SelectItem value="community_development_initiative">Community Development Initiative</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pool-target">Target Amount</Label>
                      <Input
                        id="pool-target"
                        type="number"
                        value={formData.target_amount}
                        onChange={(e) => setFormData({...formData, target_amount: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pool-currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="ZAR">ZAR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pool-min">Minimum Contribution</Label>
                      <Input
                        id="pool-min"
                        type="number"
                        value={formData.minimum_contribution}
                        onChange={(e) => setFormData({...formData, minimum_contribution: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pool-max">Maximum Contribution</Label>
                      <Input
                        id="pool-max"
                        type="number"
                        value={formData.maximum_contribution}
                        onChange={(e) => setFormData({...formData, maximum_contribution: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleCreatePool} className="flex-1">
                      Create Pool
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Pools</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-filter">Filter by Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="syndicate">Syndicate</SelectItem>
                    <SelectItem value="collective">Collective</SelectItem>
                    <SelectItem value="community_development_initiative">Community Development Initiative</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pools List */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Pools ({filteredPools.length})</CardTitle>
            <CardDescription>
              Manage investment pools and their members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPools.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No investment pools found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPools.map((pool) => (
                  <div key={pool.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{pool.name}</h3>
                          <Badge className={`text-xs ${getCategoryColor(pool.category)}`}>
                            {pool.category.replace('_', ' ')}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(pool.status)}`}>
                            {pool.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {pool.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <div className="font-medium">{formatCurrency(pool.target_amount, pool.currency)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current:</span>
                            <div className="font-medium">{formatCurrency(pool.current_amount, pool.currency)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Members:</span>
                            <div className="font-medium">{pool.pool_members?.length || 0}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <div className="font-medium">{formatDate(pool.created_at)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {pool.status === 'pending_approval' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(pool.id, 'active')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(pool.id, 'suspended')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(pool)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteDialog(pool)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Funding Progress</span>
                        <span>{getProgressPercentage(pool.current_amount, pool.target_amount).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(pool.current_amount, pool.target_amount)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Members List */}
                    {pool.pool_members && pool.pool_members.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Members ({pool.pool_members.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {pool.pool_members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <div className="text-sm font-medium">{member.users.full_name}</div>
                                <div className="text-xs text-muted-foreground">{member.role}</div>
                              </div>
                              <div className="text-sm font-medium">
                                {formatCurrency(member.contribution_amount, pool.currency)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Pool Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Investment Pool</DialogTitle>
            <DialogDescription>
              Update pool information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-pool-name">Pool Name</Label>
              <Input
                id="edit-pool-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pool-description">Description</Label>
              <Textarea
                id="edit-pool-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pool-category">Category</Label>
              <Select value={formData.category} onValueChange={(value: PoolCategory) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="syndicate">Syndicate</SelectItem>
                  <SelectItem value="collective">Collective</SelectItem>
                  <SelectItem value="community_development_initiative">Community Development Initiative</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pool-target">Target Amount</Label>
                <Input
                  id="edit-pool-target"
                  type="number"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({...formData, target_amount: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pool-currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pool-min">Minimum Contribution</Label>
                <Input
                  id="edit-pool-min"
                  type="number"
                  value={formData.minimum_contribution}
                  onChange={(e) => setFormData({...formData, minimum_contribution: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pool-max">Maximum Contribution</Label>
                <Input
                  id="edit-pool-max"
                  type="number"
                  value={formData.maximum_contribution}
                  onChange={(e) => setFormData({...formData, maximum_contribution: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleUpdatePool} className="flex-1">
                Update Pool
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Pool Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Investment Pool</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this investment pool? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleDeletePool} variant="destructive" className="flex-1">
              Delete Pool
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPoolManagement; 