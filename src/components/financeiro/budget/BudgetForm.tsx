// src/components/financeiro/budget/BudgetForm.tsx

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Budget } from '@/services/budgetService';
import { CostCenter } from '@/types/financeiro';

interface BudgetFormProps {
  budget?: Budget;
  costCenters: CostCenter[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const budgetSchema = z.object({
  costCenterId: z.string().min(1, 'Centro de custo é obrigatório'),
  costCenterName: z.string().min(1, 'Nome do centro de custo é obrigatório'),
  period: z.string().min(1, 'Período é obrigatório'),
  plannedAmount: z.number().min(0.01, 'Valor orçado deve ser maior que zero'),
  warningThreshold: z
    .number()
    .min(1)
    .max(100, 'Deve ser entre 1 e 100%'),
  criticalThreshold: z
    .number()
    .min(1)
    .max(100, 'Deve ser entre 1 e 100%')
});

type BudgetFormData = z.infer<typeof budgetSchema>;

const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  costCenters,
  onSubmit,
  onCancel
}) => {
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      costCenterId: budget?.costCenterId || '',
      costCenterName: budget?.costCenterName || '',
      period: budget?.period || getCurrentPeriod(),
      plannedAmount: budget?.plannedAmount || 0,
      warningThreshold: budget?.warningThreshold || 80,
      criticalThreshold: budget?.criticalThreshold || 95
    }
  });

  function getCurrentPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`;
  }

  const handleCostCenterChange = (costCenterId: string) => {
    const costCenter = costCenters.find(
      (cc) => cc.id === costCenterId
    );
    if (costCenter) {
      form.setValue('costCenterName', costCenter.name);
    }
  };

  const generatePeriodOptions = () => {
    const options: { value: string; label: string }[] = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() + i,
        1
      );
      const period = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
      });
      options.push({ value: period, label });
    }

    return options;
  };

  const handleSubmit = (data: BudgetFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {budget ? 'Editar Orçamento' : 'Novo Orçamento'}
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure orçamento e limites de alerta para centro de custo
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="costCenterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centro de Custo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCostCenterChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={!!budget}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o centro de custo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {costCenters.map((costCenter) => (
                        <SelectItem
                          key={costCenter.id}
                          value={costCenter.id}
                        >
                          {costCenter.name}
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
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generatePeriodOptions().map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="plannedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Orçado (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="warningThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Alerta (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="80"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 80)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="criticalThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite Crítico (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="95"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 95)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {budget ? 'Atualizar' : 'Criar'} Orçamento
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BudgetForm;
