
import React from 'react';
import { Invoice } from '@/types/financeiro';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/utils/format';
import { ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  selectedInvoiceId?: string;
}

// Helper function to render status badge with appropriate color
const InvoiceStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { label: string, variant: "default" | "outline" | "secondary" | "destructive" }> = {
    draft: { label: 'Rascunho', variant: 'outline' },
    pending: { label: 'Pendente', variant: 'secondary' },
    paid: { label: 'Pago', variant: 'default' },
    partial: { label: 'Parcial', variant: 'secondary' },
    cancelled: { label: 'Cancelada', variant: 'destructive' },
    overdue: { label: 'Vencida', variant: 'destructive' }
  };

  const config = statusConfig[status] || { label: status, variant: 'outline' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Format currency values
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices, 
  onSelectInvoice,
  selectedInvoiceId
}) => {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma nota fiscal encontrada
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow 
              key={invoice.id} 
              className={cn(
                "cursor-pointer",
                selectedInvoiceId === invoice.id && "bg-muted"
              )}
              onClick={() => onSelectInvoice(invoice)}
            >
              <TableCell>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  {invoice.number}
                </div>
              </TableCell>
              <TableCell>{invoice.supplierName}</TableCell>
              <TableCell>{formatDate(invoice.issueDate)}</TableCell>
              <TableCell>{formatDate(invoice.dueDate)}</TableCell>
              <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
              <TableCell>
                <InvoiceStatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={(e) => {
                  e.stopPropagation();
                  onSelectInvoice(invoice);
                }}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceList;
