
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';
import RenovacaoForm from './RenovacaoForm';

interface RenovacaoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  certificacao: Certificacao;
  onSubmit: (renovacao: Omit<RenovacaoCertificacao, 'id'>) => void;
}

const RenovacaoDialog: React.FC<RenovacaoDialogProps> = ({
  isOpen,
  onOpenChange,
  certificacao,
  onSubmit
}) => {
  const handleSubmit = (renovacao: Omit<RenovacaoCertificacao, 'id'>) => {
    onSubmit(renovacao);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Renovar Certificação</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {certificacao.nome} - {certificacao.entidadeCertificadora}
          </p>
        </DialogHeader>
        <RenovacaoForm
          dataVencimentoAnterior={certificacao.dataVencimento || ''}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RenovacaoDialog;
