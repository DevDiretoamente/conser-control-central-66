
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { SecureAuthProvider } from '@/contexts/SecureAuthContext';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/hooks/useErrorBoundary';
import SecureLogin from '@/components/auth/SecureLogin';
import SecureProtectedRoute from '@/components/auth/SecureProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import PublicLanding from '@/components/PublicLanding';
import MasterAdminSetup from '@/pages/MasterAdminSetup';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';
import FuncionariosErrorBoundary from '@/components/funcionarios/FuncionariosErrorBoundary';

// Pages
import Dashboard from '@/pages/Dashboard';
import ListaFuncionarios from '@/pages/funcionarios/ListaFuncionarios';
import NovoFuncionario from '@/pages/funcionarios/NovoFuncionario';
import DetalheFuncionario from '@/pages/funcionarios/DetalheFuncionario';
import EditarFuncionario from '@/pages/funcionarios/EditarFuncionario';
import ExamesMedicosPage from '@/pages/funcionarios/ExamesMedicosPage';
import Obras from '@/pages/obras/Obras';
import Frota from '@/pages/frota/Frota';
import Patrimonio from '@/pages/patrimonio/Patrimonio';
import Financeiro from '@/pages/financeiro/Financeiro';
import RHPage from '@/pages/rh/RHPage';
import CartaoPontoPage from '@/pages/rh/CartaoPontoPage';
import CartaoPontoDetailPage from '@/pages/rh/CartaoPontoDetailPage';
import DocumentosRHPage from '@/pages/rh/DocumentosRHPage';
import RelatoriosPage from '@/pages/rh/RelatoriosPage';
import Configuracoes from '@/pages/configuracoes/Configuracoes';
import Funcoes from '@/pages/configuracoes/Funcoes';
import DetalheFuncao from '@/pages/configuracoes/DetalheFuncao';
import EditarFuncao from '@/pages/configuracoes/EditarFuncao';
import Setores from '@/pages/configuracoes/Setores';
import Clinicas from '@/pages/configuracoes/Clinicas';
import Exames from '@/pages/configuracoes/Exames';
import Emails from '@/pages/configuracoes/Emails';
import Beneficios from '@/pages/configuracoes/Beneficios';
import Usuarios from '@/pages/configuracoes/Usuarios';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <SecureAuthProvider>
            <Router>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<PublicLanding />} />
                  <Route path="/secure-login" element={<SecureLogin />} />
                  <Route path="/master-admin-setup" element={
                    <PageErrorBoundary 
                      fallbackTitle="Erro na Configuração"
                      fallbackMessage="Ocorreu um erro ao carregar a página de configuração do Master Admin."
                    >
                      <MasterAdminSetup />
                    </PageErrorBoundary>
                  } />
                  
                  {/* Protected app routes */}
                  <Route path="/app" element={
                    <SecureProtectedRoute>
                      <AppLayout />
                    </SecureProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    
                    {/* Funcionários - Rotas com ErrorBoundary específico */}
                    <Route path="funcionarios" element={
                      <FuncionariosErrorBoundary>
                        <ListaFuncionarios />
                      </FuncionariosErrorBoundary>
                    } />
                    <Route path="funcionarios/novo" element={
                      <FuncionariosErrorBoundary>
                        <NovoFuncionario />
                      </FuncionariosErrorBoundary>
                    } />
                    <Route path="funcionarios/:id" element={
                      <FuncionariosErrorBoundary>
                        <DetalheFuncionario />
                      </FuncionariosErrorBoundary>
                    } />
                    <Route path="funcionarios/:id/editar" element={
                      <FuncionariosErrorBoundary>
                        <EditarFuncionario />
                      </FuncionariosErrorBoundary>
                    } />
                    <Route path="funcionarios/exames" element={
                      <FuncionariosErrorBoundary>
                        <ExamesMedicosPage />
                      </FuncionariosErrorBoundary>
                    } />
                    
                    {/* Outras rotas */}
                    <Route path="obras" element={<Obras />} />
                    <Route path="frota" element={<Frota />} />
                    <Route path="patrimonio" element={<Patrimonio />} />
                    <Route path="financeiro" element={<Financeiro />} />
                    
                    {/* RH */}
                    <Route path="rh" element={<RHPage />} />
                    <Route path="rh/cartao-ponto" element={<CartaoPontoPage />} />
                    <Route path="rh/cartao-ponto/:id" element={<CartaoPontoDetailPage />} />
                    <Route path="rh/documentos" element={<DocumentosRHPage />} />
                    <Route path="rh/relatorios" element={<RelatoriosPage />} />
                    
                    {/* Benefícios */}
                    <Route path="beneficios" element={<Beneficios />} />
                    
                    {/* Configurações */}
                    <Route path="configuracoes" element={<Configuracoes />} />
                    <Route path="funcoes" element={<Funcoes />} />
                    <Route path="funcoes/:id" element={<DetalheFuncao />} />
                    <Route path="funcoes/:id/editar" element={<EditarFuncao />} />
                    <Route path="setores" element={<Setores />} />
                    <Route path="clinicas" element={<Clinicas />} />
                    <Route path="exames" element={<Exames />} />
                    <Route path="configuracoes/emails" element={<Emails />} />
                    <Route path="configuracoes/usuarios" element={<Usuarios />} />
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
    </ErrorBoundary>
  );
}

export default App;
