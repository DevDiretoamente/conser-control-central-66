
import React, { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CartaoPonto, CartaoPontoStatus, TipoJornada } from '@/types/cartaoPonto';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isWeekend, parseISO } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  horaExtraInicio: z.string().optional(),
  horaExtraFim: z.string().optional(),
  tipoJornada: z.string() as z.ZodType<TipoJornada>,
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
      horaExtraInicio: cartaoPonto?.horaExtraInicio || '',
      horaExtraFim: cartaoPonto?.horaExtraFim || '',
      tipoJornada: cartaoPonto?.tipoJornada || 'normal',
      status: cartaoPonto?.status || 'normal',
      justificativa: cartaoPonto?.justificativa || '',
      observacoes: cartaoPonto?.observacoes || '',
    },
  });

  // Update tipoJornada when date changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'data' && value.data) {
        try {
          const dateObj = parseISO(value.data);
          const isWeekendDay = isWeekend(dateObj);
          
          // Set tipoJornada based on day of week
          if (isWeekendDay) {
            const isSunday = dateObj.getDay() === 0;
            form.setValue('tipoJornada', isSunday ? 'domingo_feriado' : 'sabado');
          } else {
            form.setValue('tipoJornada', 'normal');
          }
        } catch (error) {
          console.error('Error parsing date:', error);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

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
  
  // Get the current tipoJornada
  const currentTipoJornada = form.watch('tipoJornada');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Tipo de Jornada (read-only, calculated from date) */}
                <FormField
                  control={form.control}
                  name="tipoJornada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Jornada</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={true} // Made read-only as it's calculated from date
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de jornada" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal (Segunda a Sexta)</SelectItem>
                          <SelectItem value="sabado">Sábado (Extras 50% ou 80%)</SelectItem>
                          <SelectItem value="domingo_feriado">Domingo/Feriado (Extras 110%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Hora de Entrada */}
                  <FormField
                    control={form.control}
                    name="horaEntrada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entrada Manhã</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
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
                        <FormLabel>Saída Tarde</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
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
                        <FormLabel>Saída Almoço</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
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
                        <FormLabel>Retorno Almoço</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Hora Extra Início */}
                  <FormField
                    control={form.control}
                    name="horaExtraInicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Início Hora Extra</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Hora Extra Fim */}
                  <FormField
                    control={form.control}
                    name="horaExtraFim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Término Hora Extra</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
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
                          <SelectItem value="dispensado">Dispensado</SelectItem>
                          <SelectItem value="feriado">Feriado</SelectItem>
                          <SelectItem value="falta_justificada">Falta Justificada</SelectItem>
                          <SelectItem value="falta_injustificada">Falta Injustificada</SelectItem>
                          <SelectItem value="sobreaviso">Sobreaviso</SelectItem>
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
