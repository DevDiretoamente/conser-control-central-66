
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Funcao } from '@/types/funcionario';
import { funcionesService } from '@/services/funcionesService';

// Import the refactored components
import SearchFuncoes from '@/components/funcoes/SearchFuncoes';
import FuncaoList from '@/components/funcoes/FuncaoList';
import FuncaoDialog from '@/components/funcoes/FuncaoDialog';
import DeleteFuncaoDialog from '@/components/funcoes/DeleteFuncaoDialog';
import { FuncaoFormValues, FuncaoFormData } from '@/components/funcoes/FuncaoForm';

const FuncoesTab: React.FC = () => {
  // State
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFuncao, setEditingFuncao] = useState<Funcao | null>(null);
  const [funcaoParaExcluir, setFuncaoParaExcluir] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredFuncoes, setFilteredFuncoes] = useState<Funcao[]>([]);

  // Load functions on component mount
  useEffect(() => {
    loadFuncoes();
  }, []);

  // Filter functions when search term or functions list changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFuncoes(funcoes);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = funcoes.filter(funcao => 
        funcao.nome.toLowerCase().includes(lowerSearchTerm) ||
        funcao.descricao.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredFuncoes(filtered);
    }
  }, [searchTerm, funcoes]);

  const loadFuncoes = async () => {
    setLoading(true);
    try {
      const data = await funcionesService.getAll();
      setFuncoes(data);
      setFilteredFuncoes(data);
    } catch (error) {
      console.error('Error loading funções:', error);
      toast.error('Erro ao carregar funções. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const onOpenDialog = async (funcao?: Funcao) => {
    if (funcao) {
      try {
        const funcaoData = await funcionesService.getById(funcao.id);
        setEditingFuncao(funcaoData || null);
      } catch (error) {
        console.error('Error getting função details:', error);
        toast.error('Erro ao carregar detalhes da função');
        return;
      }
    } else {
      setEditingFuncao(null);
    }
    setDialogOpen(true);
  };

  const onSubmit = async (values: FuncaoFormValues, formData: FuncaoFormData) => {
    setFormLoading(true);
    
    try {
      // Process atribuições from textarea
      const atribuicoesList = formData.atribuicoesText
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim());
      
      // Get full objects for EPIs and uniformes
      const selectedEPIObjects = funcionesService.getEPIsByIds(formData.selectedEPIs);
      const selectedUniformeObjects = funcionesService.getUniformesByIds(formData.selectedUniformes);
      
      // Create the examesNecessarios object from selected exam IDs
      const examesNecessarios = funcionesService.createExamesPorTipoFromSelected(formData.selectedExamesByType);

      const funcaoData = {
        nome: values.nome,
        descricao: values.descricao,
        setorId: values.setorId,
        atribuicoes: atribuicoesList,
        epis: selectedEPIObjects,
        examesNecessarios: examesNecessarios,
        uniformes: selectedUniformeObjects,
        ativo: values.ativo
      };

      if (editingFuncao) {
        // Update existing funcao
        await funcionesService.update(editingFuncao.id, funcaoData);
        toast.success(`Função "${values.nome}" atualizada com sucesso!`);
      } else {
        // Create new funcao
        await funcionesService.create(funcaoData as Omit<Funcao, 'id'>);
        toast.success(`Função "${values.nome}" criada com sucesso!`);
      }
      
      // Reload functions after operation
      await loadFuncoes();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving function:', error);
      toast.error(`Erro ao ${editingFuncao ? 'atualizar' : 'criar'} função. Tente novamente.`);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleAtivo = async (id: string) => {
    try {
      const updatedFuncao = await funcionesService.toggleActive(id);
      await loadFuncoes();
      
      toast.success(`Função "${updatedFuncao.nome}" ${updatedFuncao.ativo ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      console.error('Error toggling function status:', error);
      toast.error('Erro ao alterar status da função. Tente novamente.');
    }
  };

  const confirmDeleteFuncao = (id: string) => {
    setFuncaoParaExcluir(id);
  };

  const deleteFuncao = async () => {
    if (!funcaoParaExcluir) return;
    
    try {
      const funcaoName = funcoes.find(f => f.id === funcaoParaExcluir)?.nome || 'função';
      await funcionesService.delete(funcaoParaExcluir);
      await loadFuncoes();
      
      toast.success(`Função "${funcaoName}" excluída com sucesso!`);
    } catch (error) {
      console.error('Error deleting function:', error);
      toast.error('Erro ao excluir função. Tente novamente.');
    } finally {
      setFuncaoParaExcluir(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <SearchFuncoes 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        <Button onClick={() => onOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Função
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <FuncaoList 
            funcoes={filteredFuncoes} 
            loading={loading}
            searchTerm={searchTerm}
            onEdit={onOpenDialog}
            onDelete={confirmDeleteFuncao}
            onToggleActive={toggleAtivo}
            onResetSearch={() => setSearchTerm('')}
          />
        </CardContent>
      </Card>
      
      {/* Function Dialog */}
      <FuncaoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingFuncao={editingFuncao}
        formLoading={formLoading}
        onSubmit={onSubmit}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteFuncaoDialog
        open={funcaoParaExcluir !== null}
        onOpenChange={(open) => !open && setFuncaoParaExcluir(null)}
        onConfirm={deleteFuncao}
      />
    </div>
  );
};

export default FuncoesTab;
