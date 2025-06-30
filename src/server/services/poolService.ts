import { supabase } from '../supabaseClient';
import type { InvestmentPool, PoolMember, ApiResponse, PaginationParams, PoolMemberRole } from '../../shared/types';

export class PoolService {
  /**
   * Get all investment pools with pagination
   */
  static async getPools(params: PaginationParams): Promise<ApiResponse<InvestmentPool[]>> {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * limit;

      const { data: pools, error, count } = await supabase
        .from('investment_pools')
        .select('*, pool_members(*)', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error('Failed to fetch pools');
      }

      return {
        success: true,
        data: pools || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Get pools error:', error);
      throw error;
    }
  }

  /**
   * Get pool by ID with members
   */
  static async getPoolById(poolId: string): Promise<InvestmentPool | null> {
    try {
      const { data: pool, error } = await supabase
        .from('investment_pools')
        .select('*, pool_members(*, users(*))')
        .eq('id', poolId)
        .single();

      if (error || !pool) {
        return null;
      }

      return pool;
    } catch (error) {
      console.error('Get pool by ID error:', error);
      return null;
    }
  }

  /**
   * Create new investment pool
   */
  static async createPool(poolData: Partial<InvestmentPool>, userId: string): Promise<InvestmentPool> {
    try {
      const pool = {
        ...poolData,
        created_by: userId,
        current_amount: 0,
        status: 'active',
        category: poolData.category || 'collective' // Ensure category is set
      };

      const { data: newPool, error } = await supabase
        .from('investment_pools')
        .insert(pool)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create pool');
      }

      return newPool;
    } catch (error) {
      console.error('Create pool error:', error);
      throw error;
    }
  }

  /**
   * Update investment pool
   */
  static async updatePool(poolId: string, updateData: Partial<InvestmentPool>, userId: string, userRole: string): Promise<InvestmentPool> {
    try {
      // Check if user can update this pool
      const { data: existingPool, error: fetchError } = await supabase
        .from('investment_pools')
        .select('created_by')
        .eq('id', poolId)
        .single();

      if (fetchError || !existingPool) {
        throw new Error('Pool not found');
      }

      if (userRole !== 'super_admin' && userId !== existingPool.created_by) {
        throw new Error('Access denied');
      }

      const { data: updatedPool, error } = await supabase
        .from('investment_pools')
        .update(updateData)
        .eq('id', poolId)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to update pool');
      }

      return updatedPool;
    } catch (error) {
      console.error('Update pool error:', error);
      throw error;
    }
  }

  /**
   * Join investment pool
   */
  static async joinPool(poolId: string, userId: string, contributionAmount: number): Promise<PoolMember> {
    try {
      // Check if pool exists and is active
      const { data: pool, error: poolError } = await supabase
        .from('investment_pools')
        .select('*')
        .eq('id', poolId)
        .eq('status', 'active')
        .single();

      if (poolError || !pool) {
        throw new Error('Pool not found or inactive');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('pool_members')
        .select('id')
        .eq('pool_id', poolId)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        throw new Error('Already a member of this pool');
      }

      // Add user to pool
      const { data: member, error } = await supabase
        .from('pool_members')
        .insert({
          pool_id: poolId,
          user_id: userId,
          role: 'member',
          contribution_amount: contributionAmount,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to join pool');
      }

      return member;
    } catch (error) {
      console.error('Join pool error:', error);
      throw error;
    }
  }

  /**
   * Leave investment pool
   */
  static async leavePool(poolId: string, userId: string): Promise<void> {
    try {
      // Check if user is a member
      const { data: member, error: memberError } = await supabase
        .from('pool_members')
        .select('*')
        .eq('pool_id', poolId)
        .eq('user_id', userId)
        .single();

      if (memberError || !member) {
        throw new Error('Not a member of this pool');
      }

      // Update member status
      const { error } = await supabase
        .from('pool_members')
        .update({ is_active: false })
        .eq('id', member.id);

      if (error) {
        throw new Error('Failed to leave pool');
      }
    } catch (error) {
      console.error('Leave pool error:', error);
      throw error;
    }
  }

  /**
   * Get user's pools
   */
  static async getUserPools(userId: string): Promise<InvestmentPool[]> {
    try {
      const { data: poolMembers, error } = await supabase
        .from('pool_members')
        .select('pool_id, is_active')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error || !poolMembers) {
        return [];
      }

      const poolIds = poolMembers.map(member => member.pool_id);
      if (poolIds.length === 0) {
        return [];
      }

      const { data: pools, error: poolsError } = await supabase
        .from('investment_pools')
        .select('*')
        .in('id', poolIds);

      if (poolsError) {
        return [];
      }

      return pools || [];
    } catch (error) {
      console.error('Get user pools error:', error);
      return [];
    }
  }

  /**
   * Get pool members
   */
  static async getPoolMembers(poolId: string): Promise<PoolMember[]> {
    try {
      const { data: members, error } = await supabase
        .from('pool_members')
        .select('*, users(*)')
        .eq('pool_id', poolId)
        .eq('is_active', true);

      if (error) {
        return [];
      }

      return members || [];
    } catch (error) {
      console.error('Get pool members error:', error);
      return [];
    }
  }

  /**
   * Update pool member role
   */
  static async updateMemberRole(poolId: string, userId: string, newRole: PoolMemberRole, updatedBy: string): Promise<PoolMember> {
    try {
      // Check if updater has permission (pool creator or admin)
      const { data: pool, error: poolError } = await supabase
        .from('investment_pools')
        .select('created_by')
        .eq('id', poolId)
        .single();

      if (poolError || !pool) {
        throw new Error('Pool not found');
      }

      // Check if user is admin or pool creator
      const { data: updaterUser } = await supabase.auth.getUser();
      if (updaterUser.user?.role !== 'super_admin' && updaterUser.user?.id !== pool.created_by) {
        throw new Error('Access denied');
      }

      const { data: member, error } = await supabase
        .from('pool_members')
        .update({ role: newRole })
        .eq('pool_id', poolId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to update member role');
      }

      return member;
    } catch (error) {
      console.error('Update member role error:', error);
      throw error;
    }
  }

  /**
   * Get pool statistics
   */
  static async getPoolStats(poolId: string): Promise<any> {
    try {
      const { data: pool, error: poolError } = await supabase
        .from('investment_pools')
        .select('*')
        .eq('id', poolId)
        .single();

      if (poolError || !pool) {
        throw new Error('Pool not found');
      }

      const { data: members, error: membersError } = await supabase
        .from('pool_members')
        .select('contribution_amount')
        .eq('pool_id', poolId)
        .eq('is_active', true);

      if (membersError) {
        throw new Error('Failed to fetch pool members');
      }

      const totalContributions = members?.reduce((sum, member) => sum + (member.contribution_amount || 0), 0) || 0;
      const memberCount = members?.length || 0;

      return {
        pool,
        totalContributions,
        memberCount,
        progressPercentage: pool.target_amount > 0 ? (totalContributions / pool.target_amount) * 100 : 0
      };
    } catch (error) {
      console.error('Get pool stats error:', error);
      throw error;
    }
  }
}
