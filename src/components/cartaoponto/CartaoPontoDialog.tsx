

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CartaoPonto, CartaoPontoStatus } from '@/types/cartaoPonto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartaoPontoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartaoPonto?: CartaoPonto;
  onSave: (data: CartaoPontoFormValues) => Promise<void>;
  funcionarioId?: string;
  funcionarioNome?: string;
  isEdit?: boolean;
}

// Schema for form validation
const cartaoPontoSchema = z.object({
  funcionarioId: z.string().min(1, 'ID do funcionário é obrigatório'),
  funcionarioNome: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'),
  horaEntrada: z.string().optional(),
  horaSaida: z.string().optional(),
  inicioAlmoco: z.string().optional(),
  fimAlmoco: z.string().optional(),
  status: z.string() as z.ZodType<CartaoPontoStatus>,
  justificativa: z.string().optional(),
  observacoes: z.string().optional(),
});

export type CartaoPontoFormValues = z.infer<typeof cartaoPontoSchema>;

const CartaoPontoDialog: React.FC<CartaoPontoDialogProps> = ({
  open,
  onOpenChange,
  cartaoPonto,
  onSave,
  funcionarioId,
  funcionarioNome,
  isEdit = false,
}) => {
  const form = useForm<CartaoPontoFormValues>({
    resolver: zodResolver(cartaoPontoSchema),
    defaultValues: {
      funcionarioId: cartaoPonto?.funcionarioId || funcionarioId || '',
      funcionarioNome: cartaoPonto?.funcionarioNome || funcionarioNome || '',
      data: cartaoPonto?.data || new Date().toISOString().split('T')[0],
      horaEntrada: cartaoPonto?.horaEntrada || '',
      horaSaida: cartaoPonto?.horaSaida || '',
      inicioAlmoco: cartaoPonto?.inicioAlmoco || '',
      fimAlmoco: cartaoPonto?.fimAlmoco || '',
      status: cartaoPonto?.status || 'normal',
      justificativa: cartaoPonto?.justificativa || '',
      observacoes: cartaoPonto?.observacoes || '',
    },
  });

  const onSubmit = async (data: CartaoPontoFormValues) => {
    try {
      await onSave(data);
      
      toast({
        title: isEdit ? 'Registro atualizado' : 'Registro criado',
        description: 'Cartão ponto foi salvo com sucesso.',
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar cartão ponto:', error);
      
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o registro.',
        variant: 'destructive',
      });
    }
  };
  
  const title = isEdit ? 'Editar Registro de Ponto' : 'Novo Registro de Ponto';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 pb-2">
                {/* Funcionário read-only */}
                <FormField
                  control={form.control}
                  name="funcionarioNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funcionário</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={true} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Data */}
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Hora de Entrada */}
                  <FormField
                    control={form.control}
                    name="horaEntrada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entrada</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Hora de Saída */}
                  <FormField
                    control={form.control}
                    name="horaSaida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saída</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Início do Almoço */}
                  <FormField
                    control={form.control}
                    name="inicioAlmoco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Início do Almoço</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Fim do Almoço */}
                  <FormField
                    control={form.control}
                    name="fimAlmoco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fim do Almoço</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="approved">Aprovado</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Justificativa */}
                <FormField
                  control={form.control}
                  name="justificativa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justificativa</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Justificativa para irregularidades" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Observações */}
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Observações adicionais" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            
            <DialogFooter className="pt-2">
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CartaoPontoDialog;

