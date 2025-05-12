import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FuncionariosPage from './pages/funcionarios/ListaFuncionarios';
import DetalheFuncionario from './pages/funcionarios/DetalheFuncionario';
import EditarFuncionario from './pages/funcionarios/EditarFuncionario';
import NovoFuncionario from './pages/funcionarios/NovoFuncionario';
import FuncoesPage from './pages/configuracoes/Funcoes';
import DetalheFuncao from './pages/configuracoes/DetalheFuncao';
import EditarFuncao from './pages/configuracoes/EditarFuncao';
import SetoresPage from './pages/configuracoes/Setores';
import ExamesMedicosPage from './pages/funcionarios/ExamesMedicosPage';
import Obras from './pages/obras/Obras';
import { Permission } from './types/auth';
import ClinicasPage from './pages/configuracoes/Clinicas';
import RHPage from './pages/rh/RHPage';
import AppLayout from './components/layout/AppLayout';
import ExamesPage from './pages/configuracoes/Exames';
import ConfiguracoesPage from './pages/configuracoes/Configuracoes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions: Permission[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermissions }) => {
  const { isAuthenticated, hasSpecificPermission, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const hasRequiredPermissions = requiredPermissions.every(permission =>
    hasSpecificPermission(permission.area, permission.level)
  );

  if (!hasRequiredPermissions) {
    return <div>Acesso negado.</div>;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes - Using AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={
            <ProtectedRoute requiredPermissions={[{ area: 'rh', level: 'read' }]}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* RH Routes */}
          <Route path="/rh" element={
            <ProtectedRoute requiredPermissions={[{ area: 'rh', level: 'read' }]}>
              <RHPage />
            </ProtectedRoute>
          } />
          
          {/* Funcionários Routes */}
          <Route path="/funcionarios" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'read' }]}>
              <FuncionariosPage />
            </ProtectedRoute>
          } />
          
          {/* IMPORTANT: Add the /exames route BEFORE any other funcionarios/* routes */}
          <Route path="/funcionarios/exames" element={
            <ProtectedRoute requiredPermissions={[{ area: 'exames', level: 'read' }]}>
              <ExamesMedicosPage />
            </ProtectedRoute>
          } />
          
          {/* IMPORTANT: Add the novo route BEFORE the parameterized route */}
          <Route path="/funcionarios/novo" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'write' }]}>
              <NovoFuncionario />
            </ProtectedRoute>
          } />
          
          <Route path="/funcionarios/:id" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'read' }]}>
              <DetalheFuncionario />
            </ProtectedRoute>
          } />
          
          <Route path="/funcionarios/:id/edit" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'write' }]}>
              <EditarFuncionario />
            </ProtectedRoute>
          } />
          
          <Route path="/funcionarios/:id/exames-medicos" element={
            <ProtectedRoute requiredPermissions={[{ area: 'exames', level: 'read' }]}>
              <ExamesMedicosPage />
            </ProtectedRoute>
          } />
          
          {/* Configurações Routes */}
          <Route path="/configuracoes" element={
            <ProtectedRoute requiredPermissions={[{ area: 'configuracoes', level: 'read' }]}>
              <ConfiguracoesPage />
            </ProtectedRoute>
          } />
          <Route path="/funcoes" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcoes', level: 'read' }]}>
              <FuncoesPage />
            </ProtectedRoute>
          } />
          <Route path="/funcoes/:id" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcoes', level: 'read' }]}>
              <DetalheFuncao />
            </ProtectedRoute>
          } />
          <Route path="/funcoes/:id/edit" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcoes', level: 'write' }]}>
              <EditarFuncao />
            </ProtectedRoute>
          } />
          <Route path="/setores" element={
            <ProtectedRoute requiredPermissions={[{ area: 'setores', level: 'read' }]}>
              <SetoresPage />
            </ProtectedRoute>
          } />
          <Route path="/clinicas" element={
            <ProtectedRoute requiredPermissions={[{ area: 'clinicas', level: 'read' }]}>
              <ClinicasPage />
            </ProtectedRoute>
          } />
          <Route path="/exames" element={
            <ProtectedRoute requiredPermissions={[{ area: 'exames', level: 'read' }]}>
              <ExamesPage />
            </ProtectedRoute>
          } />
          
          {/* Obras Routes */}
          <Route path="/obras" element={
            <ProtectedRoute requiredPermissions={[{ area: 'obras', level: 'read' }]}>
              <Obras />
            </ProtectedRoute>
          } />
          
          {/* Frota Routes */}
          <Route path="/frota" element={
            <ProtectedRoute requiredPermissions={[{ area: 'frota', level: 'read' }]}>
              <div>Página de Frota</div>
            </ProtectedRoute>
          } />
          
          {/* Patrimônio Routes */}
          <Route path="/patrimonio" element={
            <ProtectedRoute requiredPermissions={[{ area: 'patrimonio', level: 'read' }]}>
              <div>Página de Patrimônio</div>
            </ProtectedRoute>
          } />
          
          {/* Financeiro Routes */}
          <Route path="/financeiro" element={
            <ProtectedRoute requiredPermissions={[{ area: 'financeiro', level: 'read' }]}>
              <div>Página de Financeiro</div>
            </ProtectedRoute>
          } />

          {/* Default route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
