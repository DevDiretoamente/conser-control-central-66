
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario } from '@/types/funcionario';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import DocumentUploader from './DocumentUploader';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CNHTabProps {
  form: UseFormReturn<Funcionario>;
  onCNHFileChange?: (file: File | null) => void;
  cnhFile?: File | null;
}

const CNHTab: React.FC<CNHTabProps> = ({ form, onCNHFileChange, cnhFile }) => {
  // Ensure CNH data exists in the form
  React.useEffect(() => {
    if (!form.getValues('cnh')) {
      form.setValue('cnh', { 
        numero: '',
        categoria: '',
        validade: undefined,
      });
    }
  }, [form]);

  return (
    <ScrollArea className="h-[calc(100vh-250px)] pr-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cnh.numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da CNH</FormLabel>
                <FormControl>
                  <Input placeholder="Número da CNH" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cnh.categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Não possui</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cnh.validade"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Validade</FormLabel>
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
                          format(new Date(field.value), "dd/MM/yyyy")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {onCNHFileChange && (
          <div className="mt-6">
            <DocumentUploader 
              label="Documento da CNH"
              description="PDF ou imagem da CNH" 
              allowedTypes=".pdf,.jpg,.jpeg,.png"
              onFileChange={onCNHFileChange}
              value={cnhFile}
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default CNHTab;
