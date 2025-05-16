
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CostCenterManagement from '@/components/financeiro/costcenter/CostCenterManagement';
import InvoiceManagement from '@/components/financeiro/invoices/InvoiceManagement';
import FinancialReports from '@/components/financeiro/reports/FinancialReports';
import { FileText, BarChart3, FolderIcon } from 'lucide-react';

const FinanceiroPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cost-centers');

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
            Gerenciamento de despesas, notas fiscais e centros de custo
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="cost-centers" className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            <span>Centros de Custo</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Notas Fiscais</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Relatórios</span>
          </TabsTrigger>
        </TabsList>

        {/* Cost Centers Tab */}
        <TabsContent value="cost-centers">
          <CostCenterManagement />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <InvoiceManagement />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceiroPage;
