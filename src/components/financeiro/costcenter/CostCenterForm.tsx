
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CostCenter, CostCenterStatus } from '@/types/financeiro';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Schema for cost center form validation
const costCenterSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  budget: z.string().optional().transform(val => val ? Number(val) : undefined),
  parentId: z.string().optional(),
  obraId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived'])
});

interface CostCenterFormProps {
  costCenter?: CostCenter;
  parentCostCenters?: CostCenter[];
  obras?: any[]; // Will need to define Obra type in the future
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CostCenterForm: React.FC<CostCenterFormProps> = ({ 
  costCenter, 
  parentCostCenters = [], 
  obras = [],
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  // Initialize the form with default values or existing cost center data
  const form = useForm<z.infer<typeof costCenterSchema>>({
    resolver: zodResolver(costCenterSchema),
    defaultValues: {
      name: costCenter?.name || '',
      description: costCenter?.description || '',
      budget: costCenter?.budget ? costCenter.budget.toString() : '',
      parentId: costCenter?.parentId || '',
      obraId: costCenter?.obraId || '',
      status: costCenter?.status || 'active'
    }
  });

  const handleSubmit = (data: z.infer<typeof costCenterSchema>) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting cost center:', error);
      toast.error('Erro ao salvar centro de custo');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{costCenter ? 'Editar' : 'Novo'} Centro de Custo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do centro de custo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição detalhada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0,00" 
                      {...field} 
                      onChange={(e) => {
                        if (e.target.value === '') {
                          field.onChange('');
                        } else if (!isNaN(parseFloat(e.target.value))) {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {parentCostCenters.length > 0 && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centro de Custo Pai</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um centro de custo pai (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {parentCostCenters.map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Opcional: selecione se este é um subcentro de custo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {obras.length > 0 && (
              <FormField
                control={form.control}
                name="obraId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Obra Relacionada</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma obra (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {obras.map((obra) => (
                          <SelectItem key={obra.id} value={obra.id}>
                            {obra.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Opcional: associe a uma obra específica
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pb-0 pt-6">
              <Button variant="outline" type="button" onClick={onCancel} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (costCenter ? 'Atualizar' : 'Criar')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CostCenterForm;
