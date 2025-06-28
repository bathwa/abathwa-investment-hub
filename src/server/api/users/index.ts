import { Router } from 'express';
import { supabase } from '../../supabaseClient';
import { authenticateToken, requireRole, requireSuperAdmin } from '../../middleware/auth';
import { validateRequest, updateUserSchema, paginationSchema } from '../../utils/validation';
import type { User, UserProfile, ApiResponse, PaginationParams } from '../../../shared/types';

const router = Router();

/**
 * @route GET /api/users
 * @desc Get all users (admin only)
 * @access Private (Super Admin)
 */
router.get('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query as PaginationParams;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }

    const response: ApiResponse<User[]> = {
      success: true,
      data: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private (Admin or self)
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;

    // Check if user can access this profile
    if (user.role !== 'super_admin' && user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !userData) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/users/:id
 * @desc Update user profile
 * @access Private (Admin or self)
 */
router.put('/:id', authenticateToken, validateRequest(updateUserSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const updateData = req.body;

    // Check if user can update this profile
    if (user.role !== 'super_admin' && user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Remove sensitive fields that shouldn't be updated
    delete updateData.email;
    delete updateData.role;
    delete updateData.status;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route DELETE /api/users/:id
 * @desc Delete user (admin only)
 * @access Private (Super Admin)
 */
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - update status to deleted
    const { error } = await supabase
      .from('users')
      .update({ status: 'deleted' })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/users/:id/suspend
 * @desc Suspend user (admin only)
 * @access Private (Super Admin)
 */
router.post('/:id/suspend', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('users')
      .update({ status: 'suspended' })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to suspend user'
      });
    }

    res.json({
      success: true,
      message: 'User suspended successfully'
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/users/:id/activate
 * @desc Activate user (admin only)
 * @access Private (Super Admin)
 */
router.post('/:id/activate', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('users')
      .update({ status: 'active' })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to activate user'
      });
    }

    res.json({
      success: true,
      message: 'User activated successfully'
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/users/:id/profile
 * @desc Get user profile
 * @access Private (Admin or self)
 */
router.get('/:id/profile', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;

    // Check if user can access this profile
    if (user.role !== 'super_admin' && user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch profile'
      });
    }

    res.json({
      success: true,
      data: profile || null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/users/:id/profile
 * @desc Update user profile
 * @access Private (Admin or self)
 */
router.put('/:id/profile', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const profileData = req.body;

    // Check if user can update this profile
    if (user.role !== 'super_admin' && user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', id)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: id,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.json({
      success: true,
      data: result,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/users/:id/opportunities
 * @desc Get user's opportunities
 * @access Private (Admin or self)
 */
router.get('/:id/opportunities', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const { page = 1, limit = 10 } = req.query as PaginationParams;
    const offset = (page - 1) * limit;

    // Check if user can access this data
    if (user.role !== 'super_admin' && user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { data: opportunities, error, count } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('entrepreneur_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch opportunities'
      });
    }

    res.json({
      success: true,
      data: opportunities || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get user opportunities error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/users/:id/investments
 * @desc Get user's investments
 * @access Private (Admin or self)
 */
router.get('/:id/investments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const { page = 1, limit = 10 } = req.query as PaginationParams;
    const offset = (page - 1) * limit;

    // Check if user can access this data
    if (user.role !== 'super_admin' && user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { data: investments, error, count } = await supabase
      .from('investment_offers')
      .select('*, opportunities(*)', { count: 'exact' })
      .eq('investor_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch investments'
      });
    }

    res.json({
      success: true,
      data: investments || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 