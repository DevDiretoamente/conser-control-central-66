
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Invoice, InvoiceStatus, CostCenter, Supplier, InvoiceItem } from '@/types/financeiro';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { invoiceSchema, InvoiceFormValues } from './form/InvoiceFormSchema';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceFormProps {
  invoice?: Invoice;
  suppliers: Supplier[];
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
  const form = useForm<InvoiceFormValues>({
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

  const handleSubmit = (data: InvoiceFormValues) => {
    // Format dates as ISO strings for submission
    const formattedData = {
      ...data,
      issueDate: data.issueDate.toISOString(),
      dueDate: data.dueDate.toISOString()
    };
    
    onSubmit(formattedData);
  };

  // Calculate total from items
  const calculateTotals = () => {
    const items = form.getValues('items') || [];
    const amount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = form.getValues('tax') || 0;
    const totalAmount = amount + tax;
    
    form.setValue('amount', amount);
    form.setValue('totalAmount', totalAmount);
  };

  // Add new item to the invoice
  const addNewItem = () => {
    const items = form.getValues('items') || [];
    const newItem: InvoiceItem = {
      id: uuidv4(),
      invoiceId: invoice?.id || '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    
    form.setValue('items', [...items, newItem]);
  };

  // Remove item from the invoice
  const removeItem = (itemId: string) => {
    const items = form.getValues('items') || [];
    form.setValue('items', items.filter(item => item.id !== itemId));
    calculateTotals();
  };

  // Update item values and recalculate totals
  const updateItem = (index: number, field: string, value: any) => {
    const items = [...(form.getValues('items') || [])];
    
    items[index] = {
      ...items[index],
      [field]: value
    };
    
    // If quantity or unitPrice changed, recalculate totalPrice
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : items[index].quantity;
      const unitPrice = field === 'unitPrice' ? value : items[index].unitPrice;
      items[index].totalPrice = quantity * unitPrice;
    }
    
    form.setValue('items', items);
    calculateTotals();
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle>{invoice ? 'Editar' : 'Nova'} Nota Fiscal</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[70vh]">
          <div className="p-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                    <TabsTrigger value="items">Itens</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-6 pt-4">
                    {/* Basic Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número da Nota Fiscal</FormLabel>
                              <FormControl>
                                <Input placeholder="Número" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="supplierId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fornecedor</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um fornecedor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {suppliers.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.id}>
                                      {supplier.tradeName || supplier.businessName}
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
                          name="costCenterId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Centro de Custo</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um centro de custo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {costCenters.map((costCenter) => (
                                    <SelectItem key={costCenter.id} value={costCenter.id}>
                                      {costCenter.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="issueDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data de Emissão</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "dd/MM/yyyy")
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                  <DatePicker
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
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
                                      variant="outline"
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "dd/MM/yyyy")
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                  <DatePicker
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
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
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="paid">Paga</SelectItem>
                                  <SelectItem value="partial">Parcial</SelectItem>
                                  <SelectItem value="overdue">Vencida</SelectItem>
                                  <SelectItem value="cancelled">Cancelada</SelectItem>
                                  <SelectItem value="draft">Rascunho</SelectItem>
                                  <SelectItem value="released">Liberada</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="product">Produto</SelectItem>
                                  <SelectItem value="service">Serviço</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descrição da nota fiscal" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor (R$)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0,00" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value));
                                  const tax = form.getValues('tax') || 0;
                                  form.setValue('totalAmount', parseFloat(e.target.value) + tax);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Impostos (R$)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0,00" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value));
                                  const amount = form.getValues('amount') || 0;
                                  form.setValue('totalAmount', amount + parseFloat(e.target.value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="totalAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total (R$)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0,00" 
                                {...field} 
                                readOnly 
                                className="bg-muted"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Observações adicionais" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="items" className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Itens da Nota Fiscal</h3>
                        <Button 
                          type="button" 
                          onClick={addNewItem} 
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                        </Button>
                      </div>
                      
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Descrição</TableHead>
                              <TableHead>Quantidade</TableHead>
                              <TableHead>Preço Un.</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {form.getValues('items')?.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Input 
                                    value={item.description} 
                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    placeholder="Descrição do item"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={item.quantity} 
                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                    min={0}
                                    step={0.01}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={item.unitPrice} 
                                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                                    min={0}
                                    step={0.01}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={item.totalPrice} 
                                    readOnly
                                    className="bg-muted"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.id || '')}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {(!form.getValues('items') || form.getValues('items').length === 0) && (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                  Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {form.getValues('items') && form.getValues('items').length > 0 && (
                        <div className="flex justify-end">
                          <div className="space-y-2 w-[200px]">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>R$ {form.getValues('amount').toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Impostos:</span>
                              <span>R$ {form.getValues('tax').toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>R$ {form.getValues('totalAmount').toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
