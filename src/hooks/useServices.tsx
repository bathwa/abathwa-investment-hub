
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';
import { toast } from 'sonner';

// Use the actual database types
type ServiceCategory = {
  id: string;
  name: string;
  description: string;
};

type ServiceRequest = {
  id: string;
  title: string;
  description: string;
  service_type: string;
  status: string;
  created_at: string;
  requester_id: string;
  provider_id?: string;
  opportunity_id?: string;
  budget_range?: any;
  deadline?: string;
};

export const useServices = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  // Simplified hook that works with existing database
  const useServiceCategories = () => {
    return useQuery({
      queryKey: ['service-categories'],
      queryFn: async (): Promise<ServiceCategory[]> => {
        console.log('Service categories not yet available - placeholder data');
        // Return placeholder data until database schema is available
        return [
          { id: '1', name: 'Legal', description: 'Legal advisory services' },
          { id: '2', name: 'Accounting', description: 'Financial and accounting services' },
          { id: '3', name: 'Due Diligence', description: 'Investment due diligence' },
        ];
      },
    });
  };

  // Use existing service_requests table structure
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

  const useWorkOrders = () => {
    return useQuery({
      queryKey: ['work-orders'],
      queryFn: async (): Promise<any[]> => {
        console.log('Work orders not yet available - placeholder data');
        return [];
      },
    });
  };

  const useJobCards = () => {
    return useQuery({
      queryKey: ['job-cards'],
      queryFn: async (): Promise<any[]> => {
        console.log('Job cards not yet available - placeholder data');
        return [];
      },
    });
  };

  // Simplified mutations using existing schema
  const createServiceRequest = useMutation({
    mutationFn: async (data: any) => {
      try {
        const { data: result, error } = await supabase
          .from('service_requests')
          .insert({
            title: data.title,
            description: data.description || data.scope_description,
            service_type: data.service_category_id || 'general',
            requester_id: (await supabase.auth.getUser()).data.user?.id,
            budget_range: data.proposed_budget ? { min: 0, max: data.proposed_budget } : null,
            deadline: data.end_date,
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
    mutationFn: async (data: any) => {
      try {
        const { data: result, error } = await supabase
          .from('service_requests')
          .update({
            status: 'accepted',
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

  const createJobCard = useMutation({
    mutationFn: async (data: any) => {
      console.log('Create job card placeholder:', data);
      toast.info('Job card creation will be available once database schema is deployed');
      throw new Error('Job card creation not yet available');
    },
    onError: (error) => {
      console.log('Job card creation pending database deployment');
    },
  });

  const updateJobCard = useMutation({
    mutationFn: async (data: any) => {
      console.log('Update job card placeholder:', data);
      toast.info('Job card update will be available once database schema is deployed');
      throw new Error('Job card update not yet available');
    },
    onError: (error) => {
      console.log('Job card update pending database deployment');
    },
  });

  const updateServiceRequestStatus = useMutation({
    mutationFn: async (data: any) => {
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
    
    // Mutations
    createServiceRequest,
    acceptServiceRequest,
    createJobCard,
    updateJobCard,
    updateServiceRequestStatus,
  };
};
