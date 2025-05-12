
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, Plus, Trash2, HardHat, 
  FileText, Shirt, Loader2, Search,
  AlertCircle, Eye
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Funcao, ExamesPorTipo } from '@/types/funcionario';
import { mockSetores, mockEPIs, mockExamesMedicos, mockUniformes } from '@/data/funcionarioMockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { funcionesService, createExamesPorTipoFromSelected } from '@/services/funcionesService';

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
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFuncao, setEditingFuncao] = useState<Funcao | null>(null);
  const [funcaoParaExcluir, setFuncaoParaExcluir] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredFuncoes, setFilteredFuncoes] = useState<Funcao[]>([]);
  
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

  // Load functions on component mount
  useEffect(() => {
    loadFuncoes();
  }, []);

  // Filter functions when search term or functions list changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFuncoes(funcoes);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = funcoes.filter(funcao => 
        funcao.nome.toLowerCase().includes(lowerSearchTerm) ||
        funcao.descricao.toLowerCase().includes(lowerSearchTerm) ||
        getSetorNome(funcao.setorId).toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredFuncoes(filtered);
    }
  }, [searchTerm, funcoes]);

  const loadFuncoes = async () => {
    setLoading(true);
    try {
      const data = await funcionesService.getAll();
      setFuncoes(data);
      setFilteredFuncoes(data);
    } catch (error) {
      console.error('Error loading funções:', error);
      toast.error('Erro ao carregar funções. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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

  const onOpenDialog = async (funcao?: Funcao) => {
    if (funcao) {
      try {
        const funcaoData = await funcionesService.getById(funcao.id);
        setEditingFuncao(funcaoData || null);
        
        // Set selected items
        setSelectedEPIs(funcaoData?.epis.map(epi => epi.id) || []);
        setSelectedExamesByType(initializeSelectedExamsFromFuncao(funcaoData || funcao));
        setSelectedUniformes(funcaoData?.uniformes.map(uniforme => uniforme.id) || []);
        setAtribuicoesText(funcaoData?.atribuicoes.join('\n') || '');
        
        form.reset({
          id: funcaoData?.id,
          nome: funcaoData?.nome || '',
          descricao: funcaoData?.descricao || '',
          setorId: funcaoData?.setorId || '',
          atribuicoes: funcaoData?.atribuicoes || [],
          ativo: funcaoData?.ativo ?? true,
        });
      } catch (error) {
        console.error('Error getting função details:', error);
        toast.error('Erro ao carregar detalhes da função');
        return;
      }
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

  const onSubmit = async (values: FuncaoFormValues) => {
    setFormLoading(true);
    
    try {
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

      const funcaoData = {
        nome: values.nome,
        descricao: values.descricao,
        setorId: values.setorId,
        atribuicoes: atribuicoesList,
        epis: selectedEPIObjects,
        examesNecessarios: examesNecessarios,
        uniformes: selectedUniformeObjects,
        ativo: values.ativo
      };

      if (editingFuncao) {
        // Update existing funcao
        await funcionesService.update(editingFuncao.id, funcaoData);
        toast.success(`Função "${values.nome}" atualizada com sucesso!`);
      } else {
        // Create new funcao
        await funcionesService.create(funcaoData as Omit<Funcao, 'id'>);
        toast.success(`Função "${values.nome}" criada com sucesso!`);
      }
      
      // Reload functions after operation
      await loadFuncoes();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving function:', error);
      toast.error(`Erro ao ${editingFuncao ? 'atualizar' : 'criar'} função. Tente novamente.`);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleAtivo = async (id: string) => {
    try {
      const updatedFuncao = await funcionesService.toggleActive(id);
      await loadFuncoes();
      
      toast.success(`Função "${updatedFuncao.nome}" ${updatedFuncao.ativo ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      console.error('Error toggling function status:', error);
      toast.error('Erro ao alterar status da função. Tente novamente.');
    }
  };

  const confirmDeleteFuncao = (id: string) => {
    setFuncaoParaExcluir(id);
  };

  const deleteFuncao = async () => {
    if (!funcaoParaExcluir) return;
    
    try {
      const funcaoName = funcoes.find(f => f.id === funcaoParaExcluir)?.nome || 'função';
      await funcionesService.delete(funcaoParaExcluir);
      await loadFuncoes();
      
      toast.success(`Função "${funcaoName}" excluída com sucesso!`);
    } catch (error) {
      console.error('Error deleting function:', error);
      toast.error('Erro ao excluir função. Tente novamente.');
    } finally {
      setFuncaoParaExcluir(null);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button onClick={() => onOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Função
          </Button>
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
              <Button 
                onClick={form.handleSubmit(onSubmit)} 
                disabled={formLoading}
              >
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingFuncao ? 'Salvar Alterações' : 'Cadastrar Função'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Carregando funções...</p>
            </div>
          ) : filteredFuncoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              {searchTerm ? (
                <>
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhuma função encontrada com o termo "{searchTerm}"</p>
                  <Button variant="link" onClick={() => setSearchTerm('')}>Limpar busca</Button>
                </>
              ) : (
                <>
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhuma função cadastrada</p>
                  <Button variant="link" onClick={() => onOpenDialog()}>Cadastrar primeira função</Button>
                </>
              )}
            </div>
          ) : (
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
                  {filteredFuncoes.map((funcao) => (
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
                          <Button size="sm" variant="outline" title="Ver detalhes" onClick={() => onOpenDialog(funcao)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Editar" onClick={() => onOpenDialog(funcao)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Excluir"
                            onClick={() => confirmDeleteFuncao(funcao.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog */}
      <AlertDialog 
        open={funcaoParaExcluir !== null} 
        onOpenChange={(open) => !open && setFuncaoParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a função selecionada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteFuncao} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FuncoesTab;

