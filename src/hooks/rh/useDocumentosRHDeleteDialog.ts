
import { useState } from 'react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import { toast } from 'sonner';

export function useDocumentosRHDeleteDialog() {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ type: 'documento' | 'certificacao'; id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteDocument = (documento: DocumentoRH) => {
    setDeletingItem({ type: 'documento', id: documento.id, title: documento.titulo });
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCertification = (certificacao: Certificacao) => {
    setDeletingItem({ type: 'certificacao', id: certificacao.id, title: certificacao.nome });
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingItem(null);
  };

  return {
    // States
    isDeleteConfirmOpen,
    deletingItem,
    isDeleting,
    
    // Handlers
    handleDeleteConfirm,
    handleDeleteDocument,
    handleDeleteCertification,
    handleCloseDeleteConfirm
  };
}
