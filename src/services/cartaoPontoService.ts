
import { CartaoPonto, CartaoPontoFilterOptions, CartaoPontoStatus, CartaoPontoSummary, TipoJornada } from '@/types/cartaoPonto';
import { beneficioService } from './beneficioService';
import { v4 as uuidv4 } from 'uuid';
import { isWeekend, getDay, parseISO } from 'date-fns';

// Mock data for card points
const mockCartaoPontos: CartaoPonto[] = [
  {
    id: '1',
    funcionarioId: '101',
    funcionarioNome: 'João Silva',
    data: '2025-05-01',
    horaEntrada: '08:00',
    horaSaida: '18:00',
    inicioAlmoco: '12:00',
    fimAlmoco: '13:00',
    totalHoras: 9,
    horasExtras: 1,
    taxaHoraExtra: 0.5, // 50% rate
    eligibleCestaBasica: true,
    eligibleLanche: true,
    tipoJornada: 'normal',
    status: 'normal',
    observacoes: 'Dia normal de trabalho',
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-05-01T18:00:00Z',
  },
  {
    id: '2',
    funcionarioId: '101',
    funcionarioNome: 'João Silva',
    data: '2025-05-02',
    horaEntrada: '08:15',
    horaSaida: '17:30',
    inicioAlmoco: '12:00',
    fimAlmoco: '13:00',
    totalHoras: 8.25,
    horasExtras: 0.25,
    taxaHoraExtra: 0.5, // 50% rate
    eligibleCestaBasica: true,
    eligibleLanche: false,
    tipoJornada: 'normal',
    status: 'normal',
    observacoes: 'Saiu mais cedo com autorização',
    createdAt: '2025-05-02T08:15:00Z',
    updatedAt: '2025-05-02T17:30:00Z',
  },
  {
    id: '3',
    funcionarioId: '102',
    funcionarioNome: 'Maria Oliveira',
    data: '2025-05-01',
    horaEntrada: '09:00',
    horaSaida: '18:00',
    inicioAlmoco: '12:30',
    fimAlmoco: '13:30',
    totalHoras: 8,
    tipoJornada: 'normal',
    status: 'normal',
    createdAt: '2025-05-01T09:00:00Z',
    updatedAt: '2025-05-01T18:00:00Z',
  },
  {
    id: '4',
    funcionarioId: '102',
    funcionarioNome: 'Maria Oliveira',
    data: '2025-05-02',
    horaEntrada: '09:00',
    tipoJornada: 'normal',
    status: 'pending',
    justificativa: 'Esqueci de marcar a saída',
    createdAt: '2025-05-02T09:00:00Z',
    updatedAt: '2025-05-02T09:00:00Z',
  },
  {
    id: '5',
    funcionarioId: '101',
    funcionarioNome: 'João Silva',
    data: '2025-05-04', // Sunday
    horaEntrada: '08:00',
    horaSaida: '12:00',
    inicioAlmoco: '12:00',
    fimAlmoco: '13:00',
    totalHoras: 4,
    horasExtras: 4,
    taxaHoraExtra: 1.1, // 110% rate
    eligibleCestaBasica: true,
    eligibleLanche: true,
    tipoJornada: 'domingo_feriado',
    status: 'normal',
    observacoes: 'Trabalho em domingo',
    createdAt: '2025-05-04T08:00:00Z',
    updatedAt: '2025-05-04T12:00:00Z',
  }
];

// Helper function to determine day type based on date
const determineTipoJornada = (date: string): TipoJornada => {
  const dateObj = parseISO(date);
  const dayOfWeek = getDay(dateObj);
  
  if (dayOfWeek === 0) { // Sunday
    return 'domingo_feriado';
  } else if (dayOfWeek === 6) { // Saturday
    return 'sabado';
  } else {
    return 'normal';
  }
};

// Helper function to determine overtime rate based on date and time
const determineOvertimeRate = (date: string): number => {
  const dateObj = parseISO(date);
  const dayOfWeek = getDay(dateObj);
  
  if (dayOfWeek === 0) { // Sunday
    return 1.1; // 110% rate
  } else if (dayOfWeek === 6) { // Saturday
    return 0.8; // 80% rate - can be adjusted based on specific rules
  } else {
    return 0.5; // 50% rate for weekdays
  }
};

// Helper function to calculate hours between two time strings
const calculateHoursDifference = (start: string, end: string): number => {
  if (!start || !end) return 0;
  
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return (endMinutes - startMinutes) / 60;
};

