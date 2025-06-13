
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { DocumentoRH } from '@/types/documentosRH';

const documentoRHSchema = z.object({
  funcionarioId: z.string().min(1, 'Funcionário é obrigatório'),
  tipo: z.enum(['contrato', 'termo_confidencialidade', 'acordo_horario', 'advertencia', 'elogio', 'avaliacao', 'ferias', 'atestado', 'licenca', 'rescisao', 'outros']),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  dataDocumento: z.string().min(1, 'Data do documento é obrigatória'),
  dataVencimento: z.string().optional(),
  status: z.enum(['ativo', 'vencido', 'arquivado']),
  observacoes: z.string().optional(),
  assinado: z.boolean(),
  dataAssinatura: z.string().optional(),
  criadoPor: z.string().min(1, 'Criado por é obrigatório')
});

type DocumentoRHFormData = z.infer<typeof documentoRHSchema>;

interface DocumentoRHFormProps {
  documento?: DocumentoRH;
  onSubmit: (data: DocumentoRHFormData) => void;
  onCancel: () => void;
}

const DocumentoRHForm: React.FC<DocumentoRHFormProps> = ({ documento, onSubmit, onCancel }) => {
  const form = useForm<DocumentoRHFormData>({
    resolver: zodResolver(documentoRHSchema),
    defaultValues: documento ? {
      funcionarioId: documento.funcionarioId,
      tipo: documento.tipo,
      titulo: documento.titulo,
      descricao: documento.descricao,
      dataDocumento: documento.dataDocumento.split('T')[0],
      dataVencimento: documento.dataVencimento?.split('T')[0] || '',
      status: documento.status,
      observacoes: documento.observacoes || '',
      assinado: documento.assinado,
      dataAssinatura: documento.dataAssinatura?.split('T')[0] || '',
      criadoPor: documento.criadoPor
    } : {
      funcionarioId: '',
      tipo: 'contrato',
      titulo: '',
      descricao: '',
      dataDocumento: new Date().toISOString().split('T')[0],
      dataVencimento: '',
      status: 'ativo',
      observacoes: '',
      assinado: false,
      dataAssinatura: '',
      criadoPor: 'Usuário Atual'
    }
  });

  const handleSubmit = (data: DocumentoRHFormData) => {
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
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contrato">Contrato</SelectItem>
                  <SelectItem value="termo_confidencialidade">Termo de Confidencialidade</SelectItem>
                  <SelectItem value="acordo_horario">Acordo de Horário</SelectItem>
                  <SelectItem value="advertencia">Advertência</SelectItem>
                  <SelectItem value="elogio">Elogio</SelectItem>
                  <SelectItem value="avaliacao">Avaliação</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="atestado">Atestado</SelectItem>
                  <SelectItem value="licenca">Licença</SelectItem>
                  <SelectItem value="rescisao">Rescisão</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição do documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do Documento</FormLabel>
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
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assinado"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Documento Assinado</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
            {documento ? 'Atualizar' : 'Criar'} Documento
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentoRHForm;
