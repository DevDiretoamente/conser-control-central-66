
import { useState } from 'react';
import { Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import { toast } from 'sonner';

export function useDocumentosRHRenovacaoDialog() {
  const [isRenovacaoDialogOpen, setIsRenovacaoDialogOpen] = useState(false);
  const [renewingCertificacao, setRenewingCertificacao] = useState<Certificacao | null>(null);

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

  const handleRenewCertification = (certificacao: Certificacao) => {
    setRenewingCertificacao(certificacao);
    setIsRenovacaoDialogOpen(true);
  };

  const handleCloseRenovacaoDialog = () => {
    setIsRenovacaoDialogOpen(false);
    setRenewingCertificacao(null);
  };

  return {
    // States
    isRenovacaoDialogOpen,
    renewingCertificacao,
    
    // Handlers
    handleRenovacaoSubmit,
    handleRenewCertification,
    handleCloseRenovacaoDialog
  };
}
