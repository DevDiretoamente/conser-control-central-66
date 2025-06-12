
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText,
  Users
} from 'lucide-react';
import { InvoiceService } from '@/services/invoiceService';
import { CustomerService } from '@/services/customerService';
import { SupplierService } from '@/services/supplierService';
import { WorkService } from '@/services/workService';

const FinancialDashboard: React.FC = () => {
  // Get data from services
  const invoices = InvoiceService.getAll();
  const customers = CustomerService.getAll();
  const suppliers = SupplierService.getAll();
  const works = WorkService.getAll();
  
  const overdueInvoices = InvoiceService.getOverdueInvoices();
  const dueSoonInvoices = InvoiceService.getDueSoonInvoices();

  // Calculate metrics
  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidInvoiceValue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  const pendingInvoiceValue = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'partial')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const overdueValue = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Financeiro</h2>
        <p className="text-muted-foreground">
          Visão geral das suas finanças e indicadores principais
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Notas Fiscais</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvoiceValue)}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.length} notas fiscais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidInvoiceValue)}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter(inv => inv.status === 'paid').length} pagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingInvoiceValue)}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter(inv => inv.status === 'pending' || inv.status === 'partial').length} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Vencido</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(overdueValue)}</div>
            <p className="text-xs text-muted-foreground">
              {overdueInvoices.length} vencidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Entity Counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter(c => c.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              {customers.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.filter(s => s.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              {suppliers.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obras Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{works.filter(w => w.status === 'in_progress').length}</div>
            <p className="text-xs text-muted-foreground">
              {works.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Notas Fiscais Vencidas ({overdueInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueInvoices.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma nota fiscal vencida
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {overdueInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{invoice.number}</p>
                      <p className="text-xs text-muted-foreground">{invoice.supplierName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{formatCurrency(invoice.totalAmount)}</p>
                      <p className="text-xs text-red-500">Venceu em {formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                ))}
                {overdueInvoices.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{overdueInvoices.length - 5} mais...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Due Soon Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="h-5 w-5" />
              Vencendo em 7 dias ({dueSoonInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dueSoonInvoices.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma nota fiscal vencendo nos próximos 7 dias
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dueSoonInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{invoice.number}</p>
                      <p className="text-xs text-muted-foreground">{invoice.supplierName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-yellow-600">{formatCurrency(invoice.totalAmount)}</p>
                      <p className="text-xs text-yellow-500">Vence em {formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                ))}
                {dueSoonInvoices.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{dueSoonInvoices.length - 5} mais...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
