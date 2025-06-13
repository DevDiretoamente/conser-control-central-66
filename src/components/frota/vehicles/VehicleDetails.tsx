
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vehicle, Maintenance, FuelRecord, VehicleDocument } from '@/types/frota';
import { Edit, Calendar, Fuel, FileText, AlertTriangle } from 'lucide-react';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  maintenances: Maintenance[];
  fuelRecords: FuelRecord[];
  documents: VehicleDocument[];
  onEdit: () => void;
  onClose: () => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  vehicle,
  maintenances,
  fuelRecords,
  documents,
  onEdit,
  onClose
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isDocumentExpiringSoon = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{vehicle.brand} {vehicle.model}</h2>
          <p className="text-muted-foreground">
            {vehicle.plate ? `Placa: ${vehicle.plate}` : `ID: ${vehicle.id.slice(0, 8)}`}
          </p>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(vehicle.status)}
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
          <TabsTrigger value="fuel">Combustível</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    <p className="font-medium">{getTypeName(vehicle.type)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Ano:</span>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Cor:</span>
                    <p className="font-medium">{vehicle.color}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Combustível:</span>
                    <p className="font-medium">{getFuelName(vehicle.fuel)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Quilometragem:</span>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <p className="font-medium">{getStatusBadge(vehicle.status)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {vehicle.chassi && (
                    <div>
                      <span className="text-sm text-muted-foreground">Chassi:</span>
                      <p className="font-medium">{vehicle.chassi}</p>
                    </div>
                  )}
                  {vehicle.renavam && (
                    <div>
                      <span className="text-sm text-muted-foreground">RENAVAM:</span>
                      <p className="font-medium">{vehicle.renavam}</p>
                    </div>
                  )}
                  {vehicle.insuranceCompany && (
                    <div>
                      <span className="text-sm text-muted-foreground">Seguradora:</span>
                      <p className="font-medium">{vehicle.insuranceCompany}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Valor de Aquisição:</span>
                  <p className="font-medium">{formatCurrency(vehicle.acquisitionValue)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Valor Atual:</span>
                  <p className="font-medium">{formatCurrency(vehicle.currentValue)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Data de Aquisição:</span>
                  <p className="font-medium">{formatDate(vehicle.acquisitionDate)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vencimentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {vehicle.ipvaExpiryDate && (
                  <div className={`flex items-center justify-between ${isDocumentExpiringSoon(vehicle.ipvaExpiryDate) ? 'text-red-600' : ''}`}>
                    <span className="text-sm">IPVA:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatDate(vehicle.ipvaExpiryDate)}</span>
                      {isDocumentExpiringSoon(vehicle.ipvaExpiryDate) && (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                )}
                {vehicle.insuranceExpiryDate && (
                  <div className={`flex items-center justify-between ${isDocumentExpiringSoon(vehicle.insuranceExpiryDate) ? 'text-red-600' : ''}`}>
                    <span className="text-sm">Seguro:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatDate(vehicle.insuranceExpiryDate)}</span>
                      {isDocumentExpiringSoon(vehicle.insuranceExpiryDate) && (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                )}
                {vehicle.licensingExpiryDate && (
                  <div className={`flex items-center justify-between ${isDocumentExpiringSoon(vehicle.licensingExpiryDate) ? 'text-red-600' : ''}`}>
                    <span className="text-sm">Licenciamento:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatDate(vehicle.licensingExpiryDate)}</span>
                      {isDocumentExpiringSoon(vehicle.licensingExpiryDate) && (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {vehicle.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{vehicle.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico de Manutenções
              </CardTitle>
            </CardHeader>
            <CardContent>
              {maintenances.length > 0 ? (
                <div className="space-y-2">
                  {maintenances.map((maintenance) => (
                    <div key={maintenance.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{maintenance.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(maintenance.scheduledDate)} • {formatCurrency(maintenance.cost)}
                          </p>
                        </div>
                        <Badge variant={maintenance.status === 'completed' ? 'default' : 'secondary'}>
                          {maintenance.status === 'completed' ? 'Concluída' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma manutenção registrada</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Histórico de Abastecimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fuelRecords.length > 0 ? (
                <div className="space-y-2">
                  {fuelRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{record.gasStation}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(record.date)} • {record.liters}L • {formatCurrency(record.totalCost)}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{formatCurrency(record.pricePerLiter)}/L</p>
                          <p className="text-muted-foreground">{record.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum abastecimento registrado</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{document.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            Vence em: {formatDate(document.expiryDate)}
                          </p>
                        </div>
                        <Badge variant={document.status === 'valid' ? 'default' : 'destructive'}>
                          {document.status === 'valid' ? 'Válido' : 'Vencido'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum documento registrado</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDetails;
