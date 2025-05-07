
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { ExameMedico } from '@/types/funcionario';
import { mockExamesMedicos } from '@/data/funcionarioMockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const exameSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  tipo: z.enum(['admissional', 'periodico', 'mudancaFuncao', 'retornoTrabalho', 'demissional']),
  periodicidade: z.number().optional(),
  descricao: z.string().optional(),
  valor: z.number().optional(),
  orientacoes: z.string().optional(),
  clinicasRecomendadas: z.array(z.string()).optional(),
  ativo: z.boolean().default(true),
});

type ExameFormValues = z.infer<typeof exameSchema>;

const tiposExame = [
  { value: 'admissional', label: 'Admissional' },
  { value: 'periodico', label: 'Periódico' },
  { value: 'mudancaFuncao', label: 'Mudança de Função' },
  { value: 'retornoTrabalho', label: 'Retorno ao Trabalho' },
  { value: 'demissional', label: 'Demissional' },
];

const ExamesMedicosTab: React.FC = () => {
  const [exames, setExames] = useState<ExameMedico[]>(mockExamesMedicos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExame, setEditingExame] = useState<ExameMedico | null>(null);
  const [clinicas, setClinicas] = useState<string>('');

  const form = useForm<ExameFormValues>({
    resolver: zodResolver(exameSchema),
    defaultValues: {
      nome: '',
      tipo: 'admissional',
      periodicidade: undefined,
      descricao: '',
      valor: undefined,
      orientacoes: '',
      clinicasRecomendadas: [],
      ativo: true,
    },
  });

  const watchTipo = form.watch('tipo');

  const onOpenDialog = (exame?: ExameMedico) => {
    if (exame) {
      setEditingExame(exame);
      setClinicas((exame.clinicasRecomendadas || []).join('\n'));
      form.reset({
        id: exame.id,
        nome: exame.nome,
        tipo: exame.tipo,
        periodicidade: exame.periodicidade,
        descricao: exame.descricao || '',
        valor: exame.valor,
        orientacoes: exame.orientacoes || '',
        clinicasRecomendadas: exame.clinicasRecomendadas || [],
        ativo: exame.ativo,
      });
    } else {
      setEditingExame(null);
      setClinicas('');
      form.reset({
        nome: '',
        tipo: 'admissional',
        periodicidade: undefined,
        descricao: '',
        valor: undefined,
        orientacoes: '',
        clinicasRecomendadas: [],
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (values: ExameFormValues) => {
    // Process clinicas
    const clinicasList = clinicas
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.trim());
    
    if (editingExame) {
      // Update existing exame
      // Here is the fix: Create the new exame object with all required properties
      const updatedExame = {
        ...values,
        id: editingExame.id,
        clinicasRecomendadas: clinicasList
      };
      
      const updatedExames = exames.map(e => 
        e.id === editingExame.id ? updatedExame as ExameMedico : e
      );
      setExames(updatedExames);
      toast.success(`Exame "${values.nome}" atualizado com sucesso!`);
    } else {
      // Create new exame - Fix: Ensure all required properties are set
      const newExame: ExameMedico = {
        id: `exam-${Date.now()}`,
        nome: values.nome, // required
        tipo: values.tipo, // required
        periodicidade: values.periodicidade,
        descricao: values.descricao,
        valor: values.valor,
        orientacoes: values.orientacoes,
        clinicasRecomendadas: clinicasList,
        ativo: values.ativo // required
      };
      setExames(prev => [...prev, newExame]);
      toast.success(`Exame "${values.nome}" criado com sucesso!`);
    }
    setDialogOpen(false);
  };

  const toggleAtivo = (id: string) => {
    const updatedExames = exames.map(exame => 
      exame.id === id ? { ...exame, ativo: !exame.ativo } : exame
    );
    setExames(updatedExames);
    
    const exame = updatedExames.find(e => e.id === id);
    if (exame) {
      toast.success(`Exame "${exame.nome}" ${exame.ativo ? 'ativado' : 'desativado'} com sucesso!`);
    }
  };

  const deleteExame = (id: string) => {
    // In a real application, you would check if the exame is being used by any function
    const exameToDelete = exames.find(e => e.id === id);
    setExames(prev => prev.filter(exame => exame.id !== id));
    
    if (exameToDelete) {
      toast.success(`Exame "${exameToDelete.nome}" excluído com sucesso!`);
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'admissional':
        return 'bg-green-500';
      case 'periodico':
        return 'bg-blue-500';
      case 'mudancaFuncao':
        return 'bg-yellow-500';
      case 'retornoTrabalho':
        return 'bg-purple-500';
      case 'demissional':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTipoExame = (tipo: string) => {
    const tipoExame = tiposExame.find(t => t.value === tipo);
    return tipoExame ? tipoExame.label : tipo;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gerenciamento de Exames Médicos</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => onOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Exame
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingExame ? 'Editar' : 'Novo'} Exame Médico</DialogTitle>
              <DialogDescription>
                {editingExame
                  ? 'Edite as informações do exame existente.'
                  : 'Preencha as informações para cadastrar um novo exame.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome*</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do exame" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposExame.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {watchTipo === 'periodico' && (
                  <FormField
                    control={form.control}
                    name="periodicidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periodicidade (em meses)*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            value={field.value || ''}
                            placeholder="12"
                            min={1}
                          />
                        </FormControl>
                        <FormDescription>
                          Intervalo de tempo para repetição do exame
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Estimado (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value || ''}
                          placeholder="0,00"
                          min={0}
                        />
                      </FormControl>
                      <FormDescription>
                        Custo estimado do exame para fins de orçamento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descri��ão</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Descrição sobre a finalidade do exame"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="orientacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orientações de Preparação</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Orientações específicas para preparação do exame (jejum, etc.)"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Instruções que devem ser seguidas antes de realizar o exame
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>Clínicas Recomendadas</FormLabel>
                  <FormControl>
                    <Textarea 
                      value={clinicas}
                      onChange={(e) => setClinicas(e.target.value)}
                      placeholder="Cada clínica em uma linha"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Liste as clínicas recomendadas (uma por linha)
                  </FormDescription>
                </FormItem>
                
                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>Ativo</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingExame ? 'Salvar Alterações' : 'Cadastrar Exame'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Periodicidade</TableHead>
                <TableHead className="hidden md:table-cell">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exames.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum exame médico cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                exames.map((exame) => (
                  <TableRow key={exame.id}>
                    <TableCell className="font-medium">{exame.nome}</TableCell>
                    <TableCell>
                      <Badge className={getTipoBadgeColor(exame.tipo)}>
                        {formatTipoExame(exame.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {exame.periodicidade 
                        ? `${exame.periodicidade} ${exame.periodicidade === 1 ? 'mês' : 'meses'}`
                        : '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {exame.valor 
                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exame.valor)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={exame.ativo} 
                          onCheckedChange={() => toggleAtivo(exame.id)}
                          aria-label={`Exame ${exame.ativo ? 'ativo' : 'inativo'}`}
                        />
                        <Label className="text-sm">{exame.ativo ? 'Ativo' : 'Inativo'}</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onOpenDialog(exame)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteExame(exame.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamesMedicosTab;
