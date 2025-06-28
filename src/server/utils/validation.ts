import Joi from 'joi';
import type { UserRole, OpportunityCategory, PoolCategory } from '../../shared/types';

// User validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().min(2).max(255).required(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('entrepreneur', 'investor', 'service_provider', 'observer').required(),
  admin_key: Joi.string().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).optional(),
  phone: Joi.string().optional(),
  bio: Joi.string().max(1000).optional(),
  location: Joi.string().max(255).optional(),
  website: Joi.string().uri().optional(),
  linkedin_url: Joi.string().uri().optional()
});

// Opportunity validation schemas
export const createOpportunitySchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(20).required(),
  category: Joi.string().valid('going_concern', 'order_fulfillment', 'project_partnership').required(),
  funding_target: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('USD'),
  minimum_investment: Joi.number().positive().optional(),
  maximum_investment: Joi.number().positive().optional(),
  equity_offered: Joi.number().min(0).max(100).optional(),
  expected_roi: Joi.number().min(0).max(1000).optional(),
  investment_term_months: Joi.number().integer().positive().optional(),
  industry: Joi.string().max(255).optional(),
  location: Joi.string().max(255).optional(),
  team_size: Joi.number().integer().positive().optional(),
  founded_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional()
});

export const updateOpportunitySchema = Joi.object({
  title: Joi.string().min(5).max(255).optional(),
  description: Joi.string().min(20).optional(),
  category: Joi.string().valid('going_concern', 'order_fulfillment', 'project_partnership').optional(),
  funding_target: Joi.number().positive().optional(),
  currency: Joi.string().length(3).optional(),
  minimum_investment: Joi.number().positive().optional(),
  maximum_investment: Joi.number().positive().optional(),
  equity_offered: Joi.number().min(0).max(100).optional(),
  expected_roi: Joi.number().min(0).max(1000).optional(),
  investment_term_months: Joi.number().integer().positive().optional(),
  industry: Joi.string().max(255).optional(),
  location: Joi.string().max(255).optional(),
  team_size: Joi.number().integer().positive().optional(),
  founded_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  status: Joi.string().valid('draft', 'pending_approval', 'published', 'funding_in_progress', 'funded', 'in_progress', 'completed', 'cancelled').optional()
});

// Investment Pool validation schemas
export const createPoolSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().valid('syndicate', 'collective', 'community_development_initiative', 'company').required(),
  target_amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('USD'),
  minimum_contribution: Joi.number().positive().optional(),
  maximum_contribution: Joi.number().positive().optional()
});

// Investment Offer validation schemas
export const createOfferSchema = Joi.object({
  opportunity_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('USD'),
  terms: Joi.string().max(2000).optional(),
  pool_id: Joi.string().uuid().optional()
});

// Transaction validation schemas
export const createTransactionSchema = Joi.object({
  type: Joi.string().valid('investment', 'dividend_payout', 'capital_payout', 'fee_payment', 'escrow_deposit', 'escrow_withdrawal', 'service_payment').required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('USD'),
  opportunity_id: Joi.string().uuid().optional(),
  offer_id: Joi.string().uuid().optional(),
  payment_method: Joi.string().valid('ecocash', 'omari', 'innbucks', 'bank_transfer', 'paypal', 'stripe').optional(),
  escrow_account_id: Joi.string().uuid().optional()
});

// Observer validation schemas
export const createObserverSchema = Joi.object({
  observed_user_id: Joi.string().uuid().required(),
  scope: Joi.string().valid('all_activities', 'specific_opportunity', 'specific_pool', 'specific_investment').required(),
  opportunity_id: Joi.string().uuid().optional(),
  pool_id: Joi.string().uuid().optional(),
  investment_id: Joi.string().uuid().optional(),
  can_view_financials: Joi.boolean().default(false),
  can_view_milestones: Joi.boolean().default(false),
  can_view_reports: Joi.boolean().default(false),
  can_view_team_details: Joi.boolean().default(false),
  can_view_meeting_minutes: Joi.boolean().default(false)
});

// Pagination validation schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

// Search filters validation schema
export const searchFiltersSchema = Joi.object({
  category: Joi.string().optional(),
  status: Joi.string().optional(),
  min_amount: Joi.number().positive().optional(),
  max_amount: Joi.number().positive().optional(),
  location: Joi.string().optional(),
  industry: Joi.string().optional(),
  risk_level: Joi.string().optional()
});

// Validation middleware
export function validateRequest(schema: Joi.Schema) {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map((detail: any) => detail.message)
      });
    }
    req.body = value;
    next();
  };
}

export function validateQuery(schema: Joi.Schema) {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map((detail: any) => detail.message)
      });
    }
    req.query = value;
    next();
  };
}

/**
 * Validation utilities for API requests
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data: Record<string, any>, fields: string[]): string[] {
  const missingFields: string[] = [];
  
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  return missingFields;
}

/**
 * Validate numeric range
 */
export function validateNumericRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate string length
 */
export function validateStringLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate UUID format
 */
export function validateUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
} 