// Enhanced calculation of total work hours accounting for work day type and lunch break
const calculateTotalHours = (
  entrada: string | undefined, 
  saida: string | undefined, 
  inicioAlmoco: string | undefined, 
  fimAlmoco: string | undefined,
  tipoJornada: TipoJornada = 'normal',
  horaExtraInicio?: string,
  horaExtraFim?: string
): { 
  totalHoras: number;
  horasExtras: number;
  eligibleLanche: boolean;
} => {
  if (!entrada || !saida) return { totalHoras: 0, horasExtras: 0, eligibleLanche: false };
  
  let totalHoras = 0;
  let horasExtras = 0;
  
  // Calculate main shift hours
  const shiftHours = calculateHoursDifference(entrada, saida);
  
  // Subtract lunch break if applicable
  let lunchHours = 0;
  if (inicioAlmoco && fimAlmoco) {
    lunchHours = calculateHoursDifference(inicioAlmoco, fimAlmoco);
    totalHoras = shiftHours - lunchHours;
  } else {
    totalHoras = shiftHours;
  }
  
  // Add extra hours if specified
  if (horaExtraInicio && horaExtraFim) {
    const extraHours = calculateHoursDifference(horaExtraInicio, horaExtraFim);
    totalHoras += extraHours;
  }
  
  // Calculate overtime based on day type
  if (tipoJornada === 'domingo_feriado') {
    // All hours on Sunday or holiday are overtime
    horasExtras = totalHoras;
  } else if (tipoJornada === 'sabado') {
    // All hours on Saturday are overtime
    horasExtras = totalHoras;
  } else {
    // Regular weekday
    // Check if it's Friday (different schedule: 7:00-16:00)
    const isFriday = false; // This would be determined by the date
    const regularHours = isFriday ? 8 : 9; // 8 hours on Friday, 9 hours on other days
    
    horasExtras = Math.max(0, totalHoras - regularHours);
  }
  
  // Check if eligible for afternoon snack (more than 1 hour of overtime)
  const eligibleLanche = horasExtras > 1;
  
  return { totalHoras, horasExtras, eligibleLanche };
};

