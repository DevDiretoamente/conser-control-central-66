
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DocumentoRH } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { funcionariosService } from '@/services/funcionariosService';
import { toast } from 'sonner';
import DocumentUploader from '../funcionarios/DocumentUploader';

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<DocumentoRHFormData>({
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

  const watchAssinado = watch('assinado');

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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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

      <div className="space-y-2">
        <DocumentUploader
          label="Arquivo do Documento"
          description="PDF até 10MB"
          allowedTypes=".pdf"
          maxSize={10}
          onFileChange={setArquivo}
        />
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
