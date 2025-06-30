
import Joi from 'joi';

// Email validation
export const validateEmail = (email: string): boolean => {
  const schema = Joi.string().email().required();
  const { error } = schema.validate(email);
  return !error;
};

// Password validation
export const validatePassword = (password: string): boolean => {
  const schema = Joi.string().min(8).required();
  const { error } = schema.validate(password);
  return !error;
};

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().min(2).required(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('entrepreneur', 'investor', 'service_provider', 'observer', 'super_admin').required(),
  admin_key: Joi.string().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  full_name: Joi.string().min(2).optional(),
  phone: Joi.string().optional(),
  bio: Joi.string().optional(),
  location: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  linkedin_url: Joi.string().uri().optional()
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});

export const searchFiltersSchema = Joi.object({
  category: Joi.string().optional(),
  status: Joi.string().optional(),
  min_amount: Joi.number().optional(),
  max_amount: Joi.number().optional(),
  location: Joi.string().optional(),
  industry: Joi.string().optional(),
  risk_level: Joi.string().optional()
});

export const createOpportunitySchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().valid('going_concern', 'order_fulfillment', 'project_partnership').required(),
  funding_target: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('USD'),
  minimum_investment: Joi.number().positive().optional(),
  maximum_investment: Joi.number().positive().optional(),
  equity_offered: Joi.number().min(0).max(100).optional(),
  expected_roi: Joi.number().positive().optional(),
  investment_term_months: Joi.number().positive().optional(),
  industry: Joi.string().optional(),
  location: Joi.string().optional(),
  team_size: Joi.number().positive().optional(),
  founded_year: Joi.number().min(1900).max(new Date().getFullYear()).optional()
});

export const updateOpportunitySchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(10).optional(),
  category: Joi.string().valid('going_concern', 'order_fulfillment', 'project_partnership').optional(),
  funding_target: Joi.number().positive().optional(),
  currency: Joi.string().length(3).optional(),
  minimum_investment: Joi.number().positive().optional(),
  maximum_investment: Joi.number().positive().optional(),
  equity_offered: Joi.number().min(0).max(100).optional(),
  expected_roi: Joi.number().positive().optional(),
  investment_term_months: Joi.number().positive().optional(),
  industry: Joi.string().optional(),
  location: Joi.string().optional(),
  team_size: Joi.number().positive().optional(),
  founded_year: Joi.number().min(1900).max(new Date().getFullYear()).optional()
});

export const createPoolSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  category: Joi.string().valid('syndicate', 'collective', 'community_development_initiative', 'company').required(),
  target_amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('USD'),
  minimum_contribution: Joi.number().positive().optional(),
  maximum_contribution: Joi.number().positive().optional()
});

// User registration validation
export const validateUserRegistration = (data: any) => {
  return registerSchema.validate(data);
};

// Opportunity validation
export const validateOpportunity = (data: any) => {
  return createOpportunitySchema.validate(data);
};

// Investment pool validation
export const validateInvestmentPool = (data: any) => {
  return createPoolSchema.validate(data);
};

// Middleware for request validation
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};
