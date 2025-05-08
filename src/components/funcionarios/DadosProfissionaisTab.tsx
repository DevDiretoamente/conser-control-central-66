
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
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { mockFuncoes } from '@/data/funcionarioMockData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DadosProfissionaisTabProps {
  form: UseFormReturn<Funcionario>;
}

const DadosProfissionaisTab: React.FC<DadosProfissionaisTabProps> = ({ form }) => {
  return (
    <ScrollArea className="h-[calc(100vh-250px)] pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="dadosProfissionais.funcaoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
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
                  <SelectItem value="">Selecione uma função</SelectItem>
                  {mockFuncoes.filter(f => f.ativo).map((funcao) => (
                    <SelectItem key={funcao.id} value={funcao.id}>
                      {funcao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dadosProfissionais.cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo*</FormLabel>
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
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="motorista">Motorista</SelectItem>
                  <SelectItem value="auxiliar_administrativo">Auxiliar Administrativo</SelectItem>
                  <SelectItem value="engenheiro">Engenheiro</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="diretor">Diretor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dadosProfissionais.salario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salário*</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0,00" 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dadosProfissionais.dataAdmissao"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Admissão*</FormLabel>
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
          name="dadosProfissionais.ctpsNumero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da CTPS*</FormLabel>
              <FormControl>
                <Input placeholder="Número da CTPS" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dadosProfissionais.ctpsSerie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Série da CTPS*</FormLabel>
              <FormControl>
                <Input placeholder="Série da CTPS" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dadosProfissionais.pis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIS*</FormLabel>
              <FormControl>
                <Input placeholder="PIS" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dadosProfissionais.tituloEleitor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de Eleitor</FormLabel>
              <FormControl>
                <Input placeholder="Título de Eleitor" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dadosProfissionais.certificadoReservista"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificado de Reservista</FormLabel>
              <FormControl>
                <Input placeholder="Certificado de Reservista" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </ScrollArea>
  );
};

export default DadosProfissionaisTab;
