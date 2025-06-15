
import React from 'react';
import { Button } from '@/components/ui/button';
import { Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { funcionariosService } from '@/services/funcionariosService';
import { toast } from 'sonner';
import { useFormValidation } from '@/hooks/useFormValidation';
import { certificacaoSchema, CertificacaoFormData } from './forms/validation/certificacaoSchema';
import DocumentUploader from '../funcionarios/DocumentUploader';
import CertificacaoBasicSection from './forms/sections/CertificacaoBasicSection';
import CertificacaoDetailsSection from './forms/sections/CertificacaoDetailsSection';
import CertificacaoDatesSection from './forms/sections/CertificacaoDatesSection';

interface CertificacaoFormProps {
  certificacao?: Certificacao;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CertificacaoForm: React.FC<CertificacaoFormProps> = ({
  certificacao,
  onSubmit,
  onCancel
}) => {
  const [funcionarios, setFuncionarios] = React.useState<Funcionario[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [arquivo, setArquivo] = React.useState<File | null>(null);

  const form = useFormValidation(certificacaoSchema, {
    funcionarioId: certificacao?.funcionarioId || '',
    nome: certificacao?.nome || '',
    entidadeCertificadora: certificacao?.entidadeCertificadora || '',
    dataObtencao: certificacao?.dataObtencao || new Date().toISOString().split('T')[0],
    dataVencimento: certificacao?.dataVencimento || '',
    numero: certificacao?.numero || '',
    categoria: certificacao?.categoria || 'tecnica',
    status: certificacao?.status || 'valida',
    observacoes: certificacao?.observacoes || ''
  });

  React.useEffect(() => {
    loadFuncionarios();
  }, []);

  const loadFuncionarios = async () => {
    try {
      const data = await funcionariosService.getAll();
      setFuncionarios(data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (data: CertificacaoFormData) => {
    const submitData = {
      ...data,
      arquivo: arquivo ? 'base64-placeholder' : undefined,
      nomeArquivo: arquivo?.name
    };
    onSubmit(submitData);
  };

  if (loading) {
    return <div className="flex justify-center p-4">Carregando...</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
      <CertificacaoBasicSection
        form={form}
        funcionarios={funcionarios}
      />

      <CertificacaoDetailsSection form={form} />

      <CertificacaoDatesSection form={form} />

      <div className="space-y-2">
        <DocumentUploader
          label="Certificado"
          description="PDF até 10MB"
          allowedTypes=".pdf"
          maxSize={10}
          onFileChange={setArquivo}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {certificacao ? 'Atualizar' : 'Criar'} Certificação
        </Button>
      </div>
    </form>
  );
};

export default CertificacaoForm;
