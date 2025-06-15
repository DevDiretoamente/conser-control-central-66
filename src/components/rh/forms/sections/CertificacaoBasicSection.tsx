
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Funcionario } from '@/types/funcionario';

interface CertificacaoBasicSectionProps {
  form: UseFormReturn<any>;
  funcionarios: Funcionario[];
  categorias: Array<{ value: string; label: string }>;
}

const CertificacaoBasicSection: React.FC<CertificacaoBasicSectionProps> = ({
  form,
  funcionarios,
  categorias
}) => {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="funcionarioId">Funcionário *</Label>
        <Select
          value={watch('funcionarioId')}
          onValueChange={(value) => setValue('funcionarioId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um funcionário" />
          </SelectTrigger>
          <SelectContent>
            {funcionarios.map((funcionario) => (
              <SelectItem key={funcionario.id} value={funcionario.id!}>
                {funcionario.dadosPessoais.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.funcionarioId && (
          <p className="text-sm text-red-500">{String(errors.funcionarioId.message || 'Campo obrigatório')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria *</Label>
        <Select
          value={watch('categoria')}
          onValueChange={(value) => setValue('categoria', value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((categoria) => (
              <SelectItem key={categoria.value} value={categoria.value}>
                {categoria.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoria && (
          <p className="text-sm text-red-500">{String(errors.categoria.message || 'Campo obrigatório')}</p>
        )}
      </div>
    </div>
  );
};

export default CertificacaoBasicSection;
