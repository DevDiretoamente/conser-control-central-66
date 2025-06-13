
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Vehicle, FleetFilter } from '@/types/frota';
import { FrotaService } from '@/services/frotaService';
import VehicleForm from './VehicleForm';
import VehicleList from './VehicleList';
import VehicleDetails from './VehicleDetails';

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState<FleetFilter>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filter]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = FrotaService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = FrotaService.filterVehicles(filter);
    setFilteredVehicles(filtered);
  };

  const handleCreate = async (data: any) => {
    try {
      const newVehicle = FrotaService.createVehicle(data);
      setVehicles(prev => [...prev, newVehicle]);
      setIsFormOpen(false);
      toast.success('Veículo criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      toast.error('Erro ao criar veículo');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingVehicle) return;

    try {
      const updated = FrotaService.updateVehicle(editingVehicle.id, data);
      if (updated) {
        setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v));
        setEditingVehicle(null);
        setIsFormOpen(false);
        toast.success('Veículo atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      toast.error('Erro ao atualizar veículo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return;

    try {
      FrotaService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Veículo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      toast.error('Erro ao excluir veículo');
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleView = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setViewingVehicle(null);
  };

  const handleSubmit = (data: any) => {
    if (editingVehicle) {
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
          <h2 className="text-xl font-semibold">Veículos e Equipamentos</h2>
          <p className="text-muted-foreground">
            Gerencie a frota de veículos e equipamentos
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <VehicleList
        vehicles={filteredVehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        filter={filter}
        onFilterChange={setFilter}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={editingVehicle}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Veículo</DialogTitle>
          </DialogHeader>
          {viewingVehicle && (
            <VehicleDetails
              vehicle={viewingVehicle}
              maintenances={FrotaService.getVehicleMaintenances(viewingVehicle.id)}
              fuelRecords={FrotaService.getFuelRecords(viewingVehicle.id)}
              documents={FrotaService.getVehicleDocuments(viewingVehicle.id)}
              onEdit={() => {
                setIsDetailsOpen(false);
                handleEdit(viewingVehicle);
              }}
              onClose={handleCloseDetails}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleManagement;
