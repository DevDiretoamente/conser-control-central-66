
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
import { Funcao, EPI, ExameMedico, Uniforme, Setor } from '@/types/funcionario';
import { mockFuncoes, mockSetores, mockEPIs, mockExamesMedicos, mockUniformes } from '@/data/funcionarioMockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HardHat, FileText, Shirt } from 'lucide-react';

const funcaoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  descricao: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  setorId: z.string().min(1, { message: 'Setor é obrigatório' }),
  atribuicoes: z.array(z.string()),
  ativo: z.boolean().default(true),
  // These will be handled separately
  // epis: z.array(z.any()),
  // examesNecessarios: z.array(z.any()),
  // uniformes: z.array(z.any()),
});

type FuncaoFormValues = z.infer<typeof funcaoSchema>;

const FuncoesTab: React.FC = () => {
  const [funcoes, setFuncoes] = useState<Funcao[]>(mockFuncoes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFuncao, setEditingFuncao] = useState<Funcao | null>(null);
  
  // State for multi-select items
  const [selectedEPIs, setSelectedEPIs] = useState<string[]>([]);
  const [selectedExames, setSelectedExames] = useState<string[]>([]);
  const [selectedUniformes, setSelectedUniformes] = useState<string[]>([]);
  const [atribuicoesText, setAtribuicoesText] = useState<string>('');

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

  const onOpenDialog = (funcao?: Funcao) => {
    if (funcao) {
      setEditingFuncao(funcao);
      
      // Set selected items
      setSelectedEPIs(funcao.epis.map(epi => epi.id));
      setSelectedExames(funcao.examesNecessarios.map(exame => exame.id));
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
      setSelectedExames([]);
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
    
    // Get full objects for EPIs, exames and uniformes
    const selectedEPIObjects = mockEPIs.filter(epi => selectedEPIs.includes(epi.id));
    const selectedExameObjects = mockExamesMedicos.filter(exame => selectedExames.includes(exame.id));
    const selectedUniformeObjects = mockUniformes.filter(uniforme => selectedUniformes.includes(uniforme.id));
    
    const funcaoData = {
      ...values,
      atribuicoes: atribuicoesList,
      epis: selectedEPIObjects,
      examesNecessarios: selectedExameObjects,
      uniformes: selectedUniformeObjects,
    };

    if (editingFuncao) {
      // Update existing funcao
      const updatedFuncoes = funcoes.map(f => 
        f.id === editingFuncao.id ? { ...funcaoData, id: editingFuncao.id } as Funcao : f
      );
      setFuncoes(updatedFuncoes);
      toast.success(`Função "${values.nome}" atualizada com sucesso!`);
    } else {
      // Create new funcao
      const newFuncao: Funcao = {
        ...funcaoData,
        id: `funcao-${Date.now()}`,
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

  // Handle checkbox change
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
          <DialogContent className="max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingFuncao ? 'Editar' : 'Nova'} Função</DialogTitle>
              <DialogDescription>
                {editingFuncao
                  ? 'Edite as informações da função existente.'
                  : 'Preencha as informações para cadastrar uma nova função.'}
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  {/* Exames Selection */}
                  <FormItem>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      <FormLabel>Exames Necessários</FormLabel>
                    </div>
                    <Card>
                      <ScrollArea className="h-[200px]">
                        <CardContent className="pt-2">
                          {mockExamesMedicos.filter(exame => exame.ativo).map((exame) => (
                            <div key={exame.id} className="flex items-center space-x-2 py-2 border-b">
                              <Checkbox 
                                id={`exame-${exame.id}`}
                                checked={selectedExames.includes(exame.id)}
                                onCheckedChange={() => 
                                  handleCheckboxChange(exame.id, selectedExames, setSelectedExames)
                                }
                              />
                              <Label htmlFor={`exame-${exame.id}`}>
                                {exame.nome}
                              </Label>
                            </div>
                          ))}
                        </CardContent>
                      </ScrollArea>
                    </Card>
                    <FormDescription>
                      Selecione os exames médicos necessários para esta função
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
                
                <DialogFooter>
                  <Button type="submit">
                    {editingFuncao ? 'Salvar Alterações' : 'Cadastrar Função'}
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
                          {funcao.examesNecessarios.length}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default FuncoesTab;
