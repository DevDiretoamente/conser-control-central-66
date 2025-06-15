import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { funcionariosService } from '@/services/funcionariosService';
import { toast } from 'sonner';
import DocumentUploader from '../funcionarios/DocumentUploader';
import CertificacaoBasicSection from './forms/sections/CertificacaoBasicSection';
import CertificacaoDetailsSection from './forms/sections/CertificacaoDetailsSection';
import CertificacaoDatesSection from './forms/sections/CertificacaoDatesSection';

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

  const form = useForm<CertificacaoFormData>({
    resolver: zodResolver(certificacaoSchema),
    defaultValues: {
      funcionarioId: certificacao?.funcionarioId || '',
      nome: certificacao?.nome || '',
      entidadeCertificadora: certificacao?.entidadeCertificadora || '',
      dataObtencao: certificacao?.dataObtencao || new Date().toISOString().split('T')[0],
      dataVencimento: certificacao?.dataVencimento || '',
      numero: certificacao?.numero || '',
      categoria: certificacao?.categoria || 'tecnica',
      status: certificacao?.status || 'valida',
      observacoes: certificacao?.observacoes || ''
    }
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
