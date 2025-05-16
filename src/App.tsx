
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
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
        <Route path="/login" element={<Login />} />
        <Route path="/acesso-negado" element={<AccessDenied />} />
        <Route path="/conta-inativa" element={<InactiveAccount />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Funcionários */}
          <Route path="funcionarios">
            <Route index element={<ListaFuncionarios />} />
            <Route path="novo" element={<NovoFuncionario />} />
            <Route path=":id" element={<DetalheFuncionario />} />
            <Route path=":id/editar" element={<EditarFuncionario />} />
            <Route path="exames" element={<ExamesMedicosPage />} />
          </Route>
          
          {/* Obras */}
          <Route path="obras" element={<ObrasPage />} />
          
          {/* Frota */}
          <Route path="frota" element={<FrotaPage />} />
          
          {/* Patrimônio */}
          <Route path="patrimonio" element={<PatrimonioPage />} />
          
          {/* Financeiro */}
          <Route path="financeiro" element={<FinanceiroPage />} />
          
          {/* RH */}
          <Route path="rh">
            <Route index element={<RHPage />} />
            <Route path="cartao-ponto">
              <Route index element={<CartaoPontoPage />} />
              <Route path=":id" element={<CartaoPontoDetailPage />} />
            </Route>
            <Route path="relatorios" element={<RelatoriosPage />} />
          </Route>
          
          {/* Configurações */}
          <Route path="configuracoes">
            <Route index element={<ConfiguracoesPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="emails" element={<EmailsPage />} />
          </Route>
          
          {/* Additional Configuration Routes */}
          <Route path="funcoes">
            <Route index element={<FuncoesPage />} />
            <Route path=":id" element={<DetalheFuncaoPage />} />
            <Route path=":id/editar" element={<EditarFuncaoPage />} />
          </Route>
          <Route path="setores" element={<SetoresPage />} />
          <Route path="exames" element={<ExamesPage />} />
          <Route path="beneficios" element={<BeneficiosPage />} />
          <Route path="clinicas" element={<ClinicasPage />} />
          <Route path="documentos-ocupacionais" element={<DocumentosOcupacionaisPage />} />
          
          {/* Redirect root to dashboard */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
