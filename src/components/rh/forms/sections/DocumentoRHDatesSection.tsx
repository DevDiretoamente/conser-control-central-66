
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface DocumentoRHDatesSectionProps {
  form: UseFormReturn<any>;
}

const DocumentoRHDatesSection: React.FC<DocumentoRHDatesSectionProps> = ({ form }) => {
  const { register, setValue, watch, formState: { errors } } = form;
  const watchAssinado = watch('assinado');

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataDocumento">Data do Documento *</Label>
          <Input
            id="dataDocumento"
            type="date"
            {...register('dataDocumento')}
          />
          {errors.dataDocumento && (
            <p className="text-sm text-red-500">{errors.dataDocumento.message}</p>
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="assinado"
              checked={watchAssinado}
              onCheckedChange={(checked) => setValue('assinado', checked)}
            />
            <Label htmlFor="assinado">Documento Assinado</Label>
          </div>
        </div>
      </div>

      {watchAssinado && (
        <div className="space-y-2">
          <Label htmlFor="dataAssinatura">Data da Assinatura</Label>
          <Input
            id="dataAssinatura"
            type="date"
            {...register('dataAssinatura')}
          />
        </div>
      )}
    </>
  );
};

export default DocumentoRHDatesSection;
