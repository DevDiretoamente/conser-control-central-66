
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RenovacaoCertificacao } from '@/types/documentosRH';
import { useFormValidation } from '@/hooks/useFormValidation';
import { z } from 'zod';

const renovacaoSchema = z.object({
  dataRenovacao: z.string().min(1, 'Data de renovação é obrigatória'),
  novaDataVencimento: z.string().min(1, 'Nova data de vencimento é obrigatória'),
  observacoes: z.string().optional()
});

type RenovacaoFormData = z.infer<typeof renovacaoSchema>;

interface RenovacaoFormProps {
  dataVencimentoAnterior: string;
  onSubmit: (data: Omit<RenovacaoCertificacao, 'id'>) => void;
  onCancel: () => void;
}

const RenovacaoForm: React.FC<RenovacaoFormProps> = ({
  dataVencimentoAnterior,
  onSubmit,
  onCancel
}) => {
  const form = useFormValidation(renovacaoSchema, {
    dataRenovacao: new Date().toISOString().split('T')[0],
    novaDataVencimento: '',
    observacoes: ''
  });

  const handleSubmit = (data: RenovacaoFormData) => {
    onSubmit({
      dataRenovacao: data.dataRenovacao,
      dataVencimentoAnterior,
      novaDataVencimento: data.novaDataVencimento,
      observacoes: data.observacoes
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="dataVencimentoAnterior">Data de Vencimento Anterior</Label>
        <Input
          id="dataVencimentoAnterior"
          type="date"
          value={dataVencimentoAnterior}
          disabled
          className="bg-gray-50"
        />
      </div>

      <div>
        <Label htmlFor="dataRenovacao">Data da Renovação</Label>
        <Input
          id="dataRenovacao"
          type="date"
          {...form.register('dataRenovacao')}
          className={form.formState.errors.dataRenovacao ? 'border-red-500' : ''}
        />
        {form.formState.errors.dataRenovacao && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.dataRenovacao.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="novaDataVencimento">Nova Data de Vencimento</Label>
        <Input
          id="novaDataVencimento"
          type="date"
          {...form.register('novaDataVencimento')}
          className={form.formState.errors.novaDataVencimento ? 'border-red-500' : ''}
        />
        {form.formState.errors.novaDataVencimento && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.novaDataVencimento.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          {...form.register('observacoes')}
          placeholder="Observações sobre a renovação..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Renovar Certificação
        </Button>
      </div>
    </form>
  );
};

export default RenovacaoForm;
