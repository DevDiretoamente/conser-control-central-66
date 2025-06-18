
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SecureProtectedRoute from './components/auth/SecureProtectedRoute';
import Dashboard from './pages/Dashboard';
import SecureLogin from './components/auth/SecureLogin';
import AppLayout from './components/layout/AppLayout';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import InactiveAccount from './pages/InactiveAccount';

// Main content pages
import ListaFuncionarios from './pages/funcionarios/ListaFuncionarios';
import NovoFuncionario from './pages/funcionarios/NovoFuncionario';
import DetalheFuncionario from './pages/funcionarios/DetalheFuncionario';
import EditarFuncionario from './pages/funcionarios/EditarFuncionario';
import ExamesMedicosPage from './pages/funcionarios/ExamesMedicosPage';
import ObrasPage from './pages/obras/Obras';
import FrotaPage from './pages/frota/Frota';
import PatrimonioPage from './pages/patrimonio/Patrimonio';
import FinanceiroPage from './pages/financeiro/Financeiro';

// RH Pages
import CartaoPontoPage from './pages/rh/CartaoPontoPage';
import CartaoPontoDetailPage from './pages/rh/CartaoPontoDetailPage';
import RelatoriosPage from './pages/rh/RelatoriosPage';
import RHPage from './pages/rh/RHPage';

// Configuration pages
import ConfiguracoesPage from './pages/configuracoes/Configuracoes';
import FuncoesPage from './pages/configuracoes/Funcoes';
import DetalheFuncaoPage from './pages/configuracoes/DetalheFuncao';
import EditarFuncaoPage from './pages/configuracoes/EditarFuncao';
import ExamesPage from './pages/configuracoes/Exames';
import DocumentosOcupacionaisPage from './pages/configuracoes/DocumentosOcupacionais';
import SetoresPage from './pages/configuracoes/Setores';
import ClinicasPage from './pages/configuracoes/Clinicas';
import EmailsPage from './pages/configuracoes/Emails';
import UsuariosPage from './pages/configuracoes/Usuarios';
import BeneficiosPage from './pages/configuracoes/Beneficios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/secure-login" element={<SecureLogin />} />
        <Route path="/login" element={<Navigate to="/secure-login" replace />} />
        <Route path="/acesso-negado" element={<AccessDenied />} />
        <Route path="/conta-inativa" element={<InactiveAccount />} />
        
        <Route path="/" element={
          <SecureProtectedRoute>
            <AppLayout />
          </SecureProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Funcionários */}
          <Route path="funcionarios">
            <Route index element={
              <SecureProtectedRoute requiredResource="funcionarios" requiredAction="read">
                <ListaFuncionarios />
              </SecureProtectedRoute>
            } />
            <Route path="novo" element={
              <SecureProtectedRoute requiredResource="funcionarios" requiredAction="create">
                <NovoFuncionario />
              </SecureProtectedRoute>
            } />
            <Route path=":id" element={
              <SecureProtectedRoute requiredResource="funcionarios" requiredAction="read">
                <DetalheFuncionario />
              </SecureProtectedRoute>
            } />
            <Route path=":id/editar" element={
              <SecureProtectedRoute requiredResource="funcionarios" requiredAction="update">
                <EditarFuncionario />
              </SecureProtectedRoute>
            } />
            <Route path="exames" element={
              <SecureProtectedRoute requiredResource="exames" requiredAction="read">
                <ExamesMedicosPage />
              </SecureProtectedRoute>
            } />
          </Route>
          
          {/* Obras */}
          <Route path="obras" element={
            <SecureProtectedRoute requiredResource="obras" requiredAction="read">
              <ObrasPage />
            </SecureProtectedRoute>
          } />
          
          {/* Frota */}
          <Route path="frota" element={
            <SecureProtectedRoute requiredResource="frota" requiredAction="read">
              <FrotaPage />
            </SecureProtectedRoute>
          } />
          
          {/* Patrimônio */}
          <Route path="patrimonio" element={
            <SecureProtectedRoute requiredResource="patrimonio" requiredAction="read">
              <PatrimonioPage />
            </SecureProtectedRoute>
          } />
          
          {/* Financeiro */}
          <Route path="financeiro" element={
            <SecureProtectedRoute requiredResource="financeiro" requiredAction="read">
              <FinanceiroPage />
            </SecureProtectedRoute>
          } />
          
          {/* RH */}
          <Route path="rh">
            <Route index element={
              <SecureProtectedRoute requiredResource="rh" requiredAction="read">
                <RHPage />
              </SecureProtectedRoute>
            } />
            <Route path="cartao-ponto">
              <Route index element={
                <SecureProtectedRoute requiredResource="cartaoponto" requiredAction="read">
                  <CartaoPontoPage />
                </SecureProtectedRoute>
              } />
              <Route path=":id" element={
                <SecureProtectedRoute requiredResource="cartaoponto" requiredAction="read">
                  <CartaoPontoDetailPage />
                </SecureProtectedRoute>
              } />
            </Route>
            <Route path="relatorios" element={
              <SecureProtectedRoute requiredResource="rh" requiredAction="read">
                <RelatoriosPage />
              </SecureProtectedRoute>
            } />
          </Route>
          
          {/* Configurações */}
          <Route path="configuracoes">
            <Route index element={
              <SecureProtectedRoute requiredResource="configuracoes" requiredAction="read">
                <ConfiguracoesPage />
              </SecureProtectedRoute>
            } />
            <Route path="usuarios" element={
              <SecureProtectedRoute requiredRole="admin">
                <UsuariosPage />
              </SecureProtectedRoute>
            } />
            <Route path="emails" element={
              <SecureProtectedRoute requiredResource="emails" requiredAction="read">
                <EmailsPage />
              </SecureProtectedRoute>
            } />
          </Route>
          
          {/* Additional Configuration Routes */}
          <Route path="funcoes">
            <Route index element={
              <SecureProtectedRoute requiredResource="funcoes" requiredAction="read">
                <FuncoesPage />
              </SecureProtectedRoute>
            } />
            <Route path=":id" element={
              <SecureProtectedRoute requiredResource="funcoes" requiredAction="read">
                <DetalheFuncaoPage />
              </SecureProtectedRoute>
            } />
            <Route path=":id/editar" element={
              <SecureProtectedRoute requiredResource="funcoes" requiredAction="update">
                <EditarFuncaoPage />
              </SecureProtectedRoute>
            } />
          </Route>
          <Route path="setores" element={
            <SecureProtectedRoute requiredResource="setores" requiredAction="read">
              <SetoresPage />
            </SecureProtectedRoute>
          } />
          <Route path="exames" element={
            <SecureProtectedRoute requiredResource="exames" requiredAction="read">
              <ExamesPage />
            </SecureProtectedRoute>
          } />
          <Route path="beneficios" element={
            <SecureProtectedRoute requiredResource="beneficios" requiredAction="read">
              <BeneficiosPage />
            </SecureProtectedRoute>
          } />
          <Route path="clinicas" element={
            <SecureProtectedRoute requiredResource="clinicas" requiredAction="read">
              <ClinicasPage />
            </SecureProtectedRoute>
          } />
          <Route path="documentos-ocupacionais" element={
            <SecureProtectedRoute requiredResource="documentos" requiredAction="read">
              <DocumentosOcupacionaisPage />
            </SecureProtectedRoute>
          } />
          
          {/* Redirect root to dashboard */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
