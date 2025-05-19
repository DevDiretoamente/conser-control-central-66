import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Invoice, InvoiceStatus, CostCenter, Supplier, FinanceFilterOptions } from '@/types/financeiro';
import { toast } from 'sonner';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
import InvoiceFilter from './InvoiceFilter';
import InvoiceDetails from './InvoiceDetails';

// Mock data for initial development
const mockCostCenters: CostCenter[] = [
  { 
    id: 'cc1', 
    name: 'Administrativo', 
    description: 'Despesas administrativas',
    status: 'active', 
    createdAt: '2023-01-01', 
    updatedAt: '2023-01-01',
    createdBy: 'user1'
  },
  { 
    id: 'cc2', 
    name: 'Obra A', 
    description: 'Despesas da Obra A',
    obraId: 'obra1',
    status: 'active', 
    createdAt: '2023-01-01', 
    updatedAt: '2023-01-01',
    createdBy: 'user1'
  },
  { 
    id: 'cc3', 
    name: 'Obra B', 
    description: 'Despesas da Obra B',
    obraId: 'obra2',
    status: 'active', 
    createdAt: '2023-01-01', 
    updatedAt: '2023-01-01',
    createdBy: 'user1'
  },
];

const mockSuppliers: Supplier[] = [
  {
    id: 'sup1',
    businessName: 'Fornecedor A',
    type: 'legal',
    document: '12.345.678/0001-90',
    email: 'fornecedor.a@example.com',
    phone: '(11) 1234-5678',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 'sup2',
    businessName: 'Fornecedor B',
    type: 'legal',
    document: '98.765.432/0001-10',
    email: 'fornecedor.b@example.com',
    phone: '(11) 8765-4321',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    number: 'NF-1234',
    supplierId: 'sup1',
    supplierName: 'Fornecedor A',
    issueDate: '2023-06-10',
    dueDate: '2023-07-10',
    costCenterId: 'cc1',
    costCenterName: 'Administrativo',
    amount: 1000,
    tax: 100,
    totalAmount: 1100,
    status: 'paid',
    type: 'service',
    description: 'Serviços administrativos',
    items: [],
    payments: [
      {
        id: 'pay1',
        invoiceId: 'inv1',
        amount: 1100,
        paymentDate: '2023-07-05',
        dueDate: '2023-07-10',
        method: 'bank_transfer',
        status: 'completed',
        createdAt: '2023-07-05',
        createdBy: 'user1'
      }
    ],
    createdAt: '2023-06-10',
    createdBy: 'user1',
    updatedAt: '2023-07-05'
  },
  {
    id: 'inv2',
    number: 'NF-5678',
    supplierId: 'sup2',
    supplierName: 'Fornecedor B',
    issueDate: '2023-07-15',
    dueDate: '2023-08-15',
    costCenterId: 'cc2',
    costCenterName: 'Obra A',
    amount: 5000,
    tax: 500,
    totalAmount: 5500,
    status: 'pending',
    type: 'product',
    description: 'Materiais para Obra A',
    items: [],
    payments: [],
    createdAt: '2023-07-15',
    createdBy: 'user1',
    updatedAt: '2023-07-15'
  }
];

