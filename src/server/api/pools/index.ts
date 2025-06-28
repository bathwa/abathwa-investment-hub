import { Router } from 'express';
import { supabase } from '../../supabaseClient';
import { authenticateToken, requireRole } from '../../middleware/auth';
import { validateRequest, createPoolSchema, paginationSchema } from '../../utils/validation';
import type { InvestmentPool, ApiResponse, PaginationParams } from '../../../shared/types';

const router = Router();

/**
 * @route GET /api/pools
 * @desc Get all investment pools
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query as PaginationParams;
    const offset = (page - 1) * limit;

    const { data: pools, error, count } = await supabase
      .from('investment_pools')
      .select('*, pool_members(*)', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch pools'
      });
    }

    const response: ApiResponse<InvestmentPool[]> = {
      success: true,
      data: pools || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get pools error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/pools
 * @desc Create new investment pool
 * @access Private (Investor)
 */
router.post('/', authenticateToken, requireRole(['investor', 'super_admin']), validateRequest(createPoolSchema), async (req, res) => {
  try {
    const { user } = req as any;
    const poolData = {
      ...req.body,
      created_by: user.id,
      current_amount: 0,
      status: 'active'
    };

    const { data: pool, error } = await supabase
      .from('investment_pools')
      .insert(poolData)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create pool'
      });
    }

    res.status(201).json({
      success: true,
      data: pool,
      message: 'Investment pool created successfully'
    });
  } catch (error) {
    console.error('Create pool error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/pools/:id
 * @desc Get pool by ID
 * @access Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: pool, error } = await supabase
      .from('investment_pools')
      .select('*, pool_members(*, users(*))')
      .eq('id', id)
      .single();

    if (error || !pool) {
      return res.status(404).json({
        success: false,
        error: 'Pool not found'
      });
    }

    res.json({
      success: true,
      data: pool
    });
  } catch (error) {
    console.error('Get pool error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/pools/:id
 * @desc Update pool
 * @access Private (Creator or Admin)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const updateData = req.body;

    // Check if user can update this pool
    const { data: existingPool, error: fetchError } = await supabase
      .from('investment_pools')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError || !existingPool) {
      return res.status(404).json({
        success: false,
        error: 'Pool not found'
      });
    }

    if (user.role !== 'super_admin' && user.id !== existingPool.created_by) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { data: updatedPool, error } = await supabase
      .from('investment_pools')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update pool'
      });
    }

    res.json({
      success: true,
      data: updatedPool,
      message: 'Pool updated successfully'
    });
  } catch (error) {
    console.error('Update pool error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/pools/:id/join
 * @desc Join investment pool
 * @access Private (Investor)
 */
router.post('/:id/join', authenticateToken, requireRole(['investor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const { contribution_amount } = req.body;

    // Check if pool exists and is active
    const { data: pool, error: poolError } = await supabase
      .from('investment_pools')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (poolError || !pool) {
      return res.status(404).json({
        success: false,
        error: 'Pool not found or inactive'
      });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('pool_members')
      .select('id')
      .eq('pool_id', id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'Already a member of this pool'
      });
    }

    // Add user to pool
    const { data: member, error } = await supabase
      .from('pool_members')
      .insert({
        pool_id: id,
        user_id: user.id,
        role: 'member',
        contribution_amount: contribution_amount || 0,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to join pool'
      });
    }

    res.json({
      success: true,
      data: member,
      message: 'Successfully joined pool'
    });
  } catch (error) {
    console.error('Join pool error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/pools/:id/leave
 * @desc Leave investment pool
 * @access Private
 */
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;

    // Check if user is a member
    const { data: member, error: memberError } = await supabase
      .from('pool_members')
      .select('*')
      .eq('pool_id', id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !member) {
      return res.status(404).json({
        success: false,
        error: 'Not a member of this pool'
      });
    }

    // Update member status
    const { error } = await supabase
      .from('pool_members')
      .update({ is_active: false })
      .eq('id', member.id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to leave pool'
      });
    }

    res.json({
      success: true,
      message: 'Successfully left pool'
    });
  } catch (error) {
    console.error('Leave pool error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 