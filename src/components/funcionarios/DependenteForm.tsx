
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, Dependente } from '@/types/funcionario';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import DocumentUploader from './DocumentUploader';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Schema for the form
const dependenteSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  dataNascimento: z.date({ required_error: 'Data de nascimento é obrigatória' }),
  parentesco: z.string().min(1, { message: 'Parentesco é obrigatório' }),
  cpf: z.string().optional(),
});

type DependenteFormValues = z.infer<typeof dependenteSchema>;

interface DependenteFormProps {
  onAdd: (dependente: Partial<Dependente>) => void;
  onCancel: () => void;
  defaultValues?: Partial<Dependente>;
  isEdit?: boolean;
}

const DependenteForm: React.FC<DependenteFormProps> = ({ 
  onAdd, 
  onCancel, 
  defaultValues,
  isEdit = false,
}) => {
  const [certidaoNascimento, setCertidaoNascimento] = useState<File | null>(null);
  const [outrosDocumentos, setOutrosDocumentos] = useState<File[]>([]);
  
  const form = useForm<DependenteFormValues>({
    resolver: zodResolver(dependenteSchema),
    defaultValues: {
      nome: defaultValues?.nome || '',
      dataNascimento: defaultValues?.dataNascimento || undefined,
      parentesco: defaultValues?.parentesco || '',
      cpf: defaultValues?.cpf || '',
    },
  });
  
  const handleSubmit = (data: DependenteFormValues) => {
    const dependente: Partial<Dependente> = {
      ...data,
      documentos: {
        certidaoNascimento,
        outrosDocumentos,
      },
    };
    onAdd(dependente);
  };
  
  return (
    <Card className="bg-slate-50 mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {isEdit ? 'Editar Dependente' : 'Adicionar Dependente'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do dependente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Nascimento*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parentesco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parentesco*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o parentesco" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cônjuge">Cônjuge</SelectItem>
                        <SelectItem value="Filho(a)">Filho(a)</SelectItem>
                        <SelectItem value="Enteado(a)">Enteado(a)</SelectItem>
                        <SelectItem value="Pai/Mãe">Pai/Mãe</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="CPF do dependente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <DocumentUploader
                label="Certidão de Nascimento"
                description="PDF ou imagem da certidão"
                allowedTypes=".pdf,.jpg,.jpeg,.png"
                onFileChange={setCertidaoNascimento}
                value={certidaoNascimento}
              />
              
              {/* We would need to implement a component similar to MultiDocumentUploader for dependents */}
              {/* For now, just show a placeholder */}
              <div className="w-full">
                <p className="text-sm font-medium mb-2">Outros Documentos</p>
                <Button 
                  variant="outline"
                  className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                  type="button"
                  disabled
                >
                  <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Adicionar documentos</span>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEdit ? 'Atualizar Dependente' : 'Adicionar Dependente'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DependenteForm;
