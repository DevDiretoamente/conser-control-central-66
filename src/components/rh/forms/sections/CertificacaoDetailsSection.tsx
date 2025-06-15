
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CertificacaoDetailsSectionProps {
  form: UseFormReturn<any>;
}

const CertificacaoDetailsSection: React.FC<CertificacaoDetailsSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Certificação *</Label>
        <Input
          id="nome"
          {...register('nome')}
          placeholder="Digite o nome da certificação"
        />
        {errors.nome && (
          <p className="text-sm text-red-500">{String(errors.nome.message || 'Campo obrigatório')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="entidadeCertificadora">Entidade Certificadora *</Label>
        <Input
          id="entidadeCertificadora"
          {...register('entidadeCertificadora')}
          placeholder="Digite a entidade certificadora"
        />
        {errors.entidadeCertificadora && (
          <p className="text-sm text-red-500">{String(errors.entidadeCertificadora.message || 'Campo obrigatório')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          {...register('observacoes')}
          placeholder="Observações adicionais"
          rows={2}
        />
      </div>
    </>
  );
};

export default CertificacaoDetailsSection;
