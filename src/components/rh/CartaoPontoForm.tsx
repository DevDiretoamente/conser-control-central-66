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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  
  const funcionarioSelecionado = funcionarios.find(f => f.id === funcionarioSelecionadoId);
  
  const meses = [
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' }
  ];
  
  // Gerar anos para seleção (do ano atual - 2 até ano atual + 1)
  const anoAtual = new Date().getFullYear();
  const anos = [anoAtual - 2, anoAtual - 1, anoAtual, anoAtual + 1];
  
  // Updated status options - removed "falta_justificada" and "folga", added "a_disposicao"
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
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <Select 
            value={funcionarioSelecionadoId} 
            onValueChange={(value) => onChangeFuncionario(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {funcionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id}>
                  {funcionario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/3">
          <Select 
            value={mes.toString()} 
            onValueChange={(value) => onChangeMes(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {meses.map((mes) => (
                <SelectItem key={mes.valor} value={mes.valor.toString()}>
                  {mes.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/3">
          <Select 
            value={ano.toString()} 
            onValueChange={(value) => onChangeAno(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {anos.map((ano) => (
                <SelectItem key={ano} value={ano.toString()}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {funcionarioSelecionado && funcionarioDetalhes && (
        <Card className="mb-4">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Funcionário</h3>
                <p className="text-lg font-medium">{funcionarioDetalhes.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Setor</h3>
                <p className="text-lg font-medium">{funcionarioDetalhes.setor}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Função</h3>
                <p className="text-lg font-medium">{funcionarioDetalhes.funcao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!podeEditar && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Modo de visualização</AlertTitle>
          <AlertDescription>
            Você não tem permissão para editar os registros de ponto.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.fechado && (
        <Alert className="mb-4" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Período fechado</AlertTitle>
          <AlertDescription>
            Este cartão ponto já foi fechado e não pode mais ser editado.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.validado && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Período validado</AlertTitle>
          <AlertDescription>
            Este cartão ponto foi validado por {cartaoPonto.validadoPor} 
            em {new Date(cartaoPonto.dataValidacao || '').toLocaleString()}.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Day navigation */}
      {sortedRegistros.length > 0 && currentRegistro && (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousDay} 
              disabled={currentDayIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
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
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  Registro do dia {new Date(currentRegistro.data).getDate()}
                  <span className="ml-2 text-muted-foreground font-normal text-sm">
                    {getShortDayOfWeek(currentRegistro.data)}
                  </span>
                </span>
                {renderStatusBadge(currentRegistro.statusDia)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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

                <div>
                  <label className="text-sm font-medium">Observações</label>
                  <Input 
                    value={registroTemp.observacoes !== undefined ? registroTemp.observacoes : currentRegistro.observacoes || ''}
                    onChange={(e) => setRegistroTemp({...registroTemp, observacoes: e.target.value})}
                    disabled={!podeEditar || cartaoPonto?.fechado || currentRegistro.bloqueado}
                  />
                </div>
              </div>

              {/* Time input fields */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Entrada Extra</label>
                  <Input 
                    type="time"
                    value={registroTemp.entradaExtra !== undefined ? registroTemp.entradaExtra : currentRegistro.entradaExtra || ''}
                    onChange={(e) => setRegistroTemp({...registroTemp, entradaExtra: e.target.value})}
                    disabled={!podeEditar || (registroTemp.statusDia || currentRegistro.statusDia) !== 'normal' || cartaoPonto?.fechado || currentRegistro.bloqueado}
                    className="text-center"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Entrada</label>
                  <Input 
                    type="time"
                    value={registroTemp.horaEntradaManha !== undefined ? registroTemp.horaEntradaManha : currentRegistro.horaEntradaManha || ''}
                    onChange={(e) => setRegistroTemp({...registroTemp, horaEntradaManha: e.target.value})}
                    disabled={!podeEditar || (registroTemp.statusDia || currentRegistro.statusDia) !== 'normal' || cartaoPonto?.fechado || currentRegistro.bloqueado}
                    className="text-center"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Saída Almoço</label>
                  <Input 
                    type="time"
                    value={registroTemp.horaSaidaAlmoco !== undefined ? registroTemp.horaSaidaAlmoco : currentRegistro.horaSaidaAlmoco || ''}
                    onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaAlmoco: e.target.value})}
                    disabled={!podeEditar || (registroTemp.statusDia || currentRegistro.statusDia) !== 'normal' || cartaoPonto?.fechado || currentRegistro.bloqueado}
                    className="text-center"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Retorno Almoço</label>
                  <Input 
                    type="time"
                    value={registroTemp.horaRetornoAlmoco !== undefined ? registroTemp.horaRetornoAlmoco : currentRegistro.horaRetornoAlmoco || ''}
                    onChange={(e) => setRegistroTemp({...registroTemp, horaRetornoAlmoco: e.target.value})}
                    disabled={!podeEditar || (registroTemp.statusDia || currentRegistro.statusDia) !== 'normal' || cartaoPonto?.fechado || currentRegistro.bloqueado}
                    className="text-center"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Saída</label>
                  <Input 
                    type="time"
                    value={registroTemp.horaSaidaTarde !== undefined ? registroTemp.horaSaidaTarde : currentRegistro.horaSaidaTarde || ''}
                    onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaTarde: e.target.value})}
                    disabled={!podeEditar || (registroTemp.statusDia || currentRegistro.statusDia) !== 'normal' || cartaoPonto?.fechado || currentRegistro.bloqueado}
                    className="text-center"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Saída Extra</label>
                  <Input 
                    type="time"
                    value={registroTemp.horaSaidaExtra !== undefined ? registroTemp.horaSaidaExtra : currentRegistro.horaSaidaExtra || ''}
                    onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaExtra: e.target.value})}
                    disabled={!podeEditar || (registroTemp.statusDia || currentRegistro.statusDia) !== 'normal' || cartaoPonto?.fechado || currentRegistro.bloqueado}
                    className="text-center"
                  />
                </div>
              </div>

              {/* Action buttons */}
              {podeEditar && !cartaoPonto?.fechado && !currentRegistro.bloqueado && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={cancelarEdicao}
                    disabled={Object.keys(registroTemp).length === 0}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => salvarEdicao(currentRegistro)}
                    disabled={Object.keys(registroTemp).length === 0}
                  >
                    Salvar
                  </Button>
                </div>
              )}
              
              {currentRegistro.bloqueado && (
                <Alert className="mt-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Registro bloqueado</AlertTitle>
                  <AlertDescription>
                    Este registro não pode ser editado por ter sido criado há mais de 24 horas.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {podeVerResumo && cartaoPonto && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumo de Horas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium">Horas normais</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasNormais)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas extras (50%)</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras50)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas extras (80%)</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras80)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas extras domingo/feriado (110%)</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras110)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas noturnas</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasNoturno)}</p>
              </div>
              <div>
                <h3 className="font-medium">Quantidade de lanches</h3>
                <p className="text-xl">{cartaoPonto.totalLanches} ({cartaoPonto.totalLanches * 5} reais)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
