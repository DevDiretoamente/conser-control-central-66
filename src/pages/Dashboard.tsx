
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Users, Building, Briefcase, Truck, FileText } from 'lucide-react';
import ComplianceOverview from '@/components/dashboard/ComplianceOverview';
import AlertsSummary from '@/components/dashboard/AlertsSummary';

const Dashboard = () => {
  return (
    <div>
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de gestão da CONSERVIAS TRANSPORTES E PAVIMENTAÇÃO LTDA
        </p>
      </div>

      <h2 className="text-lg font-medium mb-4">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Recursos Humanos"
          description="Gestão de funcionários"
          icon={<Users size={24} />}
          to="/funcionarios"
          value="26"
          color="primary"
          footer="8 ASOs a vencer nos próximos 30 dias"
        />
        
        <DashboardCard
          title="Obras"
          description="Projetos e licitações"
          icon={<Building size={24} />}
          to="/obras"
          value="5"
          color="accent"
          footer="3 obras em andamento, 2 licitações pendentes"
        />
        
        <DashboardCard
          title="Frota"
          description="Veículos e equipamentos"
          icon={<Truck size={24} />}
          to="/frota"
          value="12"
          color="success"
          footer="2 manutenções preventivas agendadas"
        />
        
        <DashboardCard
          title="Financeiro"
          description="Contas a pagar e receber"
          icon={<FileText size={24} />}
          to="/financeiro"
          value="R$ 125.450,00"
          color="info"
          footer="Próximo vencimento em 3 dias"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-3">
          <h2 className="text-lg font-medium mb-4">Conformidade Ocupacional</h2>
          <ComplianceOverview />
        </div>
      </div>

      <h2 className="text-lg font-medium mb-4">Alertas</h2>
      <AlertsSummary />
    </div>
  );
};

export default Dashboard;
