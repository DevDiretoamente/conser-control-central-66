
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FuncionariosPage from './pages/funcionarios/ListaFuncionarios';
import DetalheFuncionario from './pages/funcionarios/DetalheFuncionario';
import EditarFuncionario from './pages/funcionarios/EditarFuncionario';
import FuncoesPage from './pages/configuracoes/Funcoes';
import SetoresPage from './pages/configuracoes/Setores';
import ExamesMedicosPage from './pages/funcionarios/ExamesMedicosPage';
import Obras from './pages/obras/Obras';
import { Permission } from './types/auth';
import ClinicasPage from './pages/configuracoes/Clinicas';
import RHPage from './pages/rh/RHPage';
import CartaoPontoPage from "./pages/rh/CartaoPonto";
import AppLayout from './components/layout/AppLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions: Permission[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermissions }) => {
  const { isAuthenticated, hasSpecificPermission, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>; // You can replace this with a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const hasRequiredPermissions = requiredPermissions.every(permission =>
    hasSpecificPermission(permission.area, permission.level)
  );

  if (!hasRequiredPermissions) {
    return <div>Acesso negado.</div>; // Or redirect to a "Not Authorized" page
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
          <Route path="/funcionarios" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'read' }]}>
              <FuncionariosPage />
            </ProtectedRoute>
          } />
          <Route path="/funcoes" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcoes', level: 'read' }]}>
              <FuncoesPage />
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
          <Route path="/funcionarios/exames" element={
            <ProtectedRoute requiredPermissions={[{ area: 'exames', level: 'read' }]}>
              <ExamesMedicosPage />
            </ProtectedRoute>
          } />
          <Route path="/funcionarios/:funcionarioId" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'read' }]}>
              <DetalheFuncionario />
            </ProtectedRoute>
          } />
          <Route path="/funcionarios/:funcionarioId/edit" element={
            <ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'write' }]}>
              <EditarFuncionario />
            </ProtectedRoute>
          } />
          
          {/* Add route for cartão ponto */}
          <Route path="/rh/cartao-ponto" element={
            <ProtectedRoute requiredPermissions={[{ area: 'cartaoponto', level: 'read' }]}>
              <CartaoPontoPage />
            </ProtectedRoute>
          } />
          
          {/* Obras Routes */}
          <Route path="/obras" element={
            <ProtectedRoute requiredPermissions={[{ area: 'obras', level: 'read' }]}>
              <Obras />
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
