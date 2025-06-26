
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

// Pages
import Dashboard from '@/pages/Dashboard';
import ListaFuncionarios from '@/pages/funcionarios/ListaFuncionarios';

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
  console.log('App: Rendering...');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SecureAuthProvider>
          <Router>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicLanding />} />
                <Route path="/secure-login" element={<SecureLogin />} />
                <Route path="/master-admin-setup" element={<MasterAdminSetup />} />
                
                {/* Protected app routes */}
                <Route path="/app" element={
                  <SecureProtectedRoute>
                    <AppLayout />
                  </SecureProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="funcionarios" element={<ListaFuncionarios />} />
                </Route>
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </div>
          </Router>
        </SecureAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
