
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentoRH } from '@/types/documentosRH';
import DocumentoRHForm from '../DocumentoRHForm';

interface DocumentoRHDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documento?: DocumentoRH;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const DocumentoRHDialog: React.FC<DocumentoRHDialogProps> = ({
  isOpen,
  onOpenChange,
  documento,
  onSubmit,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {documento ? 'Editar Documento' : 'Novo Documento RH'}
          </DialogTitle>
        </DialogHeader>
        <DocumentoRHForm
          documento={documento}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentoRHDialog;
