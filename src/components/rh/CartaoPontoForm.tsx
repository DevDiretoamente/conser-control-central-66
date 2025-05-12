
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  CartaoPonto, 
  RegistroPonto, 
  StatusDia,
  formatarMinutosParaHora,
  calcularResumoHoras,
  diaDaSemana
} from '@/types/cartaoPonto';
import { salvarRegistroPonto, getFuncionarioDetails } from '@/services/cartaoPontoService';
import { User } from '@/types/auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Save, 
  Clock, 
  Calendar, 
  Info, 
  Edit, 
  X,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CartaoPontoFormProps {
  funcionarios: User[];
  funcionarioSelecionadoId: string;
  onChangeFuncionario: (id: string) => void;
  cartaoPonto: CartaoPonto | null;
  onChangeCartaoPonto: (cartao: CartaoPonto) => void;
  mes: number;
  ano: number;
  onChangeMes: (mes: number) => void;
  onChangeAno: (ano: number) => void;
  podeEditar: boolean;
  podeVerResumo: boolean;
}

export const CartaoPontoForm: React.FC<CartaoPontoFormProps> = ({
  funcionarios,
  funcionarioSelecionadoId,
  onChangeFuncionario,
  cartaoPonto,
  onChangeCartaoPonto,
  mes,
  ano,
  onChangeMes,
  onChangeAno,
  podeEditar,
  podeVerResumo
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [registroTemp, setRegistroTemp] = useState<Partial<RegistroPonto>>({});
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [funcionarioDetalhes, setFuncionarioDetalhes] = useState<{ name: string; setor: string; funcao: string } | null>(null);
  const [visualizacao, setVisualizacao] = useState<'calendario' | 'individual'>('individual');
  
  // Status options
  const statusOptions: { valor: StatusDia, nome: string }[] = [
    { valor: 'normal', nome: 'Normal' },
    { valor: 'falta_injustificada', nome: 'Falta Injustificada' },
    { valor: 'atestado', nome: 'Atestado' },
    { valor: 'ferias', nome: 'Férias' },
    { valor: 'dispensado', nome: 'Dispensado' },
    { valor: 'feriado', nome: 'Feriado' },
    { valor: 'a_disposicao', nome: 'À Disposição' }
  ];

  // Fetch employee details when funcionarioId changes
  useEffect(() => {
    if (funcionarioSelecionadoId) {
      const detalhes = getFuncionarioDetails(funcionarioSelecionadoId);
      setFuncionarioDetalhes(detalhes);
    }
  }, [funcionarioSelecionadoId]);
  
  // Reset the day index when cartaoPonto changes
  useEffect(() => {
    setCurrentDayIndex(0);
  }, [cartaoPonto]);

  // Get sorted registers
  const getSortedRegistros = (): RegistroPonto[] => {
    if (!cartaoPonto || !cartaoPonto.registros) return [];
    return [...cartaoPonto.registros].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );
  };
  
  // Get current registro
  const getCurrentRegistro = (): RegistroPonto | undefined => {
    const sortedRegistros = getSortedRegistros();
    return sortedRegistros[currentDayIndex];
  };
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const sortedRegistros = getSortedRegistros();
    if (currentDayIndex < sortedRegistros.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };
  
  // Get day of week name
  const getDayOfWeekName = (date: string): string => {
    const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dayOfWeek = new Date(date).getDay();
    return weekDays[dayOfWeek];
  };
  
  // Get short day of week
  const getShortDayOfWeek = (date: string): string => {
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayOfWeek = new Date(date).getDay();
    return weekDays[dayOfWeek];
  };

  // Pre-fill time based on day of week when status changes to normal
  const handleStatusChange = (value: StatusDia, registro: RegistroPonto) => {
    // Create a new temporary registro
    const novoRegistro = { ...registroTemp, statusDia: value };
    
    // If status changed to normal, pre-fill times based on day of week
    if (value === 'normal') {
      const dayOfWeek = new Date(registro.data).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // Standard times
      novoRegistro.horaEntradaManha = '07:00';
      novoRegistro.horaSaidaAlmoco = '12:00';
      novoRegistro.horaRetornoAlmoco = '13:00';
      
      // Different end time for Friday
      if (dayOfWeek === 5) { // Friday
        novoRegistro.horaSaidaTarde = '16:00';
      } else {
        novoRegistro.horaSaidaTarde = '17:00';
      }
    } else {
      // Clear times for non-normal days
      novoRegistro.horaEntradaManha = '';
      novoRegistro.horaSaidaAlmoco = '';
      novoRegistro.horaRetornoAlmoco = '';
      novoRegistro.horaSaidaTarde = '';
      novoRegistro.entradaExtra = '';
      novoRegistro.horaSaidaExtra = '';
    }
    
    setRegistroTemp(novoRegistro);
  };

  const iniciarEdicao = (registro: RegistroPonto) => {
    // Verificar se o registro está bloqueado
    if (registro.bloqueado) {
      toast({
        variant: "destructive",
        title: "Registro bloqueado",
        description: "Este registro tem mais de 24 horas e não pode ser editado.",
      });
      return;
    }
    
    setRegistroTemp({
      horaEntradaManha: registro.horaEntradaManha || '',
      entradaExtra: registro.entradaExtra || '',
      horaSaidaAlmoco: registro.horaSaidaAlmoco || '',
      horaRetornoAlmoco: registro.horaRetornoAlmoco || '',
      horaSaidaTarde: registro.horaSaidaTarde || '',
      horaSaidaExtra: registro.horaSaidaExtra || '',
      statusDia: registro.statusDia,
      observacoes: registro.observacoes || ''
    });
  };

  const cancelarEdicao = () => {
    setRegistroTemp({});
  };
  
  const salvarEdicao = async (registro: RegistroPonto) => {
    if (!user) return;
    
    try {
      // Validação básica de horários
      const { entradaExtra, horaEntradaManha, horaSaidaAlmoco, horaRetornoAlmoco, horaSaidaTarde, horaSaidaExtra } = registroTemp;
      
      if (registroTemp.statusDia === 'normal') {
        // Se for dia normal, validar entrada e saída
        if (!horaEntradaManha || !horaSaidaTarde) {
          toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Entrada e saída são obrigatórios para dias normais.",
          });
          return;
        }
      }
      
      const registroAtualizado = await salvarRegistroPonto(
        cartaoPonto?.id || '', 
        registro.id || '', 
        registroTemp,
        user
      );
      
      if (registroAtualizado && cartaoPonto) {
        // Atualizar o registro na lista
        const registrosAtualizados = cartaoPonto.registros.map(r => 
          r.id === registroAtualizado.id ? registroAtualizado : r
        );
        
        const cartaoAtualizado = {
          ...cartaoPonto,
          registros: registrosAtualizados
        };
        
        onChangeCartaoPonto(cartaoAtualizado);
        
        toast({
          title: "Registro salvo",
          description: `Registro do dia ${new Date(registro.data).getDate()} salvo com sucesso.`,
        });
      }
      
      cancelarEdicao();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o registro.",
      });
    }
  };
  
  // Função para formatar a data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return format(data, 'dd/MM/yyyy');
  };
  
  // Status colorido - retorna classes do Tailwind
  const getStatusColor = (status: StatusDia): string => {
    switch(status) {
      case 'normal':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'falta_injustificada':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'atestado':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'ferias':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'dispensado':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'feriado':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'a_disposicao':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Status colorido
  const renderStatusBadge = (status: StatusDia) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
    
    switch(status) {
      case 'normal':
        variant = 'default';
        break;
      case 'falta_injustificada':
        variant = 'destructive';
        break;
      case 'atestado':
        variant = 'secondary';
        break;
      case 'ferias':
      case 'dispensado':
      case 'feriado':
      case 'a_disposicao':
        variant = 'outline';
        break;
    }
    
    const label = statusOptions.find(opt => opt.valor === status)?.nome || status;
    
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Get current registro for display
  const currentRegistro = getCurrentRegistro();
  const sortedRegistros = getSortedRegistros();
  
  // Verifica se tem registros
  if (!sortedRegistros.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhum registro disponível</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Não há registros de ponto para o período selecionado.
          </p>
        </div>
      </div>
    );
  }

  // Renderização de vista de calendário
  const CalendarioView = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Visão Calendário - {format(new Date(ano, mes-1, 1), 'MMMM yyyy', { locale: ptBR })}</h2>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center font-medium text-sm p-2 bg-muted">
            {day}
          </div>
        ))}
        
        {/* Dias do mês com registros */}
        {sortedRegistros.map((registro, index) => {
          const data = new Date(registro.data);
          const dia = data.getDate();
          const diaDaSemana = data.getDay();
          
          // Adicionar células vazias para alinhar com o dia da semana correto
          const cells = [];
          if (index === 0) {
            for (let i = 0; i < diaDaSemana; i++) {
              cells.push(
                <div key={`empty-${i}`} className="border p-1 h-24 bg-muted/20"></div>
              );
            }
          }
          
          // Adicionar o dia atual
          cells.push(
            <div 
              key={registro.data} 
              className={`border p-2 h-24 overflow-hidden transition-all cursor-pointer ${getStatusColor(registro.statusDia)}`}
              onClick={() => {
                setCurrentDayIndex(index);
                setVisualizacao('individual');
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{dia}</span>
                {registro.bloqueado && <AlertTriangle className="h-4 w-4" />}
              </div>
              
              {registro.statusDia === 'normal' && (
                <div className="text-xs space-y-1">
                  {registro.horaEntradaManha && (
                    <div className="flex items-center gap-1">
                      <span>Entrada:</span>
                      <span className="font-medium">{registro.horaEntradaManha}</span>
                    </div>
                  )}
                  {registro.horaSaidaTarde && (
                    <div className="flex items-center gap-1">
                      <span>Saída:</span>
                      <span className="font-medium">{registro.horaSaidaTarde}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
          
          return cells;
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Informações do funcionário */}
      {funcionarioDetalhes && (
        <div className="flex flex-col md:flex-row gap-4 items-center rounded-lg overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10 p-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {funcionarioDetalhes.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="md:flex-1">
            <h3 className="text-xl font-medium">{funcionarioDetalhes.name}</h3>
            <div className="flex gap-x-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Setor:</span> {funcionarioDetalhes.setor}
              </div>
              <div>
                <span className="font-medium">Função:</span> {funcionarioDetalhes.funcao}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Alertas */}
      {!podeEditar && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Modo de visualização</AlertTitle>
          <AlertDescription>
            Você não tem permissão para editar os registros de ponto.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.fechado && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Período fechado</AlertTitle>
          <AlertDescription>
            Este cartão ponto já foi fechado e não pode mais ser editado.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.validado && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Período validado</AlertTitle>
          <AlertDescription>
            Este cartão ponto foi validado por {cartaoPonto.validadoPor} 
            em {new Date(cartaoPonto.dataValidacao || '').toLocaleString()}.
          </AlertDescription>
        </Alert>
      )}

      {/* Toggle de visualização */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border p-1 shadow-sm">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${visualizacao === 'individual' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
            onClick={() => setVisualizacao('individual')}
          >
            Individual
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${visualizacao === 'calendario' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
            onClick={() => setVisualizacao('calendario')}
          >
            Calendário
          </button>
        </div>
      </div>

      {/* Conteúdo baseado na visualização selecionada */}
      {visualizacao === 'calendario' ? (
        <CalendarioView />
      ) : (
        currentRegistro && (
          <div className="space-y-6">
            {/* Navegação entre dias */}
            <div className="flex items-center justify-between bg-card shadow-sm rounded-lg border p-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousDay} 
                disabled={currentDayIndex === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              
              <div className="text-center">
                <div className="text-xl font-semibold">
                  {formatarData(currentRegistro.data)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDayOfWeekName(currentRegistro.data)} - Dia {currentDayIndex + 1} de {sortedRegistros.length}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextDay} 
                disabled={currentDayIndex === sortedRegistros.length - 1}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Card do registro */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Registro do dia {new Date(currentRegistro.data).getDate()}
                    <span className="text-muted-foreground font-normal text-sm">
                      ({getShortDayOfWeek(currentRegistro.data)})
                    </span>
                  </CardTitle>
                  {renderStatusBadge(currentRegistro.statusDia)}
                </div>
                
                <CardDescription>
                  {currentRegistro.bloqueado ? (
                    <span className="flex items-center gap-1 text-amber-500">
                      <AlertTriangle className="h-4 w-4" /> 
                      Registro bloqueado para edição
                    </span>
                  ) : (
                    podeEditar && !cartaoPonto?.fechado ? 
                      "Edite os campos abaixo e salve as alterações" : 
                      "Visualizando registro de ponto"
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Status do dia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status do dia</label>
                    <Select 
                      value={registroTemp.statusDia || currentRegistro.statusDia} 
                      onValueChange={(value: StatusDia) => handleStatusChange(value, currentRegistro)}
                      disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.valor} value={status.valor}>
                            {status.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Textarea 
                      value={registroTemp.observacoes !== undefined ? registroTemp.observacoes : currentRegistro.observacoes || ''}
                      onChange={(e) => setRegistroTemp({...registroTemp, observacoes: e.target.value})}
                      disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                      placeholder="Observações adicionais"
                      rows={1}
                    />
                  </div>
                </div>
                
                {/* Horários */}
                {(registroTemp.statusDia || currentRegistro.statusDia) === 'normal' && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="h-px flex-1 bg-border"></div>
                      <span className="px-3 text-sm text-muted-foreground">Horários do dia</span>
                      <div className="h-px flex-1 bg-border"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Entrada Extra
                        </label>
                        <Input 
                          type="time"
                          value={registroTemp.entradaExtra !== undefined ? registroTemp.entradaExtra : currentRegistro.entradaExtra || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, entradaExtra: e.target.value})}
                          disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Entrada
                        </label>
                        <Input 
                          type="time"
                          value={registroTemp.horaEntradaManha !== undefined ? registroTemp.horaEntradaManha : currentRegistro.horaEntradaManha || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaEntradaManha: e.target.value})}
                          disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Saída Almoço
                        </label>
                        <Input 
                          type="time"
                          value={registroTemp.horaSaidaAlmoco !== undefined ? registroTemp.horaSaidaAlmoco : currentRegistro.horaSaidaAlmoco || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaAlmoco: e.target.value})}
                          disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Retorno Almoço
                        </label>
                        <Input 
                          type="time"
                          value={registroTemp.horaRetornoAlmoco !== undefined ? registroTemp.horaRetornoAlmoco : currentRegistro.horaRetornoAlmoco || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaRetornoAlmoco: e.target.value})}
                          disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Saída
                        </label>
                        <Input 
                          type="time"
                          value={registroTemp.horaSaidaTarde !== undefined ? registroTemp.horaSaidaTarde : currentRegistro.horaSaidaTarde || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaTarde: e.target.value})}
                          disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Saída Extra
                        </label>
                        <Input 
                          type="time"
                          value={registroTemp.horaSaidaExtra !== undefined ? registroTemp.horaSaidaExtra : currentRegistro.horaSaidaExtra || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaExtra: e.target.value})}
                          disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                          className="text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="justify-end space-x-2">
                {podeEditar && !cartaoPonto?.fechado && !currentRegistro.bloqueado && Object.keys(registroTemp).length > 0 && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={cancelarEdicao}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button 
                      onClick={() => salvarEdicao(currentRegistro)}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  </>
                )}
                
                {podeEditar && !cartaoPonto?.fechado && !currentRegistro.bloqueado && Object.keys(registroTemp).length === 0 && (
                  <Button
                    variant="outline" 
                    onClick={() => iniciarEdicao(currentRegistro)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Editar Registro
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )
      )}
      
      {/* Resumo de horas */}
      {podeVerResumo && cartaoPonto && (
        <Card className="mt-8 bg-gradient-to-br from-card to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Resumo de Horas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Horas normais</h3>
                <p className="text-2xl font-semibold">{formatarMinutosParaHora(cartaoPonto.totalHorasNormais)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Horas extras (50%)</h3>
                <p className="text-2xl font-semibold">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras50)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Horas extras (80%)</h3>
                <p className="text-2xl font-semibold">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras80)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Horas extras (110%)</h3>
                <p className="text-2xl font-semibold">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras110)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Horas noturnas</h3>
                <p className="text-2xl font-semibold">{formatarMinutosParaHora(cartaoPonto.totalHorasNoturno)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Quantidade de lanches</h3>
                <p className="text-2xl font-semibold">
                  {cartaoPonto.totalLanches} 
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    (R$ {cartaoPonto.totalLanches * 5},00)
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
