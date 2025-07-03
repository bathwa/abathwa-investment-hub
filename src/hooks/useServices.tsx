
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';
import { toast } from 'sonner';
import type { ServiceCategory, ServiceRequest, WorkOrder, JobCard, ServiceNegotiation, JobCardStatus, WorkOrderStatus, PaymentStatus, NegotiationStatus, ProgressNote, JobCardAttachment, ServiceRequestStatus } from '@/types/services';

// Type guard functions for safe JSON parsing
const isProgressNote = (obj: any): obj is ProgressNote => {
  return obj && typeof obj === 'object' && 'note' in obj && 'timestamp' in obj;
};

const isJobCardAttachment = (obj: any): obj is JobCardAttachment => {
  return obj && typeof obj === 'object' && 'name' in obj && 'url' in obj;
};

const parseProgressNotes = (data: any): ProgressNote[] => {
  if (!Array.isArray(data)) return [];
  return data.filter(isProgressNote);
};

const parseJobCardAttachments = (data: any): JobCardAttachment[] => {
  if (!Array.isArray(data)) return [];
  return data.filter(isJobCardAttachment);
};

export const useServices = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  // Service Categories
  const useServiceCategories = () => {
    return useQuery({
      queryKey: ['service-categories'],
      queryFn: async (): Promise<ServiceCategory[]> => {
        try {
          const { data, error } = await supabase
            .from('service_categories')
            .select('*')
            .order('name');

          if (error) throw error;
          
          return (data || []).map(category => ({
            ...category,
            mandatory_fields: Array.isArray(category.mandatory_fields) 
              ? category.mandatory_fields as string[]
              : [],
            default_deliverables: Array.isArray(category.default_deliverables)
              ? category.default_deliverables as string[]
              : [],
            expected_budget_range: (category.expected_budget_range && typeof category.expected_budget_range === 'object')
              ? category.expected_budget_range as { min: number; max: number }
              : { min: 0, max: 0 }
          }));
        } catch (error) {
          console.error('Error fetching service categories:', error);
          handleError(error as Error);
          return [];
        }
      },
    });
  };

  // Service Requests
  const useServiceRequests = () => {
    return useQuery({
      queryKey: ['service-requests'],
      queryFn: async (): Promise<ServiceRequest[]> => {
        try {
          const { data, error } = await supabase
            .from('service_requests')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          return (data || []).map(request => ({
            ...request,
            status: request.status as ServiceRequestStatus,
            budget_range: (request.budget_range && typeof request.budget_range === 'object')
              ? request.budget_range as { min: number; max: number }
              : { min: 0, max: 0 }
          }));
        } catch (error) {
          console.error('Error fetching service requests:', error);
          handleError(error as Error);
          return [];
        }
      },
    });
  };

  const useIncomingServiceRequests = () => {
    return useQuery({
      queryKey: ['incoming-service-requests'],
      queryFn: async (): Promise<ServiceRequest[]> => {
        try {
          const { data, error } = await supabase
            .from('service_requests')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          return (data || []).map(request => ({
            ...request,
            status: request.status as ServiceRequestStatus,
            budget_range: (request.budget_range && typeof request.budget_range === 'object')
              ? request.budget_range as { min: number; max: number }
              : { min: 0, max: 0 }
          }));
        } catch (error) {
          console.error('Error fetching incoming service requests:', error);
          handleError(error as Error);
          return [];
        }
      },
    });
  };

  // Work Orders
  const useWorkOrders = () => {
    return useQuery({
      queryKey: ['work-orders'],
      queryFn: async (): Promise<WorkOrder[]> => {
        try {
          const { data, error } = await supabase
            .from('work_orders')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          return (data || []).map(order => ({
            ...order,
            status: order.status as WorkOrderStatus,
            payment_status: order.payment_status as PaymentStatus,
            agreed_deliverables: Array.isArray(order.agreed_deliverables)
              ? order.agreed_deliverables as string[]
              : []
          }));
        } catch (error) {
          console.error('Error fetching work orders:', error);
          handleError(error as Error);
          return [];
        }
      },
    });
  };

  // Job Cards
  const useJobCards = (workOrderId?: string) => {
    return useQuery({
      queryKey: ['job-cards', workOrderId],
      queryFn: async (): Promise<JobCard[]> => {
        try {
          let query = supabase
            .from('job_cards')
            .select('*')
            .order('created_at', { ascending: false });

          if (workOrderId) {
            query = query.eq('work_order_id', workOrderId);
          }

          const { data, error } = await query;

          if (error) throw error;
          
          return (data || []).map(card => ({
            ...card,
            status: card.status as JobCardStatus,
            progress_notes: parseProgressNotes(card.progress_notes),
            attachments: parseJobCardAttachments(card.attachments)
          }));
        } catch (error) {
          console.error('Error fetching job cards:', error);
          handleError(error as Error);
          return [];
        }
      },
    });
  };

  // Service Negotiations
  const useServiceNegotiations = () => {
    return useQuery({
      queryKey: ['service-negotiations'],
      queryFn: async (): Promise<ServiceNegotiation[]> => {
        try {
          const { data, error } = await supabase
            .from('service_negotiations')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          return (data || []).map(negotiation => ({
            ...negotiation,
            status: negotiation.status as NegotiationStatus,
            proposed_deliverables: Array.isArray(negotiation.proposed_deliverables)
              ? negotiation.proposed_deliverables as string[]
              : []
          }));
        } catch (error) {
          console.error('Error fetching service negotiations:', error);
          handleError(error as Error);
          return [];
        }
      },
    });
  };

  // Mutations
  const createServiceRequest = useMutation({
    mutationFn: async (data: Partial<ServiceRequest>) => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('User not authenticated');

        const { data: result, error } = await supabase
          .from('service_requests')
          .insert({
            title: data.title,
            description: data.description,
            service_type: data.service_type,
            requester_id: user.user.id,
            budget_range: data.budget_range,
            deadline: data.deadline,
            status: 'open'
          })
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Service request created successfully');
        queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        return result;
      } catch (error) {
        console.error('Error creating service request:', error);
        handleError(error as Error);
        throw error;
      }
    },
  });

  const acceptServiceRequest = useMutation({
    mutationFn: async (data: { requestId: string }) => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('User not authenticated');

        const { data: result, error } = await supabase
          .from('service_requests')
          .update({
            status: 'assigned',
            provider_id: user.user.id,
          })
          .eq('id', data.requestId)
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Service request accepted successfully');
        queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        queryClient.invalidateQueries({ queryKey: ['incoming-service-requests'] });
        return result;
      } catch (error) {
        console.error('Error accepting service request:', error);
        handleError(error as Error);
        throw error;
      }
    },
  });

  const createWorkOrder = useMutation({
    mutationFn: async (data: Partial<WorkOrder>) => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('User not authenticated');

        const { data: result, error } = await supabase
          .from('work_orders')
          .insert({
            service_request_id: data.service_request_id,
            service_provider_id: user.user.id,
            agreed_scope: data.agreed_scope,
            agreed_deliverables: data.agreed_deliverables,
            agreed_start_date: data.agreed_start_date,
            agreed_end_date: data.agreed_end_date,
            agreed_fee: data.agreed_fee,
            currency: data.currency || 'USD',
            status: 'in_progress'
          })
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Work order created successfully');
        queryClient.invalidateQueries({ queryKey: ['work-orders'] });
        return result;
      } catch (error) {
        console.error('Error creating work order:', error);
        handleError(error as Error);
        throw error;
      }
    },
  });

  const createJobCard = useMutation({
    mutationFn: async (data: Partial<JobCard>) => {
      try {
        const { data: result, error } = await supabase
          .from('job_cards')
          .insert({
            work_order_id: data.work_order_id,
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            status: 'not_started',
            progress_notes: [],
            attachments: []
          })
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Job card created successfully');
        queryClient.invalidateQueries({ queryKey: ['job-cards'] });
        return result;
      } catch (error) {
        console.error('Error creating job card:', error);
        handleError(error as Error);
        throw error;
      }
    },
  });

  const updateJobCard = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<JobCard> }) => {
      try {
        const dbUpdates: any = { ...data.updates };
        if (dbUpdates.progress_notes) {
          dbUpdates.progress_notes = dbUpdates.progress_notes as unknown;
        }
        if (dbUpdates.attachments) {
          dbUpdates.attachments = dbUpdates.attachments as unknown;
        }

        const { data: result, error } = await supabase
          .from('job_cards')
          .update(dbUpdates)
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Job card updated successfully');
        queryClient.invalidateQueries({ queryKey: ['job-cards'] });
        return result;
      } catch (error) {
        console.error('Error updating job card:', error);
        handleError(error as Error);
        throw error;
      }
    },
  });

  const updateServiceRequestStatus = useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      try {
        const { data: result, error } = await supabase
          .from('service_requests')
          .update({ status: data.status })
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Service request status updated');
        queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        queryClient.invalidateQueries({ queryKey: ['incoming-service-requests'] });
        return result;
      } catch (error) {
        console.error('Error updating service request status:', error);
        handleError(error as Error);
        throw error;
      }
    },
  });

  return {
    // Queries
    useServiceCategories,
    useServiceRequests,
    useIncomingServiceRequests,
    useWorkOrders,
    useJobCards,
    useServiceNegotiations,
    
    // Mutations
    createServiceRequest,
    acceptServiceRequest,
    createWorkOrder,
    createJobCard,
    updateJobCard,
    updateServiceRequestStatus,
  };
};
