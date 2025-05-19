
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import { ExpenseCategory, ExpenseCategoryType } from '@/types/financeiro';

// Define fuel subcategories
const fuelTypes = [
  { id: 'diesel', name: 'Diesel' },
  { id: 'gasoline', name: 'Gasolina' },
  { id: 'ethanol', name: 'Etanol' },
  { id: 'other', name: 'Outro' }
];

// Mock expense categories - in a real app, these would come from an API
const mockExpenseCategories: ExpenseCategory[] = [
  {
    id: 'cat1',
    name: 'Administração',
    type: 'administration',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat2',
    name: 'Combustível',
    type: 'fuel',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat3',
    name: 'Hospedagem',
    type: 'hotel',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat4',
    name: 'Alimentação',
    type: 'food',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat5',
    name: 'Manutenção',
    type: 'maintenance',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat6',
    name: 'Materiais',
    type: 'supplies',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat7',
    name: 'Transporte',
    type: 'transportation',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat8',
    name: 'Utilidades',
    type: 'utilities',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat9',
    name: 'Outros',
    type: 'other',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface InvoiceItemsSectionProps {
  readOnly?: boolean;
}

const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({ readOnly = false }) => {
  const { control, watch, setValue } = useFormContext();
  
  // Use the field array hook to handle the dynamic items array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Watch for quantity and unitPrice changes to calculate total price
  const items = watch('items');

  // Calculate total amount when items change
  React.useEffect(() => {
    if (items) {
      const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      setValue('amount', totalAmount);
      setValue('totalAmount', totalAmount + (watch('tax') || 0));
    }
  }, [items, setValue, watch]);

  // Update total price when quantity or unit price changes
  const updateTotalPrice = (index: number) => {
    const quantity = parseFloat(items[index]?.quantity || '0');
    const unitPrice = parseFloat(items[index]?.unitPrice || '0');
    
    if (!isNaN(quantity) && !isNaN(unitPrice)) {
      setValue(`items.${index}.totalPrice`, quantity * unitPrice);
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = mockExpenseCategories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  // Handle adding a new item
  const handleAddItem = () => {
    append({
      id: `temp-${Date.now()}`,
      invoiceId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      categoryId: '',
      categoryType: undefined,
      categoryName: '',
      subcategoryId: '',
      subcategoryName: '',
      notes: ''
    });
  };

  // When category changes, update category name and type
  const handleCategoryChange = (value: string, index: number) => {
    const category = mockExpenseCategories.find(cat => cat.id === value);
    if (category) {
      setValue(`items.${index}.categoryId`, value);
      setValue(`items.${index}.categoryName`, category.name);
      setValue(`items.${index}.categoryType`, category.type);
      
      // Reset subcategory if changing from or to fuel type
      setValue(`items.${index}.subcategoryId`, '');
      setValue(`items.${index}.subcategoryName`, '');
    }
  };

  // When subcategory changes (for fuel)
  const handleSubcategoryChange = (value: string, index: number) => {
    const subcat = fuelTypes.find(type => type.id === value);
    if (subcat) {
      setValue(`items.${index}.subcategoryId`, value);
      setValue(`items.${index}.subcategoryName`, subcat.name);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel className="text-base">Itens da Nota Fiscal</FormLabel>
        {!readOnly && (
          <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        )}
      </div>
      
      {fields.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Nenhum item adicionado. Clique em "Adicionar Item" para começar.
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Subcategoria</TableHead>
                <TableHead className="w-[10%]">Qtd</TableHead>
                <TableHead className="w-[15%]">Valor Unit.</TableHead>
                <TableHead className="w-[15%]">Total</TableHead>
                {!readOnly && <TableHead className="w-[5%]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} disabled={readOnly} placeholder="Descrição do item" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`items.${index}.categoryId`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            disabled={readOnly}
                            value={field.value}
                            onValueChange={(value) => handleCategoryChange(value, index)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockExpenseCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`items.${index}.subcategoryId`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            disabled={readOnly || items[index]?.categoryType !== 'fuel'}
                            value={field.value}
                            onValueChange={(value) => handleSubcategoryChange(value, index)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={items[index]?.categoryType !== 'fuel' ? 'N/A' : 'Selecione'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fuelTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={readOnly}
                              type="number" 
                              min="0" 
                              step="1"
                              onChange={(e) => {
                                field.onChange(e);
                                updateTotalPrice(index);
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={readOnly}
                              type="number" 
                              min="0" 
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(e);
                                updateTotalPrice(index);
                              }} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`items.${index}.totalPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} disabled={true} type="number" className="bg-muted" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default InvoiceItemsSection;
