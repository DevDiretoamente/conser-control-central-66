
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DocumentoRH } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { funcionariosService } from '@/services/funcionariosService';
import { toast } from 'sonner';
import DocumentUploader from '../funcionarios/DocumentUploader';
import DocumentoRHBasicSection from './forms/sections/DocumentoRHBasicSection';
import DocumentoRHDatesSection from './forms/sections/DocumentoRHDatesSection';
import DocumentoRHObservationsSection from './forms/sections/DocumentoRHObservationsSection';

const documentoRHSchema = z.object({
  funcionarioId: z.string().min(1, 'Funcionário é obrigatório'),
  tipo: z.enum(['contrato', 'termo_confidencialidade', 'acordo_horario', 'advertencia', 'elogio', 'avaliacao', 'ferias', 'atestado', 'licenca', 'rescisao', 'outros']),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  dataDocumento: z.string().min(1, 'Data do documento é obrigatória'),
  dataVencimento: z.string().optional(),
  status: z.enum(['ativo', 'vencido', 'arquivado']),
  assinado: z.boolean(),
  dataAssinatura: z.string().optional(),
  observacoes: z.string().optional(),
  criadoPor: z.string().min(1, 'Criado por é obrigatório')
});

type DocumentoRHFormData = z.infer<typeof documentoRHSchema>;

interface DocumentoRHFormProps {
  documento?: DocumentoRH;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DocumentoRHForm: React.FC<DocumentoRHFormProps> = ({
  documento,
  onSubmit,
  onCancel
}) => {
  const [funcionarios, setFuncionarios] = React.useState<Funcionario[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [arquivo, setArquivo] = React.useState<File | null>(null);

  const form = useForm<DocumentoRHFormData>({
    resolver: zodResolver(documentoRHSchema),
    defaultValues: {
      funcionarioId: documento?.funcionarioId || '',
      tipo: documento?.tipo || 'contrato',
      titulo: documento?.titulo || '',
      descricao: documento?.descricao || '',
      dataDocumento: documento?.dataDocumento || new Date().toISOString().split('T')[0],
      dataVencimento: documento?.dataVencimento || '',
      status: documento?.status || 'ativo',
      assinado: documento?.assinado || false,
      dataAssinatura: documento?.dataAssinatura || '',
      observacoes: documento?.observacoes || '',
      criadoPor: 'Admin' // Substituir pela sessão do usuário
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

  const onFormSubmit = (data: DocumentoRHFormData) => {
    const submitData = {
      ...data,
      arquivo: arquivo ? 'base64-placeholder' : undefined,
      nomeArquivo: arquivo?.name
    };
    onSubmit(submitData);
  };

  const tiposDocumento = [
    { value: 'contrato', label: 'Contrato' },
    { value: 'termo_confidencialidade', label: 'Termo de Confidencialidade' },
    { value: 'acordo_horario', label: 'Acordo de Horário' },
    { value: 'advertencia', label: 'Advertência' },
    { value: 'elogio', label: 'Elogio' },
    { value: 'avaliacao', label: 'Avaliação' },
    { value: 'ferias', label: 'Férias' },
    { value: 'atestado', label: 'Atestado' },
    { value: 'licenca', label: 'Licença' },
    { value: 'rescisao', label: 'Rescisão' },
    { value: 'outros', label: 'Outros' }
  ];

  if (loading) {
    return <div className="flex justify-center p-4">Carregando...</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
      <DocumentoRHBasicSection
        form={form}
        funcionarios={funcionarios}
        tiposDocumento={tiposDocumento}
      />

      <DocumentoRHDatesSection form={form} />

      <div className="space-y-2">
        <DocumentUploader
          label="Arquivo do Documento"
          description="PDF até 10MB"
          allowedTypes=".pdf"
          maxSize={10}
          onFileChange={setArquivo}
        />
      </div>

      <DocumentoRHObservationsSection form={form} />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {documento ? 'Atualizar' : 'Criar'} Documento
        </Button>
      </div>
    </form>
  );
};

export default DocumentoRHForm;
