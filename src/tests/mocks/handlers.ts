import { http, HttpResponse } from 'msw';

// Mock data
const mockUsers = [
  {
    id: '1',
    email: 'admin@abathwa.com',
    full_name: 'Admin User',
    role: 'super_admin',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

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

const mockOpportunities = [
  {
    id: '1',
    title: 'AI-Powered Analytics Platform',
    description: 'Revolutionary analytics platform using AI',
    category: 'going_concern',
    status: 'published',
    entrepreneur_id: '2',
    funding_target: 500000,
    currency: 'USD',
    risk_score: 7,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// API handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUsers[0],
        token: 'mock-jwt-token'
      }
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUsers[0],
        token: 'mock-jwt-token'
      }
    });
  }),

  // Users endpoints
  http.get('/api/users', () => {
    return HttpResponse.json({
      success: true,
      data: mockUsers,
      pagination: {
        page: 1,
        limit: 10,
        total: mockUsers.length,
        totalPages: 1
      }
    });
  }),

  // Pools endpoints
  http.get('/api/pools', () => {
    return HttpResponse.json({
      success: true,
      data: mockPools,
      pagination: {
        page: 1,
        limit: 10,
        total: mockPools.length,
        totalPages: 1
      }
    });
  }),

  http.post('/api/pools', () => {
    return HttpResponse.json({
      success: true,
      data: mockPools[0],
      message: 'Investment pool created successfully'
    });
  }),

  // Opportunities endpoints
  http.get('/api/opportunities', () => {
    return HttpResponse.json({
      success: true,
      data: mockOpportunities,
      pagination: {
        page: 1,
        limit: 10,
        total: mockOpportunities.length,
        totalPages: 1
      }
    });
  }),

  // AI endpoints
  http.post('/api/ai/analyze', () => {
    return HttpResponse.json({
      success: true,
      data: {
        risk_assessment: {
          overall_risk: 6,
          financial_risk: 5,
          market_risk: 7,
          team_risk: 4,
          entrepreneur_risk: 6,
          recommendations: ['Conduct thorough due diligence', 'Verify financial statements']
        }
      }
    });
  })
]; 