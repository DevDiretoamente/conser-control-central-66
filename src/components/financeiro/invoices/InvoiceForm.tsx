
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
import InvoiceItemsSection from './form/InvoiceItemsSection';
import WorkProjectSection from './form/WorkProjectSection';
import { invoiceSchema } from './form/InvoiceFormSchema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      workId: invoice?.workId || '',
      workName: invoice?.workName || '',
      amount: invoice?.amount || 0,
      tax: invoice?.tax || 0,
      totalAmount: invoice?.totalAmount || 0,
      status: invoice?.status || 'pending',
      type: invoice?.type || 'service',
      description: invoice?.description || '',
      notes: invoice?.notes || '',
      items: invoice?.items || []
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
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="items">Itens</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6 pt-4">
                <BasicDetailsSection form={form} suppliers={suppliers} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatusSection form={form} />
                  <WorkProjectSection />
                </div>
                
                <CostCenterSection form={form} costCenters={costCenters} />
                
                <DescriptionSection form={form} />
                <AmountSection form={form} />
              </TabsContent>
              
              <TabsContent value="items" className="pt-4">
                <InvoiceItemsSection />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                onClick={form.handleSubmit(handleSubmit)} 
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : (invoice ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
