-- =====================================================
-- ABATHWA CAPITAL INVESTMENT PORTAL - DATABASE SCHEMA
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ENUMS
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'entrepreneur', 
    'investor',
    'service_provider',
    'observer'
);

-- User status
CREATE TYPE user_status AS ENUM (
    'pending_verification',
    'active',
    'suspended',
    'deleted'
);

-- Opportunity categories
CREATE TYPE opportunity_category AS ENUM (
    'going_concern',
    'order_fulfillment', 
    'project_partnership'
);

-- Opportunity status
CREATE TYPE opportunity_status AS ENUM (
    'draft',
    'pending_approval',
    'published',
    'funding_in_progress',
    'funded',
    'in_progress',
    'completed',
    'cancelled'
);

-- Investment pool categories
CREATE TYPE pool_category AS ENUM (
    'syndicate',
    'collective',
    'community_development_initiative',
    'company'
);

-- Pool member roles
CREATE TYPE pool_member_role AS ENUM (
    'member',
    'chairperson',
    'secretary', 
    'treasurer',
    'investments_officer'
);

-- Transaction types
CREATE TYPE transaction_type AS ENUM (
    'investment',
    'dividend_payout',
    'capital_payout',
    'fee_payment',
    'escrow_deposit',
    'escrow_withdrawal',
    'service_payment'
);

-- Transaction status
CREATE TYPE transaction_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
);

-- Payment methods
CREATE TYPE payment_method AS ENUM (
    'ecocash',
    'omari',
    'innbucks',
    'bank_transfer',
    'paypal',
    'stripe'
);

-- Document types
CREATE TYPE document_type AS ENUM (
    'nda',
    'investment_agreement',
    'due_diligence',
    'financial_statement',
    'business_plan',
    'proof_of_payment',
    'invoice',
    'report'
);

-- Observer scope
CREATE TYPE observer_scope AS ENUM (
    'all_activities',
    'specific_opportunity',
    'specific_pool',
    'specific_investment'
);

-- Co-signer roles
CREATE TYPE cosigner_role AS ENUM (
    'witness',
    'arbiter',
    'guarantor',
    'co_signer'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'pending_verification',
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    linkedin_url VARCHAR(255),
    reliability_score DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE
);

-- User profiles (extended profile data)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    industry VARCHAR(255),
    experience_years INTEGER,
    investment_preferences JSONB,
    risk_tolerance VARCHAR(50),
    investment_horizon VARCHAR(50),
    minimum_investment DECIMAL(15,2),
    maximum_investment DECIMAL(15,2),
    preferred_currencies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform settings
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default escrow accounts
CREATE TABLE escrow_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100),
    account_type payment_method NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    pool_id UUID, -- NULL for default accounts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment pools
CREATE TABLE investment_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category pool_category NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    current_amount DECIMAL(15,2) DEFAULT 0.00,
    minimum_contribution DECIMAL(15,2),
    maximum_contribution DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pool members
CREATE TABLE pool_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID REFERENCES investment_pools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role pool_member_role DEFAULT 'member',
    contribution_amount DECIMAL(15,2) DEFAULT 0.00,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(pool_id, user_id)
);

-- Pool leader performance
CREATE TABLE pool_leader_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID REFERENCES investment_pools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role pool_member_role NOT NULL,
    meetings_called INTEGER DEFAULT 0,
    announcements_made INTEGER DEFAULT 0,
    investment_success_rate DECIMAL(5,2) DEFAULT 0.00,
    member_satisfaction_score DECIMAL(3,2) DEFAULT 0.00,
    overall_score DECIMAL(5,2) DEFAULT 0.00,
    last_evaluation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pool votes (anonymous)
