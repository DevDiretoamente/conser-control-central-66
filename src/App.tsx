import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeProvider'
import { Toaster } from './components/ui/sonner'

// Layout
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import Index from './pages/Index'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import AccessDenied from './pages/AccessDenied'
import InactiveAccount from './pages/InactiveAccount'

// RH Pages
import CartaoPontoPage from './pages/rh/CartaoPontoPage'
import CartaoPontoDetailPage from './pages/rh/CartaoPontoDetailPage'
import RelatoriosPage from './pages/rh/RelatoriosPage'

// Funcionários
import ListaFuncionarios from './pages/funcionarios/ListaFuncionarios'
import NovoFuncionario from './pages/funcionarios/NovoFuncionario'
import EditarFuncionario from './pages/funcionarios/EditarFuncionario'
import DetalheFuncionario from './pages/funcionarios/DetalheFuncionario'
import ExamesMedicosPage from './pages/funcionarios/ExamesMedicosPage'

// Configurações
import Funcoes from './pages/configuracoes/Funcoes'
import DetalheFuncao from './pages/configuracoes/DetalheFuncao'
import EditarFuncao from './pages/configuracoes/EditarFuncao'
import Setores from './pages/configuracoes/Setores'
import Clinicas from './pages/configuracoes/Clinicas'
import Exames from './pages/configuracoes/Exames'
import Usuarios from './pages/configuracoes/Usuarios'
import Emails from './pages/configuracoes/Emails'
import Beneficios from './pages/configuracoes/Beneficios'

// Módulos
import Frota from './pages/frota/Frota'
import Obras from './pages/obras/Obras'
import Patrimonio from './pages/patrimonio/Patrimonio'
import Financeiro from './pages/financeiro/Financeiro'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />

            {/* RH */}
            <Route path="rh/cartao-ponto" element={
              <ProtectedRoute permission="cartaoponto" level="read">
                <CartaoPontoPage />
              </ProtectedRoute>
            } />
            <Route path="rh/cartao-ponto/:id" element={
              <ProtectedRoute permission="cartaoponto" level="read">
                <CartaoPontoDetailPage />
              </ProtectedRoute>
            } />
            <Route path="rh/relatorios" element={
              <ProtectedRoute permission="cartaoponto" level="read">
                <RelatoriosPage />
              </ProtectedRoute>
            } />

            {/* Funcionários */}
            <Route path="funcionarios" element={
              <ProtectedRoute permission="funcionarios" level="read">
                <ListaFuncionarios />
              </ProtectedRoute>
            } />
            <Route path="funcionarios/novo" element={
              <ProtectedRoute permission="funcionarios" level="create">
                <NovoFuncionario />
              </ProtectedRoute>
            } />
            <Route path="funcionarios/:id" element={
              <ProtectedRoute permission="funcionarios" level="read">
                <DetalheFuncionario />
              </ProtectedRoute>
            } />
            <Route path="funcionarios/:id/editar" element={
              <ProtectedRoute permission="funcionarios" level="write">
                <EditarFuncionario />
              </ProtectedRoute>
            } />
            <Route path="funcionarios/exames" element={
              <ProtectedRoute permission="exames" level="read">
                <ExamesMedicosPage />
              </ProtectedRoute>
            } />

            {/* Outras rotas existentes */}
            <Route path="obras" element={
              <ProtectedRoute permission="obras" level="read">
                <Obras />
              </ProtectedRoute>
            } />
            <Route path="frota" element={
              <ProtectedRoute permission="frota" level="read">
                <Frota />
              </ProtectedRoute>
            } />
            <Route path="patrimonio" element={
              <ProtectedRoute permission="patrimonio" level="read">
                <Patrimonio />
              </ProtectedRoute>
            } />
            <Route path="financeiro" element={
              <ProtectedRoute permission="financeiro" level="read">
                <Financeiro />
              </ProtectedRoute>
            } />
            
            {/* Configurações */}
            <Route path="funcoes" element={
              <ProtectedRoute permission="funcoes" level="read">
                <Funcoes />
              </ProtectedRoute>
            } />
            <Route path="funcoes/:id" element={
              <ProtectedRoute permission="funcoes" level="read">
                <DetalheFuncao />
              </ProtectedRoute>
            } />
            <Route path="funcoes/:id/editar" element={
              <ProtectedRoute permission="funcoes" level="write">
                <EditarFuncao />
              </ProtectedRoute>
            } />
            <Route path="setores" element={
              <ProtectedRoute permission="setores" level="read">
                <Setores />
              </ProtectedRoute>
            } />
            <Route path="clinicas" element={
              <ProtectedRoute permission="clinicas" level="read">
                <Clinicas />
              </ProtectedRoute>
            } />
            <Route path="exames" element={
              <ProtectedRoute permission="exames" level="read">
                <Exames />
              </ProtectedRoute>
            } />
            <Route path="configuracoes/usuarios" element={
              <ProtectedRoute permission="usuarios" level="read">
                <Usuarios />
              </ProtectedRoute>
            } />
            <Route path="configuracoes/emails" element={
              <ProtectedRoute permission="emails" level="read">
                <Emails />
              </ProtectedRoute>
            } />
            <Route path="beneficios" element={
              <ProtectedRoute permission="cartaoponto" level="manage">
                <Beneficios />
              </ProtectedRoute>
            } />

            {/* Módulos */}
            <Route path="obras" element={
              <ProtectedRoute permission="obras" level="read">
                <Obras />
              </ProtectedRoute>
            } />
            <Route path="frota" element={
              <ProtectedRoute permission="frota" level="read">
                <Frota />
              </ProtectedRoute>
            } />
            <Route path="patrimonio" element={
              <ProtectedRoute permission="patrimonio" level="read">
                <Patrimonio />
              </ProtectedRoute>
            } />
            <Route path="financeiro" element={
              <ProtectedRoute permission="financeiro" level="read">
                <Financeiro />
              </ProtectedRoute>
            } />

            {/* Access Denied */}
            <Route path="acesso-negado" element={<AccessDenied />} />
            <Route path="conta-inativa" element={<InactiveAccount />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
