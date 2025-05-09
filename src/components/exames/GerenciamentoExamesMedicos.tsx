
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format, addMonths, addYears, isBefore, differenceInMonths } from 'date-fns';
import { CalendarIcon, Clock, AlertTriangle, Check, Plus, Trash2, CalendarRange } from 'lucide-react';
import DocumentUploader from '@/components/funcionarios/DocumentUploader';
import { Funcionario, ExameRealizado, ExameMedico } from '@/types/funcionario';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface GerenciamentoExamesMedicosProps {
  funcionario: Funcionario;
  onSave: (exames: ExameRealizado[]) => void;
}

// Determine if an exam is special (e.g. spirometry with 2-year validity)
const isSpecialExam = (exameName: string): boolean => {
  return exameName.toLowerCase().includes('espirometria');
};

// Calculate validity date based on exam type
const calculateValidityDate = (examDate: Date, exameName: string): Date => {
  if (isSpecialExam(exameName)) {
    return addYears(examDate, 2); // 2-year validity for special exams like spirometry
  }
  return addYears(examDate, 1); // 1-year validity for standard exams
};

const GerenciamentoExamesMedicos: React.FC<GerenciamentoExamesMedicosProps> = ({ funcionario, onSave }) => {
  const [activeTab, setActiveTab] = useState<string>('proximos');
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState<string>('periodico');
  const [examesRealizados, setExamesRealizados] = useState<ExameRealizado[]>(funcionario.examesRealizados || []);
  const [examesPendentes, setExamesPendentes] = useState<any[]>([]);
  const [novoExame, setNovoExame] = useState<ExameRealizado | null>(null);
  const [dataAgendada, setDataAgendada] = useState<Date | undefined>(undefined);
  const [exameSelected, setExameSelected] = useState<string>('');
  
  // Calcula exames pendentes e próximos baseados nos exames já realizados
  useEffect(() => {
    // Implementação real iria consultar as regras de periodicidade para a função
    // e comparar com os exames já realizados para determinar os próximos necessários
    const ultimoAdmissional = examesRealizados.find(e => e.tipoSelecionado === 'admissional');
    
    if (ultimoAdmissional) {
      const proximosPeriodicos = [];
      
      // Get the function's exams
      const examesParaFuncao = funcionario.dadosProfissionais.funcaoId ? 
        mockExamesFuncao[funcionario.dadosProfissionais.funcaoId]?.periodico || [] : [];
      
      // Group exams by standard and special (biennial)
      const standardExams = examesParaFuncao.filter(ex => !isSpecialExam(ex.nome));
      const specialExams = examesParaFuncao.filter(ex => isSpecialExam(ex.nome));
      
      // Standard exams (annual)
      if (standardExams.length > 0) {
        const dataLimiteStandard = addYears(new Date(ultimoAdmissional.dataRealizado), 1);
        const jaPassouStandard = isBefore(dataLimiteStandard, new Date());
        
        proximosPeriodicos.push({
          tipo: 'periodico',
          dataLimite: dataLimiteStandard,
          exames: standardExams,
          status: jaPassouStandard ? 'atrasado' : 'agendado',
          periodicidade: 'anual'
        });
      }
      
      // Special exams (biennial, like spirometry)
      if (specialExams.length > 0) {
        const dataLimiteSpecial = addYears(new Date(ultimoAdmissional.dataRealizado), 2);
        const jaPassouSpecial = isBefore(dataLimiteSpecial, new Date());
        
        proximosPeriodicos.push({
          tipo: 'periodico',
          dataLimite: dataLimiteSpecial,
          exames: specialExams,
          status: jaPassouSpecial ? 'atrasado' : 'agendado',
          periodicidade: 'bienal'
        });
      }
      
      setExamesPendentes(proximosPeriodicos);
    }
  }, [examesRealizados, funcionario.dadosProfissionais.funcaoId]);
  
  const handleNovoExame = (tipo: string) => {
    setTipoExameSelecionado(tipo);
    setNovoExame({
      exameId: '',
      tipoSelecionado: tipo,
      dataRealizado: new Date(),
      dataValidade: addYears(new Date(), 1), // Default 1 year, will be adjusted based on exam type
      resultado: 'Apto',
      documento: null,
      observacoes: ''
    });
  };
  
  const handleExameChange = (exameName: string) => {
    setExameSelected(exameName);
    
    if (novoExame) {
      // Update validity based on exam type
      const newValidity = calculateValidityDate(novoExame.dataRealizado, exameName);
      setNovoExame({
        ...novoExame,
        exameId: exameName,
        dataValidade: newValidity
      });
    }
  };
  
  const handleDataRealizadoChange = (date: Date | undefined) => {
    if (date && novoExame) {
      // Calculate new validity date based on exam type
      const newValidity = calculateValidityDate(date, novoExame.exameId || '');
      
      setNovoExame({
        ...novoExame,
        dataRealizado: date,
        dataValidade: newValidity
      });
    }
    
    setDataAgendada(date);
  };
  
  const handleSalvarExame = () => {
    if (novoExame) {
      setExamesRealizados([...examesRealizados, novoExame]);
      onSave([...examesRealizados, novoExame]);
      setNovoExame(null);
      setExameSelected('');
      setDataAgendada(undefined);
    }
  };
  
  const handleAgendarExame = () => {
    // Lógica para agendar exame seria implementada aqui
    // Incluiria integração com calendário/lembretes
  };
  
  // Mock de exames por função (em produção, isso viria de uma API)
  const mockExamesFuncao: Record<string, Record<string, ExameMedico[]>> = {
    '1': {
      'periodico': [
        { id: '1', nome: 'Exame Clínico', tipos: ['admissional', 'periodico'], periodicidade: 12, ativo: true, precosPorClinica: [] },
        { id: '2', nome: 'Audiometria', tipos: ['admissional', 'periodico'], periodicidade: 12, ativo: true, precosPorClinica: [] },
        { id: '3', nome: 'Espirometria', tipos: ['admissional', 'periodico'], periodicidade: 24, ativo: true, precosPorClinica: [] }
      ],
      'mudancaFuncao': [
        { id: '1', nome: 'Exame Clínico', tipos: ['admissional', 'mudancaFuncao'], periodicidade: 12, ativo: true, precosPorClinica: [] },
        { id: '4', nome: 'Acuidade Visual', tipos: ['mudancaFuncao'], periodicidade: 12, ativo: true, precosPorClinica: [] }
      ]
    }
  };
  
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="proximos">Próximos Exames</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="novo">Novo Exame</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proximos">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Exames</CardTitle>
                  <CardDescription>
                    Exames que precisam ser realizados em breve ou que estão atrasados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {examesPendentes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Check className="mx-auto h-12 w-12 mb-2" />
                      <p>Não há exames pendentes para este funcionário</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {examesPendentes.map((exame, idx) => (
                        <Card key={idx} className={cn(
                          "border",
                          exame.status === "atrasado" ? "border-red-300 bg-red-50" : "border-amber-200 bg-amber-50"
                        )}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base flex items-center gap-2">
                                {exame.status === "atrasado" ? (
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <Clock className="h-5 w-5 text-amber-500" />
                                )}
                                {exame.tipo === 'periodico' ? 'Exame Periódico' : exame.tipo}
                                <Badge 
                                  variant="outline" 
                                  className={exame.periodicidade === 'bienal' ? 
                                    "bg-blue-50 text-blue-700 border-blue-200" : 
                                    "bg-green-50 text-green-700 border-green-200"
                                  }
                                >
                                  {exame.periodicidade === 'bienal' ? '2 anos' : '1 ano'}
                                </Badge>
                              </CardTitle>
                              <Badge variant={exame.status === "atrasado" ? "destructive" : "outline"}>
                                {exame.status === "atrasado" ? "Atrasado" : "Pendente"}
                              </Badge>
                            </div>
                            <CardDescription>
                              Data limite: {format(exame.dataLimite, "dd/MM/yyyy")}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <h4 className="text-sm font-medium mb-2">Exames necessários:</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {exame.exames.map((ex: any) => (
                                <li key={ex.id} className="text-sm border rounded p-2 flex justify-between items-center">
                                  <span>{ex.nome}</span>
                                  {isSpecialExam(ex.nome) && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                      Bienal
                                    </Badge>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => handleAgendarExame()}>
                              <CalendarRange className="h-4 w-4 mr-2" />
                              Agendar
                            </Button>
                            <Button onClick={() => handleNovoExame(exame.tipo)}>
                              Registrar
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="historico">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Exames</CardTitle>
                  <CardDescription>
                    Todos os exames realizados por este funcionário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {examesRealizados.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum exame foi registrado para este funcionário</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {examesRealizados.map((exame, idx) => {
                        const isSpecial = exame.exameId && isSpecialExam(exame.exameId);
                        
                        return (
                          <Card key={idx} className="border">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base flex items-center gap-2">
                                  {exame.tipoSelecionado === 'admissional' ? 'Exame Admissional' : 
                                  exame.tipoSelecionado === 'periodico' ? 'Exame Periódico' :
                                  exame.tipoSelecionado === 'mudancaFuncao' ? 'Mudança de Função' :
                                  exame.tipoSelecionado === 'retornoTrabalho' ? 'Retorno ao Trabalho' : 'Demissional'}
                                  
                                  {isSpecial && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                      Bienal
                                    </Badge>
                                  )}
                                </CardTitle>
                                <Badge variant={isBefore(exame.dataValidade, new Date()) ? "destructive" : "outline"}>
                                  {isBefore(exame.dataValidade, new Date()) ? 'Vencido' : 'Válido'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="font-medium">Exame:</p>
                                  <p>{exame.exameId || 'Não especificado'}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Data de realização:</p>
                                  <p>{format(exame.dataRealizado, "dd/MM/yyyy")}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Validade:</p>
                                  <p>{format(exame.dataValidade, "dd/MM/yyyy")}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Resultado:</p>
                                  <p>{exame.resultado}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Clínica:</p>
                                  <p>{exame.clinicaId === '1' ? 'RP Medicina e Segurança do Trabalho' : 
                                      exame.clinicaId === '2' ? 'Sindiconvenios' : 'Não informada'}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Periodicidade:</p>
                                  <p>{isSpecial ? '2 anos' : '1 ano'}</p>
                                </div>
                              </div>
                              
                              {exame.observacoes && (
                                <div className="mt-2">
                                  <p className="font-medium">Observações:</p>
                                  <p className="text-sm">{exame.observacoes}</p>
                                </div>
                              )}
                              
                              {exame.documento && (
                                <div className="mt-2">
                                  <p className="font-medium">Documento:</p>
                                  <p className="text-sm text-blue-600 underline cursor-pointer">
                                    Ver documento
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="novo">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Novo Exame</CardTitle>
                <CardDescription>
                  Registrar um novo exame para este funcionário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Exame</label>
                      <Select 
                        value={tipoExameSelecionado} 
                        onValueChange={setTipoExameSelecionado}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="periodico">Periódico</SelectItem>
                          <SelectItem value="mudancaFuncao">Mudança de Função</SelectItem>
                          <SelectItem value="retornoTrabalho">Retorno ao Trabalho</SelectItem>
                          <SelectItem value="demissional">Demissional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome do Exame</label>
                      <Select 
                        value={exameSelected}
                        onValueChange={handleExameChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o exame" />
                        </SelectTrigger>
                        <SelectContent>
                          {funcionario.dadosProfissionais.funcaoId && 
                           mockExamesFuncao[funcionario.dadosProfissionais.funcaoId] && 
                           mockExamesFuncao[funcionario.dadosProfissionais.funcaoId][tipoExameSelecionado] ? (
                             mockExamesFuncao[funcionario.dadosProfissionais.funcaoId][tipoExameSelecionado].map(exam => (
                               <SelectItem key={exam.id} value={exam.nome}>
                                 {exam.nome} {isSpecialExam(exam.nome) && "(Bienal)"}
                               </SelectItem>
                             ))
                           ) : (
                             <SelectItem value="exame-clinico">Exame Clínico</SelectItem>
                           )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data de Realização</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !dataAgendada && "text-muted-foreground"
                            )}
                          >
                            {dataAgendada ? (
                              format(dataAgendada, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dataAgendada}
                            onSelect={handleDataRealizadoChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Validade</label>
                      <Input 
                        value={novoExame?.dataValidade ? format(novoExame.dataValidade, "dd/MM/yyyy") : ""} 
                        readOnly 
                        className="bg-muted/50"
                      />
                      <p className="text-xs text-muted-foreground">
                        {exameSelected && isSpecialExam(exameSelected) 
                          ? "Validade de 2 anos para Espirometria" 
                          : "Validade de 1 ano"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Clínica</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a clínica" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">RP Medicina e Segurança do Trabalho</SelectItem>
                          <SelectItem value="2">Sindiconvenios</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Resultado</label>
                      <Select defaultValue="Apto">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apto">Apto</SelectItem>
                          <SelectItem value="Apto com restrições">Apto com restrições</SelectItem>
                          <SelectItem value="Inapto temporariamente">Inapto temporariamente</SelectItem>
                          <SelectItem value="Inapto definitivamente">Inapto definitivamente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Textarea placeholder="Observações sobre o exame" className="resize-none" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Documento do ASO</label>
                    <DocumentUploader
                      label="Anexar ASO"
                      description="PDF ou imagem do ASO"
                      allowedTypes=".pdf,.jpg,.jpeg,.png"
                      onFileChange={() => {}}
                      value={null}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveTab('historico')}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvarExame}>
                  Salvar Exame
                </Button>
              </CardFooter>
            </Card>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciamentoExamesMedicos;
