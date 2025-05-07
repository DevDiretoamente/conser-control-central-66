
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
import { Setor } from '@/types/funcionario';
import { mockSetores } from '@/data/funcionarioMockData';

const setorSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  descricao: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  ativo: z.boolean().default(true),
});

type SetorFormValues = z.infer<typeof setorSchema>;

const SetoresTab: React.FC = () => {
  const [setores, setSetores] = useState<Setor[]>(mockSetores);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Setor | null>(null);

  const form = useForm<SetorFormValues>({
    resolver: zodResolver(setorSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      ativo: true,
    },
  });

  const onOpenDialog = (setor?: Setor) => {
    if (setor) {
      setEditingSetor(setor);
      form.reset({
        id: setor.id,
        nome: setor.nome,
        descricao: setor.descricao,
        ativo: setor.ativo,
      });
    } else {
      setEditingSetor(null);
      form.reset({
        nome: '',
        descricao: '',
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (values: SetorFormValues) => {
    if (editingSetor) {
      // Update existing setor
      const updatedSetores = setores.map(s => 
        s.id === editingSetor.id ? { ...values, id: editingSetor.id } as Setor : s
      );
      setSetores(updatedSetores);
      toast.success(`Setor "${values.nome}" atualizado com sucesso!`);
    } else {
      // Create new setor
      const newSetor: Setor = {
        ...values,
        id: `setor-${Date.now()}`,
      };
      setSetores(prev => [...prev, newSetor]);
      toast.success(`Setor "${values.nome}" criado com sucesso!`);
    }
    setDialogOpen(false);
  };

  const toggleAtivo = (id: string) => {
    const updatedSetores = setores.map(setor => 
      setor.id === id ? { ...setor, ativo: !setor.ativo } : setor
    );
    setSetores(updatedSetores);
    
    const setor = updatedSetores.find(s => s.id === id);
    if (setor) {
      toast.success(`Setor "${setor.nome}" ${setor.ativo ? 'ativado' : 'desativado'} com sucesso!`);
    }
  };

  const deleteSetor = (id: string) => {
    // In a real application, you would check if the setor is being used by any function
    // Here, we'll just remove it from the list
    const setorToDelete = setores.find(s => s.id === id);
    setSetores(prev => prev.filter(setor => setor.id !== id));
    
    if (setorToDelete) {
      toast.success(`Setor "${setorToDelete.nome}" excluído com sucesso!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Gerenciamento de Setores</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => onOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingSetor ? 'Editar' : 'Novo'} Setor</DialogTitle>
              <DialogDescription>
                {editingSetor
                  ? 'Edite as informações do setor existente.'
                  : 'Preencha as informações para criar um novo setor.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome do setor" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição*</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Descrição detalhada do setor"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Ativo</FormLabel>
                        <FormDescription>
                          Determina se o setor está disponível para uso
                        </FormDescription>
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
                <DialogFooter>
                  <Button type="submit">
                    {editingSetor ? 'Salvar Alterações' : 'Cadastrar Setor'}
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
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {setores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum setor cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                setores.map((setor) => (
                  <TableRow key={setor.id}>
                    <TableCell className="font-medium">{setor.nome}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {setor.descricao}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={setor.ativo} 
                          onCheckedChange={() => toggleAtivo(setor.id)}
                          aria-label={`Setor ${setor.ativo ? 'ativo' : 'inativo'}`}
                        />
                        <Label className="text-sm">{setor.ativo ? 'Ativo' : 'Inativo'}</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onOpenDialog(setor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteSetor(setor.id)}>
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

export default SetoresTab;
