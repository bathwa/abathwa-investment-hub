import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';
import type { ReliabilityScore, RiskAssessment, LeaderPerformance } from '../shared/types';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateReliabilityScore = useCallback(async (userId: string): Promise<ReliabilityScore> => {
    try {
      setLoading(true);
      setError(null);
      
      const score = await apiClient.calculateReliabilityScore(userId);
      return score;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to calculate reliability score';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const assessOpportunityRisk = useCallback(async (opportunityId: string): Promise<RiskAssessment> => {
    try {
      setLoading(true);
      setError(null);
      
      const assessment = await apiClient.assessOpportunityRisk(opportunityId);
      return assessment;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assess opportunity risk';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateLeaderPerformance = useCallback(async (
    poolId: string, 
    userId: string, 
    role: string
  ): Promise<LeaderPerformance> => {
    try {
      setLoading(true);
      setError(null);
      
      const performance = await apiClient.calculateLeaderPerformance(poolId, userId, role);
      return performance;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to calculate leader performance';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getModelStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await apiClient.getModelStatus();
      return status;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get model status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const batchReliabilityScores = useCallback(async (userIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await apiClient.batchReliabilityScores(userIds);
      return results;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to calculate batch reliability scores';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const batchRiskAssessments = useCallback(async (opportunityIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await apiClient.batchRiskAssessments(opportunityIds);
      return results;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assess batch risks';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    calculateReliabilityScore,
    assessOpportunityRisk,
    calculateLeaderPerformance,
    getModelStatus,
    batchReliabilityScores,
    batchRiskAssessments,
    clearError,
  };
}

// Hook for reliability scoring with caching
export function useReliabilityScore(userId?: string) {
  const [score, setScore] = useState<ReliabilityScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCalculated, setLastCalculated] = useState<Date | null>(null);

  const calculate = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const reliabilityScore = await apiClient.calculateReliabilityScore(userId);
      setScore(reliabilityScore);
      setLastCalculated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to calculate reliability score');
      console.error('Reliability score calculation error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isStale = useCallback(() => {
    if (!lastCalculated) return true;
    const hoursSinceCalculation = (Date.now() - lastCalculated.getTime()) / (1000 * 60 * 60);
    return hoursSinceCalculation > 24; // Consider stale after 24 hours
  }, [lastCalculated]);

  return {
    score,
    loading,
    error,
    lastCalculated,
    calculate,
    clearError,
    isStale,
  };
}

// Hook for risk assessment with caching
export function useRiskAssessment(opportunityId?: string) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAssessed, setLastAssessed] = useState<Date | null>(null);

  const assess = useCallback(async () => {
    if (!opportunityId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const riskAssessment = await apiClient.assessOpportunityRisk(opportunityId);
      setAssessment(riskAssessment);
      setLastAssessed(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to assess opportunity risk');
      console.error('Risk assessment error:', err);
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isStale = useCallback(() => {
    if (!lastAssessed) return true;
    const hoursSinceAssessment = (Date.now() - lastAssessed.getTime()) / (1000 * 60 * 60);
    return hoursSinceAssessment > 12; // Consider stale after 12 hours
  }, [lastAssessed]);

  return {
    assessment,
    loading,
    error,
    lastAssessed,
    assess,
    clearError,
    isStale,
  };
}

// Hook for leader performance
export function useLeaderPerformance() {
  const [performance, setPerformance] = useState<LeaderPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (poolId: string, userId: string, role: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const leaderPerformance = await apiClient.calculateLeaderPerformance(poolId, userId, role);
      setPerformance(leaderPerformance);
      return leaderPerformance;
    } catch (err: any) {
      setError(err.message || 'Failed to calculate leader performance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    performance,
    loading,
    error,
    calculate,
    clearError,
  };
} 