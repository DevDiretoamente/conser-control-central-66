
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { SecureAuthProvider } from '@/contexts/SecureAuthContext';
import { Toaster } from '@/components/ui/sonner';
import SecureLogin from '@/components/auth/SecureLogin';
import SecureProtectedRoute from '@/components/auth/SecureProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import PublicLanding from '@/components/PublicLanding';
import MasterAdminSetup from '@/pages/MasterAdminSetup';
import Dashboard from '@/pages/Dashboard';
import ListaFuncionarios from '@/pages/funcionarios/ListaFuncionarios';
import RootErrorBoundary from '@/components/RootErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function App() {
  console.log('App: Starting application...');

  return (
    <RootErrorBoundary>
      <div className="min-h-screen bg-background">
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <SecureAuthProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<PublicLanding />} />
                  <Route path="/secure-login" element={<SecureLogin />} />
                  <Route path="/master-admin-setup" element={<MasterAdminSetup />} />
                  
                  <Route path="/app" element={
                    <SecureProtectedRoute>
                      <AppLayout />
                    </SecureProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="funcionarios" element={<ListaFuncionarios />} />
                  </Route>
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                  }}
                />
              </Router>
            </SecureAuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </div>
    </RootErrorBoundary>
  );
}

export default App;
