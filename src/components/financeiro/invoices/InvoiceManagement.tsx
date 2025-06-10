
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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import InvoiceFilter from './InvoiceFilter';
import InvoiceForm from './InvoiceForm';
import InvoiceDetails from './InvoiceDetails';
import { mockInvoices, mockCostCenters, mockSuppliers } from '@/data/invoiceMockData';
import { ScrollArea } from '@/components/ui/scroll-area';

const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
    if (isDetailsOpen) setIsDetailsOpen(false);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);
      toast.success('Nota fiscal excluída com sucesso!');
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Future implementation for download functionality
    toast.info('Funcionalidade de download será implementada futuramente');
  };

  const handleCreateInvoice = (data: any) => {
    setIsLoading(true);
    
    // Find supplier name from the selected supplierId
    const supplier = mockSuppliers.find(s => s.id === data.supplierId);
    const costCenter = mockCostCenters.find(c => c.id === data.costCenterId);
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newInvoice: Invoice = {
          id: uuidv4(),
          number: data.number,
          supplierId: data.supplierId,
          supplierName: supplier ? (supplier.tradeName || supplier.businessName) : 'Unknown Supplier',
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          costCenterId: data.costCenterId,
          costCenterName: costCenter ? costCenter.name : 'Unknown Cost Center',
          workId: data.workId || undefined,
          workName: data.workName || undefined,
          amount: data.amount,
          tax: data.tax,
          totalAmount: data.totalAmount,
          status: data.status,
          type: data.type,
          description: data.description || '',
          notes: data.notes || '',
          items: data.items || [],
          payments: [],
          createdAt: new Date().toISOString(),
          createdBy: 'current-user',
          updatedAt: new Date().toISOString(),
        };

        const updatedInvoices = [...invoices, newInvoice];
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
        setIsFormOpen(false);
        toast.success('Nota fiscal criada com sucesso!');
      } catch (error) {
        console.error('Error creating invoice:', error);
        toast.error('Erro ao criar nota fiscal.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleUpdateInvoice = (data: any) => {
    if (!selectedInvoice) return;
    
    setIsLoading(true);
    
    // Find supplier name from the selected supplierId
    const supplier = mockSuppliers.find(s => s.id === data.supplierId);
    const costCenter = mockCostCenters.find(c => c.id === data.costCenterId);
    
    // Simulate API call
    setTimeout(() => {
      try {
        const updatedInvoice: Invoice = {
          ...selectedInvoice,
          number: data.number,
          supplierId: data.supplierId,
          supplierName: supplier ? (supplier.tradeName || supplier.businessName) : selectedInvoice.supplierName,
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          costCenterId: data.costCenterId,
          costCenterName: costCenter ? costCenter.name : selectedInvoice.costCenterName,
          workId: data.workId || selectedInvoice.workId,
          workName: data.workName || selectedInvoice.workName,
          amount: data.amount,
          tax: data.tax,
          totalAmount: data.totalAmount,
          status: data.status,
          type: data.type,
          description: data.description || selectedInvoice.description,
          notes: data.notes || selectedInvoice.notes,
          items: data.items || selectedInvoice.items,
          updatedAt: new Date().toISOString(),
        };

        const updatedInvoices = invoices.map(invoice => 
          invoice.id === selectedInvoice.id ? updatedInvoice : invoice
        );
        
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
        setIsFormOpen(false);
        setSelectedInvoice(null);
        toast.success('Nota fiscal atualizada com sucesso!');
      } catch (error) {
        console.error('Error updating invoice:', error);
        toast.error('Erro ao atualizar nota fiscal.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
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
      
      {/* Invoice Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
              <InvoiceForm
                invoice={selectedInvoice || undefined}
                suppliers={mockSuppliers}
                costCenters={mockCostCenters}
                onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
                onCancel={() => setIsFormOpen(false)}
                isLoading={isLoading}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
              {selectedInvoice && (
                <InvoiceDetails
                  invoice={selectedInvoice}
                  onEdit={() => {
                    setIsDetailsOpen(false);
                    setTimeout(() => {
                      setIsFormOpen(true);
                    }, 100);
                  }}
                  onClose={() => setIsDetailsOpen(false)}
                />
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceManagement;
