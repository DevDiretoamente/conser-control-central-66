
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DocumentoRHObservationsSectionProps {
  form: UseFormReturn<any>;
}

const DocumentoRHObservationsSection: React.FC<DocumentoRHObservationsSectionProps> = ({ form }) => {
  const { register } = form;

  return (
    <div className="space-y-2">
      <Label htmlFor="observacoes">Observações</Label>
      <Textarea
        id="observacoes"
        {...register('observacoes')}
        placeholder="Observações adicionais"
        rows={2}
      />
    </div>
  );
};

export default DocumentoRHObservationsSection;
