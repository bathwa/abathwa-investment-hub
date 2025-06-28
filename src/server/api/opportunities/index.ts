import { Router } from 'express';
import { supabase } from '../../supabaseClient';
import { authenticateToken, requireRole } from '../../middleware/auth';
import { validateRequest, createOpportunitySchema, updateOpportunitySchema, paginationSchema, searchFiltersSchema } from '../../utils/validation';
import { aiService } from '../../services/aiService';
import type { Opportunity, ApiResponse, PaginationParams, SearchFilters } from '../../../shared/types';

const router = Router();

/**
 * @route GET /api/opportunities
 * @desc Get all published opportunities (public)
 * @access Public
 */
router.get('/', validateQuery(paginationSchema), validateQuery(searchFiltersSchema), async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query as PaginationParams;
    const filters = req.query as SearchFilters;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('opportunities')
      .select('*, users!inner(full_name, reliability_score)', { count: 'exact' })
      .eq('status', 'published');

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.industry) {
      query = query.ilike('industry', `%${filters.industry}%`);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.min_amount) {
      query = query.gte('funding_target', filters.min_amount);
    }
    if (filters.max_amount) {
      query = query.lte('funding_target', filters.max_amount);
    }
    if (filters.risk_level) {
      // Convert risk level to score range
      const riskRanges = {
        'low': [0, 30],
        'medium': [31, 70],
        'high': [71, 100]
      };
      const [minRisk, maxRisk] = riskRanges[filters.risk_level as keyof typeof riskRanges] || [0, 100];
      query = query.gte('risk_score', minRisk).lte('risk_score', maxRisk);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: opportunities, error, count } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch opportunities'
      });
    }

    const response: ApiResponse<Opportunity[]> = {
      success: true,
      data: opportunities || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/opportunities
 * @desc Create new opportunity
 * @access Private (Entrepreneur)
 */
router.post('/', authenticateToken, requireRole(['entrepreneur', 'super_admin']), validateRequest(createOpportunitySchema), async (req, res) => {
  try {
    const { user } = req as any;
    const opportunityData = {
      ...req.body,
      entrepreneur_id: user.id,
      status: 'draft'
    };

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .insert(opportunityData)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create opportunity'
      });
    }

    // Calculate initial risk score
    await aiService.assessOpportunityRisk(opportunity.id);

    res.status(201).json({
      success: true,
      data: opportunity,
      message: 'Opportunity created successfully'
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/opportunities/:id
 * @desc Get opportunity by ID
 * @access Public (for published) / Private (for drafts)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select('*, users!inner(full_name, reliability_score, bio), opportunity_milestones(*)')
      .eq('id', id)
      .single();

    if (error || !opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    // Check access permissions
    if (opportunity.status !== 'published') {
      const { user } = req as any;
      if (!user || (user.role !== 'super_admin' && user.id !== opportunity.entrepreneur_id)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/opportunities/:id
 * @desc Update opportunity
 * @access Private (Owner or Admin)
 */
router.put('/:id', authenticateToken, validateRequest(updateOpportunitySchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const updateData = req.body;

    // Check if user can update this opportunity
    const { data: existingOpportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('entrepreneur_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingOpportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (user.role !== 'super_admin' && user.id !== existingOpportunity.entrepreneur_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Prevent status changes to published opportunities (require admin approval)
    if (existingOpportunity.status === 'published' && updateData.status && user.role !== 'super_admin') {
      delete updateData.status;
    }

    const { data: updatedOpportunity, error } = await supabase
      .from('opportunities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update opportunity'
      });
    }

    // Recalculate risk score if significant changes were made
    if (updateData.funding_target || updateData.industry || updateData.team_size) {
      await aiService.assessOpportunityRisk(id);
    }

    res.json({
      success: true,
      data: updatedOpportunity,
      message: 'Opportunity updated successfully'
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route DELETE /api/opportunities/:id
 * @desc Delete opportunity
 * @access Private (Owner or Admin)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;

    // Check if user can delete this opportunity
    const { data: opportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('entrepreneur_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (user.role !== 'super_admin' && user.id !== opportunity.entrepreneur_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Soft delete - update status to cancelled
    const { error } = await supabase
      .from('opportunities')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete opportunity'
      });
    }

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/opportunities/:id/publish
 * @desc Publish opportunity (requires admin approval)
 * @access Private (Owner)
 */
router.post('/:id/publish', authenticateToken, requireRole(['entrepreneur']), async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;

    // Check if user owns this opportunity
    const { data: opportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('entrepreneur_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (user.id !== opportunity.entrepreneur_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    if (opportunity.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Only draft opportunities can be submitted for approval'
      });
    }

    // Update status to pending approval
    const { error } = await supabase
      .from('opportunities')
      .update({ status: 'pending_approval' })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to submit opportunity for approval'
      });
    }

    res.json({
      success: true,
      message: 'Opportunity submitted for approval'
    });
  } catch (error) {
    console.error('Publish opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/opportunities/:id/approve
 * @desc Approve opportunity (admin only)
 * @access Private (Super Admin)
 */
router.post('/:id/approve', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const { data: opportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (opportunity.status !== 'pending_approval') {
      return res.status(400).json({
        success: false,
        error: 'Only pending opportunities can be approved'
      });
    }

    const { error } = await supabase
      .from('opportunities')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to approve opportunity'
      });
    }

    res.json({
      success: true,
      message: 'Opportunity approved and published'
    });
  } catch (error) {
    console.error('Approve opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/opportunities/:id/reject
 * @desc Reject opportunity (admin only)
 * @access Private (Super Admin)
 */
router.post('/:id/reject', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { data: opportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError || !opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (opportunity.status !== 'pending_approval') {
      return res.status(400).json({
        success: false,
        error: 'Only pending opportunities can be rejected'
      });
    }

    const { error } = await supabase
      .from('opportunities')
      .update({ 
        status: 'draft',
        ai_insights: {
          ...opportunity.ai_insights,
          rejection_reason: reason
        }
      })
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to reject opportunity'
      });
    }

    res.json({
      success: true,
      message: 'Opportunity rejected'
    });
  } catch (error) {
    console.error('Reject opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /api/opportunities/:id/milestones
 * @desc Get opportunity milestones
 * @access Public (for published) / Private (for drafts)
 */
router.get('/:id/milestones', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if opportunity is accessible
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('status, entrepreneur_id')
      .eq('id', id)
      .single();

    if (oppError || !opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (opportunity.status !== 'published') {
      const { user } = req as any;
      if (!user || (user.role !== 'super_admin' && user.id !== opportunity.entrepreneur_id)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    const { data: milestones, error } = await supabase
      .from('opportunity_milestones')
      .select('*')
      .eq('opportunity_id', id)
      .order('due_date', { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch milestones'
      });
    }

    res.json({
      success: true,
      data: milestones || []
    });
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 