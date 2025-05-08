
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
import { ExameMedico, PrecoClinica } from '@/types/funcionario';
import { mockExamesMedicos } from '@/data/funcionarioMockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock das clínicas disponíveis - limitado a apenas RP e Sindiconvenios conforme solicitado
const mockClinicas = [
  { id: '1', nome: 'RP Medicina e Segurança do Trabalho' },
  { id: '2', nome: 'Sindiconvenios' },
];

const exameSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  tipos: z.array(z.enum(['admissional', 'periodico', 'mudancaFuncao', 'retornoTrabalho', 'demissional'])),
  periodicidade: z.number().optional(),
  descricao: z.string().optional(),
  orientacoes: z.string().optional(),
  precosPorClinica: z.array(z.object({
    clinicaId: z.string(),
    clinicaNome: z.string(),
    valor: z.number(),
  })).default([]),
  clinicasDisponiveis: z.array(z.string()).optional(),
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

interface PrecoFormData {
  [clinicaId: string]: string; // Valor como string para input
}

const ExamesMedicosTab: React.FC = () => {
  const [exames, setExames] = useState<ExameMedico[]>(mockExamesMedicos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExame, setEditingExame] = useState<ExameMedico | null>(null);
  const [precos, setPrecos] = useState<PrecoFormData>({});
  const [tiposSelecionados, setTiposSelecionados] = useState<Record<string, boolean>>({});

  const form = useForm<ExameFormValues>({
    resolver: zodResolver(exameSchema),
    defaultValues: {
      nome: '',
      tipos: [],
      periodicidade: undefined,
      descricao: '',
      orientacoes: '',
      precosPorClinica: [],
      clinicasDisponiveis: [],
      ativo: true,
    },
  });

  const watchTipos = form.watch('tipos');

  const onOpenDialog = (exame?: ExameMedico) => {
    if (exame) {
      setEditingExame(exame);
      
      // Inicializa os preços no formato de input
      const precosInit: PrecoFormData = {};
      exame.precosPorClinica.forEach(preco => {
        precosInit[preco.clinicaId] = preco.valor.toString();
      });
      setPrecos(precosInit);
      
      // Inicializa os tipos selecionados
      const tiposInit: Record<string, boolean> = {};
      tiposExame.forEach(tipo => {
        tiposInit[tipo.value] = exame.tipos.includes(tipo.value as any);
      });
      setTiposSelecionados(tiposInit);
      
      form.reset({
        id: exame.id,
        nome: exame.nome,
        tipos: exame.tipos,
        periodicidade: exame.periodicidade,
        descricao: exame.descricao || '',
        orientacoes: exame.orientacoes || '',
        precosPorClinica: exame.precosPorClinica || [],
        clinicasDisponiveis: exame.clinicasDisponiveis || [],
        ativo: exame.ativo,
      });
    } else {
      setEditingExame(null);
      
      // Inicializa os preços vazios
      const precosInit: PrecoFormData = {};
      mockClinicas.forEach(clinica => {
        precosInit[clinica.id] = '';
      });
      setPrecos(precosInit);
      
      // Inicializa os tipos desmarcados
      const tiposInit: Record<string, boolean> = {};
      tiposExame.forEach(tipo => {
        tiposInit[tipo.value] = false;
      });
      setTiposSelecionados(tiposInit);
      
      form.reset({
        nome: '',
        tipos: [],
        periodicidade: undefined,
        descricao: '',
        orientacoes: '',
        precosPorClinica: [],
        clinicasDisponiveis: [],
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (values: ExameFormValues) => {    
    // Processar os preços das clínicas
    const precosPorClinica: PrecoClinica[] = Object.entries(precos)
      .filter(([_, valor]) => valor !== '')
      .map(([clinicaId, valorStr]) => {
        const clinica = mockClinicas.find(c => c.id === clinicaId);
        return {
          clinicaId,
          clinicaNome: clinica?.nome || '',
          valor: parseFloat(valorStr) || 0
        };
      });
    
    // Processar os tipos selecionados
    const tiposSelecionadosArray = Object.entries(tiposSelecionados)
      .filter(([_, selecionado]) => selecionado)
      .map(([tipo, _]) => tipo as 'admissional' | 'periodico' | 'mudancaFuncao' | 'retornoTrabalho' | 'demissional');
    
    // Clínicas disponíveis são aquelas que têm preço definido
    const clinicasDisponiveis = precosPorClinica.map(p => {
      const clinica = mockClinicas.find(c => c.id === p.clinicaId);
      return clinica?.nome || '';
    });
    
    if (editingExame) {
      // Update existing exame
      const updatedExame = {
        ...values,
        id: editingExame.id,
        tipos: tiposSelecionadosArray,
        precosPorClinica: precosPorClinica,
        clinicasDisponiveis: clinicasDisponiveis
      };
      
      const updatedExames = exames.map(e => 
        e.id === editingExame.id ? updatedExame as ExameMedico : e
      );
      setExames(updatedExames);
      toast.success(`Exame "${values.nome}" atualizado com sucesso!`);
    } else {
      // Create new exame
      const newExame: ExameMedico = {
        id: `exam-${Date.now()}`,
        nome: values.nome,
        tipos: tiposSelecionadosArray,
        periodicidade: values.periodicidade,
        descricao: values.descricao,
        orientacoes: values.orientacoes,
        precosPorClinica: precosPorClinica,
        clinicasDisponiveis: clinicasDisponiveis,
        ativo: values.ativo
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
    const exameToDelete = exames.find(e => e.id === id);
    setExames(prev => prev.filter(exame => exame.id !== id));
    
    if (exameToDelete) {
      toast.success(`Exame "${exameToDelete.nome}" excluído com sucesso!`);
    }
  };

  const handleTipoChange = (tipo: string, checked: boolean) => {
    setTiposSelecionados(prev => ({
      ...prev,
      [tipo]: checked
    }));
    
    // Atualizar o formState
    const novosTipos = Object.entries({...tiposSelecionados, [tipo]: checked})
      .filter(([_, selecionado]) => selecionado)
      .map(([t, _]) => t as 'admissional' | 'periodico' | 'mudancaFuncao' | 'retornoTrabalho' | 'demissional');
      
    form.setValue('tipos', novosTipos);
  };

  const getTipoLabel = (tipo: string) => {
    return tiposExame.find(t => t.value === tipo)?.label || tipo;
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{editingExame ? 'Editar' : 'Novo'} Exame Médico</DialogTitle>
              <DialogDescription>
                {editingExame
                  ? 'Edite as informações do exame existente.'
                  : 'Preencha as informações para cadastrar um novo exame.'}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-4 max-h-[calc(90vh-180px)]">
              <div className="pb-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    
                    <div className="space-y-2">
                      <Label>Tipos de Exame*</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {tiposExame.map((tipo) => (
                          <div key={tipo.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tipo-${tipo.value}`}
                              checked={tiposSelecionados[tipo.value] || false}
                              onCheckedChange={(checked) => handleTipoChange(tipo.value, checked === true)}
                            />
                            <label 
                              htmlFor={`tipo-${tipo.value}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {tipo.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.tipos && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.tipos.message}
                        </p>
                      )}
                    </div>
                    
                    {tiposSelecionados['periodico'] && (
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

                    <div className="space-y-2">
                      <Label>Preços por Clínica</Label>
                      <div className="space-y-4 border rounded-md p-4">
                        {mockClinicas.map(clinica => (
                          <div key={clinica.id} className="grid grid-cols-2 gap-4 items-center">
                            <Label>{clinica.nome}</Label>
                            <div className="flex items-center">
                              <span className="mr-2">R$</span>
                              <Input 
                                type="number"
                                step="0.01"
                                value={precos[clinica.id] || ''}
                                onChange={(e) => setPrecos(prev => ({
                                  ...prev,
                                  [clinica.id]: e.target.value
                                }))}
                                placeholder="0,00"
                                min={0}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormDescription>
                        Configure os preços do exame para cada clínica
                      </FormDescription>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
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
                  </form>
                </Form>
              </div>
            </ScrollArea>
            <DialogFooter className="flex-shrink-0 pt-2">
              <Button onClick={form.handleSubmit(onSubmit)}>
                {editingExame ? 'Salvar Alterações' : 'Cadastrar Exame'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipos</TableHead>
                  <TableHead>Periodicidade</TableHead>
                  <TableHead className="hidden md:table-cell">Clínicas</TableHead>
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
                        <div className="flex flex-wrap gap-1">
                          {exame.tipos.map(tipo => (
                            <Badge key={tipo} className={getTipoBadgeColor(tipo)}>
                              {getTipoLabel(tipo)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {exame.periodicidade 
                          ? `${exame.periodicidade} ${exame.periodicidade === 1 ? 'mês' : 'meses'}`
                          : '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          {exame.precosPorClinica.map(preco => (
                            <div key={preco.clinicaId}>
                              {preco.clinicaNome}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco.valor)}
                            </div>
                          ))}
                        </div>
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamesMedicosTab;
