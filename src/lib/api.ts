// =====================================================
// FRONTEND API CLIENT FOR ABATHWA CAPITAL
// =====================================================

import type { 
  ApiResponse, 
  User, 
  Opportunity, 
  InvestmentPool, 
  Transaction, 
  InvestmentOffer,
  ReliabilityScore,
  RiskAssessment,
  LeaderPerformance,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  PaginationParams,
  SearchFilters
} from '../shared/types';

// Environment variables for Vite
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'An error occurred',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0);
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    return response.data!;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
    
    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data!;
  }

  // User management
  async getUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<User[]>(`/users?${queryParams}`);
  }

  async getUser(id: string): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    return response.data!;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async getUserProfile(id: string): Promise<any> {
    const response = await this.request(`/users/${id}/profile`);
    return response.data;
  }

  async updateUserProfile(id: string, data: any): Promise<any> {
    const response = await this.request(`/users/${id}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getUserOpportunities(id: string, params?: PaginationParams): Promise<ApiResponse<Opportunity[]>> {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<Opportunity[]>(`/users/${id}/opportunities?${queryParams}`);
  }

  async getUserInvestments(id: string, params?: PaginationParams): Promise<ApiResponse<InvestmentOffer[]>> {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<InvestmentOffer[]>(`/users/${id}/investments?${queryParams}`);
  }

  // Opportunities
  async getOpportunities(params?: PaginationParams & SearchFilters): Promise<ApiResponse<Opportunity[]>> {
    const queryParams = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<Opportunity[]>(`/opportunities?${queryParams}`);
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    const response = await this.request<Opportunity>(`/opportunities/${id}`);
    return response.data!;
  }

  async createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
    const response = await this.request<Opportunity>('/opportunities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const response = await this.request<Opportunity>(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  async deleteOpportunity(id: string): Promise<void> {
    await this.request(`/opportunities/${id}`, { method: 'DELETE' });
  }

  async publishOpportunity(id: string): Promise<void> {
    await this.request(`/opportunities/${id}/publish`, { method: 'POST' });
  }

  async approveOpportunity(id: string): Promise<void> {
    await this.request(`/opportunities/${id}/approve`, { method: 'POST' });
  }

  async rejectOpportunity(id: string, reason: string): Promise<void> {
    await this.request(`/opportunities/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getOpportunityMilestones(id: string): Promise<any[]> {
    const response = await this.request<any[]>(`/opportunities/${id}/milestones`);
    return response.data || [];
  }

  // AI/ML endpoints
  async calculateReliabilityScore(userId: string): Promise<ReliabilityScore> {
    const response = await this.request<ReliabilityScore>(`/ai/reliability-score/${userId}`, {
      method: 'POST',
    });
    return response.data!;
  }

  async assessOpportunityRisk(opportunityId: string): Promise<RiskAssessment> {
    const response = await this.request<RiskAssessment>(`/ai/risk-assessment/${opportunityId}`, {
      method: 'POST',
    });
    return response.data!;
  }

  async calculateLeaderPerformance(poolId: string, userId: string, role: string): Promise<LeaderPerformance> {
    const response = await this.request<LeaderPerformance>('/ai/leader-performance', {
      method: 'POST',
      body: JSON.stringify({ poolId, userId, role }),
    });
    return response.data!;
  }

  async getModelStatus(): Promise<any> {
    const response = await this.request('/ai/model-status');
    return response.data;
  }

  async batchReliabilityScores(userIds: string[]): Promise<any> {
    const response = await this.request('/ai/batch-reliability-scores', {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
    return response.data;
  }

  async batchRiskAssessments(opportunityIds: string[]): Promise<any> {
    const response = await this.request('/ai/batch-risk-assessments', {
      method: 'POST',
      body: JSON.stringify({ opportunityIds }),
    });
    return response.data;
  }

  // File upload helper
  async uploadFile(file: File, bucket: string, path: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('path', path);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError('Upload failed', response.status);
    }

    const data = await response.json();
    return data.url;
  }

  // Utility methods
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export error class for use in components
export { ApiError };

// Export types for convenience
export type { 
  ApiResponse, 
  User, 
  Opportunity, 
  InvestmentPool, 
  Transaction, 
  InvestmentOffer,
  ReliabilityScore,
  RiskAssessment,
  LeaderPerformance,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  PaginationParams,
  SearchFilters
}; 