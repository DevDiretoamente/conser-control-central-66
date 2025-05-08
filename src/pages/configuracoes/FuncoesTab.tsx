
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { Funcao, EPI, ExameMedico, Uniforme, Setor, ExamesPorTipo } from '@/types/funcionario';
import { mockFuncoes, mockSetores, mockEPIs, mockExamesMedicos, mockUniformes } from '@/data/funcionarioMockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HardHat, FileText, Shirt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const funcaoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  descricao: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  setorId: z.string().min(1, { message: 'Setor é obrigatório' }),
  atribuicoes: z.array(z.string()),
  ativo: z.boolean().default(true),
});

type FuncaoFormValues = z.infer<typeof funcaoSchema>;

const FuncoesTab: React.FC = () => {
  const [funcoes, setFuncoes] = useState<Funcao[]>(mockFuncoes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFuncao, setEditingFuncao] = useState<Funcao | null>(null);
  
  // State for multi-select items
  const [selectedEPIs, setSelectedEPIs] = useState<string[]>([]);
  const [selectedExamesByType, setSelectedExamesByType] = useState<Record<string, string[]>>({
    admissional: [],
    periodico: [],
    mudancaFuncao: [],
    retornoTrabalho: [],
    demissional: []
  });
  const [selectedUniformes, setSelectedUniformes] = useState<string[]>([]);
  const [atribuicoesText, setAtribuicoesText] = useState<string>('');
  const [activeExamTypeTab, setActiveExamTypeTab] = useState<string>('admissional');

  const form = useForm<FuncaoFormValues>({
    resolver: zodResolver(funcaoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      setorId: '',
      atribuicoes: [],
      ativo: true,
    },
  });

  // Helper function to initialize selected exams from existing function
  const initializeSelectedExamsFromFuncao = (funcao: Funcao) => {
    const examesByType: Record<string, string[]> = {
      admissional: [],
      periodico: [],
      mudancaFuncao: [],
      retornoTrabalho: [],
      demissional: []
    };
    
    if (funcao.examesNecessarios) {
      // Get exam IDs for each type
      examesByType.admissional = funcao.examesNecessarios.admissional.map(exame => exame.id);
      examesByType.periodico = funcao.examesNecessarios.periodico.map(exame => exame.id);
      examesByType.mudancaFuncao = funcao.examesNecessarios.mudancaFuncao.map(exame => exame.id);
      examesByType.retornoTrabalho = funcao.examesNecessarios.retornoTrabalho.map(exame => exame.id);
      examesByType.demissional = funcao.examesNecessarios.demissional.map(exame => exame.id);
    }
    
    return examesByType;
  };

  // Helper function to create an ExamesPorTipo object from selected exam IDs
  const createExamesPorTipoFromSelected = (selectedByType: Record<string, string[]>): ExamesPorTipo => {
    const result: ExamesPorTipo = {
      admissional: [],
      periodico: [],
      mudancaFuncao: [],
      retornoTrabalho: [],
      demissional: []
    };
    
    // For each type, get the full exam objects
    Object.keys(selectedByType).forEach(type => {
      const tipoKey = type as keyof ExamesPorTipo;
      result[tipoKey] = mockExamesMedicos.filter(exame => 
        selectedByType[type].includes(exame.id) && exame.ativo
      );
    });
    
    return result;
  };

  const onOpenDialog = (funcao?: Funcao) => {
    if (funcao) {
      setEditingFuncao(funcao);
      
      // Set selected items
      setSelectedEPIs(funcao.epis.map(epi => epi.id));
      setSelectedExamesByType(initializeSelectedExamsFromFuncao(funcao));
      setSelectedUniformes(funcao.uniformes.map(uniforme => uniforme.id));
      setAtribuicoesText(funcao.atribuicoes.join('\n'));
      
      form.reset({
        id: funcao.id,
        nome: funcao.nome,
        descricao: funcao.descricao,
        setorId: funcao.setorId,
        atribuicoes: funcao.atribuicoes,
        ativo: funcao.ativo,
      });
    } else {
      setEditingFuncao(null);
      setSelectedEPIs([]);
      setSelectedExamesByType({
        admissional: [],
        periodico: [],
        mudancaFuncao: [],
        retornoTrabalho: [],
        demissional: []
      });
      setSelectedUniformes([]);
      setAtribuicoesText('');
      
      form.reset({
        nome: '',
        descricao: '',
        setorId: '',
        atribuicoes: [],
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (values: FuncaoFormValues) => {
    // Process atribuições from textarea
    const atribuicoesList = atribuicoesText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.trim());
    
    // Get full objects for EPIs and uniformes
    const selectedEPIObjects = mockEPIs.filter(epi => selectedEPIs.includes(epi.id));
    const selectedUniformeObjects = mockUniformes.filter(uniforme => selectedUniformes.includes(uniforme.id));
    
    // Create the examesNecessarios object from selected exam IDs
    const examesNecessarios = createExamesPorTipoFromSelected(selectedExamesByType);

    if (editingFuncao) {
      // Update existing funcao
      const updatedFuncoes = funcoes.map(f => 
        f.id === editingFuncao.id ? { 
          ...values, 
          id: editingFuncao.id,
          atribuicoes: atribuicoesList,
          epis: selectedEPIObjects,
          examesNecessarios: examesNecessarios,
          uniformes: selectedUniformeObjects
        } as Funcao : f
      );
      setFuncoes(updatedFuncoes);
      toast.success(`Função "${values.nome}" atualizada com sucesso!`);
    } else {
      // Create new funcao
      const newFuncao: Funcao = {
        id: `funcao-${Date.now()}`,
        nome: values.nome,
        descricao: values.descricao,
        setorId: values.setorId,
        atribuicoes: atribuicoesList,
        epis: selectedEPIObjects,
        examesNecessarios: examesNecessarios,
        uniformes: selectedUniformeObjects,
        ativo: values.ativo
      };
      setFuncoes(prev => [...prev, newFuncao]);
      toast.success(`Função "${values.nome}" criada com sucesso!`);
    }
    setDialogOpen(false);
  };

  const toggleAtivo = (id: string) => {
    const updatedFuncoes = funcoes.map(funcao => 
      funcao.id === id ? { ...funcao, ativo: !funcao.ativo } : funcao
    );
    setFuncoes(updatedFuncoes);
    
    const funcao = updatedFuncoes.find(f => f.id === id);
    if (funcao) {
      toast.success(`Função "${funcao.nome}" ${funcao.ativo ? 'ativada' : 'desativada'} com sucesso!`);
    }
  };

  const deleteFuncao = (id: string) => {
    // In a real application, you would check if the funcao is being used by any employee
    const funcaoToDelete = funcoes.find(f => f.id === id);
    setFuncoes(prev => prev.filter(funcao => funcao.id !== id));
    
    if (funcaoToDelete) {
      toast.success(`Função "${funcaoToDelete.nome}" excluída com sucesso!`);
    }
  };

  const getSetorNome = (setorId: string) => {
    const setor = mockSetores.find(s => s.id === setorId);
    return setor ? setor.nome : 'Setor não encontrado';
  };

  // Handle checkbox change for EPIs and uniformes
  const handleCheckboxChange = (
    id: string, 
    currentSelected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentSelected.includes(id)) {
      setSelected(currentSelected.filter(item => item !== id));
    } else {
      setSelected([...currentSelected, id]);
    }
  };

  // Handle checkbox change for exams (by type)
  const handleExamCheckboxChange = (examId: string, type: string) => {
    setSelectedExamesByType(prev => {
      const currentTypeSelected = prev[type] || [];
      let updatedTypeSelected;
      
      if (currentTypeSelected.includes(examId)) {
        updatedTypeSelected = currentTypeSelected.filter(id => id !== examId);
      } else {
        updatedTypeSelected = [...currentTypeSelected, examId];
      }
      
      return {
        ...prev,
        [type]: updatedTypeSelected
      };
    });
  };

  // Helper to get total exam count across all types
  const getTotalExamCount = (examesNecessarios: ExamesPorTipo): number => {
    const uniqueExamIds = new Set<string>();
    
    Object.values(examesNecessarios).forEach(exams => {
      exams.forEach(exam => uniqueExamIds.add(exam.id));
    });
    
    return uniqueExamIds.size;
  };

  // Helper to filter exams for display based on which types they support
  const getExamsForType = (tipo: string) => {
    return mockExamesMedicos
      .filter(exame => exame.ativo && exame.tipos.includes(tipo as any))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  };

  const examTypeTabs = [
    { value: 'admissional', label: 'Admissional' },
    { value: 'periodico', label: 'Periódico' },
    { value: 'mudancaFuncao', label: 'Mudança de Função' },
    { value: 'retornoTrabalho', label: 'Retorno ao Trabalho' },
    { value: 'demissional', label: 'Demissional' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gerenciamento de Funções</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => onOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Função
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{editingFuncao ? 'Editar' : 'Nova'} Função</DialogTitle>
              <DialogDescription>
                {editingFuncao
                  ? 'Edite as informações da função existente.'
                  : 'Preencha as informações para cadastrar uma nova função.'}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-4 max-h-[calc(90vh-180px)]">
              <div className="pb-6">
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
                              <Input {...field} placeholder="Nome da função" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="setorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Setor*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar setor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockSetores.filter(s => s.ativo).map((setor) => (
                                  <SelectItem key={setor.id} value={setor.id}>
                                    {setor.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Setor ao qual esta função está vinculada
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição*</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Descrição detalhada da função"
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormItem>
                      <FormLabel>Atribuições</FormLabel>
                      <FormControl>
                        <Textarea 
                          value={atribuicoesText}
                          onChange={(e) => setAtribuicoesText(e.target.value)}
                          placeholder="Cada atribuição em uma linha (conforme PGR)"
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Liste as atribuições da função conforme PGR (uma por linha)
                      </FormDescription>
                    </FormItem>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* EPIs Selection */}
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <HardHat className="h-4 w-4" />
                          <FormLabel>EPIs Necessários</FormLabel>
                        </div>
                        <Card>
                          <ScrollArea className="h-[200px]">
                            <CardContent className="pt-2">
                              {mockEPIs.filter(epi => epi.ativo).map((epi) => (
                                <div key={epi.id} className="flex items-center space-x-2 py-2 border-b">
                                  <Checkbox 
                                    id={`epi-${epi.id}`}
                                    checked={selectedEPIs.includes(epi.id)}
                                    onCheckedChange={() => 
                                      handleCheckboxChange(epi.id, selectedEPIs, setSelectedEPIs)
                                    }
                                  />
                                  <Label htmlFor={`epi-${epi.id}`} className="flex-1 flex items-center justify-between">
                                    <span>{epi.nome}</span>
                                    {epi.obrigatorio && <Badge variant="destructive" className="ml-2">Obrigatório</Badge>}
                                  </Label>
                                </div>
                              ))}
                            </CardContent>
                          </ScrollArea>
                        </Card>
                        <FormDescription>
                          Selecione os EPIs necessários para esta função
                        </FormDescription>
                      </FormItem>

                      {/* Uniformes Selection */}
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <Shirt className="h-4 w-4" />
                          <FormLabel>Uniformes Necessários</FormLabel>
                        </div>
                        <Card>
                          <ScrollArea className="h-[200px]">
                            <CardContent className="pt-2">
                              {mockUniformes.map((uniforme) => (
                                <div key={uniforme.id} className="flex items-center space-x-2 py-2 border-b">
                                  <Checkbox 
                                    id={`uniforme-${uniforme.id}`}
                                    checked={selectedUniformes.includes(uniforme.id)}
                                    onCheckedChange={() => 
                                      handleCheckboxChange(uniforme.id, selectedUniformes, setSelectedUniformes)
                                    }
                                  />
                                  <Label htmlFor={`uniforme-${uniforme.id}`}>
                                    {uniforme.descricao}
                                  </Label>
                                </div>
                              ))}
                            </CardContent>
                          </ScrollArea>
                        </Card>
                        <FormDescription>
                          Selecione os uniformes necessários para esta função
                        </FormDescription>
                      </FormItem>
                    </div>

                    {/* Exames Selection with Tabs */}
                    <FormItem className="col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <FormLabel>Exames Médicos por Tipo</FormLabel>
                      </div>
                      <Card>
                        <CardContent className="pt-2">
                          <Tabs value={activeExamTypeTab} onValueChange={setActiveExamTypeTab}>
                            <TabsList className="mb-4 grid grid-cols-5">
                              {examTypeTabs.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                                  {tab.label}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {examTypeTabs.map((tab) => (
                              <TabsContent key={tab.value} value={tab.value}>
                                <div className="mb-2 flex justify-between items-center">
                                  <span className="text-sm font-medium">Exames para {tab.label}</span>
                                  <Badge variant="outline">
                                    {selectedExamesByType[tab.value]?.length || 0} selecionados
                                  </Badge>
                                </div>
                                <ScrollArea className="h-[200px] border rounded-md p-2">
                                  {getExamsForType(tab.value).length === 0 ? (
                                    <div className="text-center text-muted-foreground p-4">
                                      Não há exames disponíveis para este tipo
                                    </div>
                                  ) : (
                                    getExamsForType(tab.value).map((exame) => (
                                      <div key={exame.id} className="flex items-center space-x-2 py-2 border-b">
                                        <Checkbox 
                                          id={`exame-${tab.value}-${exame.id}`}
                                          checked={selectedExamesByType[tab.value]?.includes(exame.id) || false}
                                          onCheckedChange={() => handleExamCheckboxChange(exame.id, tab.value)}
                                        />
                                        <div className="flex-1">
                                          <Label htmlFor={`exame-${tab.value}-${exame.id}`} className="font-medium">
                                            {exame.nome}
                                          </Label>
                                          {exame.descricao && (
                                            <p className="text-xs text-muted-foreground">{exame.descricao}</p>
                                          )}
                                        </div>
                                        {exame.periodicidade && (
                                          <Badge variant="outline" className="ml-auto">
                                            {exame.periodicidade} meses
                                          </Badge>
                                        )}
                                      </div>
                                    ))
                                  )}
                                </ScrollArea>
                                <FormDescription className="mt-2">
                                  Selecione os exames necessários para {tab.label.toLowerCase()}
                                </FormDescription>
                              </TabsContent>
                            ))}
                          </Tabs>
                        </CardContent>
                      </Card>
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
                            <FormLabel>Função Ativa</FormLabel>
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
                {editingFuncao ? 'Salvar Alterações' : 'Cadastrar Função'}
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
                  <TableHead>Setor</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead>Requisitos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhuma função cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  funcoes.map((funcao) => (
                    <TableRow key={funcao.id}>
                      <TableCell className="font-medium">{funcao.nome}</TableCell>
                      <TableCell>{getSetorNome(funcao.setorId)}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {funcao.descricao}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <HardHat className="h-3 w-3" />
                            {funcao.epis.length}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {getTotalExamCount(funcao.examesNecessarios)}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Shirt className="h-3 w-3" />
                            {funcao.uniformes.length}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={funcao.ativo} 
                            onCheckedChange={() => toggleAtivo(funcao.id)}
                            aria-label={`Função ${funcao.ativo ? 'ativa' : 'inativa'}`}
                          />
                          <Label className="text-sm">{funcao.ativo ? 'Ativa' : 'Inativa'}</Label>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => onOpenDialog(funcao)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteFuncao(funcao.id)}>
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

export default FuncoesTab;
