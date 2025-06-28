import { Router } from 'express';
import { authenticateToken, requireRole } from '../../middleware/auth';
import aiService from '../../services/aiService';
import type { ReliabilityScore, RiskAssessment, LeaderPerformance, ApiResponse } from '../../../shared/types';

const router = Router();

/**
 * @route POST /api/ai/reliability-score/:userId
 * @desc Calculate reliability score for a user
 * @access Private
 */
router.post('/reliability-score/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const reliabilityScore = await aiService.calculateReliabilityScore(userId);
    
    const response: ApiResponse<ReliabilityScore> = {
      success: true,
      data: reliabilityScore
    };

    res.json(response);
  } catch (error) {
    console.error('Reliability score calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate reliability score'
    });
  }
});

/**
 * @route POST /api/ai/risk-assessment/:opportunityId
 * @desc Assess risk for an investment opportunity
 * @access Private
 */
router.post('/risk-assessment/:opportunityId', authenticateToken, async (req, res) => {
  try {
    const { opportunityId } = req.params;
    
    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        error: 'Opportunity ID is required'
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
      error: 'Failed to assess opportunity risk'
    });
  }
});

/**
 * @route POST /api/ai/leader-performance
 * @desc Calculate leader performance for a pool
 * @access Private
 */
router.post('/leader-performance', authenticateToken, async (req, res) => {
  try {
    const { poolId, userId, role } = req.body;
    
    if (!poolId || !userId || !role) {
      return res.status(400).json({
        success: false,
        error: 'Pool ID, User ID, and Role are required'
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
 * @desc Get AI model status
 * @access Private (Admin)
 */
router.get('/model-status', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const status = {
      service_status: 'operational',
      models: {
        reliability_model: 'business_logic',
        risk_model: 'business_logic',
        performance_model: 'business_logic'
      },
      last_updated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Model status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get model status'
    });
  }
});

/**
 * @route POST /api/ai/batch-reliability-scores
 * @desc Calculate reliability scores for multiple users
 * @access Private (Admin)
 */
router.post('/batch-reliability-scores', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ userId, error: errorMessage });
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
 * @access Private (Admin)
 */
router.post('/batch-risk-assessments', authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const { opportunityIds } = req.body;
    
    if (!opportunityIds || !Array.isArray(opportunityIds)) {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ opportunityId, error: errorMessage });
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
      error: 'Failed to assess batch opportunities risk'
    });
  }
});

export default router; 