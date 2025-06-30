
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/useAuth";
import { NotificationProvider } from "./components/NotificationSystem";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminPoolManagement from "./pages/AdminPoolManagement";
import AdminInvestments from "./pages/AdminInvestments";
import InvestorDashboard from "./pages/InvestorDashboard";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import ObserverDashboard from "./pages/ObserverDashboard";
import UserSettings from "./pages/UserSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <NotificationProvider>
                <Toaster />
                <Sonner 
                  position="top-right"
                  expand={true}
                  richColors={true}
                  closeButton={true}
                />
                <Routes>
                  {/* Public route */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Protected dashboard routes */}
                  <Route 
                    path="/admin-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin-user-management" 
                    element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminUserManagement />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin-pool-management" 
                    element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminPoolManagement />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin-investments" 
                    element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <AdminInvestments />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/investor-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['investor']}>
                        <InvestorDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/entrepreneur-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['entrepreneur']}>
                        <EntrepreneurDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/service-provider-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['service_provider']}>
                        <ServiceProviderDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/observer-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['observer']}>
                        <ObserverDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* User Settings - accessible to all authenticated users */}
                  <Route 
                    path="/user-settings" 
                    element={
                      <ProtectedRoute>
                        <UserSettings />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NotificationProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
