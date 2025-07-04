import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Award, Calendar, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { documentosRHService } from '@/services/documentosRHService';
import { funcionariosService } from '@/services/funcionariosService';
import { reportExportService } from '@/services/reportExportService';
import { toast } from 'sonner';

interface VencimentoProximo {
  tipo: 'documento' | 'certificacao';
  id: string;
  titulo: string;
  funcionario: string;
  dataVencimento: string;
  diasRestantes: number;
}

const RelatoriosRH: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoRH[]>([]);
  const [certificacoes, setCertificacoes] = useState<Certificacao[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [vencimentosProximos, setVencimentosProximos] = useState<VencimentoProximo[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filtroRelatorio, setFiltroRelatorio] = useState('geral');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docsData, certsData, funcData] = await Promise.all([
        documentosRHService.getAllDocumentos(),
        documentosRHService.getAllCertificacoes(),
        funcionariosService.getAll()
      ]);
      
      setDocumentos(docsData);
      setCertificacoes(certsData);
      setFuncionarios(funcData);
      
      processarVencimentos(docsData, certsData, funcData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  };

  const processarVencimentos = (docs: DocumentoRH[], certs: Certificacao[], funcs: Funcionario[]) => {
    const hoje = new Date();
    const proximosMes = new Date();
    proximosMes.setMonth(proximosMes.getMonth() + 1);

    const vencimentos: VencimentoProximo[] = [];

    // Processar documentos
    docs.forEach(doc => {
      if (doc.dataVencimento) {
        const vencimento = new Date(doc.dataVencimento);
        if (vencimento >= hoje && vencimento <= proximosMes) {
          const funcionario = funcs.find(f => f.id === doc.funcionarioId);
          const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          
          vencimentos.push({
            tipo: 'documento',
            id: doc.id,
            titulo: doc.titulo,
            funcionario: funcionario?.dadosPessoais.nome || 'N/A',
            dataVencimento: doc.dataVencimento,
            diasRestantes
          });
        }
      }
    });

    // Processar certificações
    certs.forEach(cert => {
      if (cert.dataVencimento) {
        const vencimento = new Date(cert.dataVencimento);
        if (vencimento >= hoje && vencimento <= proximosMes) {
          const funcionario = funcs.find(f => f.id === cert.funcionarioId);
          const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          
          vencimentos.push({
            tipo: 'certificacao',
            id: cert.id,
            titulo: cert.nome,
            funcionario: funcionario?.dadosPessoais.nome || 'N/A',
            dataVencimento: cert.dataVencimento,
            diasRestantes
          });
        }
      }
    });

    vencimentos.sort((a, b) => a.diasRestantes - b.diasRestantes);
    setVencimentosProximos(vencimentos);
  };

  const gerarRelatorioPDF = async (tipo: string) => {
    try {
      setExporting(true);
      
      const reportData = {
        title: `Relatório de ${tipo}`,
        documentos: tipo === 'documentos' || tipo === 'geral' ? documentos : undefined,
        certificacoes: tipo === 'certificacoes' || tipo === 'geral' ? certificacoes : undefined,
        funcionarios,
        filters: { tipo: filtroRelatorio }
      };
      
      await reportExportService.exportToPDF(reportData);
      toast.success(`Relatório PDF de ${tipo} gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setExporting(false);
    }
  };

  const gerarRelatorioExcel = async (tipo: string) => {
    try {
      setExporting(true);
      
      const reportData = {
        title: `Relatório de ${tipo}`,
        documentos: tipo === 'documentos' || tipo === 'geral' ? documentos : undefined,
        certificacoes: tipo === 'certificacoes' || tipo === 'geral' ? certificacoes : undefined,
        funcionarios,
        filters: { tipo: filtroRelatorio }
      };
      
      await reportExportService.exportToExcel(reportData);
      toast.success(`Relatório Excel de ${tipo} gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      toast.error('Erro ao gerar relatório Excel');
    } finally {
      setExporting(false);
    }
  };

  const gerarEstatisticas = async () => {
    try {
      setExporting(true);
      
      const stats = {
        'Total de Documentos': estatisticas.totalDocumentos,
        'Documentos Ativos': estatisticas.documentosAtivos,
        'Documentos Vencidos': estatisticas.documentosVencidos,
        'Total de Certificações': estatisticas.totalCertificacoes,
        'Certificações Válidas': estatisticas.certificacoesValidas,
        'Certificações Vencidas': estatisticas.certificacoesVencidas,
        'Próximos Vencimentos': estatisticas.vencimentosProximos,
        'Total de Funcionários': funcionarios.length
      };
      
      await reportExportService.exportStatistics(stats);
      toast.success('Relatório de estatísticas gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar estatísticas:', error);
      toast.error('Erro ao gerar relatório de estatísticas');
    } finally {
      setExporting(false);
    }
  };

  const gerarRelatorio = (tipo: string) => {
    toast.success(`Relatório de ${tipo} gerado com sucesso!`);
    // Aqui seria implementada a lógica real de geração de relatório
  };

  const estatisticas = {
    totalDocumentos: documentos.length,
    documentosAtivos: documentos.filter(d => d.status === 'ativo').length,
    documentosVencidos: documentos.filter(d => d.status === 'vencido').length,
    totalCertificacoes: certificacoes.length,
    certificacoesValidas: certificacoes.filter(c => c.status === 'valida').length,
    certificacoesVencidas: certificacoes.filter(c => c.status === 'vencida').length,
    vencimentosProximos: vencimentosProximos.length
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando relatórios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios RH</h2>
          <p className="text-muted-foreground">
            Acompanhe estatísticas e gere relatórios dos documentos e certificações
          </p>
        </div>
        <Select value={filtroRelatorio} onValueChange={setFiltroRelatorio}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="geral">Relatório Geral</SelectItem>
            <SelectItem value="documentos">Apenas Documentos</SelectItem>
            <SelectItem value="certificacoes">Apenas Certificações</SelectItem>
            <SelectItem value="vencimentos">Próximos Vencimentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalDocumentos}</div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.documentosAtivos} ativos, {estatisticas.documentosVencidos} vencidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificações</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalCertificacoes}</div>
            <p className="text-xs text-muted-foreground">
              {estatisticas.certificacoesValidas} válidas, {estatisticas.certificacoesVencidas} vencidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funcionarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de funcionários cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Vencimentos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.vencimentosProximos}</div>
            <p className="text-xs text-muted-foreground">
              Nos próximos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vencimentos Próximos */}
      {vencimentosProximos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Vencimentos Próximos (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vencimentosProximos.map((item) => (
                <div key={`${item.tipo}-${item.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.tipo === 'documento' ? 
                      <FileText className="h-4 w-4 text-blue-500" /> : 
                      <Award className="h-4 w-4 text-green-500" />
                    }
                    <div>
                      <p className="font-medium">{item.titulo}</p>
                      <p className="text-sm text-muted-foreground">{item.funcionario}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.diasRestantes <= 7 ? "destructive" : "secondary"}>
                      {item.diasRestantes} dias
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.dataVencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de Relatórios com Exportação */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar e Exportar Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => gerarRelatorioPDF('Documentos por Funcionário')}
                disabled={exporting}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">PDF - Documentos</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => gerarRelatorioExcel('Documentos por Funcionário')}
                disabled={exporting}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => gerarRelatorioPDF('Certificações por Categoria')}
                disabled={exporting}
              >
                <Award className="h-6 w-6" />
                <span className="text-sm">PDF - Certificações</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => gerarRelatorioExcel('Certificações por Categoria')}
                disabled={exporting}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => gerarRelatorioPDF('Relatório Completo')}
                disabled={exporting}
              >
                <Download className="h-6 w-6" />
                <span className="text-sm">PDF - Completo</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => gerarRelatorioExcel('Relatório Completo')}
                disabled={exporting}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center gap-2"
                onClick={gerarEstatisticas}
                disabled={exporting}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Estatísticas</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => gerarRelatorioPDF('Vencimentos Próximos')}
                disabled={exporting}
              >
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Vencimentos</span>
              </Button>
            </div>
          </div>
          
          {exporting && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Gerando relatório...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosRH;
