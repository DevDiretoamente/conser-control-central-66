
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Maintenance, MaintenanceFilter } from '@/types/frota';
import { FrotaService } from '@/services/frotaService';

interface MaintenanceListProps {
  maintenances: Maintenance[];
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (id: string) => void;
  filter: MaintenanceFilter;
  onFilterChange: (filter: MaintenanceFilter) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({
  maintenances,
  onEdit,
  onDelete,
  filter,
  onFilterChange
}) => {
  const vehicles = FrotaService.getVehicles();

  const getStatusBadge = (status: Maintenance['status']) => {
    const statusMap = {
      scheduled: { label: 'Agendada', className: 'bg-blue-500' },
      in_progress: { label: 'Em Andamento', className: 'bg-yellow-500' },
      completed: { label: 'Concluída', className: 'bg-green-500' },
      cancelled: { label: 'Cancelada', className: 'bg-red-500' }
    };
    const config = statusMap[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeName = (type: Maintenance['type']) => {
    const typeMap = {
      preventive: 'Preventiva',
      corrective: 'Corretiva',
      emergency: 'Emergencial'
    };
    return typeMap[type];
  };

  const getCategoryName = (category: Maintenance['category']) => {
    const categoryMap = {
      engine: 'Motor',
      transmission: 'Transmissão',
      brakes: 'Freios',
      tires: 'Pneus',
      electrical: 'Elétrica',
      body: 'Carroceria',
      other: 'Outros'
    };
    return categoryMap[category];
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plate || vehicle.id.slice(0, 8)}` : 'Veículo não encontrado';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar manutenções..."
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filter.vehicleId || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, vehicleId: value === 'all' ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Veículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os veículos</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.plate || vehicle.id.slice(0, 8)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.status || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, status: value === 'all' ? undefined : value as Maintenance['status'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="scheduled">Agendada</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
            <SelectItem value="cancelled">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.type || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, type: value === 'all' ? undefined : value as Maintenance['type'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="preventive">Preventiva</SelectItem>
            <SelectItem value="corrective">Corretiva</SelectItem>
            <SelectItem value="emergency">Emergencial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Manutenções */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maintenances.map((maintenance) => (
          <Card key={maintenance.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{maintenance.description}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getVehicleName(maintenance.vehicleId)}
                  </p>
                </div>
                {getStatusBadge(maintenance.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-medium">{getTypeName(maintenance.type)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Categoria:</span>
                  <p className="font-medium">{getCategoryName(maintenance.category)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span>
                  <p className="font-medium">{formatDate(maintenance.scheduledDate)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Custo:</span>
                  <p className="font-medium">{formatCurrency(maintenance.cost)}</p>
                </div>
              </div>

              {maintenance.supplier && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Fornecedor:</span>
                  <p className="font-medium">{maintenance.supplier}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{maintenance.mileage.toLocaleString()} km</span>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(maintenance)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(maintenance.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {maintenances.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma manutenção encontrada</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;
