
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Award, BarChart3 } from 'lucide-react';
import DocumentosTab from '@/components/rh/tabs/DocumentosTab';
import CertificacoesTab from '@/components/rh/tabs/CertificacoesTab';
import RelatoriosRH from '@/components/rh/RelatoriosRH';
import DocumentoRHDialog from '@/components/rh/dialogs/DocumentoRHDialog';
import CertificacaoDialog from '@/components/rh/dialogs/CertificacaoDialog';
import Pagination from '@/components/rh/common/Pagination';
import { useDocumentosRH } from '@/hooks/useDocumentosRH';
import { useDocumentosRHDialogs } from '@/hooks/useDocumentosRHDialogs';

const DocumentosRHPage: React.FC = () => {
  const {
    documentos,
    certificacoes,
    documentoFilter,
    setDocumentoFilter,
    certificacaoFilter,
    setCertificacaoFilter,
    docPage,
    setDocPage,
    certPage,
    setCertPage,
    paginatedDocumentos,
    totalDocPages,
    paginatedCertificacoes,
    totalCertPages,
    loadData
  } = useDocumentosRH();

  const {
    isDocumentoFormOpen,
    isCertificacaoFormOpen,
    editingDocumento,
    editingCertificacao,
    handleDocumentoSubmit,
    handleCertificacaoSubmit,
    handleEditDocument,
    handleEditCertification,
    handleNewDocument,
    handleNewCertification,
    handleCloseDocumentoForm,
    handleCloseCertificacaoForm
  } = useDocumentosRHDialogs();

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
            onNewDocument={handleNewDocument}
            onEditDocument={handleEditDocument}
          />
          <Pagination
            currentPage={docPage}
            totalPages={totalDocPages}
            onPageChange={setDocPage}
          />
        </TabsContent>

        <TabsContent value="certificacoes">
          <CertificacoesTab
            certificacoes={certificacoes}
            filteredCertificacoes={paginatedCertificacoes}
            certificacaoFilter={certificacaoFilter}
            setCertificacaoFilter={setCertificacaoFilter}
            onNewCertification={handleNewCertification}
            onEditCertification={handleEditCertification}
          />
          <Pagination
            currentPage={certPage}
            totalPages={totalCertPages}
            onPageChange={setCertPage}
          />
        </TabsContent>

        <TabsContent value="relatorios">
          <RelatoriosRH />
        </TabsContent>
      </Tabs>

      <DocumentoRHDialog
        isOpen={isDocumentoFormOpen}
        onOpenChange={handleCloseDocumentoForm}
        documento={editingDocumento || undefined}
        onSubmit={(data) => handleDocumentoSubmit(data, loadData)}
        onCancel={handleCloseDocumentoForm}
      />

      <CertificacaoDialog
        isOpen={isCertificacaoFormOpen}
        onOpenChange={handleCloseCertificacaoForm}
        certificacao={editingCertificacao || undefined}
        onSubmit={(data) => handleCertificacaoSubmit(data, loadData)}
        onCancel={handleCloseCertificacaoForm}
      />
    </div>
  );
};

export default DocumentosRHPage;
