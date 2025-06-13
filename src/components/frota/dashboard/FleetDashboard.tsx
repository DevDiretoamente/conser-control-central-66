
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FleetDashboardData } from '@/types/frota';
import { 
  Truck, 
  Wrench, 
  Fuel, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface FleetDashboardProps {
  data: FleetDashboardData;
}

const FleetDashboard: React.FC<FleetDashboardProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const vehicleTypeData = Object.entries(data.vehiclesByType).map(([type, count]) => ({
    name: type === 'car' ? 'Carros' : 
          type === 'truck' ? 'Caminhões' :
          type === 'heavy_equipment' ? 'Eq. Pesados' :
          type === 'motorcycle' ? 'Motos' : 'Vans',
    value: count
  }));

  return (
    <div className="space-y-6">
      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Veículos
              </CardTitle>
              <Truck className="h-5 w-5 text-conserv-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalVehicles}</div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {data.activeVehicles} ativos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Manutenções Pendentes
              </CardTitle>
              <Wrench className="h-5 w-5 text-conserv-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingMaintenances}</div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {data.maintenanceVehicles} em manutenção
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consumo Médio
              </CardTitle>
              <Fuel className="h-5 w-5 text-conserv-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.averageFuelConsumption.toFixed(1)} L
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Por veículo/mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Documentos a Vencer
              </CardTitle>
              <Calendar className="h-5 w-5 text-conserv-danger" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.expiringDocuments}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Próximos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Custos mensais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Custo Total Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-conserv-primary">
              {formatCurrency(data.totalMonthlyCost)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Manutenções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatCurrency(data.maintenanceCosts)}
            </div>
            <Progress 
              value={(data.maintenanceCosts / data.totalMonthlyCost) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Combustível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatCurrency(data.fuelCosts)}
            </div>
            <Progress 
              value={(data.fuelCosts / data.totalMonthlyCost) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Manutenções por mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Manutenções por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.maintenancesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? `${value} manutenções` : formatCurrency(Number(value)),
                    name === 'count' ? 'Quantidade' : 'Custo'
                  ]}
                />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Quantidade" />
                <Bar dataKey="cost" fill="#82ca9d" name="Custo" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consumo de combustível */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Tendência de Consumo de Combustível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.fuelConsumptionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'consumption' ? `${value}L` : formatCurrency(Number(value)),
                    name === 'consumption' ? 'Consumo' : 'Custo'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#8884d8" 
                  name="Consumo (L)"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#82ca9d" 
                  name="Custo (R$)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {(data.expiringDocuments > 0 || data.pendingMaintenances > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.expiringDocuments > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {data.expiringDocuments} documento(s) vencem nos próximos 30 dias
                  </span>
                </div>
              )}
              {data.pendingMaintenances > 0 && (
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {data.pendingMaintenances} manutenção(ões) pendente(s)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FleetDashboard;
