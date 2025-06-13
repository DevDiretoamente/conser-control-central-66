
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Vehicle, FleetDashboardData, FleetFilter } from '@/types/frota';
import { FrotaService } from '@/services/frotaService';
import FleetDashboard from '@/components/frota/dashboard/FleetDashboard';
import VehicleManagement from '@/components/frota/vehicles/VehicleManagement';
import MaintenanceManagement from '@/components/frota/maintenance/MaintenanceManagement';

const FrotaPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<FleetDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = FrotaService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conserv-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Erro ao carregar dados da frota</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Frota</h1>
          <p className="text-muted-foreground">
            Gerencie veículos, equipamentos e manutenções
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vehicles">Veículos</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <FleetDashboard data={dashboardData} />
        </TabsContent>

        <TabsContent value="vehicles" className="mt-6">
          <VehicleManagement />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <MaintenanceManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrotaPage;
