import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from "lucide-react";
import { 
  CartaoPonto, 
  RegistroPonto, 
  StatusDia,
  formatarMinutosParaHora
} from '@/types/cartaoPonto';
import { salvarRegistroPonto, getFuncionarioDetails } from '@/services/cartaoPontoService';
import { User } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FuncionarioCartaoPonto } from '@/types/funcionario';
import { mapUsersToFuncionarios } from '@/services/funcionarioService';

// Importing refactored components
import FuncionarioHeader from './cartao-ponto/FuncionarioHeader';
import AlertasPonto from './cartao-ponto/AlertasPonto';
import VisualizacaoToggle from './cartao-ponto/VisualizacaoToggle';
import CalendarioView from './cartao-ponto/CalendarioView';
import DiaNavegacao from './cartao-ponto/DiaNavegacao';
import RegistroDiario from './cartao-ponto/RegistroDiario';
import HorasResumo from './cartao-ponto/HorasResumo';

interface CartaoPontoFormProps {
  funcionarios: User[] | FuncionarioCartaoPonto[];
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
  
  // Convert users to funcionarios if needed
  const getFuncionariosList = (): FuncionarioCartaoPonto[] => {
    if (funcionarios.length === 0) return [];
    
    // Check if we're already using FuncionarioCartaoPonto objects
    if ('cargo' in funcionarios[0]) {
      return funcionarios as FuncionarioCartaoPonto[];
    }
    
    // Otherwise convert User objects to FuncionarioCartaoPonto
    return mapUsersToFuncionarios(funcionarios as User[]);
  };
  
  // Fetch employee details when funcionarioId changes
  useEffect(() => {
    if (funcionarioSelecionadoId) {
      // Get employee list
      const funcionariosList = getFuncionariosList();
      const funcionario = funcionariosList.find(f => 
        f.id === funcionarioSelecionadoId || f.userId === funcionarioSelecionadoId
      );
      
      if (funcionario) {
        setFuncionarioDetalhes({
          name: funcionario.nome,
          setor: funcionario.setor,
          funcao: funcionario.cargo
        });
      } else {
        // Fallback to old method if employee not found
        const detalhes = getFuncionarioDetails(funcionarioSelecionadoId);
        setFuncionarioDetalhes(detalhes);
      }
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
      
      // Get employee default times if available
      const funcionariosList = getFuncionariosList();
      const funcionario = funcionariosList.find(f => 
        f.id === funcionarioSelecionadoId || f.userId === funcionarioSelecionadoId
      );
      
      if (funcionario) {
        // Use employee's specific schedule
        novoRegistro.horaEntradaManha = funcionario.horarioEntrada || '07:00';
        novoRegistro.horaSaidaTarde = funcionario.horarioSaida || '17:00';
        
        if (funcionario.temIntervalo) {
          novoRegistro.horaSaidaAlmoco = funcionario.horarioInicioIntervalo || '12:00';
          novoRegistro.horaRetornoAlmoco = funcionario.horarioFimIntervalo || '13:00';
        }
      } else {
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

  return (
    <div className="space-y-6">
      {/* Informações do funcionário */}
      <FuncionarioHeader funcionarioDetalhes={funcionarioDetalhes} />
      
      {/* Alertas */}
      <AlertasPonto podeEditar={podeEditar} cartaoPonto={cartaoPonto} />

      {/* Toggle de visualização */}
      <VisualizacaoToggle 
        visualizacao={visualizacao} 
        setVisualizacao={setVisualizacao} 
      />

      {/* Conteúdo baseado na visualização selecionada */}
      {visualizacao === 'calendario' ? (
        <CalendarioView
          registros={sortedRegistros}
          mes={mes}
          ano={ano}
          onDayClick={(index) => {
            setCurrentDayIndex(index);
            setVisualizacao('individual');
          }}
        />
      ) : (
        currentRegistro && (
          <div className="space-y-6">
            {/* Navegação entre dias */}
            <DiaNavegacao
              currentDayIndex={currentDayIndex}
              totalDays={sortedRegistros.length}
              formattedDate={formatarData(currentRegistro.data)}
              dayOfWeekName={getDayOfWeekName(currentRegistro.data)}
              onPrevious={goToPreviousDay}
              onNext={goToNextDay}
            />

            {/* Registro diário */}
            <RegistroDiario
              registro={currentRegistro}
              registroTemp={registroTemp}
              podeEditar={podeEditar}
              cartaoFechado={cartaoPonto?.fechado || false}
              getShortDayOfWeek={getShortDayOfWeek}
              handleStatusChange={handleStatusChange}
              setRegistroTemp={setRegistroTemp}
              iniciarEdicao={iniciarEdicao}
              cancelarEdicao={cancelarEdicao}
              salvarEdicao={salvarEdicao}
            />
          </div>
        )
      )}
      
      {/* Resumo de horas */}
      {podeVerResumo && cartaoPonto && (
        <HorasResumo cartaoPonto={cartaoPonto} />
      )}
    </div>
  );
};
