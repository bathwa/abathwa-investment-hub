
-- =====================================================
-- COMPREHENSIVE DATABASE CLEANUP AND SETUP
-- =====================================================

-- Drop ALL existing policies first
DO $$ 
DECLARE
    policy_record record;
BEGIN
    -- Drop policies for users table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for opportunities table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'opportunities' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.opportunities', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for investment_pools table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'investment_pools' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.investment_pools', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for pool_members table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'pool_members' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.pool_members', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for investment_offers table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'investment_offers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.investment_offers', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for transactions table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'transactions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.transactions', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for service_providers table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'service_providers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.service_providers', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for service_requests table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'service_requests' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.service_requests', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for observers table
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'observers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.observers', policy_record.policyname);
    END LOOP;
END $$;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE observers ENABLE ROW LEVEL SECURITY;

-- Create fresh policies for users table
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_admin_all" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Create fresh policies for opportunities table
CREATE POLICY "opportunities_select_published" ON opportunities
  FOR SELECT USING (status = 'published');

CREATE POLICY "opportunities_entrepreneur_manage" ON opportunities
  FOR ALL USING (auth.uid() = entrepreneur_id);

CREATE POLICY "opportunities_admin_all" ON opportunities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Create fresh policies for investment_pools table
CREATE POLICY "pools_select_active" ON investment_pools
  FOR SELECT USING (status = 'active');

CREATE POLICY "pools_creator_manage" ON investment_pools
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "pools_admin_all" ON investment_pools
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Create fresh policies for pool_members table
CREATE POLICY "pool_members_view_own" ON pool_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "pool_members_insert_own" ON pool_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pool_members_update_own" ON pool_members
  FOR UPDATE USING (auth.uid() = user_id);

-- Create fresh policies for investment_offers table
CREATE POLICY "offers_investor_manage" ON investment_offers
  FOR ALL USING (auth.uid() = investor_id);

CREATE POLICY "offers_entrepreneur_view" ON investment_offers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_id AND entrepreneur_id = auth.uid())
  );

-- Create fresh policies for transactions table
CREATE POLICY "transactions_user_view" ON transactions
  FOR SELECT USING (auth.uid() IN (from_user_id, to_user_id));

CREATE POLICY "transactions_admin_all" ON transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Create fresh policies for service_providers table
CREATE POLICY "service_providers_manage_own" ON service_providers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "service_providers_view_available" ON service_providers
  FOR SELECT USING (availability_status = 'available');

-- Create fresh policies for service_requests table
CREATE POLICY "service_requests_requester_manage" ON service_requests
  FOR ALL USING (auth.uid() = requester_id);

CREATE POLICY "service_requests_provider_view" ON service_requests
  FOR SELECT USING (
    auth.uid() = provider_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'service_provider')
  );

-- Create fresh policies for observers table
CREATE POLICY "observers_view_assignments" ON observers
  FOR SELECT USING (auth.uid() = observer_id);

CREATE POLICY "observers_view_observers" ON observers
  FOR SELECT USING (auth.uid() = observed_user_id);

-- Create helper functions
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION has_role(check_role user_role)
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT role FROM users WHERE id = auth.uid()) = check_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create trigger to automatically set user role and profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, first_name, last_name, phone, role, status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'phone', ''),
    COALESCE((new.raw_user_meta_data ->> 'role')::user_role, 'entrepreneur'),
    'active'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
