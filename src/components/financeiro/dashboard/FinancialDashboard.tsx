
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  FileText,
  Users,
  Building2
} from 'lucide-react';
import { InvoiceService } from '@/services/invoiceService';
import { CustomerService } from '@/services/customerService';
import { SupplierService } from '@/services/supplierService';
import { CostCenterService } from '@/services/costCenterService';
import { Invoice } from '@/types/financeiro';
import FinancialNotifications from '../notifications/FinancialNotifications';
import ExpenseAnalytics from '../invoices/ExpenseAnalytics';

const FinancialDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    activeCostCenters: 0,
    recentInvoices: [] as Invoice[]
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const invoices = InvoiceService.getAll();
    const customers = CustomerService.getAll();
    const suppliers = SupplierService.getAll();
    const costCenters = CostCenterService.getAll();
    
    // Calculate totals
    const totalExpenses = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
    const overdueInvoices = InvoiceService.getOverdueInvoices().length;
    const activeCostCenters = costCenters.filter(cc => cc.status === 'active').length;
    const recentInvoices = invoices
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    setDashboardData({
      totalRevenue: 0, // Will be implemented when revenue tracking is added
      totalExpenses,
      pendingInvoices,
      overdueInvoices,
      totalCustomers: customers.length,
      totalSuppliers: suppliers.length,
      activeCostCenters,
      recentInvoices
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendente',
      paid: 'Pago',
      partial: 'Parcial',
      overdue: 'Vencida',
      cancelled: 'Cancelada',
      draft: 'Rascunho',
      released: 'Liberada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const allInvoices = InvoiceService.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Financeiro</h2>
        <p className="text-muted-foreground">
          Visão geral das finanças da empresa
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(dashboardData.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total das despesas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {dashboardData.pendingInvoices}
            </div>
            <p className="text-xs text-muted-foreground">
              Notas fiscais aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dashboardData.overdueInvoices}
            </div>
            <p className="text-xs text-muted-foreground">
              Notas fiscais com vencimento em atraso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalSuppliers}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de fornecedores cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {dashboardData.totalCustomers}
            </div>
            <p className="text-sm text-muted-foreground">
              Total de clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Centros de Custo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {dashboardData.activeCostCenters}
            </div>
            <p className="text-sm text-muted-foreground">
              Centros de custo ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas Fiscais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {allInvoices.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Total de notas fiscais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialNotifications />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas Fiscais Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{invoice.number}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.supplierName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.totalAmount)}</p>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma nota fiscal encontrada
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Analytics */}
      {allInvoices.length > 0 && (
        <ExpenseAnalytics invoices={allInvoices} />
      )}
    </div>
  );
};

export default FinancialDashboard;
