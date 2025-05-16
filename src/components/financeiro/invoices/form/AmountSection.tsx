
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AmountSectionProps {
  form: UseFormReturn<any>;
}

const AmountSection: React.FC<AmountSectionProps> = ({ form }) => {
  // Add useEffect to automatically calculate totalAmount when amount or tax changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'amount' || name === 'tax') {
        const amount = parseFloat(value.amount) || 0;
        const tax = parseFloat(value.tax) || 0;
        form.setValue('totalAmount', amount + tax, { shouldValidate: true });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
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
                step="0.01"
                placeholder="0,00" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? 0 : Number(value));
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
                step="0.01"
                placeholder="0,00" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? 0 : Number(value));
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
            <FormLabel>Valor Total (R$)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                {...field} 
                readOnly
              />
            </FormControl>
            <FormDescription>
              Calculado automaticamente (Valor + Impostos)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AmountSection;
