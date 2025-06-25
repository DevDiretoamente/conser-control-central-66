
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ObraForm, { ObraFormValues } from './ObraForm';
import { Obra } from '@/types/obras';

interface ObraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obra?: Obra;
  onSave: (data: ObraFormValues) => Promise<void>;
  isLoading?: boolean;
}

const ObraDialog: React.FC<ObraDialogProps> = ({ 
  open, 
  onOpenChange, 
  obra, 
  onSave,
  isLoading 
}) => {
  const handleSave = async (data: ObraFormValues) => {
    try {
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar obra:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {obra ? 'Editar Obra' : 'Nova Obra'}
          </DialogTitle>
        </DialogHeader>
        <ObraForm
          obra={obra}
          onSubmit={handleSave}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ObraDialog;
