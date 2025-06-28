import { Router } from 'express';
import { authenticateToken, requireRole } from '../../middleware/auth';
import { aiService } from '../../services/aiService';
import type { ReliabilityScore, RiskAssessment, LeaderPerformance, ApiResponse } from '../../../shared/types';

const router = Router();

/**
 * @route POST /api/ai/reliability-score/:userId
 * @desc Calculate entrepreneur reliability score
 * @access Private (Admin or self)
 */
router.post('/reliability-score/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { user } = req as any;

    // Check if user can access this data
    if (user.role !== 'super_admin' && user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const reliabilityScore = await aiService.calculateReliabilityScore(userId);

    const response: ApiResponse<ReliabilityScore> = {
      success: true,
      data: reliabilityScore
    };

    res.json(response);
  } catch (error) {
    console.error('Calculate reliability score error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate reliability score'
    });
  }
});

/**
 * @route POST /api/ai/risk-assessment/:opportunityId
 * @desc Assess investment opportunity risk
 * @access Private (Admin or opportunity owner)
 */
router.post('/risk-assessment/:opportunityId', authenticateToken, async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const { user } = req as any;

    // Check if user can access this data
    // This would require checking if user owns the opportunity or is admin
    if (user.role !== 'super_admin') {
      // Additional check for opportunity ownership would go here
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const riskAssessment = await aiService.assessOpportunityRisk(opportunityId);

    const response: ApiResponse<RiskAssessment> = {
      success: true,
      data: riskAssessment
    };

    res.json(response);
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assess risk'
    });
  }
});

/**
 * @route POST /api/ai/leader-performance
 * @desc Calculate pool leader performance
 * @access Private (Pool members or admin)
 */
router.post('/leader-performance', authenticateToken, async (req, res) => {
  try {
    const { poolId, userId, role } = req.body;
    const { user } = req as any;

    if (!poolId || !userId || !role) {
      return res.status(400).json({
        success: false,
        error: 'Pool ID, user ID, and role are required'
      });
    }

    // Check if user can access this data
    if (user.role !== 'super_admin') {
      // Additional check for pool membership would go here
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const leaderPerformance = await aiService.calculateLeaderPerformance(poolId, userId, role);

    const response: ApiResponse<LeaderPerformance> = {
      success: true,
      data: leaderPerformance
    };

    res.json(response);
  } catch (error) {
    console.error('Leader performance calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate leader performance'
    });
  }
});

/**
 * @route GET /api/ai/model-status
 * @desc Get AI model status and version
 * @access Private (Admin)
 */
router.get('/model-status', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const modelStatus = {
      reliability_model: aiService.reliabilityModel ? 'loaded' : 'not_loaded',
      risk_model: aiService.riskModel ? 'loaded' : 'not_loaded',
      performance_model: aiService.performanceModel ? 'loaded' : 'not_loaded',
      version: process.env.AI_MODEL_VERSION || '1.0.0',
      last_updated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: modelStatus
    });
  } catch (error) {
    console.error('Get model status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get model status'
    });
  }
});

/**
 * @route POST /api/ai/batch-reliability-scores
 * @desc Calculate reliability scores for multiple users
 * @access Private (Admin only)
 */
router.post('/batch-reliability-scores', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'User IDs array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const userId of userIds) {
      try {
        const score = await aiService.calculateReliabilityScore(userId);
        results.push({ userId, score });
      } catch (error) {
        errors.push({ userId, error: error.message });
      }
    }

    res.json({
      success: true,
      data: {
        results,
        errors,
        total_processed: userIds.length,
        successful: results.length,
        failed: errors.length
      }
    });
  } catch (error) {
    console.error('Batch reliability scores error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate batch reliability scores'
    });
  }
});

/**
 * @route POST /api/ai/batch-risk-assessments
 * @desc Assess risk for multiple opportunities
 * @access Private (Admin only)
 */
router.post('/batch-risk-assessments', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const { opportunityIds } = req.body;

    if (!Array.isArray(opportunityIds) || opportunityIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Opportunity IDs array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const opportunityId of opportunityIds) {
      try {
        const assessment = await aiService.assessOpportunityRisk(opportunityId);
        results.push({ opportunityId, assessment });
      } catch (error) {
        errors.push({ opportunityId, error: error.message });
      }
    }

    res.json({
      success: true,
      data: {
        results,
        errors,
        total_processed: opportunityIds.length,
        successful: results.length,
        failed: errors.length
      }
    });
  } catch (error) {
    console.error('Batch risk assessments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assess batch risks'
    });
  }
});

export default router; 