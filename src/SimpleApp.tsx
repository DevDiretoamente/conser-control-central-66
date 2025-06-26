
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FixedThemeProvider } from '@/contexts/FixedThemeProvider';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import { Toaster } from '@/components/ui/sonner';
import SimpleLanding from '@/components/SimpleLanding';
import SimpleLogin from '@/components/SimpleLogin';
import SimpleDashboard from '@/components/SimpleDashboard';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function SimpleApp() {
  console.log('SimpleApp - Starting application...');

  return (
    <SimpleErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <FixedThemeProvider defaultTheme="light" storageKey="app-theme">
            <SimpleAuthProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<SimpleLanding />} />
                  <Route path="/login" element={<SimpleLogin />} />
                  <Route path="/dashboard" element={<SimpleDashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                  }}
                />
              </Router>
            </SimpleAuthProvider>
          </FixedThemeProvider>
        </QueryClientProvider>
      </div>
    </SimpleErrorBoundary>
  );
}

export default SimpleApp;
