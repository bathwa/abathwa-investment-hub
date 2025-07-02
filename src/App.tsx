
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import UserSettings from '@/pages/UserSettings';
import ServiceManagement from '@/pages/ServiceManagement';

// Role-specific dashboards
import EntrepreneurDashboard from '@/pages/EntrepreneurDashboard';
import InvestorDashboard from '@/pages/InvestorDashboard';
import ServiceProviderDashboard from '@/pages/ServiceProviderDashboard';
import ObserverDashboard from '@/pages/ObserverDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUserManagement from '@/pages/AdminUserManagement';
import AdminInvestments from '@/pages/AdminInvestments';
import AdminPoolManagement from '@/pages/AdminPoolManagement';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected routes */}
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <UserSettings />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/services" element={
                      <ProtectedRoute>
                        <ServiceManagement />
                      </ProtectedRoute>
                    } />

                    {/* Role-specific dashboards */}
                    <Route path="/entrepreneur" element={
                      <ProtectedRoute allowedRoles={['entrepreneur']}>
                        <EntrepreneurDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/investor" element={
                      <ProtectedRoute allowedRoles={['investor']}>
                        <InvestorDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/service-provider" element={
                      <ProtectedRoute allowedRoles={['service_provider']}>
                        <ServiceProviderDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/observer" element={
                      <ProtectedRoute allowedRoles={['observer']}>
                        <ObserverDashboard />
                      </ProtectedRoute>
                    } />

                    {/* Admin routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin/users" element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminUserManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin/investments" element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminInvestments />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin/pools" element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminPoolManagement />
                      </ProtectedRoute>
                    } />

                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
