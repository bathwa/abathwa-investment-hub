import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import type { InvestmentPool, ApiResponse, PaginationParams } from '../shared/types';

interface UsePoolsOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CreatePoolData {
  name: string;
  description?: string;
  category: string;
  target_amount: number;
  currency: string;
  minimum_contribution?: number;
  maximum_contribution?: number;
}

interface JoinPoolData {
  pool_id: string;
  contribution_amount: number;
}

export function usePools(options: UsePoolsOptions = {}) {
  const queryClient = useQueryClient();
  const [pools, setPools] = useState<InvestmentPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  // Fetch pools query
  const {
    data: poolsData,
    isLoading: isLoadingPools,
    error: poolsError,
    refetch: refetchPools
  } = useQuery({
    queryKey: ['pools', page, limit, sortBy, sortOrder],
    queryFn: async (): Promise<ApiResponse<InvestmentPool[]>> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/pools?${params}`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pools');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create pool mutation
  const createPoolMutation = useMutation({
    mutationFn: async (poolData: CreatePoolData): Promise<InvestmentPool> => {
      const response = await fetch('/api/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(poolData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create pool');
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
    }
  });

  // Join pool mutation
  const joinPoolMutation = useMutation({
    mutationFn: async (joinData: JoinPoolData): Promise<any> => {
      const response = await fetch(`/api/pools/${joinData.pool_id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ contribution_amount: joinData.contribution_amount })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join pool');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
    }
  });

  // Leave pool mutation
  const leavePoolMutation = useMutation({
    mutationFn: async (poolId: string): Promise<any> => {
      const response = await fetch(`/api/pools/${poolId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave pool');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
    }
  });

  // Update pool mutation
  const updatePoolMutation = useMutation({
    mutationFn: async ({ poolId, updateData }: { poolId: string; updateData: Partial<InvestmentPool> }): Promise<InvestmentPool> => {
      const response = await fetch(`/api/pools/${poolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update pool');
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
    }
  });

  // Get pool by ID
  const getPoolById = async (poolId: string): Promise<InvestmentPool | null> => {
    try {
      const response = await fetch(`/api/pools/${poolId}`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching pool:', error);
      return null;
    }
  };

  // Get user's pools
  const getUserPools = async (): Promise<InvestmentPool[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: poolMembers, error } = await supabase
        .from('pool_members')
        .select('pool_id, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error || !poolMembers) return [];

      const poolIds = poolMembers.map(member => member.pool_id);
      if (poolIds.length === 0) return [];

      const { data: pools, error: poolsError } = await supabase
        .from('investment_pools')
        .select('*')
        .in('id', poolIds);

      if (poolsError) return [];
      return pools || [];
    } catch (error) {
      console.error('Error fetching user pools:', error);
      return [];
    }
  };

  // Update local state when data changes
  useEffect(() => {
    if (poolsData?.data) {
      setPools(poolsData.data);
    }
  }, [poolsData]);

  useEffect(() => {
    setError(poolsError?.message || null);
  }, [poolsError]);

  return {
    pools: poolsData?.data || [],
    pagination: poolsData?.pagination,
    loading: isLoadingPools,
    error,
    refetch: refetchPools,
    createPool: createPoolMutation.mutate,
    joinPool: joinPoolMutation.mutate,
    leavePool: leavePoolMutation.mutate,
    updatePool: updatePoolMutation.mutate,
    getPoolById,
    getUserPools,
    isCreating: createPoolMutation.isPending,
    isJoining: joinPoolMutation.isPending,
    isLeaving: leavePoolMutation.isPending,
    isUpdating: updatePoolMutation.isPending
  };
} 