export const cartaoPontoService = {
  getAll: async (): Promise<CartaoPonto[]> => {
    return [...mockCartaoPontos];
  },
  
  getById: async (id: string): Promise<CartaoPonto | null> => {
    const record = mockCartaoPontos.find(cp => cp.id === id);
    return record || null;
  },
  
  getByFuncionarioId: async (funcionarioId: string): Promise<CartaoPonto[]> => {
    return mockCartaoPontos.filter(cp => cp.funcionarioId === funcionarioId);
  },
  
  filter: async (filters: CartaoPontoFilterOptions): Promise<CartaoPonto[]> => {
    return mockCartaoPontos.filter(cp => {
      if (filters.funcionarioId && cp.funcionarioId !== filters.funcionarioId) return false;
      
      if (filters.dataInicio) {
        const dataInicio = new Date(filters.dataInicio);
        const recordDate = new Date(cp.data);
        if (recordDate < dataInicio) return false;
      }
      
      if (filters.dataFim) {
        const dataFim = new Date(filters.dataFim);
        const recordDate = new Date(cp.data);
        if (recordDate > dataFim) return false;
      }
      
      if (filters.status && cp.status !== filters.status) return false;
      
      return true;
    });
  },
  
  create: async (cartaoPonto: Omit<CartaoPonto, 'id' | 'createdAt' | 'updatedAt'>): Promise<CartaoPonto> => {
    const now = new Date().toISOString();
    
    // Determine day type based on date
    const tipoJornada = determineTipoJornada(cartaoPonto.data);
    const taxaHoraExtra = determineOvertimeRate(cartaoPonto.data);
    
    // Calculate total hours and overtime
    const calculatedHours = calculateTotalHours(
      cartaoPonto.horaEntrada,
      cartaoPonto.horaSaida,
      cartaoPonto.inicioAlmoco,
      cartaoPonto.fimAlmoco,
      tipoJornada,
      cartaoPonto.horaExtraInicio,
      cartaoPonto.horaExtraFim
    );
    
    // Determine eligibility for basic basket
    // By default, all normal records are eligible, unless it's an unjustified absence
    const eligibleCestaBasica = cartaoPonto.status !== 'falta_injustificada';
    
    const newRecord: CartaoPonto = {
      id: uuidv4(),
      ...cartaoPonto,
      tipoJornada,
      taxaHoraExtra,
      totalHoras: calculatedHours.totalHoras,
      horasExtras: calculatedHours.horasExtras,
      eligibleCestaBasica,
      eligibleLanche: calculatedHours.eligibleLanche,
      createdAt: now,
      updatedAt: now,
    };
    
    mockCartaoPontos.push(newRecord);
    return newRecord;
  },
  
  update: async (id: string, cartaoPonto: Partial<CartaoPonto>): Promise<CartaoPonto | null> => {
    const index = mockCartaoPontos.findIndex(cp => cp.id === id);
    if (index === -1) return null;
    
    const updatedRecord = {
      ...mockCartaoPontos[index],
      ...cartaoPonto,
      updatedAt: new Date().toISOString()
    };
    
    // If the date was changed, recalculate day type and overtime rate
    if (cartaoPonto.data && cartaoPonto.data !== mockCartaoPontos[index].data) {
      updatedRecord.tipoJornada = determineTipoJornada(cartaoPonto.data);
      updatedRecord.taxaHoraExtra = determineOvertimeRate(cartaoPonto.data);
    }
    
    // Recalculate hours if time fields were updated
    if (
      cartaoPonto.horaEntrada !== undefined ||
      cartaoPonto.horaSaida !== undefined ||
      cartaoPonto.inicioAlmoco !== undefined ||
      cartaoPonto.fimAlmoco !== undefined ||
      cartaoPonto.horaExtraInicio !== undefined ||
      cartaoPonto.horaExtraFim !== undefined
    ) {
      const calculatedHours = calculateTotalHours(
        updatedRecord.horaEntrada,
        updatedRecord.horaSaida,
        updatedRecord.inicioAlmoco,
        updatedRecord.fimAlmoco,
        updatedRecord.tipoJornada,
        updatedRecord.horaExtraInicio,
        updatedRecord.horaExtraFim
      );
      
      updatedRecord.totalHoras = calculatedHours.totalHoras;
      updatedRecord.horasExtras = calculatedHours.horasExtras;
      updatedRecord.eligibleLanche = calculatedHours.eligibleLanche;
    }
    
    // Update eligibility for basic basket based on status
    if (cartaoPonto.status !== undefined) {
      updatedRecord.eligibleCestaBasica = cartaoPonto.status !== 'falta_injustificada';
    }
    
    mockCartaoPontos[index] = updatedRecord;
    return updatedRecord;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const index = mockCartaoPontos.findIndex(cp => cp.id === id);
    if (index === -1) return false;
    
    mockCartaoPontos.splice(index, 1);
    return true;
  },
  
  updateStatus: async (id: string, status: CartaoPontoStatus, observacoes?: string): Promise<CartaoPonto | null> => {
    return cartaoPontoService.update(id, { 
      status, 
      observacoes,
      // Update eligibility for basic basket based on status
      eligibleCestaBasica: status !== 'falta_injustificada'
    });
  },
  
  getSummary: async (funcionarioId: string, mes: number, ano: number): Promise<CartaoPontoSummary> => {
    const startDate = new Date(ano, mes - 1, 1);
    const endDate = new Date(ano, mes, 0);
    
    const records = mockCartaoPontos.filter(cp => {
      const recordDate = new Date(cp.data);
      return cp.funcionarioId === funcionarioId && 
             recordDate >= startDate && 
             recordDate <= endDate;
    });
    
    const totalHorasMes = records.reduce((sum, record) => sum + (record.totalHoras || 0), 0);
    const totalHorasExtras = records.reduce((sum, record) => sum + (record.horasExtras || 0), 0);
    
    // Calculate overtime by rate
    const totalHorasExtras50 = records.reduce((sum, record) => 
      sum + (record.taxaHoraExtra === 0.5 ? (record.horasExtras || 0) : 0), 
    0);
    
    const totalHorasExtras80 = records.reduce((sum, record) => 
      sum + (record.taxaHoraExtra === 0.8 ? (record.horasExtras || 0) : 0), 
    0);
    
    const totalHorasExtras110 = records.reduce((sum, record) => 
      sum + (record.taxaHoraExtra === 1.1 ? (record.horasExtras || 0) : 0), 
    0);
    
    const diasTrabalhados = records.filter(r => 
      r.status !== 'falta_injustificada' && r.status !== 'falta_justificada'
    ).length;
    
    const diasUteis = 22; // Assuming 22 working days per month
    const diasFaltantes = diasUteis - diasTrabalhados;
    
    const registrosIncompletos = records.filter(r => 
      !r.horaEntrada || !r.horaSaida || r.status === 'pending'
    ).length;
    
    // Check eligibility for food voucher (no unjustified absences)
    const elegibleValeAlimentacao = !records.some(r => r.status === 'falta_injustificada');
    
    // Get current benefit values
    const beneficioValues = await beneficioService.getCurrentValues();
    
    return {
      totalHorasMes,
      totalHorasExtras,
      totalHorasExtras50,
      totalHorasExtras80,
      totalHorasExtras110,
      diasTrabalhados,
      diasFaltantes,
      registrosIncompletos,
      valorCestaBasica: elegibleValeAlimentacao ? beneficioValues.cestaBasica : 0,
      valorLanche: records.filter(r => r.eligibleLanche).length * beneficioValues.lanche,
      elegibleValeAlimentacao
    };
  }
};

// Add a type for when we export
export type CartaoPontoService = typeof cartaoPontoService;
