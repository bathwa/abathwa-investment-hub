
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';
import { toast } from 'sonner';
import type { ServiceCategory, ServiceRequest, WorkOrder, JobCard, ServiceNegotiation } from '@/types/services';

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
          return data || [];
        } catch (error) {
          console.error('Error fetching service categories:', error);
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
          return data || [];
        } catch (error) {
          console.error('Error fetching service requests:', error);
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
          return data || [];
        } catch (error) {
          console.error('Error fetching incoming service requests:', error);
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
          return data || [];
        } catch (error) {
          console.error('Error fetching work orders:', error);
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
          return data || [];
        } catch (error) {
          console.error('Error fetching job cards:', error);
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
          return data || [];
        } catch (error) {
          console.error('Error fetching service negotiations:', error);
          return [];
        }
      },
    });
  };

  // Mutations
  const createServiceRequest = useMutation({
    mutationFn: async (data: Partial<ServiceRequest>) => {
      try {
        const { data: result, error } = await supabase
          .from('service_requests')
          .insert({
            title: data.title,
            description: data.description,
            service_type: data.service_type,
            requester_id: (await supabase.auth.getUser()).data.user?.id,
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
        toast.error('Failed to create service request');
        throw error;
      }
    },
  });

  const acceptServiceRequest = useMutation({
    mutationFn: async (data: { requestId: string }) => {
      try {
        const { data: result, error } = await supabase
          .from('service_requests')
          .update({
            status: 'assigned',
            provider_id: (await supabase.auth.getUser()).data.user?.id,
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
        toast.error('Failed to accept service request');
        throw error;
      }
    },
  });

  const createWorkOrder = useMutation({
    mutationFn: async (data: Partial<WorkOrder>) => {
      try {
        const { data: result, error } = await supabase
          .from('work_orders')
          .insert({
            service_request_id: data.service_request_id,
            service_provider_id: (await supabase.auth.getUser()).data.user?.id,
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
        toast.error('Failed to create work order');
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
        toast.error('Failed to create job card');
        throw error;
      }
    },
  });

  const updateJobCard = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<JobCard> }) => {
      try {
        const { data: result, error } = await supabase
          .from('job_cards')
          .update(data.updates)
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Job card updated successfully');
        queryClient.invalidateQueries({ queryKey: ['job-cards'] });
        return result;
      } catch (error) {
        console.error('Error updating job card:', error);
        toast.error('Failed to update job card');
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
        toast.error('Failed to update service request status');
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
