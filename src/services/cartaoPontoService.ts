
import { CartaoPonto, CartaoPontoFilterOptions, CartaoPontoStatus, CartaoPontoSummary, TipoJornada } from '@/types/cartaoPonto';
import { beneficioService } from './beneficioService';
import { v4 as uuidv4 } from 'uuid';
import { isWeekend, getDay, parseISO } from 'date-fns';
import { convertTimeStringToMinutes, convertMinutesToTimeString, formatDecimalHours } from '@/lib/utils';

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

// Helper function to determine overtime rate based on date and accumulated overtime
const determineOvertimeRate = (date: string, totalMonthlyOvertime: number): number => {
  const dateObj = parseISO(date);
  const dayOfWeek = getDay(dateObj);
  
  if (dayOfWeek === 0) { // Sunday
    return 1.1; // 110% rate
  } else if (dayOfWeek === 6) { // Saturday
    return 0.8; // 80% rate
  } else {
    // New rule: if total monthly overtime exceeds 50 hours, apply 80% rate
    return totalMonthlyOvertime > 50 ? 0.8 : 0.5;
  }
};

// Calculate total work hours accounting for proper 60-minute time format
const calculateTotalHours = (
  entrada: string | undefined, 
  saida: string | undefined, 
  inicioAlmoco: string | undefined, 
  fimAlmoco: string | undefined,
  tipoJornada: TipoJornada = 'normal',
  horaExtraFim?: string
): { 
  totalHoras: number;
  horasExtras: number;
  eligibleLanche: boolean;
} => {
  if (!entrada || !saida) {
    return { totalHoras: 0, horasExtras: 0, eligibleLanche: false };
  }
  
  // Convert times to minutes for accurate calculations
  const entradaMinutes = convertTimeStringToMinutes(entrada);
  const saidaMinutes = convertTimeStringToMinutes(saida);
  
  // Calculate lunch break time
  let almocoMinutes = 0;
  if (inicioAlmoco && fimAlmoco) {
    const inicioAlmocoMinutes = convertTimeStringToMinutes(inicioAlmoco);
    const fimAlmocoMinutes = convertTimeStringToMinutes(fimAlmoco);
    almocoMinutes = fimAlmocoMinutes - inicioAlmocoMinutes;
  }
  
  // Calculate work hours excluding lunch
  const workMinutes = saidaMinutes - entradaMinutes - almocoMinutes;
  
  // Calculate overtime if applicable
  let extraMinutes = 0;
  if (horaExtraFim) {
    const extraFimMinutes = convertTimeStringToMinutes(horaExtraFim);
    extraMinutes = extraFimMinutes - saidaMinutes;
  }
  
  // Convert minutes to decimal hours
  const workHours = workMinutes / 60;
  const extraHours = extraMinutes / 60;
  
  // Calculate total hours
  const totalHoras = workHours + extraHours;
  
  // Determine regular work hours based on day type
  let regularHours = 0;
  let horasExtras = 0;
  
  if (tipoJornada === 'domingo_feriado') {
    // All hours on Sunday or holiday are overtime
    horasExtras = totalHoras;
    regularHours = 0;
  } else if (tipoJornada === 'sabado') {
    // All hours on Saturday are overtime
    horasExtras = totalHoras;
    regularHours = 0;
  } else {
    // Regular weekday: 8 hours regular, rest is overtime
    regularHours = 8;
    horasExtras = Math.max(0, totalHoras - regularHours);
  }
  
  // Check if eligible for afternoon snack (more than 1 hour of overtime)
  const eligibleLanche = horasExtras > 1;
  
  return { 
    totalHoras, 
    horasExtras, 
    eligibleLanche 
  };
};

// Function to get total overtime for an employee in the current month
const getTotalMonthlyOvertime = async (
  funcionarioId: string, 
  currentMonth: number, 
  currentYear: number
): Promise<number> => {
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0);
  
  // Filter records for the employee within the month
  const records = mockCartaoPontos.filter(cp => {
    const recordDate = new Date(cp.data);
    return cp.funcionarioId === funcionarioId && 
           recordDate >= startDate && 
           recordDate <= endDate;
  });
  
  // Sum up overtime hours
  return records.reduce((sum, record) => {
    return sum + (record.horasExtras || 0);
  }, 0);
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
    const currentDate = new Date(cartaoPonto.data);
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Determine day type based on date
    const tipoJornada = determineTipoJornada(cartaoPonto.data);
    
    // Get total overtime for the employee in the current month
    const totalMonthlyOvertime = await getTotalMonthlyOvertime(
      cartaoPonto.funcionarioId, 
      currentMonth, 
      currentYear
    );
    
    // Determine the overtime rate based on day type and accumulated overtime
    const taxaHoraExtra = determineOvertimeRate(cartaoPonto.data, totalMonthlyOvertime);
    
    // Calculate total hours and overtime
    const calculatedHours = calculateTotalHours(
      cartaoPonto.horaEntrada,
      cartaoPonto.horaSaida,
      cartaoPonto.inicioAlmoco,
      cartaoPonto.fimAlmoco,
      tipoJornada,
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
      const currentDate = new Date(cartaoPonto.data);
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      updatedRecord.tipoJornada = determineTipoJornada(cartaoPonto.data);
      
      // Get total overtime for the month
      const totalMonthlyOvertime = await getTotalMonthlyOvertime(
        updatedRecord.funcionarioId, 
        currentMonth, 
        currentYear
      );
      
      updatedRecord.taxaHoraExtra = determineOvertimeRate(
        cartaoPonto.data, 
        totalMonthlyOvertime
      );
    }
    
    // Recalculate hours if time fields were updated
    if (
      cartaoPonto.horaEntrada !== undefined ||
      cartaoPonto.horaSaida !== undefined ||
      cartaoPonto.inicioAlmoco !== undefined ||
      cartaoPonto.fimAlmoco !== undefined ||
      cartaoPonto.horaExtraFim !== undefined
    ) {
      const calculatedHours = calculateTotalHours(
        updatedRecord.horaEntrada,
        updatedRecord.horaSaida,
        updatedRecord.inicioAlmoco,
        updatedRecord.fimAlmoco,
        updatedRecord.tipoJornada,
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
      r.status === 'normal' || r.status === 'sobreaviso'
    ).length;
    
    const diasUteis = 22; // Assuming 22 working days per month
    const diasFaltantes = diasUteis - diasTrabalhados;
    
    const registrosIncompletos = records.filter(r => 
      (r.status === 'normal' && (!r.horaEntrada || !r.horaSaida))
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
