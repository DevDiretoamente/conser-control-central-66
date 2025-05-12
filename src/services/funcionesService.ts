
import { Funcao, EPI, ExameMedico, Uniforme, ExamesPorTipo } from '@/types/funcionario';
import { mockFuncoes, mockEPIs, mockExamesMedicos, mockUniformes } from '@/data/funcionarioMockData';
import { toast } from 'sonner';

// Simulating local storage persistence
const FUNCOES_STORAGE_KEY = 'app_funcoes';

// Helper to get functions from storage or mock data
const getFuncoesFromStorage = (): Funcao[] => {
  try {
    const savedFuncoes = localStorage.getItem(FUNCOES_STORAGE_KEY);
    return savedFuncoes ? JSON.parse(savedFuncoes) : mockFuncoes;
  } catch (error) {
    console.error('Error loading funções from storage:', error);
    return mockFuncoes;
  }
};

// Helper to save functions to storage
const saveFuncoesToStorage = (funcoes: Funcao[]): void => {
  try {
    localStorage.setItem(FUNCOES_STORAGE_KEY, JSON.stringify(funcoes));
    console.log('Funções saved to storage successfully');
  } catch (error) {
    console.error('Error saving funções to storage:', error);
    toast.error('Erro ao salvar dados. Verifique seu armazenamento local.');
  }
};

// Create an ExamesPorTipo object from selected exam IDs
export const createExamesPorTipoFromSelected = (selectedByType: Record<string, string[]>): ExamesPorTipo => {
  const result: ExamesPorTipo = {
    admissional: [],
    periodico: [],
    mudancaFuncao: [],
    retornoTrabalho: [],
    demissional: []
  };
  
  // For each type, get the full exam objects
  Object.keys(selectedByType).forEach(type => {
    const tipoKey = type as keyof ExamesPorTipo;
    result[tipoKey] = mockExamesMedicos.filter(exame => 
      selectedByType[type].includes(exame.id) && exame.ativo
    );
  });
  
  return result;
};

// Service object with CRUD operations
export const funcionesService = {
  // Get all functions
  getAll: async (): Promise<Funcao[]> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const funcoes = getFuncoesFromStorage();
        console.log(`Retrieved ${funcoes.length} funções from storage`);
        resolve(funcoes);
      }, 300);
    });
  },
  
  // Get a specific function by ID
  getById: async (id: string): Promise<Funcao | undefined> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const funcoes = getFuncoesFromStorage();
        const funcao = funcoes.find(f => f.id === id);
        
        if (funcao) {
          console.log(`Retrieved função: ${funcao.nome}`);
          resolve(funcao);
        } else {
          console.error(`Função with id ${id} not found`);
          reject(new Error('Função não encontrada'));
        }
      }, 300);
    });
  },
  
  // Create a new function
  create: async (funcaoData: Omit<Funcao, 'id'>): Promise<Funcao> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const funcoes = getFuncoesFromStorage();
        
        const newFuncao: Funcao = {
          ...funcaoData,
          id: `funcao-${Date.now()}`
        };
        
        console.log(`Creating new função: ${newFuncao.nome}`);
        const updatedFuncoes = [...funcoes, newFuncao];
        saveFuncoesToStorage(updatedFuncoes);
        
        resolve(newFuncao);
      }, 500);
    });
  },
  
  // Update an existing function
  update: async (id: string, funcaoData: Partial<Funcao>): Promise<Funcao> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const funcoes = getFuncoesFromStorage();
        const funcaoIndex = funcoes.findIndex(f => f.id === id);
        
        if (funcaoIndex !== -1) {
          const updatedFuncao = {
            ...funcoes[funcaoIndex],
            ...funcaoData
          };
          
          console.log(`Updating função: ${updatedFuncao.nome}`);
          const updatedFuncoes = [
            ...funcoes.slice(0, funcaoIndex),
            updatedFuncao,
            ...funcoes.slice(funcaoIndex + 1)
          ];
          
          saveFuncoesToStorage(updatedFuncoes);
          resolve(updatedFuncao);
        } else {
          console.error(`Failed to update: Função with id ${id} not found`);
          reject(new Error('Função não encontrada para atualização'));
        }
      }, 500);
    });
  },
  
  // Toggle active status
  toggleActive: async (id: string): Promise<Funcao> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const funcoes = getFuncoesFromStorage();
        const funcaoIndex = funcoes.findIndex(f => f.id === id);
        
        if (funcaoIndex !== -1) {
          const funcao = funcoes[funcaoIndex];
          const updatedFuncao = {
            ...funcao,
            ativo: !funcao.ativo
          };
          
          console.log(`Toggling status for função: ${updatedFuncao.nome} to ${updatedFuncao.ativo ? 'active' : 'inactive'}`);
          const updatedFuncoes = [
            ...funcoes.slice(0, funcaoIndex),
            updatedFuncao,
            ...funcoes.slice(funcaoIndex + 1)
          ];
          
          saveFuncoesToStorage(updatedFuncoes);
          resolve(updatedFuncao);
        } else {
          console.error(`Failed to toggle: Função with id ${id} not found`);
          reject(new Error('Função não encontrada para alteração de status'));
        }
      }, 300);
    });
  },
  
  // Delete a function
  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const funcoes = getFuncoesFromStorage();
        const funcaoIndex = funcoes.findIndex(f => f.id === id);
        
        if (funcaoIndex !== -1) {
          const funcaoToDelete = funcoes[funcaoIndex];
          console.log(`Deleting função: ${funcaoToDelete.nome}`);
          
          const updatedFuncoes = [
            ...funcoes.slice(0, funcaoIndex),
            ...funcoes.slice(funcaoIndex + 1)
          ];
          
          saveFuncoesToStorage(updatedFuncoes);
          resolve(true);
        } else {
          console.error(`Failed to delete: Função with id ${id} not found`);
          reject(new Error('Função não encontrada para exclusão'));
        }
      }, 500);
    });
  },
  
  // Helper functions for related entities
  getEPIsByIds: (epiIds: string[]): EPI[] => {
    return mockEPIs.filter(epi => epiIds.includes(epi.id));
  },
  
  getUniformesByIds: (uniformeIds: string[]): Uniforme[] => {
    return mockUniformes.filter(uniforme => uniformeIds.includes(uniforme.id));
  },
  
  // Search functions by name, description, or sector
  search: async (searchTerm: string): Promise<Funcao[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const funcoes = getFuncoesFromStorage();
        
        if (!searchTerm.trim()) {
          resolve(funcoes);
          return;
        }
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        const filteredFuncoes = funcoes.filter(funcao => 
          funcao.nome.toLowerCase().includes(lowerSearchTerm) ||
          funcao.descricao.toLowerCase().includes(lowerSearchTerm)
        );
        
        console.log(`Search found ${filteredFuncoes.length} funções for term: "${searchTerm}"`);
        resolve(filteredFuncoes);
      }, 300);
    });
  }
};
