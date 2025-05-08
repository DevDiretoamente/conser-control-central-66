
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, ExameRealizado } from '@/types/funcionario';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockFuncoes } from '@/data/funcionarioMockData';

interface ExamesMedicosTabProps {
  form: UseFormReturn<Funcionario>;
}

const ExamesMedicosTab: React.FC<ExamesMedicosTabProps> = ({ form }) => {
  const [documentoExame, setDocumentoExame] = useState<File | null>(null);
  const examesRealizados = form.watch('examesRealizados') || [];
  const funcaoId = form.watch('dadosProfissionais.funcaoId');
  const [examesAdmissionais, setExamesAdmissionais] = useState<any[]>([]);
  
  // Carregar exames admissionais baseados na função selecionada
  useEffect(() => {
    if (funcaoId) {
      const funcao = mockFuncoes.find(f => f.id === funcaoId);
      if (funcao && funcao.examesNecessarios && funcao.examesNecessarios.admissional) {
        setExamesAdmissionais(funcao.examesNecessarios.admissional);
      } else {
        setExamesAdmissionais([]);
      }
    } else {
      setExamesAdmissionais([]);
    }
  }, [funcaoId]);
  
  // Garantir que o array examesRealizados esteja inicializado
  useEffect(() => {
    if (!form.getValues('examesRealizados')) {
      form.setValue('examesRealizados', []);
    }
  }, [form]);
  
  const adicionarExameAdmissional = () => {
    // Verifica se já existe um exame admissional
    const existingExams = form.getValues('examesRealizados') || [];
    if (existingExams.length > 0) {
      return; // Já existe um exame admissional, não permite adicionar outro
    }
    
    const novoExame: ExameRealizado = {
      exameId: '',
      tipoSelecionado: 'admissional',
      dataRealizado: new Date(),
      dataValidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      resultado: 'Apto',
      documento: null,
      observacoes: ''
    };
    
    form.setValue('examesRealizados', [...existingExams, novoExame]);
  };
  
  const removerExame = (index: number) => {
    const novosExames = [...examesRealizados];
    novosExames.splice(index, 1);
    form.setValue('examesRealizados', novosExames);
  };
  
  return (
    <ScrollArea className="h-[calc(100vh-250px)] pr-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Exame Admissional</h3>
          {(examesRealizados?.length === 0 || !examesRealizados) && (
            <Button type="button" onClick={adicionarExameAdmissional}>Adicionar ASO</Button>
          )}
        </div>
        
        {(!examesRealizados || examesRealizados.length === 0) ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                Nenhum exame admissional registrado. Clique em "Adicionar ASO" para registrar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {examesRealizados.map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">ASO - Exame Admissional</CardTitle>
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
                          <FormLabel>Validade do ASO</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name={`examesRealizados.${index}.resultado`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resultado</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || "Apto"}
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
                              placeholder="Observações sobre o ASO"
                              className="resize-none"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <FormLabel>ASO (Atestado de Saúde Ocupacional)</FormLabel>
                    <DocumentUploader
                      label="Anexo do ASO"
                      description="PDF ou imagem do ASO"
                      allowedTypes=".pdf,.jpg,.jpeg,.png"
                      onFileChange={(file) => {
                        setDocumentoExame(file);
                        form.setValue(`examesRealizados.${index}.documento`, file as any);
                      }}
                      value={form.getValues(`examesRealizados.${index}.documento`) as File | null}
                    />
                  </div>
                  
                  {examesAdmissionais.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Exames inclusos no ASO:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {examesAdmissionais.map((exame) => (
                          <li key={exame.id} className="text-sm border rounded p-2 bg-muted">
                            {exame.nome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!funcaoId && examesRealizados && examesRealizados.length > 0 && (
          <Card>
            <CardContent className="pt-4">
              <p className="text-center text-amber-500 flex items-center justify-center gap-2">
                <span>⚠️</span> Selecione uma função para ver os exames necessários para o ASO
              </p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Observação:</strong> Os exames periódicos, de mudança de função, retorno ao trabalho e 
              demissionais devem ser gerenciados na seção de acompanhamento de exames médicos no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ExamesMedicosTab;
