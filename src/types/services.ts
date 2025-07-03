
// Service Management Types matching the actual database schema

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  mandatory_fields: string[];
  default_deliverables: string[];
  expected_budget_range: {
    min: number;
    max: number;
  };
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
  budget_range?: {
    min: number;
    max: number;
  };
  deadline?: string;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
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
}

export interface ProgressNote {
  note: string;
  timestamp: string;
}

export interface JobCardAttachment {
  name: string;
  url: string;
}

export interface JobCard {
  id: string;
  work_order_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: JobCardStatus;
  progress_notes: ProgressNote[];
  attachments: JobCardAttachment[];
  created_at: string;
  updated_at: string;
}

export interface ServiceNegotiation {
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
  status: NegotiationStatus;
  created_at: string;
  updated_at: string;
}

export type ServiceRequestStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type WorkOrderStatus = 'in_progress' | 'pending_delivery' | 'delivered' | 'under_review' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'pending_payment' | 'paid';
export type JobCardStatus = 'not_started' | 'in_progress' | 'awaiting_client_input' | 'completed' | 'blocked';
export type NegotiationStatus = 'pending' | 'accepted' | 'declined' | 'superseded';

export interface CreateJobCardData {
  work_order_id: string;
  title: string;
  description?: string;
  due_date?: string;
}
