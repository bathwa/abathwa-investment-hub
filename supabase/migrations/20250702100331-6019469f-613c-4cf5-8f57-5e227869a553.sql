
-- Create service categories lookup table
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  mandatory_fields JSONB DEFAULT '[]'::jsonb,
  default_deliverables JSONB DEFAULT '[]'::jsonb,
  expected_budget_range JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service requests table
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requestor_id UUID REFERENCES public.users(id) NOT NULL,
  associated_entity_id UUID, -- FK to opportunities or investments
  associated_entity_type VARCHAR(20) CHECK (associated_entity_type IN ('opportunity', 'investment')),
  service_category_id UUID REFERENCES public.service_categories(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  scope_description TEXT NOT NULL,
  deliverables JSONB DEFAULT '[]'::jsonb,
  start_date DATE,
  end_date DATE,
  proposed_budget DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending_acceptance' CHECK (
    status IN ('pending_acceptance', 'accepted', 'declined', 'negotiating', 'cancelled', 'completed')
  ),
  selected_service_provider_ids JSONB DEFAULT '[]'::jsonb,
  broadcast_to_all BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work orders table
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) UNIQUE NOT NULL,
  service_provider_id UUID REFERENCES public.users(id) NOT NULL,
  agreed_scope TEXT NOT NULL,
  agreed_deliverables JSONB DEFAULT '[]'::jsonb,
  agreed_start_date DATE,
  agreed_end_date DATE,
  agreed_fee DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (
    status IN ('in_progress', 'pending_delivery', 'delivered', 'under_review', 'completed', 'cancelled')
  ),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'pending_payment', 'paid')
  ),
  terms_agreed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job cards table
CREATE TABLE public.job_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID REFERENCES public.work_orders(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'in_progress', 'awaiting_client_input', 'completed', 'blocked')
  ),
  progress_notes JSONB DEFAULT '[]'::jsonb, -- Array of {note: string, timestamp: ISO string}
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service negotiations table for counter-proposals
CREATE TABLE public.service_negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.service_requests(id) NOT NULL,
  service_provider_id UUID REFERENCES public.users(id) NOT NULL,
  proposed_scope TEXT,
  proposed_deliverables JSONB DEFAULT '[]'::jsonb,
  proposed_timeline_start DATE,
  proposed_timeline_end DATE,
  proposed_fee DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  counter_proposal_notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'declined', 'superseded')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_negotiations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_categories (readable by all authenticated users)
CREATE POLICY "service_categories_select_all" ON public.service_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "service_categories_admin_manage" ON public.service_categories
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));

-- RLS Policies for service_requests
CREATE POLICY "service_requests_requestor_manage" ON public.service_requests
  FOR ALL TO authenticated USING (requestor_id = auth.uid());

CREATE POLICY "service_requests_provider_view" ON public.service_requests
  FOR SELECT TO authenticated USING (
    broadcast_to_all = true OR 
    auth.uid() = ANY(SELECT jsonb_array_elements_text(selected_service_provider_ids)::uuid) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'service_provider')
  );

CREATE POLICY "service_requests_admin_all" ON public.service_requests
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));

-- RLS Policies for work_orders
CREATE POLICY "work_orders_participants_view" ON public.work_orders
  FOR SELECT TO authenticated USING (
    service_provider_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM service_requests WHERE id = work_orders.service_request_id AND requestor_id = auth.uid())
  );

CREATE POLICY "work_orders_provider_manage" ON public.work_orders
  FOR ALL TO authenticated USING (service_provider_id = auth.uid());

CREATE POLICY "work_orders_admin_all" ON public.work_orders
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));

-- RLS Policies for job_cards
CREATE POLICY "job_cards_provider_manage" ON public.job_cards
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM work_orders WHERE id = job_cards.work_order_id AND service_provider_id = auth.uid())
  );

CREATE POLICY "job_cards_requestor_view" ON public.job_cards
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM work_orders wo 
      JOIN service_requests sr ON wo.service_request_id = sr.id 
      WHERE wo.id = job_cards.work_order_id AND sr.requestor_id = auth.uid()
    )
  );

-- RLS Policies for service_negotiations
CREATE POLICY "service_negotiations_participants_manage" ON public.service_negotiations
  FOR ALL TO authenticated USING (
    service_provider_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM service_requests WHERE id = service_negotiations.service_request_id AND requestor_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX idx_service_requests_requestor ON public.service_requests(requestor_id);
CREATE INDEX idx_service_requests_category ON public.service_requests(service_category_id);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);
CREATE INDEX idx_work_orders_provider ON public.work_orders(service_provider_id);
CREATE INDEX idx_work_orders_request ON public.work_orders(service_request_id);
CREATE INDEX idx_job_cards_work_order ON public.job_cards(work_order_id);
CREATE INDEX idx_job_cards_status ON public.job_cards(status);

-- Insert default service categories
INSERT INTO public.service_categories (name, description, default_deliverables, expected_budget_range) VALUES
('Legal', 'Legal advisory and documentation services', '["Contract Review", "Legal Opinion", "Compliance Check"]', '{"min": 500, "max": 5000}'),
('Accounting', 'Financial and accounting services', '["Financial Statements", "Tax Preparation", "Audit Support"]', '{"min": 300, "max": 3000}'),
('Due Diligence', 'Investment due diligence and analysis', '["Due Diligence Report", "Risk Assessment", "Financial Analysis"]', '{"min": 1000, "max": 10000}'),
('Marketing', 'Marketing and business development', '["Marketing Strategy", "Content Creation", "Campaign Management"]', '{"min": 800, "max": 8000}'),
('IT Consulting', 'Technology and IT advisory services', '["System Analysis", "Technical Specification", "Implementation Plan"]', '{"min": 1200, "max": 12000}'),
('Business Planning', 'Strategic planning and business development', '["Business Plan", "Market Analysis", "Financial Projections"]', '{"min": 1500, "max": 15000}');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON public.work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_cards_updated_at BEFORE UPDATE ON public.job_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_negotiations_updated_at BEFORE UPDATE ON public.service_negotiations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
