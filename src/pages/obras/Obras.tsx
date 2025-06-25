
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ObrasDashboard } from '@/components/obras/ObrasDashboard';
import ObraDialog from '@/components/obras/ObraDialog';
import ObraDetails from '@/components/obras/ObraDetails';
import ObraDeleteDialog from '@/components/obras/ObraDeleteDialog';
import { ObraFormValues } from '@/components/obras/ObraForm';
import { obrasService } from '@/services/obrasService';
import { Obra } from '@/types/obras';
import { toast } from 'sonner';

const Obras: React.FC = () => {
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: obras = [], isLoading } = useQuery({
    queryKey: ['obras'],
    queryFn: obrasService.getAll
  });

  const createMutation = useMutation({
    mutationFn: (data: ObraFormValues) => obrasService.create(data as Omit<Obra, 'id' | 'criadoEm' | 'atualizadoEm' | 'historicoAlteracoes'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra criada com sucesso!');
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error('Erro ao criar obra');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Obra> }) => 
      obrasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra atualizada com sucesso!');
      setIsEditDialogOpen(false);
      setSelectedObra(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar obra');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => obrasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast.success('Obra excluída com sucesso!');
      setIsDeleteDialogOpen(false);
      setSelectedObra(null);
    },
    onError: () => {
      toast.error('Erro ao excluir obra');
    }
  });

  const handleCreate = async (data: ObraFormValues) => {
    await createMutation.mutateAsync(data);
  };

  const handleEdit = async (data: ObraFormValues) => {
    if (!selectedObra) return;
    await updateMutation.mutateAsync({ id: selectedObra.id, data });
  };

  const handleDelete = async () => {
    if (!selectedObra) return;
    await deleteMutation.mutateAsync(selectedObra.id);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      planejamento: { variant: 'secondary' as const, label: 'Planejamento' },
      aprovacao: { variant: 'outline' as const, label: 'Aprovação' },
      execucao: { variant: 'default' as const, label: 'Execução' },
      pausada: { variant: 'destructive' as const, label: 'Pausada' },
      concluida: { variant: 'outline' as const, label: 'Concluída' },
      cancelada: { variant: 'destructive' as const, label: 'Cancelada' }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.planejamento;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando obras...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Obras</h1>
          <p className="text-muted-foreground">
            Gerencie todas as obras e projetos da empresa
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Obra
        </Button>
      </div>

      <ObrasDashboard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {obras.map((obra) => (
          <Card key={obra.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{obra.nome}</CardTitle>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedObra(obra);
                      setIsDetailsDialogOpen(true);
                    }}
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedObra(obra);
                      setIsEditDialogOpen(true);
                    }}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedObra(obra);
                      setIsDeleteDialogOpen(true);
                    }}
                    title="Excluir"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(obra.status)}
                <Badge variant="outline" className="capitalize">
                  {obra.tipo}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{obra.clienteNome}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Valor do Contrato</p>
                <p className="font-medium">{formatCurrency(obra.valorContrato)}</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>{obra.progressoPercentual}%</span>
                </div>
                <Progress value={obra.progressoPercentual} className="h-2" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Término Previsto</p>
                <p className="text-sm">
                  {obra.dataFimPrevista ? 
                    new Date(obra.dataFimPrevista).toLocaleDateString('pt-BR') : 
                    'Não definido'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {obras.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhuma obra encontrada</p>
          <p className="text-muted-foreground">Clique em "Nova Obra" para começar</p>
        </div>
      )}

      <ObraDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreate}
        isLoading={createMutation.isPending}
      />

      <ObraDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        obra={selectedObra || undefined}
        onSave={handleEdit}
        isLoading={updateMutation.isPending}
      />

      <ObraDetails
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        obra={selectedObra}
      />

      <ObraDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        obra={selectedObra}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Obras;
