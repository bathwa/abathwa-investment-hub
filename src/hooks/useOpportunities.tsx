import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';
import type { Opportunity, PaginationParams, SearchFilters, ApiResponse } from '../shared/types';

interface UseOpportunitiesOptions {
  autoFetch?: boolean;
  initialParams?: PaginationParams & SearchFilters;
}

export function useOpportunities(options: UseOpportunitiesOptions = {}) {
  const { autoFetch = false, initialParams } = options;
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse<Opportunity[]>['pagination'] | null>(null);
  const [params, setParams] = useState<PaginationParams & SearchFilters>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialParams
  });

  const fetchOpportunities = useCallback(async (searchParams?: PaginationParams & SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentParams = searchParams || params;
      const response = await apiClient.getOpportunities(currentParams);
      
      setOpportunities(response.data || []);
      setPagination(response.pagination || null);
      setParams(currentParams);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch opportunities');
      console.error('Fetch opportunities error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createOpportunity = useCallback(async (data: Partial<Opportunity>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newOpportunity = await apiClient.createOpportunity(data);
      setOpportunities(prev => [newOpportunity, ...prev]);
      
      return newOpportunity;
    } catch (err: any) {
      setError(err.message || 'Failed to create opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOpportunity = useCallback(async (id: string, data: Partial<Opportunity>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedOpportunity = await apiClient.updateOpportunity(id, data);
      setOpportunities(prev => 
        prev.map(opp => opp.id === id ? updatedOpportunity : opp)
      );
      
      return updatedOpportunity;
    } catch (err: any) {
      setError(err.message || 'Failed to update opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOpportunity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.deleteOpportunity(id);
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishOpportunity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.publishOpportunity(id);
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === id 
            ? { ...opp, status: 'pending_approval' as const }
            : opp
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to publish opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveOpportunity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.approveOpportunity(id);
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === id 
            ? { ...opp, status: 'published' as const, published_at: new Date().toISOString() }
            : opp
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to approve opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectOpportunity = useCallback(async (id: string, reason: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.rejectOpportunity(id, reason);
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === id 
            ? { ...opp, status: 'draft' as const }
            : opp
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to reject opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParams = useCallback((newParams: Partial<PaginationParams & SearchFilters>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 })); // Reset to page 1 when filters change
  }, []);

  const goToPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchOpportunities();
    }
  }, [autoFetch, fetchOpportunities]);

  // Fetch when params change
  useEffect(() => {
    if (autoFetch) {
      fetchOpportunities();
    }
  }, [params, autoFetch, fetchOpportunities]);

  return {
    opportunities,
    loading,
    error,
    pagination,
    params,
    fetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    publishOpportunity,
    approveOpportunity,
    rejectOpportunity,
    updateParams,
    goToPage,
    clearError,
  };
}

// Hook for single opportunity
export function useOpportunity(id: string) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunity = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiClient.getOpportunity(id);
      setOpportunity(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch opportunity');
      console.error('Fetch opportunity error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateOpportunity = useCallback(async (data: Partial<Opportunity>) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedOpportunity = await apiClient.updateOpportunity(id, data);
      setOpportunity(updatedOpportunity);
      
      return updatedOpportunity;
    } catch (err: any) {
      setError(err.message || 'Failed to update opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const deleteOpportunity = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.deleteOpportunity(id);
      setOpportunity(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete opportunity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    opportunity,
    loading,
    error,
    fetchOpportunity,
    updateOpportunity,
    deleteOpportunity,
    clearError,
  };
} 