// =====================================================
// DATA VALIDATION UTILITIES
// =====================================================

import type { User, Opportunity, InvestmentPool, Transaction } from '../shared/types';

/**
 * Validate user data
 */
export function validateUser(user: any): user is User {
  if (!user || typeof user !== 'object') return false;
  
  const requiredFields = ['id', 'email', 'full_name', 'role', 'status'];
  return requiredFields.every(field => user[field] !== undefined && user[field] !== null);
}

/**
 * Validate opportunity data
 */
export function validateOpportunity(opportunity: any): opportunity is Opportunity {
  if (!opportunity || typeof opportunity !== 'object') return false;
  
  const requiredFields = ['id', 'title', 'description', 'category', 'status', 'entrepreneur_id', 'funding_target'];
  return requiredFields.every(field => opportunity[field] !== undefined && opportunity[field] !== null);
}

/**
 * Validate investment pool data
 */
export function validateInvestmentPool(pool: any): pool is InvestmentPool {
  if (!pool || typeof pool !== 'object') return false;
  
  const requiredFields = ['id', 'name', 'category', 'target_amount', 'currency', 'created_by'];
  return requiredFields.every(field => pool[field] !== undefined && pool[field] !== null);
}

/**
 * Validate transaction data
 */
export function validateTransaction(transaction: any): transaction is Transaction {
  if (!transaction || typeof transaction !== 'object') return false;
  
  const requiredFields = ['id', 'reference_number', 'type', 'status', 'amount', 'currency'];
  return requiredFields.every(field => transaction[field] !== undefined && transaction[field] !== null);
}

/**
 * Sanitize user data for display
 */
export function sanitizeUserData(user: any): Partial<User> {
  if (!validateUser(user)) {
    return {
      id: 'unknown',
      email: 'unknown@email.com',
      full_name: 'Unknown User',
      role: 'observer' as const,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  return {
    id: user.id,
    email: user.email || 'unknown@email.com',
    full_name: user.full_name || 'Unknown User',
    phone: user.phone,
    role: user.role,
    status: user.status,
    avatar_url: user.avatar_url,
    bio: user.bio,
    location: user.location,
    website: user.website,
    linkedin_url: user.linkedin_url,
    reliability_score: user.reliability_score || 0,
    created_at: user.created_at,
    updated_at: user.updated_at,
    last_login: user.last_login,
    email_verified_at: user.email_verified_at,
    phone_verified_at: user.phone_verified_at
  };
}

/**
 * Sanitize opportunity data for display
 */
export function sanitizeOpportunityData(opportunity: any): Partial<Opportunity> {
  if (!validateOpportunity(opportunity)) {
    return {
      id: 'unknown',
      title: 'Unknown Opportunity',
      description: 'No description available',
      category: 'going_concern' as const,
      status: 'draft' as const,
      entrepreneur_id: 'unknown',
      funding_target: 0,
      currency: 'USD',
      risk_score: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  return {
    id: opportunity.id,
    title: opportunity.title || 'Untitled Opportunity',
    description: opportunity.description || 'No description available',
    category: opportunity.category,
    status: opportunity.status,
    entrepreneur_id: opportunity.entrepreneur_id,
    pool_id: opportunity.pool_id,
    funding_target: opportunity.funding_target || 0,
    currency: opportunity.currency || 'USD',
    minimum_investment: opportunity.minimum_investment,
    maximum_investment: opportunity.maximum_investment,
    equity_offered: opportunity.equity_offered,
    expected_roi: opportunity.expected_roi,
    investment_term_months: opportunity.investment_term_months,
    industry: opportunity.industry,
    location: opportunity.location,
    team_size: opportunity.team_size,
    founded_year: opportunity.founded_year,
    risk_score: opportunity.risk_score || 5,
    ai_insights: opportunity.ai_insights,
    created_at: opportunity.created_at,
    updated_at: opportunity.updated_at,
    published_at: opportunity.published_at,
    expires_at: opportunity.expires_at
  };
}

/**
 * Sanitize investment pool data for display
 */
export function sanitizeInvestmentPoolData(pool: any): Partial<InvestmentPool> {
  if (!validateInvestmentPool(pool)) {
    return {
      id: 'unknown',
      name: 'Unknown Pool',
      description: 'No description available',
      category: 'syndicate' as const,
      target_amount: 0,
      currency: 'USD',
      current_amount: 0,
      status: 'active',
      created_by: 'unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  return {
    id: pool.id,
    name: pool.name || 'Untitled Pool',
    description: pool.description,
    category: pool.category,
    target_amount: pool.target_amount || 0,
    currency: pool.currency || 'USD',
    current_amount: pool.current_amount || 0,
    minimum_contribution: pool.minimum_contribution,
    maximum_contribution: pool.maximum_contribution,
    status: pool.status || 'active',
    created_by: pool.created_by,
    created_at: pool.created_at,
    updated_at: pool.updated_at
  };
}

/**
 * Sanitize transaction data for display
 */
export function sanitizeTransactionData(transaction: any): Partial<Transaction> {
  if (!validateTransaction(transaction)) {
    return {
      id: 'unknown',
      reference_number: 'TXN-UNKNOWN',
      type: 'investment' as const,
      status: 'pending' as const,
      amount: 0,
      currency: 'USD',
      exchange_rate: 1,
      base_currency_amount: 0,
      platform_fee: 0,
      processing_fee: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  return {
    id: transaction.id,
    reference_number: transaction.reference_number || 'TXN-UNKNOWN',
    type: transaction.type,
    status: transaction.status,
    amount: transaction.amount || 0,
    currency: transaction.currency || 'USD',
    exchange_rate: transaction.exchange_rate || 1,
    base_currency_amount: transaction.base_currency_amount || transaction.amount || 0,
    from_user_id: transaction.from_user_id,
    to_user_id: transaction.to_user_id,
    from_pool_id: transaction.from_pool_id,
    to_pool_id: transaction.to_pool_id,
    opportunity_id: transaction.opportunity_id,
    offer_id: transaction.offer_id,
    payment_method: transaction.payment_method,
    escrow_account_id: transaction.escrow_account_id,
    proof_of_payment_url: transaction.proof_of_payment_url,
    admin_confirmed_at: transaction.admin_confirmed_at,
    payout_confirmed_at: transaction.payout_confirmed_at,
    platform_fee: transaction.platform_fee || 0,
    processing_fee: transaction.processing_fee || 0,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at
  };
}

/**
 * Validate and sanitize API response
 */
export function validateApiResponse<T>(response: any): T | null {
  if (!response || typeof response !== 'object') return null;
  
  if (response.success === false) {
    console.error('API Error:', response.error);
    return null;
  }
  
  return response.data || null;
}

/**
 * Check if data contains mock/test content
 */
export function isMockData(data: any): boolean {
  if (!data) return false;
  
  const mockKeywords = ['mock', 'test', 'demo', 'sample', 'fake', 'dummy'];
  const dataString = JSON.stringify(data).toLowerCase();
  
  return mockKeywords.some(keyword => dataString.includes(keyword));
}

/**
 * Filter out mock data from arrays
 */
export function filterMockData<T>(data: T[]): T[] {
  return data.filter(item => !isMockData(item));
} 