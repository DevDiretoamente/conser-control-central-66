import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ListaFuncionarios from "./pages/funcionarios/ListaFuncionarios";
import NovoFuncionario from "./pages/funcionarios/NovoFuncionario";
import DetalheFuncionario from "./pages/funcionarios/DetalheFuncionario";
import EditarFuncionario from "./pages/funcionarios/EditarFuncionario";
import ObrasPage from "./pages/obras/Obras";
import FrotaPage from "./pages/frota/Frota";
import PatrimonioPage from "./pages/patrimonio/Patrimonio";
import FinanceiroPage from "./pages/financeiro/Financeiro";
import ConfiguracoesPage from "./pages/configuracoes/Configuracoes";
import Clinicas from "./pages/configuracoes/Clinicas";
import DocumentosOcupacionaisPage from "./pages/configuracoes/DocumentosOcupacionais";
import ExamesMedicosPage from "./pages/funcionarios/ExamesMedicosPage";
import FuncoesPage from "./pages/configuracoes/Funcoes";
import SetoresPage from "./pages/configuracoes/Setores";
import ExamesPage from "./pages/configuracoes/Exames";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/acesso-negado" element={<AccessDenied />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              
              {/* RH Routes - Manager or Admin */}
              <Route path="funcionarios" element={
                <ProtectedRoute requiredRole="manager">
                  <ListaFuncionarios />
                </ProtectedRoute>
              } />
              <Route path="funcionarios/novo" element={
                <ProtectedRoute requiredRole="manager">
                  <NovoFuncionario />
                </ProtectedRoute>
              } />
              <Route path="funcionarios/:id" element={
                <ProtectedRoute requiredRole="operator">
                  <DetalheFuncionario />
                </ProtectedRoute>
              } />
              <Route path="funcionarios/:id/editar" element={
                <ProtectedRoute requiredRole="manager">
                  <EditarFuncionario />
                </ProtectedRoute>
              } />
              <Route path="funcionarios/:id/exames-medicos" element={
                <ProtectedRoute requiredRole="operator">
                  <ExamesMedicosPage />
                </ProtectedRoute>
              } />
              
              {/* Other module routes */}
              <Route path="obras" element={
                <ProtectedRoute requiredRole="operator">
                  <ObrasPage />
                </ProtectedRoute>
              } />
              <Route path="frota" element={
                <ProtectedRoute requiredRole="operator">
                  <FrotaPage />
                </ProtectedRoute>
              } />
              <Route path="patrimonio" element={
                <ProtectedRoute requiredRole="operator">
                  <PatrimonioPage />
                </ProtectedRoute>
              } />
              <Route path="financeiro" element={
                <ProtectedRoute requiredRole="manager">
                  <FinanceiroPage />
                </ProtectedRoute>
              } />
              
              {/* Configuration routes - Admin only */}
              <Route path="configuracoes" element={
                <ProtectedRoute requiredRole="admin">
                  <ConfiguracoesPage />
                </ProtectedRoute>
              } />
              <Route path="configuracoes/clinicas" element={
                <ProtectedRoute requiredRole="admin">
                  <Clinicas />
                </ProtectedRoute>
              } />
              <Route path="configuracoes/documentos-ocupacionais" element={
                <ProtectedRoute requiredRole="admin">
                  <DocumentosOcupacionaisPage />
                </ProtectedRoute>
              } />
              <Route path="configuracoes/funcoes" element={
                <ProtectedRoute requiredRole="admin">
                  <FuncoesPage />
                </ProtectedRoute>
              } />
              <Route path="configuracoes/setores" element={
                <ProtectedRoute requiredRole="admin">
                  <SetoresPage />
                </ProtectedRoute>
              } />
              <Route path="configuracoes/exames" element={
                <ProtectedRoute requiredRole="admin">
                  <ExamesPage />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
