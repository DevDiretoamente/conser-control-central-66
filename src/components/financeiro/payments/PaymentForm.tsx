
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Payment, PaymentMethod, Invoice } from '@/types/financeiro';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/format';

// Schema for payment form validation
const paymentSchema = z.object({
  amount: z.string().min(1, { message: "Valor obrigatório" })
    .transform(val => parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'))),
  paymentDate: z.date({ required_error: "Data de pagamento obrigatória" }),
  dueDate: z.date({ required_error: "Data de vencimento obrigatória" }),
  method: z.enum(['cash', 'bank_transfer', 'check', 'credit_card', 'debit_card', 'other'], {
    required_error: "Método de pagamento obrigatório"
  }),
  reference: z.string().optional(),
  installmentNumber: z.number().optional(),
  totalInstallments: z.number().optional(),
  notes: z.string().optional()
});

interface PaymentFormProps {
  invoice: Invoice;
  payment?: Payment;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  invoice,
  payment,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [showInstallments, setShowInstallments] = useState(false);

  // Determine remaining amount to pay
  const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = invoice.totalAmount - paidAmount;

  // Initialize form with default values or existing payment data
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: payment ? payment.amount.toString() : remainingAmount.toString(),
      paymentDate: payment ? new Date(payment.paymentDate) : new Date(),
      dueDate: payment ? new Date(payment.dueDate) : new Date(invoice.dueDate),
      method: payment ? payment.method : 'bank_transfer',
      reference: payment ? payment.reference : '',
      installmentNumber: payment ? payment.installmentNumber : undefined,
      totalInstallments: payment ? payment.totalInstallments : undefined,
      notes: payment ? payment.notes : ''
    }
  });

  const handleSubmit = (data: z.infer<typeof paymentSchema>) => {
    onSubmit({
      ...data,
      invoiceId: invoice.id,
      // amount is already converted to number in the schema transformation
    });
  };

  const paymentMethods: { value: PaymentMethod, label: string }[] = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'bank_transfer', label: 'Transferência Bancária' },
    { value: 'check', label: 'Cheque' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'other', label: 'Outro' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{payment ? 'Editar' : 'Novo'} Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-md">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <p className="text-sm font-medium">Nota Fiscal: {invoice.number}</p>
              <p className="text-sm text-muted-foreground">
                Fornecedor: {invoice.supplierName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Valor Total: {formatCurrency(invoice.totalAmount)}</p>
              <p className="text-sm text-muted-foreground">
                Valor Restante: {formatCurrency(remainingAmount)}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0,00" 
                      {...field} 
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d.,]/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Pagamento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={
                            "w-full pl-3 text-left font-normal"
                          }
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", {locale: ptBR})
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={
                            "w-full pl-3 text-left font-normal"
                          }
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", {locale: ptBR})
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                        <SelectValue placeholder="Selecione um método de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referência</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Número do cheque, ID da transação, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional: número de referência do pagamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2 my-4">
              <input
                type="checkbox"
                id="installments"
                checked={showInstallments}
                onChange={() => setShowInstallments(!showInstallments)}
                className="rounded border-gray-300"
              />
              <label htmlFor="installments" className="text-sm font-medium">
                Pagamento parcelado?
              </label>
            </div>

            {showInstallments && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="installmentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Parcela</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalInstallments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total de Parcelas</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre o pagamento" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pb-0 pt-6">
              <Button variant="outline" type="button" onClick={onCancel} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (payment ? 'Atualizar' : 'Registrar Pagamento')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
