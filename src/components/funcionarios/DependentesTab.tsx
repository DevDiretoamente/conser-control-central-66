
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, Dependente } from '@/types/funcionario';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import DependenteForm from './DependenteForm';

interface DependentesTabProps {
  form: UseFormReturn<Funcionario>;
}

const DependentesTab: React.FC<DependentesTabProps> = ({ form }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const dependentes = form.watch('dependentes') || [];
  
  const handleAddDependente = (dependente: Partial<Dependente>) => {
    const currentDependentes = form.getValues('dependentes') || [];
    
    if (editingIndex !== null) {
      // Update existing dependente
      const updatedDependentes = [...currentDependentes];
      updatedDependentes[editingIndex] = {
        ...updatedDependentes[editingIndex],
        ...dependente,
      };
      form.setValue('dependentes', updatedDependentes);
      setEditingIndex(null);
    } else {
      // Add new dependente
      form.setValue('dependentes', [...currentDependentes, dependente as Dependente]);
    }
    
    setShowForm(false);
  };
  
  const handleEditDependente = (index: number) => {
    setEditingIndex(index);
    setShowForm(true);
  };
  
  const handleDeleteDependente = () => {
    if (deletingIndex !== null) {
      const currentDependentes = form.getValues('dependentes') || [];
      const updatedDependentes = currentDependentes.filter((_, i) => i !== deletingIndex);
      form.setValue('dependentes', updatedDependentes);
      setDeletingIndex(null);
    }
  };
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };
  
  return (
    <div>
      {showForm ? (
        <DependenteForm 
          onAdd={handleAddDependente}
          onCancel={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
          defaultValues={editingIndex !== null ? dependentes[editingIndex] : undefined}
          isEdit={editingIndex !== null}
        />
      ) : (
        <Button 
          onClick={() => setShowForm(true)}
          className="mb-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Dependente
        </Button>
      )}
      
      {dependentes.length > 0 ? (
        <div className="space-y-4">
          {dependentes.map((dependente, index) => (
            <Card key={index} className="bg-slate-50">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h4 className="text-base font-semibold">{dependente.nome}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Parentesco</p>
                        <p>{dependente.parentesco}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                        <p>{formatDate(dependente.dataNascimento)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CPF</p>
                        <p>{dependente.cpf || "Não informado"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEditDependente(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => setDeletingIndex(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {dependente.documentos?.certidaoNascimento && (
                  <div className="mt-4 p-2 bg-slate-100 rounded-md">
                    <p className="text-xs font-medium">Certidão de Nascimento anexada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">Nenhum dependente cadastrado</p>
        </div>
      )}
      
      <AlertDialog open={deletingIndex !== null} onOpenChange={(open) => !open && setDeletingIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Dependente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este dependente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDependente} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DependentesTab;
