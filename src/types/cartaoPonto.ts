
// Types for TimeCard (Cartão Ponto) system

export type StatusDia = 
  | 'normal'
  | 'falta_injustificada'
  | 'falta_justificada'
  | 'atestado'
  | 'ferias'
  | 'dispensado'
  | 'feriado'
  | 'folga';

export interface RegistroPonto {
  id?: string;
  funcionarioId: string;
  data: string; // YYYY-MM-DD format
  
  // Registros de horários (formato HH:MM)
  horaEntradaManha?: string; // Entrada normal
  entradaExtra?: string;     // Entrada antes do horário normal (hora extra)
  horaSaidaAlmoco?: string;  // Saída para almoço
  horaRetornoAlmoco?: string; // Volta do almoço
  horaSaidaTarde?: string;   // Saída normal
  horaSaidaExtra?: string;   // Saída após horário normal (hora extra)
  
  // Status do dia
  statusDia: StatusDia;
  
  // Observações
  observacoes?: string;
  
  // Campos calculados
  totalHorasNormais?: number; // Em minutos
  totalHorasExtras50?: number; // Em minutos
  totalHorasExtras80?: number; // Em minutos
  totalHorasExtras110?: number; // Em minutos
  totalHorasNoturno?: number; // Em minutos
  temDireitoLanche: boolean;
  
  // Metadados
  registradoPor: string;
  dataRegistro: string;
  ultimaModificacao?: string;
  modificadoPor?: string;
  bloqueado: boolean; // Bloqueado para edição (após 24h)
}

export interface CartaoPonto {
  id?: string;
  funcionarioId: string;
  mes: number; // 1-12
  ano: number;
  registros: RegistroPonto[];
  
  // Totalizadores
  totalHorasNormais: number; // Em minutos
  totalHorasExtras50: number; // Em minutos
  totalHorasExtras80: number; // Em minutos
  totalHorasExtras110: number; // Em minutos
  totalHorasNoturno: number; // Em minutos
  totalLanches: number;
  
  // Metadados
  fechado: boolean;
  validado: boolean;
  validadoPor?: string;
  dataValidacao?: string;
}

export interface ResumoHoras {
  totalNormal: number; // Em minutos
  totalExtra50: number; // Em minutos
  totalExtra80: number; // Em minutos
  totalExtra110: number; // Em minutos
  totalNoturno: number; // Em minutos
  totalLanches: number;
  valorLanches: number; // R$ 5,00 por lanche
}

// Funções de utilidade para cálculos de horas
export const isHorarioNoturno = (hora: string): boolean => {
  const horaNum = parseInt(hora.split(':')[0], 10);
  return horaNum >= 22 || horaNum < 5;
};

export const calcularMinutos = (hora: string): number => {
  if (!hora) return 0;
  const [hours, minutes] = hora.split(':').map(num => parseInt(num, 10));
  return (hours * 60) + minutes;
};

export const formatarMinutosParaHora = (minutos: number): string => {
  if (minutos === 0) return '00:00';
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const diaDaSemana = (data: string): number => {
  return new Date(data).getDay(); // 0 = domingo, 6 = sábado
};

export const isFimDeSemana = (data: string): boolean => {
  const dia = diaDaSemana(data);
  return dia === 0 || dia === 6; // domingo ou sábado
};

export const getHorarioSaidaRegular = (data: string): string => {
  // Se for sexta-feira (5), saída às 16:00, senão 17:00
  const dia = diaDaSemana(data);
  return dia === 5 ? '16:00' : '17:00';
};

// Adding the missing function
export const calcularResumoHoras = (cartaoPonto: CartaoPonto): ResumoHoras => {
  if (!cartaoPonto || !cartaoPonto.registros) {
    return {
      totalNormal: 0,
      totalExtra50: 0,
      totalExtra80: 0,
      totalExtra110: 0,
      totalNoturno: 0,
      totalLanches: 0,
      valorLanches: 0
    };
  }

  const resumo = {
    totalNormal: cartaoPonto.totalHorasNormais || 0,
    totalExtra50: cartaoPonto.totalHorasExtras50 || 0,
    totalExtra80: cartaoPonto.totalHorasExtras80 || 0,
    totalExtra110: cartaoPonto.totalHorasExtras110 || 0,
    totalNoturno: cartaoPonto.totalHorasNoturno || 0,
    totalLanches: cartaoPonto.totalLanches || 0,
    valorLanches: (cartaoPonto.totalLanches || 0) * 5 // R$ 5,00 por lanche
  };
  
  return resumo;
};
