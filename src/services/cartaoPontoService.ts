
import { CartaoPonto, RegistroPonto, StatusDia } from "@/types/cartaoPonto";
import { User } from "@/types/auth";
import { Funcionario, Funcao, Setor } from "@/types/funcionario";

// Mock data for CartaoPonto
const mockCartaoPontoData: CartaoPonto[] = [
  {
    id: '1',
    funcionarioId: '1',
    mes: 5,
    ano: 2023,
    registros: [
      {
        id: '1-1',
        funcionarioId: '1',
        data: '2023-05-01',
        horaEntradaManha: '07:00',
        horaSaidaAlmoco: '12:00',
        horaRetornoAlmoco: '13:00',
        horaSaidaTarde: '17:00',
        statusDia: 'normal',
        temDireitoLanche: false,
        registradoPor: 'admin',
        dataRegistro: '2023-05-02T10:00:00',
        bloqueado: true
      },
      // More records would be here
    ],
    totalHorasNormais: 44 * 60, // 44 hours in minutes
    totalHorasExtras50: 5 * 60,
    totalHorasExtras80: 2 * 60,
    totalHorasExtras110: 0,
    totalHorasNoturno: 0,
    totalLanches: 3,
    fechado: false,
    validado: false
  }
];

// Enhanced mock data for employee details including sector and function
const mockFuncionariosDetails = [
  {
    id: '1',
    name: 'João Silva',
    setor: 'Operacional',
    funcao: 'Pedreiro'
  },
  {
    id: '2',
    name: 'Maria Souza',
    setor: 'Administrativo',
    funcao: 'Assistente Administrativo'
  },
  {
    id: '3',
    name: 'Pedro Santos',
    setor: 'Engenharia',
    funcao: 'Engenheiro Civil'
  }
];

// Function to get CartaoPonto for a specific employee and period
export const getCartaoPonto = (funcionarioId: string, mes: number, ano: number): CartaoPonto => {
  // In a real app, this would fetch from the API
  const cartaoPonto = mockCartaoPontoData.find(
    cp => cp.funcionarioId === funcionarioId && cp.mes === mes && cp.ano === ano
  );
  
  if (cartaoPonto) {
    return cartaoPonto;
  }
  
  // If not found, create a new empty one
  return createEmptyCartaoPonto(funcionarioId, mes, ano);
};

// Function to get employee details including sector and function
export const getFuncionarioDetails = (funcionarioId: string) => {
  const funcionario = mockFuncionariosDetails.find(f => f.id === funcionarioId);
  
  if (funcionario) {
    return {
      name: funcionario.name,
      setor: funcionario.setor,
      funcao: funcionario.funcao
    };
  }
  
  return {
    name: 'Funcionário não encontrado',
    setor: 'Não definido',
    funcao: 'Não definida'
  };
};

// Function to get default times based on day of week
export const getDefaultTimes = (data: string) => {
  const dayOfWeek = new Date(data).getDay(); // 0 = Sunday, ..., 6 = Saturday
  
  // Default times for all weekdays
  const times = {
    horaEntradaManha: '07:00',
    horaSaidaAlmoco: '12:00',
    horaRetornoAlmoco: '13:00',
    horaSaidaTarde: '17:00' // Default for Mon-Thu
  };
  
  // Friday has early departure
  if (dayOfWeek === 5) { // Friday
    times.horaSaidaTarde = '16:00';
  }
  
  // Weekend or holiday would be handled differently
  if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
    return null; // No default times for weekends
  }
  
  return times;
};

// Function to create an empty CartaoPonto with initialized days
export const createEmptyCartaoPonto = (funcionarioId: string, mes: number, ano: number): CartaoPonto => {
  const daysInMonth = new Date(ano, mes, 0).getDate();
  const registros: RegistroPonto[] = [];
  
  // Create a record for each day of the month
  for (let dia = 1; dia <= daysInMonth; dia++) {
    const data = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    const dataObj = new Date(data);
    
    // Skip creating entries for days in the future
    if (dataObj > new Date()) continue;
    
    // Determine default status for the day
    let statusDia: StatusDia = 'normal';
    
    // Weekends are automatically marked as 'folga'
    if (dataObj.getDay() === 0 || dataObj.getDay() === 6) {
      statusDia = 'folga';
    }
    
    // Fixed public holidays could be added here
    // if (isPublicHoliday(data)) {
    //   statusDia = 'feriado';
    // }
    
    // Create registro with appropriate defaults based on day of week
    const registro: RegistroPonto = {
      funcionarioId,
      data,
      statusDia,
      temDireitoLanche: false,
      registradoPor: 'system',
      dataRegistro: new Date().toISOString(),
      bloqueado: false
    };
    
    // Add default times for normal weekdays
    if (statusDia === 'normal') {
      const defaultTimes = getDefaultTimes(data);
      if (defaultTimes) {
        registro.horaEntradaManha = defaultTimes.horaEntradaManha;
        registro.horaSaidaAlmoco = defaultTimes.horaSaidaAlmoco;
        registro.horaRetornoAlmoco = defaultTimes.horaRetornoAlmoco;
        registro.horaSaidaTarde = defaultTimes.horaSaidaTarde;
      }
    }
    
    registros.push(registro);
  }
  
  return {
    funcionarioId,
    mes,
    ano,
    registros,
    totalHorasNormais: 0,
    totalHorasExtras50: 0,
    totalHorasExtras80: 0,
    totalHorasExtras110: 0,
    totalHorasNoturno: 0,
    totalLanches: 0,
    fechado: false,
    validado: false
  };
};

