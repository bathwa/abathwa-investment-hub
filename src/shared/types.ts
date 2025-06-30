// =====================================================
// SHARED TYPES FOR ABATHWA CAPITAL INVESTMENT PORTAL
// =====================================================

// Database Json type helper
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// User Types
export type UserRole = 'super_admin' | 'entrepreneur' | 'investor' | 'service_provider' | 'observer';
export type UserStatus = 'pending_verification' | 'active' | 'suspended' | 'deleted';

export interface User {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  reliability_score?: number;
  created_at: string;
  updated_at: string;
  last_login?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  company_name?: string;
  industry?: string;
  experience_years?: number;
  investment_preferences?: Record<string, any>;
  risk_tolerance?: string;
  investment_horizon?: string;
  minimum_investment?: number;
  maximum_investment?: number;
  preferred_currencies?: string[];
  created_at: string;
  updated_at: string;
}

// For admin user management - matches the actual database structure
export interface UserWithProfile extends User {
  user_profiles?: UserProfile; // Single profile, not array
}

// Opportunity Types
export type OpportunityCategory = 'going_concern' | 'order_fulfillment' | 'project_partnership';
export type OpportunityStatus = 'draft' | 'pending_approval' | 'published' | 'funding_in_progress' | 'funded' | 'in_progress' | 'completed' | 'cancelled';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  status: OpportunityStatus;
  entrepreneur_id: string;
  pool_id?: string;
  funding_target: number;
  currency: string;
  minimum_investment?: number;
  maximum_investment?: number;
  equity_offered?: number;
  expected_roi?: number;
  investment_term_months?: number;
  industry?: string;
  location?: string;
  team_size?: number;
  founded_year?: number;
  risk_score: number;
  ai_insights?: Record<string, any>;
  created_at: string;
  updated_at: string;
  published_at?: string;
  expires_at?: string;
  // Dashboard specific fields (computed)
  raised_amount?: number;
  investors_count?: number;
  days_left?: number;
}

