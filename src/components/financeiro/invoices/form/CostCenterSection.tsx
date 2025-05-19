
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CostCenter } from '@/types/financeiro';

interface CostCenterSectionProps {
  form: UseFormReturn<any>;
  costCenters: CostCenter[];
}

const CostCenterSection: React.FC<CostCenterSectionProps> = ({ form, costCenters }) => {
  return (
    <FormField
      control={form.control}
      name="costCenterId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Centro de Custo</FormLabel>
          <FormDescription>
            Selecione um tipo para agrupar esta despesa
          </FormDescription>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
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
  );
};

export default CostCenterSection;
