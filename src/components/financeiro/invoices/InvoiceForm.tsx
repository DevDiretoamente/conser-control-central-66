
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Invoice, InvoiceStatus, InvoiceType, CostCenter } from '@/types/financeiro';
import BasicDetailsSection from './form/BasicDetailsSection';
import StatusSection from './form/StatusSection';
import CostCenterSection from './form/CostCenterSection';
import DescriptionSection from './form/DescriptionSection';
import AmountSection from './form/AmountSection';
import { invoiceSchema } from './form/InvoiceFormSchema';

interface SupplierForForm {
  id: string;
  name: string;
}

interface InvoiceFormProps {
  invoice?: Invoice;
  suppliers: SupplierForForm[];
  costCenters: CostCenter[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  invoice, 
  suppliers, 
  costCenters, 
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  // Initialize form with default values or existing invoice data
  const form = useForm<z.infer<typeof invoiceSchema>>({
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
      status: invoice?.status || 'pending',
      type: invoice?.type || 'service',
      description: invoice?.description || '',
      notes: invoice?.notes || ''
    }
  });

  const handleSubmit = (data: z.infer<typeof invoiceSchema>) => {
    onSubmit(data);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle>{invoice ? 'Editar' : 'Nova'} Nota Fiscal</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BasicDetailsSection form={form} suppliers={suppliers} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusSection form={form} />
              <CostCenterSection form={form} costCenters={costCenters} />
            </div>
            
            <DescriptionSection form={form} />
            <AmountSection form={form} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="px-0 pb-0">
        <Button variant="outline" type="button" onClick={onCancel} className="mr-2">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          onClick={form.handleSubmit(handleSubmit)} 
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : (invoice ? 'Atualizar' : 'Criar')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceForm;
