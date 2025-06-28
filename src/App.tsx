import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminPoolManagement from "./pages/AdminPoolManagement";
import AdminInvestments from "./pages/AdminInvestments";
import InvestorDashboard from "./pages/InvestorDashboard";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import ObserverDashboard from "./pages/ObserverDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