CREATE TABLE pool_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID REFERENCES investment_pools(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(20) NOT NULL, -- 'confidence', 'no_confidence'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    is_anonymous BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category opportunity_category NOT NULL,
    status opportunity_status DEFAULT 'draft',
    entrepreneur_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pool_id UUID REFERENCES investment_pools(id),
    
    -- Financial details
    funding_target DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    minimum_investment DECIMAL(15,2),
    maximum_investment DECIMAL(15,2),
    equity_offered DECIMAL(5,2), -- percentage
    expected_roi DECIMAL(5,2), -- percentage
    investment_term_months INTEGER,
    
    -- Business details
    industry VARCHAR(255),
    location VARCHAR(255),
    team_size INTEGER,
    founded_year INTEGER,
    
    -- Risk assessment
    risk_score DECIMAL(5,2) DEFAULT 0.00,
    ai_insights JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Opportunity milestones
CREATE TABLE opportunity_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment offers
CREATE TABLE investment_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    pool_id UUID REFERENCES investment_pools(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    terms TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, counter_offered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    base_currency_amount DECIMAL(15,2) NOT NULL,
    
    -- Parties
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    from_pool_id UUID REFERENCES investment_pools(id),
    to_pool_id UUID REFERENCES investment_pools(id),
    
    -- Related entities
    opportunity_id UUID REFERENCES opportunities(id),
    offer_id UUID REFERENCES investment_offers(id),
    
    -- Payment details
    payment_method payment_method,
    escrow_account_id UUID REFERENCES escrow_accounts(id),
    proof_of_payment_url TEXT,
    admin_confirmed_at TIMESTAMP WITH TIME ZONE,
    payout_confirmed_at TIMESTAMP WITH TIME ZONE,
    
    -- Fees
    platform_fee DECIMAL(15,2) DEFAULT 0.00,
    processing_fee DECIMAL(15,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type document_type NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Related entities
    user_id UUID REFERENCES users(id),
    opportunity_id UUID REFERENCES opportunities(id),
    transaction_id UUID REFERENCES transactions(id),
    pool_id UUID REFERENCES investment_pools(id),
    
    -- Template data
    template_data JSONB,
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agreements (smart contracts)
CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    document_id UUID REFERENCES documents(id),
    opportunity_id UUID REFERENCES opportunities(id),
    investor_id UUID REFERENCES users(id),
    entrepreneur_id UUID REFERENCES users(id),
    pool_id UUID REFERENCES investment_pools(id),
    
    -- Terms
    terms JSONB NOT NULL,
    conditions JSONB,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_signature, active, completed, terminated
    signed_at TIMESTAMP WITH TIME ZONE,
    activated_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agreement co-signers
CREATE TABLE agreement_cosigners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role cosigner_role NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Observers
CREATE TABLE observers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    observer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    observed_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scope observer_scope NOT NULL,
    
    -- Specific entities being observed
    opportunity_id UUID REFERENCES opportunities(id),
    pool_id UUID REFERENCES investment_pools(id),
    investment_id UUID REFERENCES transactions(id),
    
    -- Permissions
    can_view_financials BOOLEAN DEFAULT false,
    can_view_milestones BOOLEAN DEFAULT false,
    can_view_reports BOOLEAN DEFAULT false,
    can_view_team_details BOOLEAN DEFAULT false,
    can_view_meeting_minutes BOOLEAN DEFAULT false,
    
    added_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service providers
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(255) NOT NULL,
    expertise_areas TEXT[],
    credentials JSONB,
    hourly_rate DECIMAL(10,2),
    availability_status VARCHAR(50) DEFAULT 'available',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_projects INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service requests
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES service_providers(id),
    opportunity_id UUID REFERENCES opportunities(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    budget_range JSONB,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'open', -- open, assigned, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pool activities (meetings, announcements)
CREATE TABLE pool_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID REFERENCES investment_pools(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'meeting', 'announcement', 'discussion'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    initiated_by UUID REFERENCES users(id),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'scheduled',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_reliability_score ON users(reliability_score);

-- Opportunities
CREATE INDEX idx_opportunities_entrepreneur_id ON opportunities(entrepreneur_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_category ON opportunities(category);
CREATE INDEX idx_opportunities_risk_score ON opportunities(risk_score);
CREATE INDEX idx_opportunities_published_at ON opportunities(published_at);

-- Transactions
CREATE INDEX idx_transactions_reference_number ON transactions(reference_number);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Investment pools
CREATE INDEX idx_investment_pools_category ON investment_pools(category);
CREATE INDEX idx_investment_pools_created_by ON investment_pools(created_by);

-- Pool members
CREATE INDEX idx_pool_members_pool_id ON pool_members(pool_id);
CREATE INDEX idx_pool_members_user_id ON pool_members(user_id);
CREATE INDEX idx_pool_members_role ON pool_members(role);

-- Investment offers
CREATE INDEX idx_investment_offers_opportunity_id ON investment_offers(opportunity_id);
CREATE INDEX idx_investment_offers_investor_id ON investment_offers(investor_id);
CREATE INDEX idx_investment_offers_status ON investment_offers(status);

-- Documents
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_opportunity_id ON documents(opportunity_id);

-- Observers
CREATE INDEX idx_observers_observer_id ON observers(observer_id);
CREATE INDEX idx_observers_observed_user_id ON observers(observed_user_id);
CREATE INDEX idx_observers_scope ON observers(scope);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Full-text search indexes
CREATE INDEX idx_opportunities_search ON opportunities USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', full_name || ' ' || COALESCE(bio, '')));

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number(prefix TEXT DEFAULT 'TXN')
RETURNS TEXT AS $$
DECLARE
    ref_number TEXT;
    counter INTEGER;
BEGIN
    -- Get current counter for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(reference_number FROM LENGTH(prefix) + 9) AS INTEGER)), 0)
    INTO counter
    FROM transactions 
    WHERE reference_number LIKE prefix || '_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_%';
    
    -- Generate new reference number
    ref_number := prefix || '_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD((counter + 1)::TEXT, 4, '0');
    
    RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate reliability score
CREATE OR REPLACE FUNCTION calculate_reliability_score(user_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    score DECIMAL(5,2) := 0.00;
    milestone_score DECIMAL(5,2) := 0.00;
    communication_score DECIMAL(5,2) := 0.00;
    agreement_score DECIMAL(5,2) := 0.00;
    time_score DECIMAL(5,2) := 0.00;
BEGIN
    -- Calculate milestone adherence score
    SELECT COALESCE(
        (COUNT(CASE WHEN status = 'completed' THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(*), 0)::DECIMAL) * 100, 0
    ) INTO milestone_score
    FROM opportunity_milestones om
    JOIN opportunities o ON om.opportunity_id = o.id
    WHERE o.entrepreneur_id = user_uuid;
    
    -- Calculate communication score (placeholder - would need communication logs)
    communication_score := 75.00; -- Default score
    
    -- Calculate agreement compliance score
    SELECT COALESCE(
        (COUNT(CASE WHEN status = 'active' THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(*), 0)::DECIMAL) * 100, 0
    ) INTO agreement_score
    FROM agreements
    WHERE entrepreneur_id = user_uuid;
    
    -- Calculate time management score
    SELECT COALESCE(
        (COUNT(CASE WHEN completed_date <= due_date THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(*), 0)::DECIMAL) * 100, 0
    ) INTO time_score
    FROM opportunity_milestones om
    JOIN opportunities o ON om.opportunity_id = o.id
    WHERE o.entrepreneur_id = user_uuid AND om.completed_date IS NOT NULL;
    
    -- Calculate overall score (weighted average)
    score := (milestone_score * 0.3 + communication_score * 0.2 + 
              agreement_score * 0.3 + time_score * 0.2);
    
    RETURN ROUND(score, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate risk score for opportunities
CREATE OR REPLACE FUNCTION calculate_opportunity_risk_score(opp_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    risk_score DECIMAL(5,2) := 0.00;
    financial_risk DECIMAL(5,2) := 0.00;
    market_risk DECIMAL(5,2) := 0.00;
    team_risk DECIMAL(5,2) := 0.00;
    entrepreneur_score DECIMAL(5,2) := 0.00;
BEGIN
    -- Get entrepreneur reliability score
    SELECT reliability_score INTO entrepreneur_score
    FROM users u
    JOIN opportunities o ON u.id = o.entrepreneur_id
    WHERE o.id = opp_id;
    
    -- Calculate financial risk (placeholder - would need financial data)
    financial_risk := 50.00; -- Default moderate risk
    
    -- Calculate market risk (placeholder - would need market analysis)
    market_risk := 40.00; -- Default moderate risk
    
    -- Calculate team risk (placeholder - would need team assessment)
    team_risk := 30.00; -- Default low risk
    
    -- Calculate overall risk score
    risk_score := (financial_risk * 0.3 + market_risk * 0.3 + 
                   team_risk * 0.2 + (100 - entrepreneur_score) * 0.2);
    
    RETURN ROUND(risk_score, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate pool leader performance
CREATE OR REPLACE FUNCTION calculate_pool_leader_performance(pool_uuid UUID, user_uuid UUID, leader_role pool_member_role)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    overall_score DECIMAL(5,2) := 0.00;
    meetings_score DECIMAL(5,2) := 0.00;
    announcements_score DECIMAL(5,2) := 0.00;
    investment_score DECIMAL(5,2) := 0.00;
    satisfaction_score DECIMAL(5,2) := 0.00;
BEGIN
    -- Calculate meetings score
    SELECT COALESCE(
        LEAST(meetings_called * 10, 100), 0
    ) INTO meetings_score
    FROM pool_leader_performance
    WHERE pool_id = pool_uuid AND user_id = user_uuid AND role = leader_role;
    
    -- Calculate announcements score
    SELECT COALESCE(
        LEAST(announcements_made * 15, 100), 0
    ) INTO announcements_score
    FROM pool_leader_performance
    WHERE pool_id = pool_uuid AND user_id = user_uuid AND role = leader_role;
    
    -- Get investment success rate
    SELECT COALESCE(investment_success_rate, 0) INTO investment_score
    FROM pool_leader_performance
    WHERE pool_id = pool_uuid AND user_id = user_uuid AND role = leader_role;
    
    -- Get member satisfaction score
    SELECT COALESCE(member_satisfaction_score * 100, 0) INTO satisfaction_score
    FROM pool_leader_performance
    WHERE pool_id = pool_uuid AND user_id = user_uuid AND role = leader_role;
    
    -- Calculate overall score (weighted average)
    overall_score := (meetings_score * 0.25 + announcements_score * 0.25 + 
                      investment_score * 0.3 + satisfaction_score * 0.2);
    
    RETURN ROUND(overall_score, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON platform_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escrow_accounts_updated_at BEFORE UPDATE ON escrow_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_pools_updated_at BEFORE UPDATE ON investment_pools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pool_leader_performance_updated_at BEFORE UPDATE ON pool_leader_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunity_milestones_updated_at BEFORE UPDATE ON opportunity_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_offers_updated_at BEFORE UPDATE ON investment_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON agreements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_observers_updated_at BEFORE UPDATE ON observers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pool_activities_updated_at BEFORE UPDATE ON pool_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate reference numbers for transactions
CREATE TRIGGER generate_transaction_reference BEFORE INSERT ON transactions FOR EACH ROW EXECUTE FUNCTION generate_reference_number();

-- Update reliability score when milestones change
CREATE OR REPLACE FUNCTION update_reliability_score_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        UPDATE users 
        SET reliability_score = calculate_reliability_score(users.id)
        WHERE id IN (
            SELECT DISTINCT o.entrepreneur_id 
            FROM opportunities o 
            WHERE o.id = COALESCE(NEW.opportunity_id, OLD.opportunity_id)
        );
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reliability_score 
    AFTER INSERT OR UPDATE OR DELETE ON opportunity_milestones 
    FOR EACH ROW EXECUTE FUNCTION update_reliability_score_trigger();

-- Update risk score when opportunities change
CREATE OR REPLACE FUNCTION update_risk_score_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        NEW.risk_score = calculate_opportunity_risk_score(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_risk_score 
    BEFORE INSERT OR UPDATE ON opportunities 
    FOR EACH ROW EXECUTE FUNCTION update_risk_score_trigger();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_leader_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreement_cosigners ENABLE ROW LEVEL SECURITY;
ALTER TABLE observers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Opportunities policies
CREATE POLICY "Users can view published opportunities" ON opportunities
    FOR SELECT USING (status = 'published');

CREATE POLICY "Entrepreneurs can manage their own opportunities" ON opportunities
    FOR ALL USING (entrepreneur_id = auth.uid());

CREATE POLICY "Admins can manage all opportunities" ON opportunities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Investment pools policies
CREATE POLICY "Users can view active pools" ON investment_pools
    FOR SELECT USING (status = 'active');

CREATE POLICY "Pool members can view their pools" ON investment_pools
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pool_members 
            WHERE pool_id = investment_pools.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Pool creators can manage their pools" ON investment_pools
    FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all pools" ON investment_pools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (
        from_user_id = auth.uid() OR to_user_id = auth.uid()
    );

CREATE POLICY "Admins can view all transactions" ON transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Observers policies
CREATE POLICY "Observers can view permitted data" ON observers
    FOR SELECT USING (observer_id = auth.uid());

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('documents', 'documents', false),
('proof-of-payment', 'proof-of-payment', false),
('business-plans', 'business-plans', false),
('financial-statements', 'financial-statements', false),
('reports', 'reports', false);

-- Storage policies
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view public avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload documents for their opportunities" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('documents', 'business-plans', 'financial-statements') AND
        EXISTS (
            SELECT 1 FROM opportunities 
            WHERE id::text = (storage.foldername(name))[1] 
            AND entrepreneur_id = auth.uid()
        )
    );

CREATE POLICY "Users can view documents they have access to" ON storage.objects
    FOR SELECT USING (
        bucket_id IN ('documents', 'business-plans', 'financial-statements') AND
        (
            EXISTS (
                SELECT 1 FROM opportunities o
                JOIN observers obs ON o.id = obs.opportunity_id
                WHERE o.id::text = (storage.foldername(name))[1] 
                AND obs.observer_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM opportunities 
                WHERE id::text = (storage.foldername(name))[1] 
                AND entrepreneur_id = auth.uid()
            )
        )
    );

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
('default_currency', '"USD"', 'Default platform currency'),
('platform_fee_percentage', '2.5', 'Platform fee as percentage'),
('support_contacts', '{"phone": "+263 78 998 9619", "email": "admin@abathwa.com", "whatsapp": "wa.me/789989619"}', 'Default support contact information'),
('default_escrow_accounts', '{"mobile_wallets": {"account_number": "0788420479", "holder_name": "Vusa Ncube"}, "innbucks_microbank": {"account_name": "Abathwa Incubator PBC", "account_number": "013113351190001"}}', 'Default escrow account details');

-- Insert default escrow accounts
INSERT INTO escrow_accounts (account_name, account_number, account_type, holder_name, is_default) VALUES
('Mobile Wallets (Ecocash, Omari, Innbucks)', '0788420479', 'ecocash', 'Vusa Ncube', true),
('Innbucks MicroBank', '013113351190001', 'innbucks', 'Abathwa Incubator PBC', true);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'Main users table with authentication and basic profile information';
COMMENT ON TABLE user_profiles IS 'Extended profile information for users';
COMMENT ON TABLE platform_settings IS 'Global platform configuration settings';
COMMENT ON TABLE escrow_accounts IS 'Escrow accounts for payment processing';
COMMENT ON TABLE investment_pools IS 'Investment pools for collective investing';
COMMENT ON TABLE pool_members IS 'Members of investment pools with their roles';
COMMENT ON TABLE opportunities IS 'Investment opportunities posted by entrepreneurs';
COMMENT ON TABLE opportunity_milestones IS 'Milestones for tracking opportunity progress';
COMMENT ON TABLE investment_offers IS 'Offers made by investors for opportunities';
COMMENT ON TABLE transactions IS 'All financial transactions on the platform';
COMMENT ON TABLE documents IS 'Documents uploaded to the platform';
COMMENT ON TABLE agreements IS 'Smart contracts and agreements between parties';
COMMENT ON TABLE observers IS 'Users who can observe specific activities';
COMMENT ON TABLE service_providers IS 'Service providers offering professional services';
COMMENT ON TABLE audit_logs IS 'Audit trail for all system activities';

-- =====================================================
-- END OF SCHEMA
-- ===================================================== 