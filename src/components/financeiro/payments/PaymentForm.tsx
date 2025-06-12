
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice, PaymentMethod, PaymentStatus } from '@/types/financeiro';

const paymentSchema = z.object({
  amount: z.number().min(0.01, { message: "Valor deve ser maior que zero" }),
  paymentDate: z.string().min(1, { message: "Data de pagamento é obrigatória" }),
  dueDate: z.string().min(1, { message: "Data de vencimento é obrigatória" }),
  method: z.enum(['cash', 'bank_transfer', 'check', 'credit_card', 'debit_card', 'other'] as const, {
    required_error: "Método de pagamento é obrigatório"
  }),
  reference: z.string().optional().or(z.literal('')),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled'] as const, {
    required_error: "Status é obrigatório"
  }),
  installmentNumber: z.number().optional(),
  totalInstallments: z.number().optional(),
  notes: z.string().optional().or(z.literal('')),
});

interface PaymentFormProps {
  invoice: Invoice;
  remainingAmount: number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  invoice,
  remainingAmount,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: remainingAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      method: 'bank_transfer',
      status: 'completed',
      reference: '',
      notes: '',
    }
  });

  const handleSubmit = (data: z.infer<typeof paymentSchema>) => {
    onSubmit(data);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getMethodLabel = (method: PaymentMethod) => {
    const labels = {
      cash: 'Dinheiro',
      bank_transfer: 'Transferência Bancária',
      check: 'Cheque',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      other: 'Outros'
    };
    return labels[method];
  };

  const getStatusLabel = (status: PaymentStatus) => {
    const labels = {
      pending: 'Pendente',
      completed: 'Concluído',
      failed: 'Falhou',
      cancelled: 'Cancelado'
    };
    return labels[status];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registrar Pagamento</CardTitle>
        <div className="text-sm text-muted-foreground">
          <p>Nota Fiscal: {invoice.number}</p>
          <p>Valor Restante: <span className="font-semibold text-red-600">{formatCurrency(remainingAmount)}</span></p>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Pagamento</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">{getMethodLabel('cash')}</SelectItem>
                        <SelectItem value="bank_transfer">{getMethodLabel('bank_transfer')}</SelectItem>
                        <SelectItem value="check">{getMethodLabel('check')}</SelectItem>
                        <SelectItem value="credit_card">{getMethodLabel('credit_card')}</SelectItem>
                        <SelectItem value="debit_card">{getMethodLabel('debit_card')}</SelectItem>
                        <SelectItem value="other">{getMethodLabel('other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Pagamento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">{getStatusLabel('pending')}</SelectItem>
                        <SelectItem value="completed">{getStatusLabel('completed')}</SelectItem>
                        <SelectItem value="failed">{getStatusLabel('failed')}</SelectItem>
                        <SelectItem value="cancelled">{getStatusLabel('cancelled')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referência (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Número do cheque, ID da transferência, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações adicionais sobre o pagamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)} 
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Registrar Pagamento'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
