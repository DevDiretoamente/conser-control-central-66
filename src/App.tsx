import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import FuncionariosPage from './pages/FuncionariosPage';
import DetalheFuncionario from './pages/DetalheFuncionario';
import EditarFuncionario from './pages/EditarFuncionario';
import FuncoesPage from './pages/FuncoesPage';
import SetoresPage from './pages/SetoresPage';
import ExamesMedicosPage from './pages/ExamesMedicosPage';
import Obras from './pages/Obras';
import { Permission } from './types/auth';
import AppSidebar from './components/layout/AppSidebar';
import ClinicasPage from './pages/ClinicasPage';
import RHPage from './pages/RHPage';
import CartaoPontoPage from "./pages/rh/CartaoPonto";

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
      <div className="flex h-screen bg-gray-100">
        {/* Authentication check is not needed for the sidebar as it handles its own navigation based on user roles */}
        <AppSidebar />

        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute requiredPermissions={[{ area: 'rh', level: 'read' }]}><Dashboard /></ProtectedRoute>} />

            {/* RH Routes */}
            <Route path="/rh" element={<ProtectedRoute requiredPermissions={[{ area: 'rh', level: 'read' }]}><RHPage /></ProtectedRoute>} />
            <Route path="/funcionarios" element={<ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'read' }]}><FuncionariosPage /></ProtectedRoute>} />
            <Route path="/funcoes" element={<ProtectedRoute requiredPermissions={[{ area: 'funcoes', level: 'read' }]}><FuncoesPage /></ProtectedRoute>} />
            <Route path="/setores" element={<ProtectedRoute requiredPermissions={[{ area: 'setores', level: 'read' }]}><SetoresPage /></ProtectedRoute>} />
            <Route path="/clinicas" element={<ProtectedRoute requiredPermissions={[{ area: 'clinicas', level: 'read' }]}><ClinicasPage /></ProtectedRoute>} />
            <Route path="/funcionarios/exames" element={<ProtectedRoute requiredPermissions={[{ area: 'exames', level: 'read'}]}><ExamesMedicosPage /></ProtectedRoute>} />
            <Route path="/funcionarios/:funcionarioId" element={<ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'read'}]}><DetalheFuncionario /></ProtectedRoute>} />
            <Route path="/funcionarios/:funcionarioId/edit" element={<ProtectedRoute requiredPermissions={[{ area: 'funcionarios', level: 'write'}]}><EditarFuncionario /></ProtectedRoute>} />
            
            {/* Add route for cartão ponto */}
            <Route path="/rh/cartao-ponto" element={<ProtectedRoute requiredPermissions={[{ area: 'cartaoponto', level: 'read'}]}><CartaoPontoPage /></ProtectedRoute>} />
            
            {/* Obras Routes */}
            <Route path="/obras" element={<ProtectedRoute requiredPermissions={[{ area: 'obras', level: 'read'}]}><Obras /></ProtectedRoute>} />

            {/* Add more routes here, protected as needed */}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
