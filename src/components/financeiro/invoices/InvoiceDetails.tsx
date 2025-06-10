
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Invoice } from '@/types/financeiro';
import { Edit, Download, Printer, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onEdit: () => void;
  onClose: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoice,
  onEdit,
  onClose,
}) => {
  // Format date string to DD/MM/YYYY
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Get status badge variant
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

  // Get status label in Portuguese
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      paid: 'Pago',
      partial: 'Parcial',
      overdue: 'Vencida',
      cancelled: 'Cancelada',
      draft: 'Rascunho',
      released: 'Liberada',
    };
    return labels[status] || status;
  };

  // Handle print invoice
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="border-none">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              Nota Fiscal #{invoice.number}
              <Badge className="ml-2" variant={getStatusBadgeVariant(invoice.status)}>
                {getStatusLabel(invoice.status)}
              </Badge>
            </CardTitle>
            <CardDescription>
              Emitida em {formatDate(invoice.issueDate)} - Vencimento em{' '}
              {formatDate(invoice.dueDate)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-6">
            {/* Basic information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Fornecedor</h3>
                <p className="text-sm">{invoice.supplierName}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Centro de Custo</h3>
                <p className="text-sm">{invoice.costCenterName}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Tipo</h3>
                <p className="text-sm">
                  {invoice.type === 'product' ? 'Produto' : 'Serviço'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1">Descrição</h3>
              <p className="text-sm">{invoice.description || 'Sem descrição'}</p>
            </div>

            {invoice.workName && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Obra/Projeto</h3>
                <p className="text-sm">{invoice.workName}</p>
              </div>
            )}

            {invoice.notes && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Observações</h3>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            )}

            <Separator />

            {/* Invoice Items */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Itens da Nota Fiscal
              </h3>

              {invoice.items && invoice.items.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Preço Un.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.totalPrice)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum item registrado para esta nota fiscal.
                </p>
              )}
            </div>

            <Separator />

            {/* Payment Summary */}
            <div>
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span className="text-sm">{formatCurrency(invoice.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Impostos:</span>
                    <span className="text-sm">{formatCurrency(invoice.tax || 0)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments Information */}
            {invoice.payments && invoice.payments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Pagamentos</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Referência</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                          <TableCell>
                            {payment.method === 'cash' && 'Dinheiro'}
                            {payment.method === 'bank_transfer' && 'Transferência'}
                            {payment.method === 'check' && 'Cheque'}
                            {payment.method === 'credit_card' && 'Cartão de Crédito'}
                            {payment.method === 'debit_card' && 'Cartão de Débito'}
                            {payment.method === 'other' && 'Outro'}
                          </TableCell>
                          <TableCell>{payment.reference || '-'}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === 'completed'
                                  ? 'default'
                                  : payment.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {payment.status === 'completed' && 'Concluído'}
                              {payment.status === 'pending' && 'Pendente'}
                              {payment.status === 'failed' && 'Falhou'}
                              {payment.status === 'cancelled' && 'Cancelado'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceDetails;
