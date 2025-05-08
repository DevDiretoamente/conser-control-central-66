
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="funcionarios" element={<ListaFuncionarios />} />
            <Route path="funcionarios/novo" element={<NovoFuncionario />} />
            <Route path="funcionarios/:id" element={<DetalheFuncionario />} />
            <Route path="funcionarios/:id/editar" element={<EditarFuncionario />} />
            <Route path="funcionarios/:id/exames-medicos" element={<ExamesMedicosPage />} />
            <Route path="obras" element={<ObrasPage />} />
            <Route path="frota" element={<FrotaPage />} />
            <Route path="patrimonio" element={<PatrimonioPage />} />
            <Route path="financeiro" element={<FinanceiroPage />} />
            <Route path="configuracoes" element={<ConfiguracoesPage />} />
            <Route path="configuracoes/clinicas" element={<Clinicas />} />
            <Route path="configuracoes/documentos-ocupacionais" element={<DocumentosOcupacionaisPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
