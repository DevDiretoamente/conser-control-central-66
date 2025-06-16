
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Award, Users, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { documentosRHService } from '@/services/documentosRHService';
import { funcionariosService } from '@/services/funcionariosService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  estatisticas: {
    totalDocumentos: number;
    documentosAtivos: number;
    documentosVencidos: number;
    totalCertificacoes: number;
    certificacoesValidas: number;
    certificacoesVencidas: number;
    funcionariosComDocumentos: number;
    vencimentosProximos: number;
  };
  documentosPorTipo: Array<{ name: string; value: number; color: string }>;
  certificacoesPorCategoria: Array<{ name: string; value: number; color: string }>;
  vencimentosPorMes: Array<{ mes: string; documentos: number; certificacoes: number }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
}

const CORES = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const DocumentosRHDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [documentos, certificacoes, funcionarios] = await Promise.all([
        documentosRHService.getAllDocumentos(),
        documentosRHService.getAllCertificacoes(),
        funcionariosService.getAll()
      ]);

      const dashboardData = processData(documentos, certificacoes, funcionarios);
      setData(dashboardData);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (
    documentos: DocumentoRH[],
    certificacoes: Certificacao[],
    funcionarios: Funcionario[]
  ): DashboardData => {
    const hoje = new Date();
    const em30Dias = new Date();
    em30Dias.setDate(hoje.getDate() + 30);

    // Estatísticas básicas
    const estatisticas = {
      totalDocumentos: documentos.length,
      documentosAtivos: documentos.filter(d => d.status === 'ativo').length,
      documentosVencidos: documentos.filter(d => d.status === 'vencido').length,
      totalCertificacoes: certificacoes.length,
      certificacoesValidas: certificacoes.filter(c => c.status === 'valida').length,
      certificacoesVencidas: certificacoes.filter(c => c.status === 'vencida').length,
      funcionariosComDocumentos: new Set([...documentos.map(d => d.funcionarioId), ...certificacoes.map(c => c.funcionarioId)]).size,
      vencimentosProximos: [
        ...documentos.filter(d => d.dataVencimento && new Date(d.dataVencimento) <= em30Dias && new Date(d.dataVencimento) >= hoje),
        ...certificacoes.filter(c => c.dataVencimento && new Date(c.dataVencimento) <= em30Dias && new Date(c.dataVencimento) >= hoje)
      ].length
    };

    // Documentos por tipo
    const tiposMap = new Map<string, number>();
    documentos.forEach(doc => {
      const count = tiposMap.get(doc.tipo) || 0;
      tiposMap.set(doc.tipo, count + 1);
    });
    
    const documentosPorTipo = Array.from(tiposMap.entries())
      .map(([tipo, value], index) => ({
        name: tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
        color: CORES[index % CORES.length]
      }))
      .sort((a, b) => b.value - a.value);

    // Certificações por categoria
    const categoriasMap = new Map<string, number>();
    certificacoes.forEach(cert => {
      const count = categoriasMap.get(cert.categoria) || 0;
      categoriasMap.set(cert.categoria, count + 1);
    });
    
    const certificacoesPorCategoria = Array.from(categoriasMap.entries())
      .map(([categoria, value], index) => ({
        name: categoria.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
        color: CORES[index % CORES.length]
      }))
      .sort((a, b) => b.value - a.value);

    // Vencimentos por mês (próximos 6 meses)
    const vencimentosPorMes = [];
    for (let i = 0; i < 6; i++) {
      const mes = new Date();
      mes.setMonth(mes.getMonth() + i);
      const mesNome = mes.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      const docVencimentos = documentos.filter(d => {
        if (!d.dataVencimento) return false;
        const venc = new Date(d.dataVencimento);
        return venc.getMonth() === mes.getMonth() && venc.getFullYear() === mes.getFullYear();
      }).length;
      
      const certVencimentos = certificacoes.filter(c => {
        if (!c.dataVencimento) return false;
        const venc = new Date(c.dataVencimento);
        return venc.getMonth() === mes.getMonth() && venc.getFullYear() === mes.getFullYear();
      }).length;
      
      vencimentosPorMes.push({
        mes: mesNome,
        documentos: docVencimentos,
        certificacoes: certVencimentos
      });
    }

    // Distribuição de status
    const statusDistribution = [
      { name: 'Documentos Ativos', value: estatisticas.documentosAtivos, color: '#10b981' },
      { name: 'Documentos Vencidos', value: estatisticas.documentosVencidos, color: '#ef4444' },
      { name: 'Certificações Válidas', value: estatisticas.certificacoesValidas, color: '#3b82f6' },
      { name: 'Certificações Vencidas', value: estatisticas.certificacoesVencidas, color: '#f59e0b' }
    ].filter(item => item.value > 0);

    return {
      estatisticas,
      documentosPorTipo,
      certificacoesPorCategoria,
      vencimentosPorMes,
      statusDistribution
    };
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando dashboard...</div>;
  }

  if (!data) {
    return <div className="flex justify-center p-8">Erro ao carregar dados</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.estatisticas.totalDocumentos}</div>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-green-500">{data.estatisticas.documentosAtivos} ativos</Badge>
              {data.estatisticas.documentosVencidos > 0 && (
                <Badge className="bg-red-500">{data.estatisticas.documentosVencidos} vencidos</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificações</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.estatisticas.totalCertificacoes}</div>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-blue-500">{data.estatisticas.certificacoesValidas} válidas</Badge>
              {data.estatisticas.certificacoesVencidas > 0 && (
                <Badge className="bg-orange-500">{data.estatisticas.certificacoesVencidas} vencidas</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.estatisticas.funcionariosComDocumentos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Com documentos/certificações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencimentos Próximos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.estatisticas.vencimentosProximos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Próximos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.documentosPorTipo}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {data.documentosPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Certificações por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Certificações por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.certificacoesPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vencimentos por Mês */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vencimentos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.vencimentosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="documentos" fill="#3b82f6" name="Documentos" />
                <Bar dataKey="certificacoes" fill="#10b981" name="Certificações" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentosRHDashboard;
