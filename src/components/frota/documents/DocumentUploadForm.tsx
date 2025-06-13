
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';
import { VehicleDocument } from '@/types/frota';

interface DocumentUploadFormProps {
  document?: VehicleDocument;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const documentSchema = z.object({
  type: z.enum(['crlv', 'ipva', 'insurance', 'licensing', 'inspection', 'aet', 'special_permit', 'certificate', 'custom', 'other']),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  documentNumber: z.string().optional(),
  issueDate: z.string().min(1, 'Data de emissão é obrigatória'),
  expiryDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  issuingAuthority: z.string().optional(),
  value: z.number().min(0).optional(),
  reminderDays: z.number().min(1).max(365),
  autoRenew: z.boolean().optional(),
  pdfFile: z.string().optional(),
  fileName: z.string().optional()
});

type DocumentFormData = z.infer<typeof documentSchema>;

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  document,
  onSubmit,
  onCancel
}) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(document?.pdfFile || null);
  const [fileName, setFileName] = useState<string>(document?.fileName || '');

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      type: document?.type || 'other',
      title: document?.title || '',
      description: document?.description || '',
      documentNumber: document?.documentNumber || '',
      issueDate: document?.issueDate || '',
      expiryDate: document?.expiryDate || '',
      issuingAuthority: document?.issuingAuthority || '',
      value: document?.value || 0,
      reminderDays: document?.reminderDays || 30,
      autoRenew: document?.autoRenew || false,
      pdfFile: document?.pdfFile || '',
      fileName: document?.fileName || ''
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Arquivo muito grande. Limite de 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setUploadedFile(base64);
      setFileName(file.name);
      form.setValue('pdfFile', base64);
      form.setValue('fileName', file.name);
      toast.success('Arquivo carregado com sucesso!');
    };
    reader.onerror = () => {
      toast.error('Erro ao carregar arquivo');
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileName('');
    form.setValue('pdfFile', '');
    form.setValue('fileName', '');
  };

  const handleSubmit = (data: DocumentFormData) => {
    onSubmit({
      ...data,
      pdfFile: uploadedFile,
      fileName: fileName
    });
  };

  const getDocumentTypeTitle = (type: string) => {
    const titles = {
      crlv: 'Certificado de Registro e Licenciamento de Veículo',
      ipva: 'Imposto sobre a Propriedade de Veículos Automotores',
      insurance: 'Seguro do Veículo',
      licensing: 'Licenciamento Anual',
      inspection: 'Inspeção Veicular',
      aet: 'Autorização Especial de Trânsito',
      special_permit: 'Licença Especial',
      certificate: 'Certificado',
      custom: 'Documento Personalizado',
      other: 'Outro Documento'
    };
    return titles[type as keyof typeof titles] || 'Documento';
  };

  const watchedType = form.watch('type');

  React.useEffect(() => {
    if (watchedType && !document) {
      form.setValue('title', getDocumentTypeTitle(watchedType));
    }
  }, [watchedType, document, form]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="crlv">CRLV</SelectItem>
                      <SelectItem value="ipva">IPVA</SelectItem>
                      <SelectItem value="insurance">Seguro</SelectItem>
                      <SelectItem value="licensing">Licenciamento</SelectItem>
                      <SelectItem value="inspection">Inspeção</SelectItem>
                      <SelectItem value="aet">Autorização Especial de Trânsito</SelectItem>
                      <SelectItem value="special_permit">Licença Especial</SelectItem>
                      <SelectItem value="certificate">Certificado</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 12345678901" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título do documento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição detalhada do documento"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="issuingAuthority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Órgão Emissor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: DETRAN-SP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Pago (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="reminderDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lembrete (dias antes do vencimento)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoRenew"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Renovação Automática</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Criar lembrete para renovação automática
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Upload de Arquivo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload do Documento (PDF)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Clique para fazer upload ou arraste o arquivo PDF aqui
                    </p>
                    <p className="text-xs text-gray-500">
                      Máximo 10MB - Apenas arquivos PDF
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{fileName}</p>
                      <p className="text-sm text-green-600">PDF carregado com sucesso</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {document ? 'Atualizar' : 'Salvar'} Documento
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DocumentUploadForm;
