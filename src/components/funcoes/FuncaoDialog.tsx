

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="max-w-[90vw] sm:max-w-[600px] md:max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 flex-shrink-0">
          <DialogTitle>{editingFuncao ? 'Editar' : 'Nova'} Função</DialogTitle>
          <DialogDescription>
            {editingFuncao
              ? 'Edite as informações da função existente.'
              : 'Preencha as informações para cadastrar uma nova função.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4 max-h-[calc(90vh-140px)]">
          <div className="pb-4">
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

