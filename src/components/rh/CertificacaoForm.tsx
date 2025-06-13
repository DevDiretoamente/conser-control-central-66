
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Certificacao } from '@/types/documentosRH';

const certificacaoSchema = z.object({
  funcionarioId: z.string().min(1, 'Funcionário é obrigatório'),
  nome: z.string().min(1, 'Nome da certificação é obrigatório'),
  entidadeCertificadora: z.string().min(1, 'Entidade certificadora é obrigatória'),
  dataObtencao: z.string().min(1, 'Data de obtenção é obrigatória'),
  dataVencimento: z.string().optional(),
  numero: z.string().optional(),
  categoria: z.enum(['tecnica', 'seguranca', 'qualidade', 'gestao', 'idioma', 'outros']),
  status: z.enum(['valida', 'vencida', 'em_renovacao']),
  observacoes: z.string().optional()
});

type CertificacaoFormData = z.infer<typeof certificacaoSchema>;

interface CertificacaoFormProps {
  certificacao?: Certificacao;
  onSubmit: (data: CertificacaoFormData) => void;
  onCancel: () => void;
}

const CertificacaoForm: React.FC<CertificacaoFormProps> = ({ certificacao, onSubmit, onCancel }) => {
  const form = useForm<CertificacaoFormData>({
    resolver: zodResolver(certificacaoSchema),
    defaultValues: certificacao ? {
      funcionarioId: certificacao.funcionarioId,
      nome: certificacao.nome,
      entidadeCertificadora: certificacao.entidadeCertificadora,
      dataObtencao: certificacao.dataObtencao.split('T')[0],
      dataVencimento: certificacao.dataVencimento?.split('T')[0] || '',
      numero: certificacao.numero || '',
      categoria: certificacao.categoria,
      status: certificacao.status,
      observacoes: certificacao.observacoes || ''
    } : {
      funcionarioId: '',
      nome: '',
      entidadeCertificadora: '',
      dataObtencao: new Date().toISOString().split('T')[0],
      dataVencimento: '',
      numero: '',
      categoria: 'tecnica',
      status: 'valida',
      observacoes: ''
    }
  });

  const handleSubmit = (data: CertificacaoFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="funcionarioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funcionário</FormLabel>
              <FormControl>
                <Input placeholder="ID do funcionário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Certificação</FormLabel>
              <FormControl>
                <Input placeholder="Nome da certificação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entidadeCertificadora"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entidade Certificadora</FormLabel>
              <FormControl>
                <Input placeholder="Entidade que emitiu a certificação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataObtencao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Obtenção</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataVencimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Certificação</FormLabel>
              <FormControl>
                <Input placeholder="Número ou código da certificação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tecnica">Técnica</SelectItem>
                  <SelectItem value="seguranca">Segurança</SelectItem>
                  <SelectItem value="qualidade">Qualidade</SelectItem>
                  <SelectItem value="gestao">Gestão</SelectItem>
                  <SelectItem value="idioma">Idioma</SelectItem>
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
                  <SelectItem value="valida">Válida</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="em_renovacao">Em Renovação</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {certificacao ? 'Atualizar' : 'Criar'} Certificação
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CertificacaoForm;
