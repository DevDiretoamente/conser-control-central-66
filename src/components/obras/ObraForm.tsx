
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Obra } from '@/types/obras';

const obraFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.enum(['pavimentacao', 'construcao', 'reforma', 'manutencao', 'infraestrutura', 'outros']),
  status: z.enum(['planejamento', 'aprovacao', 'execucao', 'pausada', 'concluida', 'cancelada']).default('planejamento'),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']).default('media'),
  clienteNome: z.string().min(1, 'Nome do cliente é obrigatório'),
  contrato: z.string().optional(),
  valorContrato: z.number().min(0).default(0),
  dataInicio: z.string().optional(),
  dataFimPrevista: z.string().min(1, 'Data de término prevista é obrigatória'),
  endereco: z.object({
    cep: z.string().optional(),
    rua: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional()
  }).default({}),
  responsavelTecnico: z.string().optional(),
  encarregado: z.string().optional(),
  orcamentoTotal: z.number().min(0).default(0),
  observacoes: z.string().optional()
});

export type ObraFormValues = z.infer<typeof obraFormSchema>;

interface ObraFormProps {
  obra?: Obra;
  onSubmit: (data: ObraFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ObraForm: React.FC<ObraFormProps> = ({ obra, onSubmit, onCancel, isLoading }) => {
  const form = useForm<ObraFormValues>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: {
      nome: obra?.nome || '',
      descricao: obra?.descricao || '',
      tipo: obra?.tipo || 'construcao',
      status: obra?.status || 'planejamento',
      prioridade: obra?.prioridade || 'media',
      clienteNome: obra?.clienteNome || '',
      contrato: obra?.contrato || '',
      valorContrato: obra?.valorContrato || 0,
      dataInicio: obra?.dataInicio || '',
      dataFimPrevista: obra?.dataFimPrevista || '',
      endereco: obra?.endereco || {},
      responsavelTecnico: obra?.responsavelTecnico || '',
      encarregado: obra?.encarregado || '',
      orcamentoTotal: obra?.orcamentoTotal || 0,
      observacoes: obra?.observacoes || ''
    }
  });

  const handleSubmit = async (data: ObraFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar obra:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Obra *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da obra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clienteNome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição da obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pavimentacao">Pavimentação</SelectItem>
                    <SelectItem value="construcao">Construção</SelectItem>
                    <SelectItem value="reforma">Reforma</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
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
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="aprovacao">Aprovação</SelectItem>
                    <SelectItem value="execucao">Execução</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prioridade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valorContrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Contrato</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orcamentoTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orçamento Total</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataFimPrevista"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término Prevista *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="responsavelTecnico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável Técnico</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável técnico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="encarregado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encarregado</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do encarregado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Observações adicionais" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : (obra ? 'Atualizar' : 'Criar')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ObraForm;
