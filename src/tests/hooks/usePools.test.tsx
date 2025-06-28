import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePools } from '../../hooks/usePools';

// Mock the supabase client
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: { access_token: 'mock-token' } } })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: '1', role: 'investor' } } }))
    }
  }
}));

// Mock fetch
global.fetch = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch pools successfully', async () => {
    const mockPools = [
      {
        id: '1',
        name: 'Tech Innovation Pool',
        description: 'Investment pool for technology startups',
        category: 'syndicate',
        target_amount: 1000000,
        currency: 'USD',
        current_amount: 500000,
        status: 'active',
        created_by: '1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockPools,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      })
    });

    const { result } = renderHook(() => usePools(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pools).toEqual(mockPools);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePools(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
  });
}); 