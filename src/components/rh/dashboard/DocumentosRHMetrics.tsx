
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Award, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { documentosService } from '@/services/documentosService';
import { certificacoesService } from '@/services/certificacoesService';
import { validationService } from '@/services/validationService';

interface Metrics {
  documentos: {
    total: number;
    ativos: number;
    vencidos: number;
    vencendoEm30Dias: number;
    porTipo: Record<string, number>;
    assinados: number;
  };
  certificacoes: {
    total: number;
    validas: number;
    vencidas: number;
    vencendoEm30Dias: number;
    porCategoria: Record<string, number>;
    emRenovacao: number;
  };
  conformidade: {
    funcionariosCompletos: number;
    funcionariosIncompletos: number;
    percentualConformidade: number;
    problemasConformidade: string[];
  };
}

const DocumentosRHMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      // Carregar dados
      const [documentos, certificacoes] = await Promise.all([
        documentosService.getAll(),
        certificacoesService.getAll()
      ]);

      // Mock funcionários (substitua pela implementação real)
      const mockFuncionarios: Funcionario[] = [
        { id: '1', dadosPessoais: { nome: 'João Silva', email: 'joao@test.com', telefone: '11999999999' } },
        { id: '2', dadosPessoais: { nome: 'Maria Santos', email: 'maria@test.com', telefone: '11888888888' } }
      ] as Funcionario[];

      setFuncionarios(mockFuncionarios);

      // Calcular métricas
      const calculatedMetrics = calculateMetrics(documentos, certificacoes, mockFuncionarios);
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (documentos: DocumentoRH[], certificacoes: Certificacao[], funcionarios: Funcionario[]): Metrics => {
    const hoje = new Date();
    const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Métricas de documentos
    const documentosVencidos = documentos.filter(d => 
      d.dataVencimento && new Date(d.dataVencimento) < hoje
    );
    
    const documentosVencendoEm30Dias = documentos.filter(d => 
      d.dataVencimento && 
      new Date(d.dataVencimento) <= em30Dias && 
      new Date(d.dataVencimento) >= hoje
    );

    const documentosPorTipo = documentos.reduce((acc, doc) => {
      acc[doc.tipo] = (acc[doc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Métricas de certificações
    const certificacoesVencidas = certificacoes.filter(c => 
      c.dataVencimento && new Date(c.dataVencimento) < hoje
    );
    
    const certificacoesVencendoEm30Dias = certificacoes.filter(c => 
      c.dataVencimento && 
      new Date(c.dataVencimento) <= em30Dias && 
      new Date(c.dataVencimento) >= hoje
    );

    const certificacoesPorCategoria = certificacoes.reduce((acc, cert) => {
      acc[cert.categoria] = (acc[cert.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Métricas de conformidade
    let funcionariosCompletos = 0;
    const problemasConformidade: string[] = [];

    funcionarios.forEach(funcionario => {
      const docsFuncionario = documentos.filter(d => d.funcionarioId === funcionario.id);
      const certsFuncionario = certificacoes.filter(c => c.funcionarioId === funcionario.id);
      
      const validacao = validationService.validateComplianceChecklist(
        funcionario.id, 
        docsFuncionario, 
        certsFuncionario
      );

      if (validacao.isValid) {
        funcionariosCompletos++;
      } else {
        problemasConformidade.push(...validacao.errors);
      }
    });

    const percentualConformidade = funcionarios.length > 0 
      ? Math.round((funcionariosCompletos / funcionarios.length) * 100)
      : 0;

    return {
      documentos: {
        total: documentos.length,
        ativos: documentos.filter(d => d.status === 'ativo').length,
        vencidos: documentosVencidos.length,
        vencendoEm30Dias: documentosVencendoEm30Dias.length,
        porTipo: documentosPorTipo,
        assinados: documentos.filter(d => d.assinado).length
      },
      certificacoes: {
        total: certificacoes.length,
        validas: certificacoes.filter(c => c.status === 'valida').length,
        vencidas: certificacoesVencidas.length,
        vencendoEm30Dias: certificacoesVencendoEm30Dias.length,
        porCategoria: certificacoesPorCategoria,
        emRenovacao: certificacoes.filter(c => c.status === 'em_renovacao').length
      },
      conformidade: {
        funcionariosCompletos,
        funcionariosIncompletos: funcionarios.length - funcionariosCompletos,
        percentualConformidade,
        problemasConformidade: [...new Set(problemasConformidade)]
      }
    };
  };

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.documentos.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.documentos.assinados} assinados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificações</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.certificacoes.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.certificacoes.validas} válidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics.documentos.vencidos + metrics.certificacoes.vencidas}
            </div>
            <p className="text-xs text-muted-foreground">
              Requer atenção imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.conformidade.percentualConformidade}%
            </div>
            <Progress value={metrics.conformidade.percentualConformidade} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs com Detalhes */}
      <Tabs defaultValue="documentos" className="w-full">
        <TabsList>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="certificacoes">Certificações</TabsTrigger>
          <TabsTrigger value="conformidade">Conformidade</TabsTrigger>
        </TabsList>

        <TabsContent value="documentos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status dos Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Ativos</span>
                    <Badge variant="default">{metrics.documentos.ativos}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Vencidos</span>
                    <Badge variant="destructive">{metrics.documentos.vencidos}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Vencendo em 30 dias</span>
                    <Badge variant="secondary">{metrics.documentos.vencendoEm30Dias}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.documentos.porTipo).map(([tipo, count]) => (
                    <div key={tipo} className="flex justify-between text-sm">
                      <span className="capitalize">{tipo.replace('_', ' ')}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificacoes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status das Certificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Válidas</span>
                    <Badge variant="default">{metrics.certificacoes.validas}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Vencidas</span>
                    <Badge variant="destructive">{metrics.certificacoes.vencidas}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Em Renovação</span>
                    <Badge variant="secondary">{metrics.certificacoes.emRenovacao}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.certificacoes.porCategoria).map(([categoria, count]) => (
                    <div key={categoria} className="flex justify-between text-sm">
                      <span className="capitalize">{categoria}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conformidade" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Funcionários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Conformes</span>
                    <Badge variant="default">{metrics.conformidade.funcionariosCompletos}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendentes</span>
                    <Badge variant="destructive">{metrics.conformidade.funcionariosIncompletos}</Badge>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Percentual de Conformidade</span>
                      <span>{metrics.conformidade.percentualConformidade}%</span>
                    </div>
                    <Progress value={metrics.conformidade.percentualConformidade} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {metrics.conformidade.problemasConformidade.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Problemas Identificados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {metrics.conformidade.problemasConformidade.slice(0, 5).map((problema, index) => (
                      <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        {problema}
                      </div>
                    ))}
                    {metrics.conformidade.problemasConformidade.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{metrics.conformidade.problemasConformidade.length - 5} outros problemas
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentosRHMetrics;
