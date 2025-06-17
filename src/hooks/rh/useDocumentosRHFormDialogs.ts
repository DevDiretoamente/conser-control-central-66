
import { useState } from 'react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import { toast } from 'sonner';

export function useDocumentosRHFormDialogs() {
  const [isDocumentoFormOpen, setIsDocumentoFormOpen] = useState(false);
  const [isCertificacaoFormOpen, setIsCertificacaoFormOpen] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<DocumentoRH | null>(null);
  const [editingCertificacao, setEditingCertificacao] = useState<Certificacao | null>(null);

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

  const handleNewDocument = () => {
    setIsDocumentoFormOpen(true);
  };

  const handleNewCertification = () => {
    setIsCertificacaoFormOpen(true);
  };

  const handleEditDocument = (documento: DocumentoRH) => {
    setEditingDocumento(documento);
    setIsDocumentoFormOpen(true);
  };

  const handleEditCertification = (certificacao: Certificacao) => {
    setEditingCertificacao(certificacao);
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

  return {
    // States
    isDocumentoFormOpen,
    isCertificacaoFormOpen,
    editingDocumento,
    editingCertificacao,
    
    // Handlers
    handleDocumentoSubmit,
    handleCertificacaoSubmit,
    handleNewDocument,
    handleNewCertification,
    handleEditDocument,
    handleEditCertification,
    handleCloseDocumentoForm,
    handleCloseCertificacaoForm
  };
}
