
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CostCenterManagement from '@/components/financeiro/costcenter/CostCenterManagement';
import InvoiceManagement from '@/components/financeiro/invoices/InvoiceManagement';
import SupplierManagement from '@/components/financeiro/suppliers/SupplierManagement';
import CustomerManagement from '@/components/financeiro/customers/CustomerManagement';
import WorkManagement from '@/components/financeiro/works/WorkManagement';
import FinancialReports from '@/components/financeiro/reports/FinancialReports';
import FinancialDashboard from '@/components/financeiro/dashboard/FinancialDashboard';
import BudgetManagement from '@/components/financeiro/budget/BudgetManagement';
import AuditHistory from '@/components/financeiro/audit/AuditHistory';
import { FileText, BarChart3, FolderIcon, Users, User, Building2, Home, DollarSign, History } from 'lucide-react';

const FinanceiroPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/financeiro">Financeiro</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão Financeira</h1>
          <p className="text-muted-foreground">
            Gerenciamento completo das finanças da empresa
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="cost-centers" className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            <span>Centros de Custo</span>
          </TabsTrigger>
          <TabsTrigger value="works" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Obras/Projetos</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Fornecedores</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Notas Fiscais</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Orçamentos</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Relatórios</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Histórico</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <FinancialDashboard />
        </TabsContent>

        {/* Cost Centers Tab */}
        <TabsContent value="cost-centers">
          <CostCenterManagement />
        </TabsContent>

        {/* Works/Projects Tab */}
        <TabsContent value="works">
          <WorkManagement />
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <SupplierManagement />
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <InvoiceManagement />
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget">
          <BudgetManagement />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>

        {/* Audit History Tab */}
        <TabsContent value="audit">
          <AuditHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceiroPage;
