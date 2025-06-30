
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

// User registration validation
export const validateUserRegistration = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    full_name: Joi.string().min(2).required(),
    phone: Joi.string().optional(),
    role: Joi.string().valid('entrepreneur', 'investor', 'service_provider', 'observer', 'super_admin').required(),
    admin_key: Joi.string().optional()
  });

  return schema.validate(data);
};

// Opportunity validation
export const validateOpportunity = (data: any) => {
  const schema = Joi.object({
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

  return schema.validate(data);
};

// Investment pool validation
export const validateInvestmentPool = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().optional(),
    category: Joi.string().valid('syndicate', 'collective', 'community_development_initiative', 'company').required(),
    target_amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).default('USD'),
    minimum_contribution: Joi.number().positive().optional(),
    maximum_contribution: Joi.number().positive().optional()
  });

  return schema.validate(data);
};
