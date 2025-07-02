
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';
import { toast } from 'sonner';
import type {
  ServiceCategory,
  ServiceRequest,
  WorkOrder,
  JobCard,
  ServiceNegotiation,
  CreateServiceRequestData,
  CreateJobCardData,
  UpdateJobCardData,
  ServiceRequestStatus,
  WorkOrderStatus,
  JobCardStatus
} from '@/types/services';

export const useServices = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  // Fetch service categories
  const useServiceCategories = () => {
    return useQuery({
      queryKey: ['service-categories'],
      queryFn: async (): Promise<ServiceCategory[]> => {
        console.log('Fetching service categories...');
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching service categories:', error);
          throw error;
        }

        console.log('Service categories fetched:', data);
        return data || [];
      },
    });
  };

  // Fetch service requests (for requestors)
  const useServiceRequests = (status?: ServiceRequestStatus) => {
    return useQuery({
      queryKey: ['service-requests', status],
      queryFn: async (): Promise<ServiceRequest[]> => {
        console.log('Fetching service requests...', { status });
        let query = supabase
          .from('service_requests')
          .select(`
            *,
            service_category:service_categories(*)
          `)
          .order('created_at', { ascending: false });

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching service requests:', error);
          throw error;
        }

        console.log('Service requests fetched:', data);
        return data || [];
      },
    });
  };

  // Fetch incoming service requests (for service providers)
  const useIncomingServiceRequests = () => {
    return useQuery({
      queryKey: ['incoming-service-requests'],
      queryFn: async (): Promise<ServiceRequest[]> => {
        console.log('Fetching incoming service requests...');
        const { data, error } = await supabase
          .from('service_requests')
          .select(`
            *,
            service_category:service_categories(*)
          `)
          .or('broadcast_to_all.eq.true,status.eq.pending_acceptance')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching incoming requests:', error);
          throw error;
        }

        console.log('Incoming service requests fetched:', data);
        return data || [];
      },
    });
  };

  // Fetch work orders
  const useWorkOrders = (isProvider: boolean = false) => {
    return useQuery({
      queryKey: ['work-orders', isProvider],
      queryFn: async (): Promise<WorkOrder[]> => {
        console.log('Fetching work orders...', { isProvider });
        const { data, error } = await supabase
          .from('work_orders')
          .select(`
            *,
            service_request:service_requests(
              *,
              service_category:service_categories(*)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching work orders:', error);
          throw error;
        }

        console.log('Work orders fetched:', data);
        return data || [];
      },
    });
  };

  // Fetch job cards
  const useJobCards = (workOrderId?: string) => {
    return useQuery({
      queryKey: ['job-cards', workOrderId],
      queryFn: async (): Promise<JobCard[]> => {
        console.log('Fetching job cards...', { workOrderId });
        let query = supabase
          .from('job_cards')
          .select(`
            *,
            work_order:work_orders(
              *,
              service_request:service_requests(*)
            )
          `)
          .order('created_at', { ascending: false });

        if (workOrderId) {
          query = query.eq('work_order_id', workOrderId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching job cards:', error);
          throw error;
        }

        console.log('Job cards fetched:', data);
        return data || [];
      },
    });
  };

  // Create service request
  const createServiceRequest = useMutation({
    mutationFn: async (data: CreateServiceRequestData): Promise<ServiceRequest> => {
      console.log('Creating service request...', data);
      const { data: result, error } = await supabase
        .from('service_requests')
        .insert({
          ...data,
          requestor_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select(`
          *,
          service_category:service_categories(*)
        `)
        .single();

      if (error) {
        console.error('Error creating service request:', error);
        throw error;
      }

      console.log('Service request created:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast.success('Service request created successfully');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Accept service request (creates work order)
  const acceptServiceRequest = useMutation({
    mutationFn: async ({ 
      requestId, 
      agreedScope, 
      agreedDeliverables, 
      agreedFee,
      agreedStartDate,
      agreedEndDate 
    }: {
      requestId: string;
      agreedScope: string;
      agreedDeliverables: string[];
      agreedFee?: number;
      agreedStartDate?: string;
      agreedEndDate?: string;
    }): Promise<WorkOrder> => {
      console.log('Accepting service request...', { requestId });
      
      // First update the service request status
      const { error: updateError } = await supabase
        .from('service_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating service request:', updateError);
        throw updateError;
      }

      // Then create the work order
      const { data: result, error } = await supabase
        .from('work_orders')
        .insert({
          service_request_id: requestId,
          service_provider_id: (await supabase.auth.getUser()).data.user?.id,
          agreed_scope: agreedScope,
          agreed_deliverables: agreedDeliverables,
          agreed_fee: agreedFee,
          agreed_start_date: agreedStartDate,
          agreed_end_date: agreedEndDate,
          terms_agreed_at: new Date().toISOString(),
        })
        .select(`
          *,
          service_request:service_requests(
            *,
            service_category:service_categories(*)
          )
        `)
        .single();

      if (error) {
        console.error('Error creating work order:', error);
        throw error;
      }

      console.log('Work order created:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['incoming-service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      toast.success('Service request accepted and work order created');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Create job card
  const createJobCard = useMutation({
    mutationFn: async (data: CreateJobCardData): Promise<JobCard> => {
      console.log('Creating job card...', data);
      const { data: result, error } = await supabase
        .from('job_cards')
        .insert(data)
        .select(`
          *,
          work_order:work_orders(
            *,
            service_request:service_requests(*)
          )
        `)
        .single();

      if (error) {
        console.error('Error creating job card:', error);
        throw error;
      }

      console.log('Job card created:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-cards'] });
      toast.success('Job card created successfully');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Update job card
  const updateJobCard = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateJobCardData }): Promise<JobCard> => {
      console.log('Updating job card...', { id, data });
      const { data: result, error } = await supabase
        .from('job_cards')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          work_order:work_orders(
            *,
            service_request:service_requests(*)
          )
        `)
        .single();

      if (error) {
        console.error('Error updating job card:', error);
        throw error;
      }

      console.log('Job card updated:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-cards'] });
      toast.success('Job card updated successfully');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Update service request status
  const updateServiceRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ServiceRequestStatus }) => {
      console.log('Updating service request status...', { id, status });
      const { error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating service request status:', error);
        throw error;
      }

      console.log('Service request status updated');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['incoming-service-requests'] });
      toast.success('Service request updated successfully');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return {
    // Queries
    useServiceCategories,
    useServiceRequests,
    useIncomingServiceRequests,
    useWorkOrders,
    useJobCards,
    
    // Mutations
    createServiceRequest,
    acceptServiceRequest,
    createJobCard,
    updateJobCard,
    updateServiceRequestStatus,
  };
};
