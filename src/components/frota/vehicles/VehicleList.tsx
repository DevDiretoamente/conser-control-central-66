
import React, { useState } from 'react';
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
import { Search, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { Vehicle, FleetFilter } from '@/types/frota';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onView: (vehicle: Vehicle) => void;
  filter: FleetFilter;
  onFilterChange: (filter: FleetFilter) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onEdit,
  onDelete,
  onView,
  filter,
  onFilterChange
}) => {
  const getStatusBadge = (status: Vehicle['status']) => {
    const statusMap = {
      active: { label: 'Ativo', className: 'bg-green-500' },
      maintenance: { label: 'Manutenção', className: 'bg-yellow-500' },
      inactive: { label: 'Inativo', className: 'bg-gray-500' },
      sold: { label: 'Vendido', className: 'bg-red-500' }
    };
    const config = statusMap[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeName = (type: Vehicle['type']) => {
    const typeMap = {
      car: 'Carro',
      truck: 'Caminhão',
      heavy_equipment: 'Equipamento Pesado',
      motorcycle: 'Motocicleta',
      van: 'Van'
    };
    return typeMap[type];
  };

  const getFuelName = (fuel: Vehicle['fuel']) => {
    const fuelMap = {
      gasoline: 'Gasolina',
      diesel: 'Diesel',
      flex: 'Flex',
      electric: 'Elétrico',
      hybrid: 'Híbrido'
    };
    return fuelMap[fuel];
  };

  const hasExpiringDocuments = (vehicle: Vehicle) => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return (
      (vehicle.ipvaExpiryDate && new Date(vehicle.ipvaExpiryDate) <= thirtyDaysFromNow) ||
      (vehicle.insuranceExpiryDate && new Date(vehicle.insuranceExpiryDate) <= thirtyDaysFromNow) ||
      (vehicle.licensingExpiryDate && new Date(vehicle.licensingExpiryDate) <= thirtyDaysFromNow)
    );
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por marca, modelo, placa..."
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filter.type || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, type: value === 'all' ? undefined : value as Vehicle['type'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="car">Carro</SelectItem>
            <SelectItem value="truck">Caminhão</SelectItem>
            <SelectItem value="heavy_equipment">Equipamento Pesado</SelectItem>
            <SelectItem value="motorcycle">Motocicleta</SelectItem>
            <SelectItem value="van">Van</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.status || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, status: value === 'all' ? undefined : value as Vehicle['status'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="maintenance">Manutenção</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="sold">Vendido</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.fuel || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, fuel: value === 'all' ? undefined : value as Vehicle['fuel'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Combustível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="gasoline">Gasolina</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="flex">Flex</SelectItem>
            <SelectItem value="electric">Elétrico</SelectItem>
            <SelectItem value="hybrid">Híbrido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.brand} {vehicle.model}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.plate ? `Placa: ${vehicle.plate}` : `ID: ${vehicle.id.slice(0, 8)}`}
                  </p>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-medium">{getTypeName(vehicle.type)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ano:</span>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Combustível:</span>
                  <p className="font-medium">{getFuelName(vehicle.fuel)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">KM:</span>
                  <p className="font-medium">{vehicle.mileage.toLocaleString()}</p>
                </div>
              </div>

              {hasExpiringDocuments(vehicle) && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Documentos vencendo</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(vehicle)}
                >
                  Ver Detalhes
                </Button>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum veículo encontrado</p>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
