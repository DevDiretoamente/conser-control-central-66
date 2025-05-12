
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Funcao } from '@/types/funcionario';
import FuncaoForm, { FuncaoFormValues, FuncaoFormData } from './FuncaoForm';

interface FuncaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFuncao: Funcao | null;
  formLoading: boolean;
  onSubmit: (values: FuncaoFormValues, formData: FuncaoFormData) => void;
}

export const FuncaoDialog: React.FC<FuncaoDialogProps> = ({
  open,
  onOpenChange,
  editingFuncao,
  formLoading,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{editingFuncao ? 'Editar' : 'Nova'} Função</DialogTitle>
          <DialogDescription>
            {editingFuncao
              ? 'Edite as informações da função existente.'
              : 'Preencha as informações para cadastrar uma nova função.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 max-h-[calc(90vh-180px)]">
          <div className="pb-6">
            <FuncaoForm 
              editingFuncao={editingFuncao} 
              onSubmit={onSubmit} 
              isLoading={formLoading} 
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FuncaoDialog;
