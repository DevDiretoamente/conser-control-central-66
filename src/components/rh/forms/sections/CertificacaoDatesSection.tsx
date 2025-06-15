
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CertificacaoDatesSectionProps {
  form: UseFormReturn<any>;
}

const CertificacaoDatesSection: React.FC<CertificacaoDatesSectionProps> = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataObtencao">Data de Obtenção *</Label>
          <Input
            id="dataObtencao"
            type="date"
            {...register('dataObtencao')}
          />
          {errors.dataObtencao && (
            <p className="text-sm text-red-500">{String(errors.dataObtencao.message || 'Campo obrigatório')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input
            id="dataVencimento"
            type="date"
            {...register('dataVencimento')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero">Número da Certificação</Label>
          <Input
            id="numero"
            {...register('numero')}
            placeholder="Número do certificado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valida">Válida</SelectItem>
              <SelectItem value="vencida">Vencida</SelectItem>
              <SelectItem value="em_renovacao">Em Renovação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default CertificacaoDatesSection;
