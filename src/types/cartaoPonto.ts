
export type CartaoPontoStatus = 'normal' | 'pending' | 'approved' | 'rejected';

export interface CartaoPonto {
  id: string;
  funcionarioId: string;
  funcionarioNome?: string; // For displaying the name
  data: string; // ISO date string
  horaEntrada?: string; // Time format HH:MM
  horaSaida?: string; // Time format HH:MM
  inicioAlmoco?: string; // Time format HH:MM
  fimAlmoco?: string; // Time format HH:MM
  totalHoras?: number;
  horasExtras?: number;
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
  diasTrabalhados: number;
  diasFaltantes: number;
  registrosIncompletos: number;
}