export interface OpportunityMilestone {
  id: string;
  opportunity_id: string;
  title: string;
  description?: string;
  due_date: string;
  completed_date?: string;
  status: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

// Investment Pool Types
export type PoolCategory = 'syndicate' | 'collective' | 'community_development_initiative' | 'company';
export type PoolMemberRole = 'member' | 'chairperson' | 'secretary' | 'treasurer' | 'investments_officer';

export interface InvestmentPool {
  id: string;
  name: string;
  description?: string;
  category: PoolCategory;
  target_amount: number;
  currency: string;
  current_amount: number;
  minimum_contribution?: number;
  maximum_contribution?: number;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PoolMember {
  id: string;
  pool_id: string;
  user_id: string;
  role: PoolMemberRole;
  contribution_amount: number;
  joined_at: string;
  is_active: boolean;
}

export interface PoolLeaderPerformance {
  id: string;
  pool_id: string;
  user_id: string;
  role: PoolMemberRole;
  meetings_called: number;
  announcements_made: number;
  investment_success_rate: number;
  member_satisfaction_score: number;
  overall_score: number;
  last_evaluation_date: string;
  created_at: string;
  updated_at: string;
}

// Transaction Types
export type TransactionType = 'investment' | 'dividend_payout' | 'capital_payout' | 'fee_payment' | 'escrow_deposit' | 'escrow_withdrawal' | 'service_payment';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PaymentMethod = 'ecocash' | 'omari' | 'innbucks' | 'bank_transfer' | 'paypal' | 'stripe';

export interface Transaction {
  id: string;
  reference_number: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  exchange_rate: number;
  base_currency_amount: number;
  from_user_id?: string;
  to_user_id?: string;
  from_pool_id?: string;
  to_pool_id?: string;
  opportunity_id?: string;
  offer_id?: string;
  payment_method?: PaymentMethod;
  escrow_account_id?: string;
  proof_of_payment_url?: string;
  admin_confirmed_at?: string;
  payout_confirmed_at?: string;
  platform_fee: number;
  processing_fee: number;
  created_at: string;
  updated_at: string;
}

// Investment Offer Types
export interface InvestmentOffer {
  id: string;
  opportunity_id: string;
  investor_id: string;
  pool_id?: string;
  amount: number;
  currency: string;
  terms?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Document Types
export type DocumentType = 'nda' | 'investment_agreement' | 'due_diligence' | 'financial_statement' | 'business_plan' | 'proof_of_payment' | 'invoice' | 'report';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  user_id?: string;
  opportunity_id?: string;
  transaction_id?: string;
  pool_id?: string;
  template_data?: Record<string, any>;
  is_signed: boolean;
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

// Agreement Types
export type CosignerRole = 'witness' | 'arbiter' | 'guarantor' | 'co_signer';

export interface Agreement {
  id: string;
  title: string;
  document_id?: string;
  opportunity_id?: string;
  investor_id?: string;
  entrepreneur_id?: string;
  pool_id?: string;
  terms: Record<string, any>;
  conditions?: Record<string, any>;
  status: string;
  signed_at?: string;
  activated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AgreementCosigner {
  id: string;
  agreement_id: string;
  user_id: string;
  role: CosignerRole;
  signed_at?: string;
  signature_data?: Record<string, any>;
  created_at: string;
}

// Observer Types
export type ObserverScope = 'all_activities' | 'specific_opportunity' | 'specific_pool' | 'specific_investment';

export interface Observer {
  id: string;
  observer_id: string;
  observed_user_id: string;
  scope: ObserverScope;
  opportunity_id?: string;
  pool_id?: string;
  investment_id?: string;
  can_view_financials: boolean;
  can_view_milestones: boolean;
  can_view_reports: boolean;
  can_view_team_details: boolean;
  can_view_meeting_minutes: boolean;
  added_by: string;
  created_at: string;
  updated_at: string;
}

// Service Provider Types
export interface ServiceProvider {
  id: string;
  user_id: string;
  service_type: string;
  expertise_areas?: string[];
  credentials?: Record<string, any>;
  hourly_rate?: number;
  availability_status: string;
  rating: number;
  total_projects: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  requester_id: string;
  provider_id?: string;
  opportunity_id?: string;
  title: string;
  description: string;
  service_type: string;
  budget_range?: Record<string, any>; // Changed from Json to Record<string, any>
  deadline?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Platform Settings Types
export interface PlatformSettings {
  id: string;
  setting_key: string;
  setting_value: Record<string, any>;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EscrowAccount {
  id: string;
  account_name: string;
  account_number?: string;
  account_type: PaymentMethod;
  holder_name: string;
  is_default: boolean;
  is_active: boolean;
  pool_id?: string;
  created_at: string;
  updated_at: string;
}

// Pool Activity Types
export interface PoolActivity {
  id: string;
  pool_id: string;
  activity_type: string;
  title: string;
  description?: string;
  initiated_by: string;
  scheduled_at?: string;
  completed_at?: string;
  status: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Pool Vote Types
export interface PoolVote {
  id: string;
  pool_id: string;
  voter_id: string;
  target_user_id: string;
  vote_type: string;
  rating: number;
  feedback?: string;
  is_anonymous: boolean;
  created_at: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Activity Type for Dashboards
export interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

// Project Types for Service Provider Dashboard
export interface Project {
  id: string;
  name: string;
  service_type: string;
  status: string;
  budget: number;
  progress: number;
  days_left: number;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  admin_key?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

// AI/ML Types
export interface ReliabilityScore {
  overall_score: number;
  milestone_score: number;
  communication_score: number;
  agreement_score: number;
  time_score: number;
  factors: Record<string, number>;
}

export interface RiskAssessment {
  overall_risk: number;
  financial_risk: number;
  market_risk: number;
  team_risk: number;
  entrepreneur_risk: number;
  recommendations: string[];
}

export interface LeaderPerformance {
  overall_score: number;
  meetings_score: number;
  announcements_score: number;
  investment_score: number;
  satisfaction_score: number;
  duties_performed: Record<string, number>;
}

// Dashboard Types
export interface DashboardStats {
  total_users: number;
  total_opportunities: number;
  total_investments: number;
  total_pools: number;
  total_transactions: number;
  platform_revenue: number;
}

export interface UserDashboardData {
  user: User;
  stats: {
    opportunities_created: number;
    investments_made: number;
    pools_joined: number;
    total_invested: number;
    total_earned: number;
  };
  recent_activities: any[];
  upcoming_milestones: OpportunityMilestone[];
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  data?: Record<string, any>;
  created_at: string;
}

// Search Types
export interface SearchFilters {
  category?: string;
  status?: string;
  min_amount?: number;
  max_amount?: number;
  location?: string;
  industry?: string;
  risk_level?: string;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  filters: SearchFilters;
}
