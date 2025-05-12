
import { User } from '@/types/auth';
import { FuncionarioCartaoPonto } from '@/types/funcionario';
import { mockFuncoes } from '@/data/funcionarioMockData';

// Mock employee data for time card system
const mockFuncionariosCartaoPonto: FuncionarioCartaoPonto[] = [
  {
    id: "func-1",
    nome: "João Silva",
    cargo: "Pedreiro",
    setor: "Operacional",
    matricula: "12345",
    dataAdmissao: "2022-01-15",
    horarioEntrada: "07:00",
    horarioSaida: "17:00",
    temIntervalo: true,
    horarioInicioIntervalo: "12:00",
    horarioFimIntervalo: "13:00",
    cargaHorariaSemanal: 44,
    diasTrabalho: [1, 2, 3, 4, 5], // Mon-Fri
    ativo: true,
    userId: "1"  // Reference to user account for linked systems
  },
  {
    id: "func-2",
    nome: "Maria Souza",
    cargo: "Assistente Administrativo",
    setor: "Administrativo",
    matricula: "12346",
    dataAdmissao: "2022-03-10",
    horarioEntrada: "08:00",
    horarioSaida: "17:00",
    temIntervalo: true,
    horarioInicioIntervalo: "12:00",
    horarioFimIntervalo: "13:00",
    cargaHorariaSemanal: 40,
    diasTrabalho: [1, 2, 3, 4, 5], // Mon-Fri
    ativo: true,
    userId: "2"
  },
  {
    id: "func-3",
    nome: "Pedro Santos",
    cargo: "Engenheiro Civil",
    setor: "Engenharia",
    matricula: "12347",
    dataAdmissao: "2022-02-01",
    horarioEntrada: "08:00",
    horarioSaida: "17:00",
    temIntervalo: true,
    horarioInicioIntervalo: "12:00",
    horarioFimIntervalo: "13:00",
    cargaHorariaSemanal: 40,
    diasTrabalho: [1, 2, 3, 4, 5], // Mon-Fri
    ativo: true,
    userId: "3"
  },
  {
    id: "func-4",
    nome: "Ana Carolina",
    cargo: "Analista de RH",
    setor: "Recursos Humanos",
    matricula: "12348",
    dataAdmissao: "2021-11-20",
    horarioEntrada: "08:00",
    horarioSaida: "17:00",
    temIntervalo: true,
    horarioInicioIntervalo: "12:00",
    horarioFimIntervalo: "13:00",
    cargaHorariaSemanal: 40,
    diasTrabalho: [1, 2, 3, 4, 5], // Mon-Fri
    ativo: true,
    userId: "4"
  },
  {
    id: "func-5",
    nome: "Roberto Almeida",
    cargo: "Motorista",
    setor: "Operacional",
    matricula: "12349",
    dataAdmissao: "2023-01-10",
    horarioEntrada: "07:00",
    horarioSaida: "17:00",
    temIntervalo: true,
    horarioInicioIntervalo: "12:00",
    horarioFimIntervalo: "13:00",
    cargaHorariaSemanal: 44,
    diasTrabalho: [1, 2, 3, 4, 5], // Mon-Fri
    ativo: true,
    userId: "5"
  }
];

// Get all active employees
export const getFuncionariosAtivos = (): FuncionarioCartaoPonto[] => {
  return mockFuncionariosCartaoPonto.filter(f => f.ativo);
};

// Get employee by ID
export const getFuncionarioById = (id: string): FuncionarioCartaoPonto | undefined => {
  return mockFuncionariosCartaoPonto.find(f => f.id === id);
};

// Get employee by user ID (for linking user accounts to employee data)
export const getFuncionarioByUserId = (userId: string): FuncionarioCartaoPonto | undefined => {
  return mockFuncionariosCartaoPonto.find(f => f.userId === userId);
};

// Convert users to employees (temporary mapping for transition)
export const mapUsersToFuncionarios = (users: User[]): FuncionarioCartaoPonto[] => {
  // Get active employees from mock data
  const funcionarios = getFuncionariosAtivos();
  
  // For users who don't have a corresponding employee record, create a basic one
  const userFuncionarios = users.filter(u => u.isActive && u.role === 'operator')
    .map(user => {
      // Check if user already has a mapped employee
      const existingFuncionario = funcionarios.find(f => f.userId === user.id);
      if (existingFuncionario) return existingFuncionario;
      
      // Create a new employee record for this user
      return {
        id: `user-${user.id}`,
        nome: user.name,
        cargo: "Não especificado",
        setor: "Não especificado",
        dataAdmissao: new Date().toISOString(),
        horarioEntrada: "08:00",
        horarioSaida: "17:00",
        temIntervalo: true,
        horarioInicioIntervalo: "12:00",
        horarioFimIntervalo: "13:00",
        cargaHorariaSemanal: 40,
        diasTrabalho: [1, 2, 3, 4, 5], // Mon-Fri
        ativo: true,
        userId: user.id
      };
    });
  
  // Return combined list, with real employee data taking precedence
  return [...funcionarios, ...userFuncionarios.filter(uf => 
    !funcionarios.some(f => f.userId === uf.userId)
  )];
};
