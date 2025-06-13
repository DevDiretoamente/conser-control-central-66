
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Maintenance, MaintenanceFilter } from '@/types/frota';
import { FrotaService } from '@/services/frotaService';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';

const MaintenanceManagement: React.FC = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState<Maintenance[]>([]);
  const [filter, setFilter] = useState<MaintenanceFilter>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenances();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [maintenances, filter]);

  const loadMaintenances = async () => {
    try {
      setLoading(true);
      const data = FrotaService.getMaintenances();
      setMaintenances(data);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      toast.error('Erro ao carregar manutenções');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = FrotaService.getMaintenances(filter);
    setFilteredMaintenances(filtered);
  };

  const handleCreate = async (data: any) => {
    try {
      const newMaintenance = FrotaService.createMaintenance(data);
      setMaintenances(prev => [...prev, newMaintenance]);
      setIsFormOpen(false);
      toast.success('Manutenção criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar manutenção:', error);
      toast.error('Erro ao criar manutenção');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingMaintenance) return;

    try {
      const updated = FrotaService.updateMaintenance(editingMaintenance.id, data);
      if (updated) {
        setMaintenances(prev => prev.map(m => m.id === updated.id ? updated : m));
        setEditingMaintenance(null);
        setIsFormOpen(false);
        toast.success('Manutenção atualizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error);
      toast.error('Erro ao atualizar manutenção');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta manutenção?')) return;

    try {
      FrotaService.deleteMaintenance(id);
      setMaintenances(prev => prev.filter(m => m.id !== id));
      toast.success('Manutenção excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      toast.error('Erro ao excluir manutenção');
    }
  };

  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMaintenance(null);
  };

  const handleSubmit = (data: any) => {
    if (editingMaintenance) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manutenções</h1>
          <p className="text-muted-foreground">
            Gerencie as manutenções da frota
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Manutenção
        </Button>
      </div>

      <MaintenanceList
        maintenances={filteredMaintenances}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filter={filter}
        onFilterChange={setFilter}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMaintenance ? 'Editar Manutenção' : 'Nova Manutenção'}
            </DialogTitle>
          </DialogHeader>
          <MaintenanceForm
            maintenance={editingMaintenance}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceManagement;
