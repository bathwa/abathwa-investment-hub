import { Router } from 'express';
import { supabase } from '../../supabaseClient';
import { authenticateToken, requireRole } from '../../middleware/auth';
import { validateRequest, createOpportunitySchema, updateOpportunitySchema, paginationSchema, searchFiltersSchema } from '../../utils/validation';
import { aiService } from '../../services/aiService';
import type { Opportunity, ApiResponse, PaginationParams, SearchFilters } from '../../../shared/types';

const router = Router();

/**
 * @route GET /api/opportunities
 * @desc Get all opportunities with pagination and filters
 * @access Public
 */
router.get('/', validateRequest(searchFiltersSchema), validateRequest(paginationSchema), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'created_at', 
      sortOrder = 'desc',
      category,
      status,
      min_amount,
      max_amount,
      location,
      industry,
      risk_level
    } = req.query as any;

    let query = supabase
      .from('opportunities')
      .select(`
        *,
        users!inner(
          id,
          full_name,
          email,
          reliability_score
        )
      `)
      .eq('status', 'published');

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (min_amount) {
      query = query.gte('funding_target', min_amount);
    }
    if (max_amount) {
      query = query.lte('funding_target', max_amount);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (industry) {
      query = query.ilike('industry', `%${industry}%`);
    }
    if (risk_level) {
      // Risk level filtering would be based on risk_score ranges
      const riskRanges: Record<string, { min: number; max: number }> = {
        'low': { min: 0, max: 30 },
        'medium': { min: 31, max: 70 },
        'high': { min: 71, max: 100 }
      };
      const range = riskRanges[risk_level as string];
      if (range) {
        query = query.gte('risk_score', range.min).lte('risk_score', range.max);
      }
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: opportunities, error, count } = await query;

    if (error) {
      console.error('Fetch opportunities error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch opportunities'
      });
    }

    // Transform the data to ensure proper types
    const transformedOpportunities: Opportunity[] = (opportunities || []).map(opp => ({
      ...opp,
      ai_insights: typeof opp.ai_insights === 'string' 
        ? JSON.parse(opp.ai_insights) 
        : opp.ai_insights || {},
      raised_amount: 0, // This would come from aggregated investment data
      investors_count: 0, // This would come from aggregated investment data  
      days_left: opp.expires_at ? Math.max(0, Math.ceil((new Date(opp.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null
    }));

    const response: ApiResponse<{
      opportunities: Opportunity[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }> = {
      success: true,
      data: {
        opportunities: transformedOpportunities,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit as string))
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch opportunities'
    });
  }
});

/**
 * @route POST /api/opportunities
 * @desc Create new opportunity
 * @access Private (Entrepreneurs)
 */
router.post('/', authenticateToken, requireRole(['entrepreneur']), validateRequest(createOpportunitySchema), async (req, res) => {
  try {
    const opportunityData: Opportunity = req.body;
    const { user } = req as any;

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .insert({
        ...opportunityData,
        entrepreneur_id: user.userId,
        status: 'draft',
        risk_score: 50.0 // Default risk score
      })
      .select()
      .single();

    if (error) {
      console.error('Create opportunity error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create opportunity'
      });
    }

    const response: ApiResponse<Opportunity> = {
      success: true,
      data: opportunity as Opportunity
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create opportunity'
    });
  }
});

/**
 * @route GET /api/opportunities/:id
 * @desc Get opportunity by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        users!inner(
          id,
          full_name,
          email,
          reliability_score,
          avatar_url
        ),
        opportunity_milestones(*)
      `)
      .eq('id', id)
      .single();

    if (error || !opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    const response: ApiResponse<Opportunity> = {
      success: true,
      data: opportunity as Opportunity
    };

    res.json(response);
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch opportunity'
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
    const updateData: Opportunity = req.body;
    const { user } = req as any;

    // Check if user owns the opportunity or is admin
    const { data: existingOpportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('entrepreneur_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingOpportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (user.role !== 'super_admin' && existingOpportunity.entrepreneur_id !== user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update opportunity error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update opportunity'
      });
    }

    const response: ApiResponse<Opportunity> = {
      success: true,
      data: opportunity as Opportunity
    };

    res.json(response);
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update opportunity'
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

    // Check if user owns the opportunity or is admin
    const { data: existingOpportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('entrepreneur_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingOpportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    if (user.role !== 'super_admin' && existingOpportunity.entrepreneur_id !== user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete opportunity error:', error);
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
      error: 'Failed to delete opportunity'
    });
  }
});

/**
 * @route POST /api/opportunities/:id/publish
 * @desc Publish opportunity
 * @access Private (Owner)
 */
router.post('/:id/publish', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;

    // Check if user owns the opportunity
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

    if (existingOpportunity.entrepreneur_id !== user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    if (existingOpportunity.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Only draft opportunities can be published'
      });
    }

    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .update({
        status: 'pending_approval',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Publish opportunity error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to publish opportunity'
      });
    }

    const response: ApiResponse<Opportunity> = {
      success: true,
      data: opportunity as Opportunity
    };

    res.json(response);
  } catch (error) {
    console.error('Publish opportunity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish opportunity'
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
