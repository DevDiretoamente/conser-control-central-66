
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, Dependente } from '@/types/funcionario';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import DocumentUploader from './DocumentUploader';

interface DependentesTabProps {
  form: UseFormReturn<Funcionario>;
}

const DependentesTab: React.FC<DependentesTabProps> = ({ form }) => {
  const dependentes = form.watch('dependentes') || [];

  const addDependente = () => {
    const novoDependente: Dependente = {
      nome: '',
      dataNascimento: new Date(),
      parentesco: '',
      documentos: {
        certidaoNascimento: null,
        outrosDocumentos: []
      }
    };

    form.setValue('dependentes', [...dependentes, novoDependente]);
  };

  const removeDependente = (index: number) => {
    const novosDependentes = [...dependentes];
    novosDependentes.splice(index, 1);
    form.setValue('dependentes', novosDependentes);
  };

  const handleDocumentChange = (index: number, docType: 'certidaoNascimento' | 'outrosDocumentos', file: File | null) => {
    const currentDependentes = [...dependentes];
    
    if (docType === 'certidaoNascimento') {
      currentDependentes[index].documentos.certidaoNascimento = file;
    } else if (docType === 'outrosDocumentos' && file) {
      const currentDocs = currentDependentes[index].documentos.outrosDocumentos || [];
      currentDependentes[index].documentos.outrosDocumentos = [...currentDocs, file];
    }
    
    form.setValue('dependentes', currentDependentes);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Dependentes</h3>
          <Button 
            type="button" 
            onClick={addDependente} 
            variant="outline"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Dependente
          </Button>
        </div>

        {dependentes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dependente cadastrado
          </div>
        ) : (
          <div className="space-y-6">
            {dependentes.map((dependente, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Dependente {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeDependente(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name={`dependentes.${index}.nome`}
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
                    name={`dependentes.${index}.dataNascimento`}
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
                    name={`dependentes.${index}.parentesco`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parentesco*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="filho">Filho(a)</SelectItem>
                            <SelectItem value="conjuge">Cônjuge</SelectItem>
                            <SelectItem value="pai">Pai</SelectItem>
                            <SelectItem value="mae">Mãe</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`dependentes.${index}.cpf`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="CPF do dependente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <DocumentUploader
                    label="Certidão de Nascimento/Casamento"
                    description="PDF, JPG ou PNG até 10MB"
                    allowedTypes=".pdf,.jpg,.jpeg,.png"
                    onFileChange={(file) => handleDocumentChange(index, 'certidaoNascimento', file)}
                  />

                  <DocumentUploader
                    label="Outros Documentos"
                    description="PDF, JPG ou PNG até 10MB"
                    allowedTypes=".pdf,.jpg,.jpeg,.png"
                    onFileChange={(file) => handleDocumentChange(index, 'outrosDocumentos', file)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DependentesTab;
