
export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  mandatory_fields: string[];
  default_deliverables: string[];
  expected_budget_range: {
    min: number;
    max: number;
  };
  created_at: string;
  updated_at: string;
};

export type ServiceRequestStatus = 
  | 'pending_acceptance'
  | 'accepted'
  | 'declined'
  | 'negotiating'
  | 'cancelled'
  | 'completed';

export type ServiceRequest = {
  id: string;
  requestor_id: string;
  associated_entity_id?: string;
  associated_entity_type?: 'opportunity' | 'investment';
  service_category_id: string;
  title: string;
  scope_description: string;
  deliverables: string[];
  start_date?: string;
  end_date?: string;
  proposed_budget?: number;
  currency: string;
  status: ServiceRequestStatus;
  selected_service_provider_ids: string[];
  broadcast_to_all: boolean;
  attachments: string[];
  created_at: string;
  updated_at: string;
  service_category?: ServiceCategory;
};

export type WorkOrderStatus = 
  | 'in_progress'
  | 'pending_delivery'
  | 'delivered'
  | 'under_review'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'pending_payment' | 'paid';

export type WorkOrder = {
  id: string;
  service_request_id: string;
  service_provider_id: string;
  agreed_scope: string;
  agreed_deliverables: string[];
  agreed_start_date?: string;
  agreed_end_date?: string;
  agreed_fee?: number;
  currency: string;
  status: WorkOrderStatus;
  payment_status: PaymentStatus;
  terms_agreed_at?: string;
  created_at: string;
  updated_at: string;
  service_request?: ServiceRequest;
};

export type JobCardStatus = 
  | 'not_started'
  | 'in_progress'
  | 'awaiting_client_input'
  | 'completed'
  | 'blocked';

export type JobCard = {
  id: string;
  work_order_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: JobCardStatus;
  progress_notes: Array<{
    note: string;
    timestamp: string;
  }>;
  attachments: string[];
  created_at: string;
  updated_at: string;
  work_order?: WorkOrder;
};

export type ServiceNegotiation = {
  id: string;
  service_request_id: string;
  service_provider_id: string;
  proposed_scope?: string;
  proposed_deliverables: string[];
  proposed_timeline_start?: string;
  proposed_timeline_end?: string;
  proposed_fee?: number;
  currency: string;
  counter_proposal_notes?: string;
  status: 'pending' | 'accepted' | 'declined' | 'superseded';
  created_at: string;
  updated_at: string;
};

export type CreateServiceRequestData = {
  associated_entity_id?: string;
  associated_entity_type?: 'opportunity' | 'investment';
  service_category_id: string;
  title: string;
  scope_description: string;
  deliverables: string[];
  start_date?: string;
  end_date?: string;
  proposed_budget?: number;
  currency?: string;
  selected_service_provider_ids?: string[];
  broadcast_to_all?: boolean;
  attachments?: string[];
};

export type CreateJobCardData = {
  work_order_id: string;
  title: string;
  description?: string;
  due_date?: string;
};

export type UpdateJobCardData = {
  title?: string;
  description?: string;
  due_date?: string;
  status?: JobCardStatus;
  progress_notes?: Array<{
    note: string;
    timestamp: string;
  }>;
  attachments?: string[];
};
