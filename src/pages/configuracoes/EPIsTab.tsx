
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
import { EPI } from '@/types/funcionario';
import { mockEPIs } from '@/data/funcionarioMockData';
import { Badge } from '@/components/ui/badge';

const epiSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  ca: z.string().min(1, { message: 'Número do CA é obrigatório' }),
  validade: z.number().min(1, { message: 'Validade deve ser pelo menos 1 mês' }),
  descricao: z.string().optional(),
  obrigatorio: z.boolean().default(true),
  instrucoes: z.string().optional(),
  imagem: z.string().optional(),
  ativo: z.boolean().default(true),
});

type EPIFormValues = z.infer<typeof epiSchema>;

const EPIsTab: React.FC = () => {
  const [epis, setEpis] = useState<EPI[]>(mockEPIs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEPI, setEditingEPI] = useState<EPI | null>(null);

  const form = useForm<EPIFormValues>({
    resolver: zodResolver(epiSchema),
    defaultValues: {
      nome: '',
      ca: '',
      validade: 12,
      descricao: '',
      obrigatorio: true,
      instrucoes: '',
      ativo: true,
    },
  });

  const onOpenDialog = (epi?: EPI) => {
    if (epi) {
      setEditingEPI(epi);
      form.reset({
        id: epi.id,
        nome: epi.nome,
        ca: epi.ca,
        validade: epi.validade,
        descricao: epi.descricao || '',
        obrigatorio: epi.obrigatorio,
        instrucoes: epi.instrucoes || '',
        imagem: epi.imagem,
        ativo: epi.ativo,
      });
    } else {
      setEditingEPI(null);
      form.reset({
        nome: '',
        ca: '',
        validade: 12,
        descricao: '',
        obrigatorio: true,
        instrucoes: '',
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (values: EPIFormValues) => {
    if (editingEPI) {
      // Update existing EPI
      const updatedEpis = epis.map(e => 
        e.id === editingEPI.id ? { ...values, id: editingEPI.id } as EPI : e
      );
      setEpis(updatedEpis);
      toast.success(`EPI "${values.nome}" atualizado com sucesso!`);
    } else {
      // Create new EPI
      const newEPI: EPI = {
        ...values,
        id: `epi-${Date.now()}`,
      };
      setEpis(prev => [...prev, newEPI]);
      toast.success(`EPI "${values.nome}" criado com sucesso!`);
    }
    setDialogOpen(false);
  };

  const toggleAtivo = (id: string) => {
    const updatedEpis = epis.map(epi => 
      epi.id === id ? { ...epi, ativo: !epi.ativo } : epi
    );
    setEpis(updatedEpis);
    
    const epi = updatedEpis.find(e => e.id === id);
    if (epi) {
      toast.success(`EPI "${epi.nome}" ${epi.ativo ? 'ativado' : 'desativado'} com sucesso!`);
    }
  };

  const deleteEPI = (id: string) => {
    // In a real application, you would check if the EPI is being used by any function
    const epiToDelete = epis.find(e => e.id === id);
    setEpis(prev => prev.filter(epi => epi.id !== id));
    
    if (epiToDelete) {
      toast.success(`EPI "${epiToDelete.nome}" excluído com sucesso!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gerenciamento de EPIs</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => onOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo EPI
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingEPI ? 'Editar' : 'Novo'} EPI</DialogTitle>
              <DialogDescription>
                {editingEPI
                  ? 'Edite as informações do EPI existente.'
                  : 'Preencha as informações para cadastrar um novo EPI.'}
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
                          <Input {...field} placeholder="Nome do EPI" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do CA*</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Certificado de Aprovação" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="validade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade (em meses)*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          min={1}
                        />
                      </FormControl>
                      <FormDescription>
                        Período de validade do EPI em meses
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
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Descrição sobre o uso e finalidade do EPI"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instrucoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instruções de Uso</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Orientações específicas para uso do EPI"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Descreva como o EPI deve ser utilizado, conservado e inspecionado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="obrigatorio"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Obrigatório</FormLabel>
                        </div>
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
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {editingEPI ? 'Salvar Alterações' : 'Cadastrar EPI'}
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
                <TableHead>CA</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead className="hidden md:table-cell">Detalhes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {epis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum EPI cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                epis.map((epi) => (
                  <TableRow key={epi.id}>
                    <TableCell className="font-medium">
                      {epi.nome}
                      {epi.obrigatorio && (
                        <Badge variant="destructive" className="ml-2">Obrigatório</Badge>
                      )}
                    </TableCell>
                    <TableCell>{epi.ca}</TableCell>
                    <TableCell>{epi.validade} {epi.validade === 1 ? 'mês' : 'meses'}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {epi.descricao}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={epi.ativo} 
                          onCheckedChange={() => toggleAtivo(epi.id)}
                          aria-label={`EPI ${epi.ativo ? 'ativo' : 'inativo'}`}
                        />
                        <Label className="text-sm">{epi.ativo ? 'Ativo' : 'Inativo'}</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onOpenDialog(epi)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteEPI(epi.id)}>
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

export default EPIsTab;
