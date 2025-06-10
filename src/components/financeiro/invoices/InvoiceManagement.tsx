
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Eye, Edit, Trash2, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Invoice, InvoiceStatus } from '@/types/financeiro';
import InvoiceFilter from './InvoiceFilter';
import { mockInvoices, mockCostCenters, mockSuppliers } from '@/data/invoiceMockData';

const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getStatusBadgeVariant = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      case 'draft':
        return 'secondary';
      case 'released':
        return 'default';
      case 'partial':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    const labels = {
      pending: 'Pendente',
      paid: 'Pago',
      partial: 'Parcial',
      overdue: 'Vencida',
      cancelled: 'Cancelada',
      draft: 'Rascunho',
      released: 'Liberada'
    };
    return labels[status] || status;
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...invoices];

    if (filters.searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.number.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        invoice.supplierName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        invoice.costCenterName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    if (filters.costCenterId) {
      filtered = filtered.filter(invoice => invoice.costCenterId === filters.costCenterId);
    }

    if (filters.supplierId) {
      filtered = filtered.filter(invoice => invoice.supplierId === filters.supplierId);
    }

    if (filters.startDate) {
      filtered = filtered.filter(invoice => new Date(invoice.issueDate) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(invoice => new Date(invoice.issueDate) <= new Date(filters.endDate));
    }

    setFilteredInvoices(filtered);
  };

  const handleNewInvoice = () => {
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowForm(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      setFilteredInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    // Aqui você pode abrir um modal ou navegar para a página de detalhes
    console.log('Visualizar nota fiscal:', invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Implementar download da nota fiscal
    console.log('Baixar nota fiscal:', invoice);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notas Fiscais</h2>
          <p className="text-muted-foreground">
            Gerencie as notas fiscais de entrada e saída
          </p>
        </div>
        <Button onClick={handleNewInvoice}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota Fiscal
        </Button>
      </div>

      <InvoiceFilter
        onFilterChange={handleFilterChange}
        costCenters={mockCostCenters}
        suppliers={mockSuppliers}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Notas Fiscais ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Centro de Custo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.supplierName}</TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>{invoice.costCenterName}</TableCell>
                    <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Nenhuma nota fiscal encontrada
                        </p>
                        <Button variant="outline" onClick={handleNewInvoice}>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar primeira nota fiscal
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
