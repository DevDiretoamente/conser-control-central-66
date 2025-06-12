
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Payment, Invoice } from '@/types/financeiro';
import { InvoiceService } from '@/services/invoiceService';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import PaymentForm from './PaymentForm';
import PaymentList from './PaymentList';
import { toast } from 'sonner';

interface PaymentManagementProps {
  invoice: Invoice;
  onPaymentUpdate: () => void;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ 
  invoice, 
  onPaymentUpdate 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(invoice.payments || []);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewPayment = () => {
    setIsFormOpen(true);
  };

  const handleCreatePayment = (paymentData: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const newPayment = InvoiceService.addPayment(invoice.id, paymentData);
        if (newPayment) {
          setPayments([...payments, newPayment]);
          setIsFormOpen(false);
          onPaymentUpdate();
          toast.success('Pagamento registrado com sucesso!');
        }
      } catch (error) {
        console.error('Error creating payment:', error);
        toast.error('Erro ao registrar pagamento.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const remainingAmount = invoice.totalAmount - totalPaid;
  const isPaidInFull = totalPaid >= invoice.totalAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Pagamentos da Nota Fiscal</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os pagamentos desta nota fiscal
          </p>
        </div>
        
        {!isPaidInFull && (
          <Button onClick={handleNewPayment}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Pagamento
          </Button>
        )}
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(invoice.totalAmount)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Total Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(remainingAmount)}</p>
            {isPaidInFull && (
              <Badge variant="default" className="mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Pago Integralmente
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <PaymentList payments={payments} />

      {/* Payment Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6">
              <PaymentForm
                invoice={invoice}
                remainingAmount={remainingAmount}
                onSubmit={handleCreatePayment}
                onCancel={() => setIsFormOpen(false)}
                isLoading={isLoading}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManagement;
