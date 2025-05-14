
export type CartaoPontoStatus = 
  'normal' | 
  'sobreaviso' | // On standby/willingness
  'dispensado' | // Dispensed
  'ferias' | // Vacation 
  'feriado' | // Holiday
  'falta_justificada' | // Justified absence
  'falta_injustificada'; // Unjustified absence

export type TipoJornada = 'normal' | 'sabado' | 'domingo_feriado';

// Interface for benefit management
export interface Beneficio {
  id: string;
  tipo: 'cesta_basica' | 'lanche';  // Basic basket or snack
  valor: number;  // Value in currency
  dataAtualizacao: string;
  observacoes?: string;
}

export interface CartaoPonto {
  id: string;
  funcionarioId: string;
  funcionarioNome?: string; // For displaying the name
  data: string; // ISO date string
  horaEntrada?: string; // Time format HH:MM
  horaSaida?: string; // Time format HH:MM
  inicioAlmoco?: string; // Time format HH:MM
  fimAlmoco?: string; // Time format HH:MM
  horaExtraInicio?: string; // Start time of extra hours
  horaExtraFim?: string; // End time of extra hours
  totalHoras?: number;
  horasExtras?: number;
  taxaHoraExtra?: number; // Rate for overtime (0.5, 0.8, 1.1)
  eligibleCestaBasica?: boolean; // Eligible for basic basket benefit
  eligibleLanche?: boolean; // Eligible for afternoon snack
  tipoJornada?: TipoJornada; // Type of workday
  status: CartaoPontoStatus;
  justificativa?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartaoPontoFilterOptions {
  funcionarioId?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: CartaoPontoStatus;
}

export interface CartaoPontoSummary {
  totalHorasMes: number;
  totalHorasExtras: number;
  totalHorasExtras50: number; // 50% overtime
  totalHorasExtras80: number; // 80% overtime
  totalHorasExtras110: number; // 110% overtime
  diasTrabalhados: number;
  diasFaltantes: number;
  registrosIncompletos: number;
  valorCestaBasica: number; // Value for basic basket benefit
  valorLanche: number; // Value for afternoon snack
  elegibleValeAlimentacao: boolean; // Eligible for food voucher
}
