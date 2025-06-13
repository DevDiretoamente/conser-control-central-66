
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Award, 
  Calendar,
  User,
  Download,
  AlertTriangle
} from 'lucide-react';
import { DocumentoRH, Certificacao, DocumentoRHFilter, CertificacaoFilter } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import DocumentoRHForm from '@/components/rh/DocumentoRHForm';
import CertificacaoForm from '@/components/rh/CertificacaoForm';

const DocumentosRHPage: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoRH[]>([]);
  const [certificacoes, setCertificacoes] = useState<Certificacao[]>([]);
  const [filteredDocumentos, setFilteredDocumentos] = useState<DocumentoRH[]>([]);
  const [filteredCertificacoes, setFilteredCertificacoes] = useState<Certificacao[]>([]);
  const [documentoFilter, setDocumentoFilter] = useState<DocumentoRHFilter>({});
  const [certificacaoFilter, setCertificacaoFilter] = useState<CertificacaoFilter>({});
  
  const [isDocumentoFormOpen, setIsDocumentoFormOpen] = useState(false);
  const [isCertificacaoFormOpen, setIsCertificacaoFormOpen] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<DocumentoRH | null>(null);
  const [editingCertificacao, setEditingCertificacao] = useState<Certificacao | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyDocumentoFilters();
  }, [documentos, documentoFilter]);

  useEffect(() => {
    applyCertificacaoFilters();
  }, [certificacoes, certificacaoFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docs, certs] = await Promise.all([
        documentosRHService.getAllDocumentos(),
        documentosRHService.getAllCertificacoes()
      ]);
      setDocumentos(docs);
      setCertificacoes(certs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const applyDocumentoFilters = () => {
    let filtered = [...documentos];

    if (documentoFilter.search) {
      const search = documentoFilter.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.titulo.toLowerCase().includes(search) ||
        d.descricao.toLowerCase().includes(search)
      );
    }

    if (documentoFilter.tipo && documentoFilter.tipo !== 'all') {
      filtered = filtered.filter(d => d.tipo === documentoFilter.tipo);
    }

    if (documentoFilter.status && documentoFilter.status !== 'all') {
      filtered = filtered.filter(d => d.status === documentoFilter.status);
    }

    setFilteredDocumentos(filtered);
  };

  const applyCertificacaoFilters = () => {
    let filtered = [...certificacoes];

    if (certificacaoFilter.search) {
      const search = certificacaoFilter.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(search) ||
        c.entidadeCertificadora.toLowerCase().includes(search)
      );
    }

    if (certificacaoFilter.categoria && certificacaoFilter.categoria !== 'all') {
      filtered = filtered.filter(c => c.categoria === certificacaoFilter.categoria);
    }

    if (certificacaoFilter.status && certificacaoFilter.status !== 'all') {
      filtered = filtered.filter(c => c.status === certificacaoFilter.status);
    }

    setFilteredCertificacoes(filtered);
  };

  const getDocumentoTypeName = (tipo: DocumentoRH['tipo']) => {
    const typeMap = {
      contrato: 'Contrato',
      termo_confidencialidade: 'Termo de Confidencialidade',
      acordo_horario: 'Acordo de Horário',
      advertencia: 'Advertência',
      elogio: 'Elogio',
      avaliacao: 'Avaliação',
      ferias: 'Férias',
      atestado: 'Atestado',
      licenca: 'Licença',
      rescisao: 'Rescisão',
      outros: 'Outros'
    };
    return typeMap[tipo];
  };

  const getStatusBadge = (status: string, isVencido?: boolean) => {
    if (isVencido) {
      return <Badge className="bg-red-500">Vencido</Badge>;
    }
    
    const statusMap = {
      ativo: { label: 'Ativo', className: 'bg-green-500' },
      valida: { label: 'Válida', className: 'bg-green-500' },
      vencido: { label: 'Vencido', className: 'bg-red-500' },
      vencida: { label: 'Vencida', className: 'bg-red-500' },
      arquivado: { label: 'Arquivado', className: 'bg-gray-500' },
      em_renovacao: { label: 'Em Renovação', className: 'bg-yellow-500' }
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const checkVencimento = (dataVencimento?: string) => {
    if (!dataVencimento) return false;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Documentos RH & Certificações</h1>
          <p className="text-muted-foreground">
            Gerencie documentos e certificações dos funcionários
          </p>
        </div>
      </div>

      <Tabs defaultValue="documentos" className="w-full">
        <TabsList>
          <TabsTrigger value="documentos">
            <FileText className="mr-2 h-4 w-4" />
            Documentos RH
          </TabsTrigger>
          <TabsTrigger value="certificacoes">
            <Award className="mr-2 h-4 w-4" />
            Certificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documentos RH</CardTitle>
                <Button onClick={() => setIsDocumentoFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Documento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros para Documentos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar documentos..."
                    value={documentoFilter.search || ''}
                    onChange={(e) => setDocumentoFilter({ ...documentoFilter, search: e.target.value })}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={documentoFilter.tipo || 'all'}
                  onValueChange={(value) => setDocumentoFilter({ ...documentoFilter, tipo: value === 'all' ? undefined : value as DocumentoRH['tipo'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="termo_confidencialidade">Termo de Confidencialidade</SelectItem>
                    <SelectItem value="acordo_horario">Acordo de Horário</SelectItem>
                    <SelectItem value="advertencia">Advertência</SelectItem>
                    <SelectItem value="elogio">Elogio</SelectItem>
                    <SelectItem value="avaliacao">Avaliação</SelectItem>
                    <SelectItem value="ferias">Férias</SelectItem>
                    <SelectItem value="atestado">Atestado</SelectItem>
                    <SelectItem value="licenca">Licença</SelectItem>
                    <SelectItem value="rescisao">Rescisão</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={documentoFilter.status || 'all'}
                  onValueChange={(value) => setDocumentoFilter({ ...documentoFilter, status: value === 'all' ? undefined : value as DocumentoRH['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Documentos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocumentos.map((documento) => {
                  const isVencido = checkVencimento(documento.dataVencimento);
                  
                  return (
                    <Card key={documento.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{documento.titulo}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {getDocumentoTypeName(documento.tipo)}
                            </p>
                          </div>
                          {getStatusBadge(documento.status, isVencido)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{documento.descricao}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Data:</span>
                            <p className="font-medium">
                              {new Date(documento.dataDocumento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {documento.dataVencimento && (
                            <div>
                              <span className="text-muted-foreground">Vencimento:</span>
                              <p className="font-medium">
                                {new Date(documento.dataVencimento).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                        </div>

                        {isVencido && (
                          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-800">Documento vencido</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex items-center gap-2">
                            {documento.assinado && (
                              <Badge variant="outline">Assinado</Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingDocumento(documento);
                                setIsDocumentoFormOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificacoes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Certificações</CardTitle>
                <Button onClick={() => setIsCertificacaoFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Certificação
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Similar structure for certificações */}
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Sistema de certificações será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog do Formulário de Documento */}
      <Dialog open={isDocumentoFormOpen} onOpenChange={setIsDocumentoFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDocumento ? 'Editar Documento' : 'Novo Documento RH'}
            </DialogTitle>
          </DialogHeader>
          {/* DocumentoRHForm será implementado */}
          <div className="text-center py-8">
            <p className="text-muted-foreground">Formulário será implementado</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog do Formulário de Certificação */}
      <Dialog open={isCertificacaoFormOpen} onOpenChange={setIsCertificacaoFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCertificacao ? 'Editar Certificação' : 'Nova Certificação'}
            </DialogTitle>
          </DialogHeader>
          {/* CertificacaoForm será implementado */}
          <div className="text-center py-8">
            <p className="text-muted-foreground">Formulário será implementado</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentosRHPage;
