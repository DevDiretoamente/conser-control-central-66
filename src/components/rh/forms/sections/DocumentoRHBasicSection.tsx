
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Funcionario } from '@/types/funcionario';

interface DocumentoRHBasicSectionProps {
  form: UseFormReturn<any>;
  funcionarios: Funcionario[];
  tiposDocumento: Array<{ value: string; label: string }>;
}

const DocumentoRHBasicSection: React.FC<DocumentoRHBasicSectionProps> = ({
  form,
  funcionarios,
  tiposDocumento
}) => {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <>
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
            <p className="text-sm text-red-500">{errors.funcionarioId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Documento *</Label>
          <Select
            value={watch('tipo')}
            onValueChange={(value) => setValue('tipo', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposDocumento.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipo && (
            <p className="text-sm text-red-500">{errors.tipo.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          {...register('titulo')}
          placeholder="Digite o título do documento"
        />
        {errors.titulo && (
          <p className="text-sm text-red-500">{errors.titulo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Textarea
          id="descricao"
          {...register('descricao')}
          placeholder="Digite a descrição do documento"
          rows={3}
        />
        {errors.descricao && (
          <p className="text-sm text-red-500">{errors.descricao.message}</p>
        )}
      </div>
    </>
  );
};

export default DocumentoRHBasicSection;
