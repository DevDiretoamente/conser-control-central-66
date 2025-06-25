
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Obra } from '@/types/obras';

interface ObraDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obra: Obra | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

const ObraDeleteDialog: React.FC<ObraDeleteDialogProps> = ({
  open,
  onOpenChange,
  obra,
  onConfirm,
  isLoading
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao excluir obra:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir a obra "{obra?.nome}"?
            <br />
            <strong>Esta ação não pode ser desfeita.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ObraDeleteDialog;
