
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CartaoPontoFilterOptions, CartaoPontoStatus } from '@/types/cartaoPonto';
import { Search, X } from 'lucide-react';

interface CartaoPontoFilterProps {
  onFilter: (filters: CartaoPontoFilterOptions) => void;
  funcionarioOptions: { id: string; nome: string }[];
}

const CartaoPontoFilter: React.FC<CartaoPontoFilterProps> = ({ 
  onFilter,
  funcionarioOptions
}) => {
  const form = useForm<CartaoPontoFilterOptions>({
    defaultValues: {
      funcionarioId: '',
      dataInicio: '',
      dataFim: '',
      status: undefined,
    }
  });

  const handleSubmit = (data: CartaoPontoFilterOptions) => {
    onFilter(data);
  };

  const handleReset = () => {
    form.reset({
      funcionarioId: '',
      dataInicio: '',
      dataFim: '',
      status: undefined,
    });
    onFilter({});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 bg-gray-50 rounded-lg border mb-6">
        <h3 className="text-lg font-medium">Filtros</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Funcionário */}
          <FormField
            control={form.control}
            name="funcionarioId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funcionário</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {funcionarioOptions.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Data Início */}
          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Data Fim */}
          <FormField
            control={form.control}
            name="dataFim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Fim</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="sobreaviso">Sobreaviso</SelectItem>
                    <SelectItem value="dispensado">Dispensado</SelectItem>
                    <SelectItem value="ferias">Férias</SelectItem>
                    <SelectItem value="feriado">Feriado</SelectItem>
                    <SelectItem value="falta_justificada">Falta Justificada</SelectItem>
                    <SelectItem value="falta_injustificada">Falta Injustificada</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleReset}
          >
            <X className="mr-2 h-4 w-4" /> Limpar
          </Button>
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Filtrar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CartaoPontoFilter;
