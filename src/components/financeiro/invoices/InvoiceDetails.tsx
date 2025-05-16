
import React from 'react';
import { Invoice, Payment } from '@/types/financeiro';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Clock, Ban, FileText, Download, Printer } from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onEdit: () => void;
  onClose: () => void;
  onAddPayment?: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onEdit, onClose, onAddPayment }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Paga
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Vencida
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Ban className="h-3 w-3" />
            Cancelada
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Rascunho
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Parcial
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <CardTitle>Nota Fiscal #{invoice.number}</CardTitle>
            {getStatusBadge(invoice.status)}
          </div>
          <CardDescription className="mt-1.5">
            Emitida em {format(new Date(invoice.issueDate), 'dd/MM/yyyy', { locale: ptBR })} | 
            Vencimento em {format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fornecedor</h3>
              <p className="text-base">{invoice.supplierName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Centro de Custo</h3>
              <p className="text-base">{invoice.costCenterName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
              <p className="text-base">
                {invoice.type === 'product' ? 'Produto' : 'Serviço'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valores</h3>
              <div className="space-y-1 mt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impostos:</span>
                  <span>{formatCurrency(invoice.tax || 0)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {invoice.description && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
            <p className="text-sm">{invoice.description}</p>
          </div>
        )}
        
        {invoice.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Observações</h3>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}

        {invoice.payments && invoice.payments.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Histórico de Pagamentos</h3>
            <div className="border rounded-md">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Data</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Método</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Valor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((payment: Payment) => (
                    <tr key={payment.id} className="border-t">
                      <td className="px-4 py-2 text-sm">
                        {format(new Date(payment.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {(() => {
                          switch (payment.method) {
                            case 'bank_transfer': return 'Transferência Bancária';
                            case 'credit_card': return 'Cartão de Crédito';
                            case 'debit_card': return 'Cartão de Débito';
                            case 'cash': return 'Dinheiro';
                            case 'check': return 'Cheque';
                            default: return 'Outro';
                          }
                        })()}
                      </td>
                      <td className="px-4 py-2 text-sm">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-2 text-sm">
                        {getStatusBadge(payment.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <div className="flex gap-2">
          {['pending', 'partial', 'overdue'].includes(invoice.status) && onAddPayment && (
            <Button onClick={onAddPayment}>Registrar Pagamento</Button>
          )}
          <Button onClick={onEdit}>Editar</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvoiceDetails;
