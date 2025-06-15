import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FileText, Award, BarChart3 } from 'lucide-react';
import { DocumentoRH, Certificacao, DocumentoRHFilter, CertificacaoFilter } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import DocumentoRHForm from '@/components/rh/DocumentoRHForm';
import CertificacaoForm from '@/components/rh/CertificacaoForm';
import DocumentosTab from '@/components/rh/tabs/DocumentosTab';
import CertificacoesTab from '@/components/rh/tabs/CertificacoesTab';
import RelatoriosRH from '@/components/rh/RelatoriosRH';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const PAGE_SIZE = 20;

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
  const [docPage, setDocPage] = useState(1);
  const [certPage, setCertPage] = useState(1);

  const debouncedDocumentoSearch = useDebouncedValue(documentoFilter?.search || '', 300);
  const debouncedCertificacaoSearch = useDebouncedValue(certificacaoFilter?.search || '', 300);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyDocumentoFilters();
  }, [documentos, debouncedDocumentoSearch, documentoFilter.tipo, documentoFilter.status]);

  useEffect(() => {
    applyCertificacaoFilters();
  }, [certificacoes, debouncedCertificacaoSearch, certificacaoFilter.categoria, certificacaoFilter.status]);

  useEffect(() => { setDocPage(1); }, [debouncedDocumentoSearch, documentoFilter.tipo, documentoFilter.status]);
  useEffect(() => { setCertPage(1); }, [debouncedCertificacaoSearch, certificacaoFilter.categoria, certificacaoFilter.status]);

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

    if (debouncedDocumentoSearch) {
      const search = debouncedDocumentoSearch.toLowerCase();
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

    if (debouncedCertificacaoSearch) {
      const search = debouncedCertificacaoSearch.toLowerCase();
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

  const handleDocumentoSubmit = async (data: any) => {
    try {
      if (editingDocumento) {
        await documentosRHService.updateDocumento(editingDocumento.id, data);
        toast.success('Documento atualizado com sucesso');
      } else {
        await documentosRHService.createDocumento(data);
        toast.success('Documento criado com sucesso');
      }
      setIsDocumentoFormOpen(false);
      setEditingDocumento(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      toast.error('Erro ao salvar documento');
    }
  };

  const handleCertificacaoSubmit = async (data: any) => {
    try {
      if (editingCertificacao) {
        await documentosRHService.updateCertificacao(editingCertificacao.id, data);
        toast.success('Certificação atualizada com sucesso');
      } else {
        await documentosRHService.createCertificacao(data);
        toast.success('Certificação criada com sucesso');
      }
      setIsCertificacaoFormOpen(false);
      setEditingCertificacao(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar certificação:', error);
      toast.error('Erro ao salvar certificação');
    }
  };

  const handleEditDocument = (documento: DocumentoRH) => {
    setEditingDocumento(documento);
    setIsDocumentoFormOpen(true);
  };

  const handleEditCertification = (certificacao: Certificacao) => {
    setEditingCertificacao(certificacao);
    setIsCertificacaoFormOpen(true);
  };

  const paginatedDocumentos = filteredDocumentos.slice((docPage - 1) * PAGE_SIZE, docPage * PAGE_SIZE);
  const totalDocPages = Math.ceil(filteredDocumentos.length / PAGE_SIZE);
  const paginatedCertificacoes = filteredCertificacoes.slice((certPage - 1) * PAGE_SIZE, certPage * PAGE_SIZE);
  const totalCertPages = Math.ceil(filteredCertificacoes.length / PAGE_SIZE);

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
          <TabsTrigger value="relatorios">
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          <DocumentosTab
            documentos={documentos}
            filteredDocumentos={paginatedDocumentos}
            documentoFilter={documentoFilter}
            setDocumentoFilter={setDocumentoFilter}
            onNewDocument={() => setIsDocumentoFormOpen(true)}
            onEditDocument={handleEditDocument}
          />
          {/* Paginação Documentos */}
          {totalDocPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                className="px-3 py-1 mx-1 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => setDocPage(p => Math.max(1, p - 1))}
                disabled={docPage === 1}
              >Anterior</button>
              <span className="mx-2 text-sm">{docPage} / {totalDocPages}</span>
              <button
                className="px-3 py-1 mx-1 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => setDocPage(p => Math.min(totalDocPages, p + 1))}
                disabled={docPage === totalDocPages}
              >Próxima</button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificacoes">
          <CertificacoesTab
            certificacoes={certificacoes}
            filteredCertificacoes={paginatedCertificacoes}
            certificacaoFilter={certificacaoFilter}
            setCertificacaoFilter={setCertificacaoFilter}
            onNewCertification={() => setIsCertificacaoFormOpen(true)}
            onEditCertification={handleEditCertification}
          />
          {/* Paginação Certificações */}
          {totalCertPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                className="px-3 py-1 mx-1 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => setCertPage(p => Math.max(1, p - 1))}
                disabled={certPage === 1}
              >Anterior</button>
              <span className="mx-2 text-sm">{certPage} / {totalCertPages}</span>
              <button
                className="px-3 py-1 mx-1 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => setCertPage(p => Math.min(totalCertPages, p + 1))}
                disabled={certPage === totalCertPages}
              >Próxima</button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="relatorios">
          <RelatoriosRH />
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
          <DocumentoRHForm
            documento={editingDocumento || undefined}
            onSubmit={handleDocumentoSubmit}
            onCancel={() => {
              setIsDocumentoFormOpen(false);
              setEditingDocumento(null);
            }}
          />
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
          <CertificacaoForm
            certificacao={editingCertificacao || undefined}
            onSubmit={handleCertificacaoSubmit}
            onCancel={() => {
              setIsCertificacaoFormOpen(false);
              setEditingCertificacao(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentosRHPage;
