
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, ExameRealizado } from '@/types/funcionario';
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
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import DocumentUploader from './DocumentUploader';

interface ExamesMedicosTabProps {
  form: UseFormReturn<Funcionario>;
}

const ExamesMedicosTab: React.FC<ExamesMedicosTabProps> = ({ form }) => {
  const [documentoExame, setDocumentoExame] = useState<File | null>(null);
  const examesRealizados = form.watch('examesRealizados') || [];
  
  const adicionarExame = () => {
    const novoExame: ExameRealizado = {
      exameId: '',
      tipoSelecionado: 'admissional',
      dataRealizado: new Date(),
      dataValidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      resultado: 'Apto',
      documento: null,
      observacoes: ''
    };
    
    form.setValue('examesRealizados', [...examesRealizados, novoExame]);
  };
  
  const removerExame = (index: number) => {
    const novosExames = [...examesRealizados];
    novosExames.splice(index, 1);
    form.setValue('examesRealizados', novosExames);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Exames Médicos</h3>
        <Button type="button" onClick={adicionarExame}>Adicionar Exame</Button>
      </div>
      
      {examesRealizados.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              Nenhum exame médico registrado. Clique em "Adicionar Exame" para registrar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {examesRealizados.map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Exame {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerExame(index)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`examesRealizados.${index}.exameId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Exame</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o exame" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="exam-1">Exame Clínico Ocupacional</SelectItem>
                            <SelectItem value="exam-2">Audiometria</SelectItem>
                            <SelectItem value="exam-3">Espirometria</SelectItem>
                            <SelectItem value="exam-4">Acuidade Visual</SelectItem>
                            <SelectItem value="exam-5">Eletrocardiograma</SelectItem>
                            <SelectItem value="exam-6">Glicemia</SelectItem>
                            <SelectItem value="exam-7">Raio-X Coluna Lombar</SelectItem>
                            <SelectItem value="exam-8">Exame Toxicológico</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`examesRealizados.${index}.tipoSelecionado`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Exame</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admissional">Admissional</SelectItem>
                            <SelectItem value="periodico">Periódico</SelectItem>
                            <SelectItem value="mudancaFuncao">Mudança de Função</SelectItem>
                            <SelectItem value="retornoTrabalho">Retorno ao Trabalho</SelectItem>
                            <SelectItem value="demissional">Demissional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`examesRealizados.${index}.dataRealizado`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data do Exame</FormLabel>
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
                    name={`examesRealizados.${index}.dataValidade`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Validade do Exame</FormLabel>
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
                    name={`examesRealizados.${index}.resultado`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resultado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o resultado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Apto">Apto</SelectItem>
                            <SelectItem value="Apto com restrições">Apto com restrições</SelectItem>
                            <SelectItem value="Inapto temporariamente">Inapto temporariamente</SelectItem>
                            <SelectItem value="Inapto definitivamente">Inapto definitivamente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`examesRealizados.${index}.clinicaId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clínica</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a clínica" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">RP Medicina e Segurança do Trabalho</SelectItem>
                            <SelectItem value="2">Sindiconvenios</SelectItem>
                            <SelectItem value="3">Clínica Saúde</SelectItem>
                            <SelectItem value="4">MedOcupacional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name={`examesRealizados.${index}.observacoes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre o exame"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormLabel>Documento do Exame</FormLabel>
                  <DocumentUploader
                    label="Anexo do Exame"
                    description="PDF ou imagem do resultado do exame"
                    allowedTypes=".pdf,.jpg,.jpeg,.png"
                    onFileChange={(file) => {
                      setDocumentoExame(file);
                      form.setValue(`examesRealizados.${index}.documento`, file as any);
                    }}
                    value={form.getValues(`examesRealizados.${index}.documento`) as File | null}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamesMedicosTab;
