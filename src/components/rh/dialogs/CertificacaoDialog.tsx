
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Certificacao } from '@/types/documentosRH';
import CertificacaoForm from '../CertificacaoForm';

interface CertificacaoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  certificacao?: Certificacao;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CertificacaoDialog: React.FC<CertificacaoDialogProps> = ({
  isOpen,
  onOpenChange,
  certificacao,
  onSubmit,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {certificacao ? 'Editar Certificação' : 'Nova Certificação'}
          </DialogTitle>
        </DialogHeader>
        <CertificacaoForm
          certificacao={certificacao}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CertificacaoDialog;
