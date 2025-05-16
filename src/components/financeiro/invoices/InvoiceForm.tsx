
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Invoice, Supplier, CostCenter } from '@/types/financeiro';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { invoiceSchema, InvoiceFormValues } from './form/InvoiceFormSchema';

// Import the refactored form sections
import BasicDetailsSection from './form/BasicDetailsSection';
import CostCenterSection from './form/CostCenterSection';
import AmountSection from './form/AmountSection';
import StatusSection from './form/StatusSection';
import DescriptionSection from './form/DescriptionSection';

interface InvoiceFormProps {
  invoice?: Invoice;
  suppliers?: Supplier[];
  costCenters?: CostCenter[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  invoice, 
  suppliers = [], 
  costCenters = [],
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  // Initialize the form with default values or existing invoice data
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      number: invoice?.number || '',
      supplierId: invoice?.supplierId || '',
      issueDate: invoice?.issueDate ? new Date(invoice.issueDate) : new Date(),
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : new Date(),
      costCenterId: invoice?.costCenterId || '',
      amount: invoice?.amount || 0,
      tax: invoice?.tax || 0,
      totalAmount: invoice?.totalAmount || 0,
      status: invoice?.status || 'draft',
      type: invoice?.type || 'product',
      description: invoice?.description || '',
      notes: invoice?.notes || '',
    }
  });

  // Update total amount when amount or tax changes
  React.useEffect(() => {
    const amount = form.watch('amount') || 0;
    const tax = form.watch('tax') || 0;
    const total = amount + tax;
    form.setValue('totalAmount', total);
  }, [form.watch('amount'), form.watch('tax')]);

  const handleSubmit = (data: InvoiceFormValues) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting invoice:', error);
      toast.error('Erro ao salvar nota fiscal');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{invoice ? 'Editar' : 'Nova'} Nota Fiscal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Basic details section: invoice number, supplier, dates */}
            <BasicDetailsSection form={form} suppliers={suppliers} />
            
            {/* Cost center section */}
            <CostCenterSection form={form} costCenters={costCenters} />
            
            {/* Amount section: amount, tax, total */}
            <AmountSection form={form} />
            
            {/* Status section: status, type */}
            <StatusSection form={form} />
            
            {/* Description section: description, notes */}
            <DescriptionSection form={form} />

            <CardFooter className="px-0 pb-0 pt-6">
              <Button variant="outline" type="button" onClick={onCancel} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (invoice ? 'Atualizar' : 'Criar')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
