
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceManagement from '@/components/financeiro/invoices/InvoiceManagement';
import SupplierManagement from '@/components/financeiro/suppliers/SupplierManagement';
import CustomerManagement from '@/components/financeiro/customers/CustomerManagement';
import CostCenterManagement from '@/components/financeiro/costcenter/CostCenterManagement';
import FinancialReports from '@/components/financeiro/reports/FinancialReports';
import FinancialDashboard from '@/components/financeiro/dashboard/FinancialDashboard';
import QuickActions from '@/components/financeiro/dashboard/QuickActions';

const Financeiro = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNewInvoice = () => {
    setActiveTab('invoices');
  };

  const handleNewSupplier = () => {
    setActiveTab('suppliers');
  };

  const handleNewCustomer = () => {
    setActiveTab('customers');
  };

  const handleViewReports = () => {
    setActiveTab('reports');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">
          Gestão financeira completa: faturas, fornecedores, clientes e relatórios
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="cost-centers">Centros de Custo</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <FinancialDashboard />
          <QuickActions 
            onNewInvoice={handleNewInvoice}
            onNewSupplier={handleNewSupplier}
            onNewCustomer={handleNewCustomer}
            onViewReports={handleViewReports}
          />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceManagement />
        </TabsContent>

        <TabsContent value="suppliers">
          <SupplierManagement />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>

        <TabsContent value="cost-centers">
          <CostCenterManagement />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;
