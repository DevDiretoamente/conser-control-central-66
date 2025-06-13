
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersonType } from '@/types/financeiro';

interface CustomerFilterProps {
  onFilterChange: (filters: {
    searchTerm?: string;
    type?: PersonType | 'all';
    status?: boolean;
  }) => void;
}

const filterSchema = z.object({
  searchTerm: z.string().optional(),
  type: z.enum(['all', 'physical', 'legal']).optional(),
  status: z.boolean().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

const CustomerFilter: React.FC<CustomerFilterProps> = ({ onFilterChange }) => {
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      searchTerm: '',
      type: 'all',
      status: undefined,
    },
  });

  const onSubmit = (data: FilterValues) => {
    onFilterChange({
      searchTerm: data.searchTerm,
      type: data.type === 'all' ? undefined : data.type as PersonType,
      status: data.status,
    });
  };

  const handleReset = () => {
    form.reset({
      searchTerm: '',
      type: 'all',
      status: undefined,
    });
    
    onFilterChange({});
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Term */}
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Buscar clientes..."
                        className="pl-8"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="physical">Pessoa Física</SelectItem>
                      <SelectItem value="legal">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={(value) => field.onChange(value === 'true')} 
                    defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="undefined">Todos os Status</SelectItem>
                      <SelectItem value="true">Ativo</SelectItem>
                      <SelectItem value="false">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit">Filtrar</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
            >
              Limpar Filtros
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default CustomerFilter;