// Create placeholder for other service functions
export const saveCartaoPonto = (cartaoPonto: CartaoPonto): Promise<CartaoPonto> => {
  // In a real app, this would send data to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...cartaoPonto,
        id: cartaoPonto.id || Math.random().toString(36).substring(2, 10)
      });
    }, 500);
  });
};

// Function to save or update a registro ponto
export const salvarRegistroPonto = async (
  cartaoPontoId: string, 
  registroId: string,
  dadosRegistro: Partial<RegistroPonto>,
  user: User
): Promise<RegistroPonto> => {
  // In a real app, this would send data to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      const novoRegistro: RegistroPonto = {
        id: registroId || `reg-${Math.random().toString(36).substring(2, 10)}`,
        funcionarioId: dadosRegistro.funcionarioId || '',
        data: dadosRegistro.data || '',
        horaEntradaManha: dadosRegistro.horaEntradaManha,
        entradaExtra: dadosRegistro.entradaExtra,
        horaSaidaAlmoco: dadosRegistro.horaSaidaAlmoco,
        horaRetornoAlmoco: dadosRegistro.horaRetornoAlmoco,
        horaSaidaTarde: dadosRegistro.horaSaidaTarde,
        horaSaidaExtra: dadosRegistro.horaSaidaExtra,
        statusDia: dadosRegistro.statusDia || 'normal',
        observacoes: dadosRegistro.observacoes,
        totalHorasNormais: calculateHorasNormais(dadosRegistro),
        totalHorasExtras50: calculateHorasExtras50(dadosRegistro),
        totalHorasExtras80: calculateHorasExtras80(dadosRegistro),
        totalHorasExtras110: calculateHorasExtras110(dadosRegistro),
        totalHorasNoturno: calculateHorasNoturno(dadosRegistro),
        temDireitoLanche: calculateTemDireitoLanche(dadosRegistro),
        registradoPor: user.id,
        dataRegistro: new Date().toISOString(),
        modificadoPor: user.id,
        ultimaModificacao: new Date().toISOString(),
        bloqueado: false
      };
      
      resolve(novoRegistro);
    }, 500);
  });
};

// Helper functions for calculations
const calculateHorasNormais = (registro: Partial<RegistroPonto>): number => {
  // Simple implementation for now - just return a reasonable amount
  return 480; // 8 hours in minutes
};

const calculateHorasExtras50 = (registro: Partial<RegistroPonto>): number => {
  // Simplified calculation
  return 0;
};

const calculateHorasExtras80 = (registro: Partial<RegistroPonto>): number => {
  // Simplified calculation
  return 0;
};

const calculateHorasExtras110 = (registro: Partial<RegistroPonto>): number => {
  // Simplified calculation
  return 0;
};

const calculateHorasNoturno = (registro: Partial<RegistroPonto>): number => {
  // Simplified calculation
  return 0;
};

const calculateTemDireitoLanche = (registro: Partial<RegistroPonto>): boolean => {
  // If total extra hours > 1h, they get a snack
  return false;
};

// Check if a specific day is a holiday
export const isHoliday = (data: string): boolean => {
  // This would normally check against a list of holidays
  // For this example, just assume no holidays
  return false;
};

// Function to check if a registration can be edited
export const canEditRegistro = (registro: RegistroPonto): boolean => {
  if (registro.bloqueado) return false;
  
  // Can't edit if the status isn't 'normal' (except for changing the status itself)
  if (registro.statusDia !== 'normal' && registro.statusDia !== 'feriado') return false;
  
  // Check if it's within 24h of registration
  const now = new Date();
  const registeredDate = new Date(registro.dataRegistro);
  const hoursDiff = (now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff <= 24;
};