const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Update the handleFilter function to properly handle "none" values
  const handleFilter = (filters: FinanceFilterOptions & {
    status?: InvoiceStatus | 'none';
    costCenterId?: string;
    supplierId?: string;
  }) => {
    let filtered = [...invoices];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(term) ||
        invoice.supplierName.toLowerCase().includes(term) ||
        invoice.costCenterName.toLowerCase().includes(term)
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.issueDate) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.issueDate) <= new Date(filters.endDate!)
      );
    }

    // Only filter by status if it's a valid InvoiceStatus (not 'none')
    if (filters.status && filters.status !== 'none') {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    // Only filter by costCenterId if it's not 'none'
    if (filters.costCenterId && filters.costCenterId !== 'none') {
      filtered = filtered.filter(invoice => invoice.costCenterId === filters.costCenterId);
    }

    // Only filter by supplierId if it's not 'none'
    if (filters.supplierId && filters.supplierId !== 'none') {
      filtered = filtered.filter(invoice => invoice.supplierId === filters.supplierId);
    }

    setFilteredInvoices(filtered);
  };

  // Check for duplicate invoices (same supplier + invoice number)
  const isDuplicateInvoice = (invoice: any): boolean => {
    return invoices.some(
      inv => 
        inv.id !== (selectedInvoice?.id || '') && 
        inv.supplierId === invoice.supplierId && 
        inv.number.trim().toLowerCase() === invoice.number.trim().toLowerCase()
    );
  };

  const handleCreateInvoice = (data: any) => {
    setIsLoading(true);
    
    // Check for duplicate invoice
    if (isDuplicateInvoice(data)) {
      toast.error('Já existe uma nota fiscal com este número para este fornecedor.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newInvoice: Invoice = {
          id: `inv${invoices.length + 1}`,
          number: data.number,
          supplierId: data.supplierId,
          supplierName: mockSuppliers.find(s => s.id === data.supplierId)?.businessName || '',
          issueDate: data.issueDate.toISOString(),
          dueDate: data.dueDate.toISOString(),
          costCenterId: data.costCenterId,
          costCenterName: mockCostCenters.find(c => c.id === data.costCenterId)?.name || '',
          amount: data.amount,
          tax: data.tax || 0,
          totalAmount: data.totalAmount,
          status: data.status as InvoiceStatus,
          type: data.type,
          description: data.description || '',
          notes: data.notes || '',
          items: [],
          payments: [],
          createdAt: new Date().toISOString(),
          createdBy: 'user1',
          updatedAt: new Date().toISOString()
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
    
    // Check for duplicate invoice
    if (isDuplicateInvoice(data)) {
      toast.error('Já existe uma nota fiscal com este número para este fornecedor.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const updatedInvoice: Invoice = {
          ...selectedInvoice,
          number: data.number,
          supplierId: data.supplierId,
          supplierName: mockSuppliers.find(s => s.id === data.supplierId)?.businessName || selectedInvoice.supplierName,
          issueDate: data.issueDate.toISOString(),
          dueDate: data.dueDate.toISOString(),
          costCenterId: data.costCenterId,
          costCenterName: mockCostCenters.find(c => c.id === data.costCenterId)?.name || selectedInvoice.costCenterName,
          amount: data.amount,
          tax: data.tax || 0,
          totalAmount: data.totalAmount,
          status: data.status,
          type: data.type,
          description: data.description || '',
          notes: data.notes || '',
          updatedAt: new Date().toISOString()
        };

        const updatedInvoices = invoices.map(invoice => 
          invoice.id === selectedInvoice.id ? updatedInvoice : invoice
        );
        
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
        setIsFormOpen(false);
        setSelectedInvoice(undefined);
        toast.success('Nota fiscal atualizada com sucesso!');
      } catch (error) {
        console.error('Error updating invoice:', error);
        toast.error('Erro ao atualizar nota fiscal.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    // In a real application, you would confirm before deleting
    try {
      const updatedInvoices = invoices.filter(item => item.id !== invoice.id);
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);
      toast.success('Nota fiscal excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erro ao excluir nota fiscal.');
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
    if (isDetailsOpen) setIsDetailsOpen(false);
  };

  const handleAddPayment = () => {
    // In a real application, this would open a payment form
    toast.info('Funcionalidade de pagamento será implementada em breve.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-lg font-medium">Notas Fiscais</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie todas as notas fiscais da sua empresa
          </p>
        </div>
        <Button onClick={() => {
          setSelectedInvoice(undefined);
          setIsFormOpen(true);
        }} className="shrink-0">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Nota Fiscal
        </Button>
      </div>

      <InvoiceFilter 
        onFilterChange={handleFilter}
        costCenters={mockCostCenters}
        suppliers={mockSuppliers}
      />

      {filteredInvoices.length === 0 ? (
        <Alert>
          <AlertDescription>
            Nenhuma nota fiscal encontrada. Altere os filtros ou adicione uma nova nota fiscal.
          </AlertDescription>
        </Alert>
      ) : (
        <InvoiceList
          invoices={filteredInvoices}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onViewDetails={(invoice) => {
            setSelectedInvoice(invoice);
            setIsDetailsOpen(true);
          }}
        />
      )}

      {/* Invoice Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <InvoiceForm
            invoice={selectedInvoice}
            suppliers={mockSuppliers}
            costCenters={mockCostCenters}
            onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
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
              onAddPayment={handleAddPayment}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceManagement;
