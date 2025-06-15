
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { funcionariosService } from '@/services/funcionariosService';
import { toast } from 'sonner';
import DocumentUploader from '../funcionarios/DocumentUploader';

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CertificacaoFormData>({
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

  const categorias = [
    { value: 'tecnica', label: 'Técnica' },
    { value: 'seguranca', label: 'Segurança' },
    { value: 'qualidade', label: 'Qualidade' },
    { value: 'gestao', label: 'Gestão' },
    { value: 'idioma', label: 'Idioma' },
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
            <p className="text-sm text-red-500">{errors.categoria.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Certificação *</Label>
        <Input
          id="nome"
          {...register('nome')}
          placeholder="Digite o nome da certificação"
        />
        {errors.nome && (
          <p className="text-sm text-red-500">{errors.nome.message}</p>
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
          <p className="text-sm text-red-500">{errors.entidadeCertificadora.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataObtencao">Data de Obtenção *</Label>
          <Input
            id="dataObtencao"
            type="date"
            {...register('dataObtencao')}
          />
          {errors.dataObtencao && (
            <p className="text-sm text-red-500">{errors.dataObtencao.message}</p>
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

      <div className="space-y-2">
        <DocumentUploader
          label="Certificado"
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
          {certificacao ? 'Atualizar' : 'Criar'} Certificação
        </Button>
      </div>
    </form>
  );
};

export default CertificacaoForm;
