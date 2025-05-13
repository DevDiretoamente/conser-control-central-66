
import { CartaoPonto, CartaoPontoFilterOptions, CartaoPontoStatus, CartaoPontoSummary } from '@/types/cartaoPonto';
import { v4 as uuidv4 } from 'uuid';

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
    status: 'pending',
    justificativa: 'Esqueci de marcar a saída',
    createdAt: '2025-05-02T09:00:00Z',
    updatedAt: '2025-05-02T09:00:00Z',
  }
];

// Helper function to calculate hours between two time strings
const calculateHoursDifference = (start: string, end: string): number => {
  if (!start || !end) return 0;
  
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return (endMinutes - startMinutes) / 60;
};

// Calculate total work hours accounting for lunch break
const calculateTotalHours = (entrada: string | undefined, saida: string | undefined, inicioAlmoco: string | undefined, fimAlmoco: string | undefined): number => {
  if (!entrada || !saida) return 0;
  
  const totalHours = calculateHoursDifference(entrada, saida);
  
  if (inicioAlmoco && fimAlmoco) {
    const lunchHours = calculateHoursDifference(inicioAlmoco, fimAlmoco);
    return totalHours - lunchHours;
  }
  
  return totalHours;
};

// Calculate overtime hours (assuming 8-hour workday)
const calculateOvertime = (totalHoras: number): number => {
  return totalHoras > 8 ? totalHoras - 8 : 0;
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
    
    // Calculate total hours and overtime
    const totalHoras = calculateTotalHours(
      cartaoPonto.horaEntrada,
      cartaoPonto.horaSaida,
      cartaoPonto.inicioAlmoco,
      cartaoPonto.fimAlmoco
    );
    
    const horasExtras = calculateOvertime(totalHoras);
    
    const newRecord: CartaoPonto = {
      id: uuidv4(),
      ...cartaoPonto,
      totalHoras,
      horasExtras,
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
    
    // Recalculate hours if time fields were updated
    if (
      cartaoPonto.horaEntrada !== undefined ||
      cartaoPonto.horaSaida !== undefined ||
      cartaoPonto.inicioAlmoco !== undefined ||
      cartaoPonto.fimAlmoco !== undefined
    ) {
      updatedRecord.totalHoras = calculateTotalHours(
        updatedRecord.horaEntrada,
        updatedRecord.horaSaida,
        updatedRecord.inicioAlmoco,
        updatedRecord.fimAlmoco
      );
      
      updatedRecord.horasExtras = calculateOvertime(updatedRecord.totalHoras);
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
    return cartaoPontoService.update(id, { status, observacoes });
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
    const diasTrabalhados = records.length;
    const diasUteis = 22; // Assuming 22 working days per month
    const diasFaltantes = diasUteis - diasTrabalhados;
    const registrosIncompletos = records.filter(r => 
      !r.horaEntrada || !r.horaSaida || r.status === 'pending'
    ).length;
    
    return {
      totalHorasMes,
      totalHorasExtras,
      diasTrabalhados,
      diasFaltantes,
      registrosIncompletos
    };
  }
};

// Add a type for when we export
export type CartaoPontoService = typeof cartaoPontoService;
