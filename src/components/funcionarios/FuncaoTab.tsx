
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FuncaoTabProps {
  form: UseFormReturn<Funcionario>;
}

const FuncaoTab: React.FC<FuncaoTabProps> = ({ form }) => {
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [selectedFuncao, setSelectedFuncao] = useState<Funcao | null>(null);
  const [selectedExamTab, setSelectedExamTab] = useState<string>('admissional');

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

  // Helper function to get badge for exam type
  const getExamTypeBadge = (tipo: string) => {
    const badgeVariants: Record<string, string> = {
      'admissional': 'bg-green-500',
      'periodico': 'bg-blue-500',
      'mudancaFuncao': 'bg-yellow-500',
      'retornoTrabalho': 'bg-purple-500',
      'demissional': 'bg-red-500'
    };
    
    const badgeLabels: Record<string, string> = {
      'admissional': 'Admissional',
      'periodico': 'Periódico',
      'mudancaFuncao': 'Mudança de Função',
      'retornoTrabalho': 'Retorno ao Trabalho',
      'demissional': 'Demissional'
    };

    return (
      <Badge className={badgeVariants[tipo] || 'bg-gray-500'}>
        {badgeLabels[tipo] || tipo}
      </Badge>
    );
  };

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
                  <Tabs 
                    defaultValue="admissional" 
                    value={selectedExamTab}
                    onValueChange={setSelectedExamTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-5 mb-4">
                      <TabsTrigger value="admissional" className="text-xs">Admissional</TabsTrigger>
                      <TabsTrigger value="periodico" className="text-xs">Periódico</TabsTrigger>
                      <TabsTrigger value="mudancaFuncao" className="text-xs">Mudança</TabsTrigger>
                      <TabsTrigger value="retornoTrabalho" className="text-xs">Retorno</TabsTrigger>
                      <TabsTrigger value="demissional" className="text-xs">Demissional</TabsTrigger>
                    </TabsList>

                    {/* Admissional Tab */}
                    <TabsContent value="admissional">
                      {selectedFuncao.examesNecessarios.admissional.length === 0 ? (
                        <p className="text-muted-foreground">Não há exames admissionais específicos para esta função</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedFuncao.examesNecessarios.admissional.map((exame) => (
                            <div key={exame.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{exame.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exame.periodicidade && `Periodicidade: ${exame.periodicidade} meses`}
                                </p>
                                {exame.descricao && (
                                  <p className="text-sm mt-1">{exame.descricao}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Periodico Tab */}
                    <TabsContent value="periodico">
                      {selectedFuncao.examesNecessarios.periodico.length === 0 ? (
                        <p className="text-muted-foreground">Não há exames periódicos específicos para esta função</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedFuncao.examesNecessarios.periodico.map((exame) => (
                            <div key={exame.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{exame.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exame.periodicidade && `Periodicidade: ${exame.periodicidade} meses`}
                                </p>
                                {exame.descricao && (
                                  <p className="text-sm mt-1">{exame.descricao}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Mudança de Função Tab */}
                    <TabsContent value="mudancaFuncao">
                      {selectedFuncao.examesNecessarios.mudancaFuncao.length === 0 ? (
                        <p className="text-muted-foreground">Não há exames de mudança de função específicos para esta função</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedFuncao.examesNecessarios.mudancaFuncao.map((exame) => (
                            <div key={exame.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{exame.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exame.periodicidade && `Periodicidade: ${exame.periodicidade} meses`}
                                </p>
                                {exame.descricao && (
                                  <p className="text-sm mt-1">{exame.descricao}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Retorno ao Trabalho Tab */}
                    <TabsContent value="retornoTrabalho">
                      {selectedFuncao.examesNecessarios.retornoTrabalho.length === 0 ? (
                        <p className="text-muted-foreground">Não há exames de retorno ao trabalho específicos para esta função</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedFuncao.examesNecessarios.retornoTrabalho.map((exame) => (
                            <div key={exame.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{exame.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exame.periodicidade && `Periodicidade: ${exame.periodicidade} meses`}
                                </p>
                                {exame.descricao && (
                                  <p className="text-sm mt-1">{exame.descricao}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Demissional Tab */}
                    <TabsContent value="demissional">
                      {selectedFuncao.examesNecessarios.demissional.length === 0 ? (
                        <p className="text-muted-foreground">Não há exames demissionais específicos para esta função</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedFuncao.examesNecessarios.demissional.map((exame) => (
                            <div key={exame.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">{exame.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exame.periodicidade && `Periodicidade: ${exame.periodicidade} meses`}
                                </p>
                                {exame.descricao && (
                                  <p className="text-sm mt-1">{exame.descricao}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
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
