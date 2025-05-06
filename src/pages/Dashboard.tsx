
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Users, Building, Briefcase, Truck, FileText, AlertTriangle } from 'lucide-react';

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
          value="5"
          color="primary"
          footer="10 ASOs a vencer nos próximos 30 dias"
        />
        
        <DashboardCard
          title="Obras"
          description="Projetos e licitações"
          icon={<Building size={24} />}
          to="/obras"
          value="3"
          color="accent"
          footer="2 obras em andamento, 1 licitação pendente"
        />
        
        <DashboardCard
          title="Frota"
          description="Veículos e equipamentos"
          icon={<Truck size={24} />}
          to="/frota"
          value="8"
          color="success"
          footer="2 manutenções preventivas agendadas"
        />
        
        <DashboardCard
          title="Financeiro"
          description="Contas a pagar e receber"
          icon={<FileText size={24} />}
          to="/financeiro"
          value="R$ 12.500,00"
          color="info"
          footer="Próximo vencimento em 3 dias"
        />
      </div>

      <h2 className="text-lg font-medium mb-4">Alertas</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-l-4 border-l-conserv-danger">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-conserv-danger" />
              ASO de 3 funcionários vencendo esta semana
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 pt-0">
            <p className="text-sm text-muted-foreground">
              Agende os exames médicos o quanto antes para evitar não conformidades.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-conserv-warning">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-conserv-warning" />
              Manutenção preventiva de 2 veículos agendada para amanhã
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 pt-0">
            <p className="text-sm text-muted-foreground">
              Veículos XYZ-1234 e ABC-5678 devem ser levados ao mecânico amanhã às 08:00.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-conserv-info">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-conserv-info" />
              Licitação #2023-001 com prazo final em 5 dias
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 pt-0">
            <p className="text-sm text-muted-foreground">
              Prefeitura Municipal de São Paulo - Manutenção de Vias Urbanas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
