
import { useState } from 'react';
import { DocumentoRH, Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import { toast } from 'sonner';

export function useDocumentosRHDialogs() {
  const [isDocumentoFormOpen, setIsDocumentoFormOpen] = useState(false);
  const [isCertificacaoFormOpen, setIsCertificacaoFormOpen] = useState(false);
  const [isDocumentoDetailsOpen, setIsDocumentoDetailsOpen] = useState(false);
  const [isCertificacaoDetailsOpen, setIsCertificacaoDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isRenovacaoDialogOpen, setIsRenovacaoDialogOpen] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<DocumentoRH | null>(null);
  const [editingCertificacao, setEditingCertificacao] = useState<Certificacao | null>(null);
  const [viewingDocumento, setViewingDocumento] = useState<DocumentoRH | null>(null);
  const [viewingCertificacao, setViewingCertificacao] = useState<Certificacao | null>(null);
  const [renewingCertificacao, setRenewingCertificacao] = useState<Certificacao | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: 'documento' | 'certificacao'; id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDocumentoSubmit = async (data: any, loadData: () => Promise<void>) => {
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
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      toast.error('Erro ao salvar documento');
    }
  };

  const handleCertificacaoSubmit = async (data: any, loadData: () => Promise<void>) => {
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
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar certificação:', error);
      toast.error('Erro ao salvar certificação');
    }
  };

  const handleRenovacaoSubmit = async (renovacao: Omit<RenovacaoCertificacao, 'id'>, loadData: () => Promise<void>) => {
    if (!renewingCertificacao) return;

    try {
      await documentosRHService.addRenovacao(renewingCertificacao.id, renovacao);
      
      // Atualizar a data de vencimento da certificação
      await documentosRHService.updateCertificacao(renewingCertificacao.id, {
        dataVencimento: renovacao.novaDataVencimento,
        status: 'valida'
      });
      
      toast.success('Renovação registrada com sucesso');
      setIsRenovacaoDialogOpen(false);
      setRenewingCertificacao(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao registrar renovação:', error);
      toast.error('Erro ao registrar renovação');
    }
  };

  const handleDeleteConfirm = async (loadData: () => Promise<void>) => {
    if (!deletingItem) return;

    try {
      setIsDeleting(true);
      
      if (deletingItem.type === 'documento') {
        await documentosRHService.deleteDocumento(deletingItem.id);
        toast.success('Documento excluído com sucesso');
      } else {
        await documentosRHService.deleteCertificacao(deletingItem.id);
        toast.success('Certificação excluída com sucesso');
      }
      
      setIsDeleteConfirmOpen(false);
      setDeletingItem(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir item');
    } finally {
      setIsDeleting(false);
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

  const handleViewDocument = (documento: DocumentoRH) => {
    setViewingDocumento(documento);
    setIsDocumentoDetailsOpen(true);
  };

  const handleViewCertification = (certificacao: Certificacao) => {
    setViewingCertificacao(certificacao);
    setIsCertificacaoDetailsOpen(true);
  };

  const handleRenewCertification = (certificacao: Certificacao) => {
    setRenewingCertificacao(certificacao);
    setIsRenovacaoDialogOpen(true);
  };

  const handleDeleteDocument = (documento: DocumentoRH) => {
    setDeletingItem({ type: 'documento', id: documento.id, title: documento.titulo });
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCertification = (certificacao: Certificacao) => {
    setDeletingItem({ type: 'certificacao', id: certificacao.id, title: certificacao.nome });
    setIsDeleteConfirmOpen(true);
  };

  const handleNewDocument = () => {
    setIsDocumentoFormOpen(true);
  };

  const handleNewCertification = () => {
    setIsCertificacaoFormOpen(true);
  };

  const handleCloseDocumentoForm = () => {
    setIsDocumentoFormOpen(false);
    setEditingDocumento(null);
  };

  const handleCloseCertificacaoForm = () => {
    setIsCertificacaoFormOpen(false);
    setEditingCertificacao(null);
  };

  const handleCloseDocumentoDetails = () => {
    setIsDocumentoDetailsOpen(false);
    setViewingDocumento(null);
  };

  const handleCloseCertificacaoDetails = () => {
    setIsCertificacaoDetailsOpen(false);
    setViewingCertificacao(null);
  };

  const handleCloseRenovacaoDialog = () => {
    setIsRenovacaoDialogOpen(false);
    setRenewingCertificacao(null);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingItem(null);
  };

  return {
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
  };
}
