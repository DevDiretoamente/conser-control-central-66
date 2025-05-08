
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
import { format, addMonths, isBefore } from 'date-fns';
import { CalendarIcon, Clock, AlertTriangle, Check, Plus, Trash2, CalendarRange } from 'lucide-react';
import DocumentUploader from '@/components/funcionarios/DocumentUploader';
import { Funcionario, ExameRealizado, ExameMedico } from '@/types/funcionario';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface GerenciamentoExamesMedicosProps {
  funcionario: Funcionario;
  onSave: (exames: ExameRealizado[]) => void;
}

const GerenciamentoExamesMedicos: React.FC<GerenciamentoExamesMedicosProps> = ({ funcionario, onSave }) => {
  const [activeTab, setActiveTab] = useState<string>('proximos');
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState<string>('periodico');
  const [examesRealizados, setExamesRealizados] = useState<ExameRealizado[]>(funcionario.examesRealizados || []);
  const [examesPendentes, setExamesPendentes] = useState<any[]>([]);
  const [novoExame, setNovoExame] = useState<ExameRealizado | null>(null);
  const [dataAgendada, setDataAgendada] = useState<Date | undefined>(undefined);
  
  // Calcula exames pendentes e próximos baseados nos exames já realizados
  useEffect(() => {
    // Implementação real iria consultar as regras de periodicidade para a função
    // e comparar com os exames já realizados para determinar os próximos necessários
    const ultimoAdmissional = examesRealizados.find(e => e.tipoSelecionado === 'admissional');
    
    if (ultimoAdmissional) {
      const proximosPeriodicos = [];
      // Exemplo: periódico após 6 meses da admissão se não houver nenhum periódico realizado
      const proximoExame = {
        tipo: 'periodico',
        dataLimite: addMonths(ultimoAdmissional.dataRealizado, 6),
        exames: funcionario.dadosProfissionais.funcaoId ? 
          (funcionario.dadosProfissionais.funcaoId ? 
           mockExamesFuncao[funcionario.dadosProfissionais.funcaoId]?.periodico || [] : []) : []
      };
      
      // Verificar se já passou da data e não foi realizado
      const jaPassou = isBefore(proximoExame.dataLimite, new Date());
      proximosPeriodicos.push({
        ...proximoExame,
        status: jaPassou ? 'atrasado' : 'agendado'
      });
      
      setExamesPendentes(proximosPeriodicos);
    }
  }, [examesRealizados, funcionario.dadosProfissionais.funcaoId]);
  
  const handleNovoExame = (tipo: string) => {
    setTipoExameSelecionado(tipo);
    setNovoExame({
      exameId: '',
      tipoSelecionado: tipo,
      dataRealizado: new Date(),
      dataValidade: addMonths(new Date(), 6),
      resultado: 'Apto',
      documento: null,
      observacoes: ''
    });
  };
  
  const handleSalvarExame = () => {
    if (novoExame) {
      setExamesRealizados([...examesRealizados, novoExame]);
      onSave([...examesRealizados, novoExame]);
      setNovoExame(null);
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
        { id: '1', nome: 'Exame Clínico', tipos: ['admissional', 'periodico'], periodicidade: 6, ativo: true, precosPorClinica: [] },
        { id: '2', nome: 'Audiometria', tipos: ['admissional', 'periodico'], periodicidade: 12, ativo: true, precosPorClinica: [] }
      ],
      'mudancaFuncao': [
        { id: '1', nome: 'Exame Clínico', tipos: ['admissional', 'mudancaFuncao'], periodicidade: 6, ativo: true, precosPorClinica: [] },
        { id: '3', nome: 'Acuidade Visual', tipos: ['mudancaFuncao'], ativo: true, precosPorClinica: [] }
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
                                <li key={ex.id} className="text-sm border rounded p-2">
                                  {ex.nome}
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
                      {examesRealizados.map((exame, idx) => (
                        <Card key={idx} className="border">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">
                                {exame.tipoSelecionado === 'admissional' ? 'Exame Admissional' : 
                                 exame.tipoSelecionado === 'periodico' ? 'Exame Periódico' :
                                 exame.tipoSelecionado === 'mudancaFuncao' ? 'Mudança de Função' :
                                 exame.tipoSelecionado === 'retornoTrabalho' ? 'Retorno ao Trabalho' : 'Demissional'}
                              </CardTitle>
                              <Badge variant={isBefore(exame.dataValidade, new Date()) ? "destructive" : "outline"}>
                                {isBefore(exame.dataValidade, new Date()) ? 'Vencido' : 'Válido'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2 text-sm">
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
                      ))}
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
                            onSelect={setDataAgendada}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    <label className="text-sm font-medium">Exames incluídos</label>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {funcionario.dadosProfissionais.funcaoId && 
                           mockExamesFuncao[funcionario.dadosProfissionais.funcaoId] && 
                           mockExamesFuncao[funcionario.dadosProfissionais.funcaoId][tipoExameSelecionado] ? (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {mockExamesFuncao[funcionario.dadosProfissionais.funcaoId][tipoExameSelecionado].map(exame => (
                                <li key={exame.id} className="flex items-center gap-2 border p-2 rounded bg-background">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span>{exame.nome}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-center py-4 text-muted-foreground">
                              Nenhum exame configurado para esta função/tipo de exame
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
