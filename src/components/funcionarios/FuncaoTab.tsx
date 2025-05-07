
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, Funcao, EPI, Uniforme, ExameMedico, Setor } from '@/types/funcionario';
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
import { mockFuncoes, mockSetores } from '@/data/funcionarioMockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HardHat, Shirt } from 'lucide-react';

interface FuncaoTabProps {
  form: UseFormReturn<Funcionario>;
}

const FuncaoTab: React.FC<FuncaoTabProps> = ({ form }) => {
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [selectedFuncao, setSelectedFuncao] = useState<Funcao | null>(null);

  // Filter functions based on selected sector
  const filteredFuncoes = selectedSetor 
    ? mockFuncoes.filter(f => f.setorId === selectedSetor && f.ativo) 
    : mockFuncoes.filter(f => f.ativo);

  const handleSetorChange = (setorId: string) => {
    setSelectedSetor(setorId);
    setSelectedFuncao(null);
    form.setValue('dadosProfissionais.funcaoId', undefined);
  };

  const handleFuncaoChange = (funcaoId: string) => {
    const funcao = mockFuncoes.find(f => f.id === funcaoId);
    setSelectedFuncao(funcao || null);
    
    // Update the form value
    form.setValue('dadosProfissionais.funcaoId', funcaoId);
  };

  // Organize functions by sector for rendering
  const setoresWithFuncoes = mockSetores
    .filter(setor => setor.ativo)
    .map(setor => ({
      ...setor,
      funcoes: mockFuncoes.filter(f => f.setorId === setor.id && f.ativo)
    }))
    .filter(setor => setor.funcoes.length > 0);

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Sector Selector */}
        <FormItem className="mb-6">
          <FormLabel>Setor</FormLabel>
          <Select
            onValueChange={handleSetorChange}
            value={selectedSetor || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os setores</SelectItem>
              {mockSetores
                .filter(setor => setor.ativo)
                .map((setor) => (
                  <SelectItem key={setor.id} value={setor.id}>
                    {setor.nome}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <FormDescription>
            Selecione um setor para filtrar as funções disponíveis
          </FormDescription>
        </FormItem>

        {/* Function Selector */}
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
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedSetor ? (
                    // Show functions filtered by selected sector
                    filteredFuncoes.map((funcao) => (
                      <SelectItem key={funcao.id} value={funcao.id}>
                        {funcao.nome}
                      </SelectItem>
                    ))
                  ) : (
                    // Show functions grouped by sector
                    setoresWithFuncoes.map((setor) => (
                      <React.Fragment key={setor.id}>
                        <SelectItem disabled value={`setor-header-${setor.id}`} className="font-bold pl-2">
                          {setor.nome}
                        </SelectItem>
                        {setor.funcoes.map((funcao) => (
                          <SelectItem key={funcao.id} value={funcao.id} className="pl-4">
                            {funcao.nome}
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))
                  )}
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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg font-medium">{selectedFuncao.nome}</h3>
                <Badge variant="outline">
                  {mockSetores.find(s => s.id === selectedFuncao.setorId)?.nome || 'Setor não encontrado'}
                </Badge>
              </div>
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
                              {/* Changed 'tipo' to 'tipos' here */}
                              Tipo: {exame.tipos.length > 0 && (exame.tipos[0].charAt(0).toUpperCase() + exame.tipos[0].slice(1))}
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
