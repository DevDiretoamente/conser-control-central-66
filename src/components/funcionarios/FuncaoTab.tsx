
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, Funcao, EPI, Uniforme, ExameMedico } from '@/types/funcionario';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockFuncoes } from '@/data/funcionarioMockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HardHat, Shirt } from 'lucide-react';

interface FuncaoTabProps {
  form: UseFormReturn<Funcionario>;
}

const FuncaoTab: React.FC<FuncaoTabProps> = ({ form }) => {
  const [selectedFuncao, setSelectedFuncao] = useState<Funcao | null>(null);

  const handleFuncaoChange = (funcaoId: string) => {
    const funcao = mockFuncoes.find(f => f.id === funcaoId);
    setSelectedFuncao(funcao || null);
    
    // Update the form value
    form.setValue('dadosProfissionais.funcaoId', funcaoId);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="dadosProfissionais.funcaoId"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>Função*</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleFuncaoChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockFuncoes.map((funcao) => (
                    <SelectItem key={funcao.id} value={funcao.id}>
                      {funcao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                A função determina os EPIs, uniformes e exames necessários para o funcionário
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedFuncao && (
          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">{selectedFuncao.nome}</h3>
              <p className="text-muted-foreground">{selectedFuncao.descricao}</p>
            </div>
            
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="atribuicoes">
                <AccordionTrigger className="text-base font-medium">Atribuições</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-1">
                    {selectedFuncao.atribuicoes.map((atribuicao, index) => (
                      <li key={index} className="text-sm">{atribuicao}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="epis">
                <AccordionTrigger className="text-base font-medium">
                  <span className="flex items-center">
                    <HardHat className="mr-2 h-4 w-4" />
                    EPIs Necessários
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {selectedFuncao.epis.length === 0 ? (
                    <p className="text-muted-foreground">Não há EPIs necessários para esta função</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedFuncao.epis.map((epi) => (
                        <div key={epi.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{epi.nome}</p>
                            <p className="text-xs text-muted-foreground">CA: {epi.ca} | Validade: {epi.validade} meses</p>
                            {epi.descricao && (
                              <p className="text-sm mt-1">{epi.descricao}</p>
                            )}
                          </div>
                          {epi.obrigatorio && (
                            <Badge className="bg-red-600">Obrigatório</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="uniformes">
                <AccordionTrigger className="text-base font-medium">
                  <span className="flex items-center">
                    <Shirt className="mr-2 h-4 w-4" />
                    Uniformes Necessários
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {selectedFuncao.uniformes.length === 0 ? (
                    <p className="text-muted-foreground">Não há uniformes específicos para esta função</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedFuncao.uniformes.map((uniforme) => (
                        <div key={uniforme.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{uniforme.descricao}</p>
                            <p className="text-xs text-muted-foreground">Tipo: {uniforme.tipo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="exames">
                <AccordionTrigger className="text-base font-medium">
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Exames Médicos Necessários
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {selectedFuncao.examesNecessarios.length === 0 ? (
                    <p className="text-muted-foreground">Não há exames específicos para esta função</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedFuncao.examesNecessarios.map((exame) => (
                        <div key={exame.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{exame.nome}</p>
                            <p className="text-xs text-muted-foreground">
                              Tipo: {exame.tipo.charAt(0).toUpperCase() + exame.tipo.slice(1)}
                              {exame.periodicidade && ` | Periodicidade: ${exame.periodicidade} meses`}
                            </p>
                            {exame.descricao && (
                              <p className="text-sm mt-1">{exame.descricao}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FuncaoTab;
