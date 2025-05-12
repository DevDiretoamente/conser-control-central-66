
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ArrowLeft, HardHat, FileText, Shirt } from 'lucide-react';
import { Funcao } from '@/types/funcionario';
import { funcionesService, createExamesPorTipoFromSelected } from '@/services/funcionesService';
import { mockSetores, mockEPIs, mockExamesMedicos, mockUniformes } from '@/data/funcionarioMockData';

// Form schema
const funcaoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  descricao: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  setorId: z.string().min(1, { message: 'Setor é obrigatório' }),
  atribuicoes: z.array(z.string()),
  ativo: z.boolean().default(true),
});

type FuncaoFormValues = z.infer<typeof funcaoSchema>;

const EditarFuncao: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [funcao, setFuncao] = useState<Funcao | null>(null);
  
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
  
  // Load function data
  useEffect(() => {
    const loadFuncao = async () => {
      if (!id) {
        navigate('/funcoes');
        return;
      }
      
      try {
        setLoading(true);
        const funcaoData = await funcionesService.getById(id);
        setFuncao(funcaoData);
        
        if (funcaoData) {
          // Set form values
          form.reset({
            id: funcaoData.id,
            nome: funcaoData.nome,
            descricao: funcaoData.descricao,
            setorId: funcaoData.setorId,
            atribuicoes: funcaoData.atribuicoes,
            ativo: funcaoData.ativo,
          });
          
          // Set selected EPIs, exames, and uniformes
          setSelectedEPIs(funcaoData.epis.map(epi => epi.id));
          setSelectedExamesByType(initializeSelectedExamsFromFuncao(funcaoData));
          setSelectedUniformes(funcaoData.uniformes.map(uniforme => uniforme.id));
          setAtribuicoesText(funcaoData.atribuicoes.join('\n'));
        }
      } catch (error) {
        console.error('Error loading function data:', error);
        toast.error('Erro ao carregar dados da função');
        navigate('/funcoes');
      } finally {
        setLoading(false);
      }
    };
    
    loadFuncao();
  }, [id, navigate, form]);
  
  // Handle form submit
  const onSubmit = async (values: FuncaoFormValues) => {
    if (!id) return;
    
    setSaving(true);
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
      
      await funcionesService.update(id, funcaoData);
      toast.success(`Função "${values.nome}" atualizada com sucesso!`);
      navigate('/funcoes');
    } catch (error) {
      console.error('Error updating function:', error);
      toast.error('Erro ao atualizar função. Tente novamente.');
    } finally {
      setSaving(false);
    }
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
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Carregando dados da função...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/funcoes">Funções</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Editar {funcao?.nome}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Função</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/funcoes/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        rows={3}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div className="pt-4">
                <Button type="submit" className="mr-2" disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => navigate(`/funcoes/${id}`)} disabled={saving}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditarFuncao;
