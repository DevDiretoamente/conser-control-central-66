
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Award, BarChart3, Bell } from 'lucide-react';
import DocumentosTab from '@/components/rh/tabs/DocumentosTab';
import CertificacoesTab from '@/components/rh/tabs/CertificacoesTab';
import RelatoriosRH from '@/components/rh/RelatoriosRH';
import DocumentoRHDialog from '@/components/rh/dialogs/DocumentoRHDialog';
import CertificacaoDialog from '@/components/rh/dialogs/CertificacaoDialog';
import DocumentoRHDetailsDialog from '@/components/rh/dialogs/DocumentoRHDetailsDialog';
import CertificacaoDetailsDialog from '@/components/rh/dialogs/CertificacaoDetailsDialog';
import DeleteConfirmDialog from '@/components/rh/dialogs/DeleteConfirmDialog';
import RenovacaoDialog from '@/components/rh/renovacoes/RenovacaoDialog';
import NotificationCenter from '@/components/rh/notifications/NotificationCenter';
import DocumentosRHDashboard from '@/components/rh/dashboard/DocumentosRHDashboard';
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
    // Form states
    isDocumentoFormOpen,
    isCertificacaoFormOpen,
    editingDocumento,
    editingCertificacao,
    
    // Details states
    isDocumentoDetailsOpen,
    isCertificacaoDetailsOpen,
    viewingDocumento,
    viewingCertificacao,
    
    // Renovacao states
    isRenovacaoDialogOpen,
    renewingCertificacao,
    
    // Delete states
    isDeleteConfirmOpen,
    deletingItem,
    isDeleting,
    
    // Handlers
    handleDocumentoSubmit,
    handleCertificacaoSubmit,
    handleRenovacaoSubmit,
    handleDeleteConfirm,
    handleEditDocument,
    handleEditCertification,
    handleViewDocument,
    handleViewCertification,
    handleRenewCertification,
    handleDeleteDocument,
    handleDeleteCertification,
    handleNewDocument,
    handleNewCertification,
    handleCloseDocumentoForm,
    handleCloseCertificacaoForm,
    handleCloseDocumentoDetails,
    handleCloseCertificacaoDetails,
    handleCloseRenovacaoDialog,
    handleCloseDeleteConfirm
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

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="documentos">
            <FileText className="mr-2 h-4 w-4" />
            Documentos RH
          </TabsTrigger>
          <TabsTrigger value="certificacoes">
            <Award className="mr-2 h-4 w-4" />
            Certificações
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="relatorios">
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DocumentosRHDashboard />
        </TabsContent>

        <TabsContent value="documentos">
          <DocumentosTab
            documentos={documentos}
            filteredDocumentos={paginatedDocumentos}
            documentoFilter={documentoFilter}
            setDocumentoFilter={setDocumentoFilter}
            onNewDocument={handleNewDocument}
            onEditDocument={handleEditDocument}
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
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
            onViewCertification={handleViewCertification}
            onDeleteCertification={handleDeleteCertification}
            onRenewCertification={handleRenewCertification}
          />
          <Pagination
            currentPage={certPage}
            totalPages={totalCertPages}
            onPageChange={setCertPage}
          />
        </TabsContent>

        <TabsContent value="notificacoes">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="relatorios">
          <RelatoriosRH />
        </TabsContent>
      </Tabs>

      {/* Form Dialogs */}
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

      {/* Renovacao Dialog */}
      {renewingCertificacao && (
        <RenovacaoDialog
          isOpen={isRenovacaoDialogOpen}
          onOpenChange={handleCloseRenovacaoDialog}
          certificacao={renewingCertificacao}
          onSubmit={(renovacao) => handleRenovacaoSubmit(renovacao, loadData)}
        />
      )}

      {/* Details Dialogs */}
      {viewingDocumento && (
        <DocumentoRHDetailsDialog
          isOpen={isDocumentoDetailsOpen}
          onOpenChange={handleCloseDocumentoDetails}
          documento={viewingDocumento}
        />
      )}

      {viewingCertificacao && (
        <CertificacaoDetailsDialog
          isOpen={isCertificacaoDetailsOpen}
          onOpenChange={handleCloseCertificacaoDetails}
          certificacao={viewingCertificacao}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={handleCloseDeleteConfirm}
        title={`Excluir ${deletingItem?.type === 'documento' ? 'Documento' : 'Certificação'}`}
        description={`Tem certeza que deseja excluir "${deletingItem?.title}"? Esta ação não pode ser desfeita.`}
        onConfirm={() => handleDeleteConfirm(loadData)}
        loading={isDeleting}
      />
    </div>
  );
};

export default DocumentosRHPage;
