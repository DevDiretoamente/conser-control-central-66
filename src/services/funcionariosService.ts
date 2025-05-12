
import { Funcionario, Dependente, DocumentoGerado } from '@/types/funcionario';
import { toast } from 'sonner';

// Simulating local storage persistence
const FUNCIONARIOS_STORAGE_KEY = 'app_funcionarios';

// Helper to get funcionários from storage or empty array
const getFuncionariosFromStorage = (): Funcionario[] => {
  try {
    const savedFuncionarios = localStorage.getItem(FUNCIONARIOS_STORAGE_KEY);
    return savedFuncionarios ? JSON.parse(savedFuncionarios) : [];
  } catch (error) {
    console.error('Error loading funcionários from storage:', error);
    return [];
  }
};

// Helper to save funcionários to storage
const saveFuncionariosToStorage = (funcionarios: Funcionario[]): void => {
  try {
    localStorage.setItem(FUNCIONARIOS_STORAGE_KEY, JSON.stringify(funcionarios));
    console.log('Funcionários saved to storage successfully');
  } catch (error) {
    console.error('Error saving funcionários to storage:', error);
    toast.error('Erro ao salvar dados. Verifique seu armazenamento local.');
  }
};

// Service object with CRUD operations
export const funcionariosService = {
  // Get all funcionários
  getAll: async (): Promise<Funcionario[]> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const funcionarios = getFuncionariosFromStorage();
        console.log(`Retrieved ${funcionarios.length} funcionários from storage`);
        resolve(funcionarios);
      }, 300);
    });
  },
  
  // Get a specific funcionário by ID
  getById: async (id: string): Promise<Funcionario | undefined> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const funcionarios = getFuncionariosFromStorage();
        const funcionario = funcionarios.find(f => f.id === id);
        
        if (funcionario) {
          console.log(`Retrieved funcionário: ${funcionario.dadosPessoais.nome}`);
          resolve(funcionario);
        } else {
          console.error(`Funcionário with id ${id} not found`);
          reject(new Error('Funcionário não encontrado'));
        }
      }, 300);
    });
  },
  
  // Create a new funcionário
  create: async (funcionarioData: Omit<Funcionario, 'id'>): Promise<Funcionario> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const funcionarios = getFuncionariosFromStorage();
        
        const newFuncionario: Funcionario = {
          ...funcionarioData,
          id: `funcionario-${Date.now()}`
        };
        
        console.log(`Creating new funcionário: ${newFuncionario.dadosPessoais.nome}`);
        const updatedFuncionarios = [...funcionarios, newFuncionario];
        saveFuncionariosToStorage(updatedFuncionarios);
        
        resolve(newFuncionario);
      }, 500);
    });
  },
  
  // Update an existing funcionário
  update: async (id: string, funcionarioData: Partial<Funcionario>): Promise<Funcionario> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const funcionarios = getFuncionariosFromStorage();
        const funcionarioIndex = funcionarios.findIndex(f => f.id === id);
        
        if (funcionarioIndex !== -1) {
          const updatedFuncionario = {
            ...funcionarios[funcionarioIndex],
            ...funcionarioData
          };
          
          console.log(`Updating funcionário: ${updatedFuncionario.dadosPessoais.nome}`);
          const updatedFuncionarios = [
            ...funcionarios.slice(0, funcionarioIndex),
            updatedFuncionario,
            ...funcionarios.slice(funcionarioIndex + 1)
          ];
          
          saveFuncionariosToStorage(updatedFuncionarios);
          resolve(updatedFuncionario);
        } else {
          console.error(`Failed to update: Funcionário with id ${id} not found`);
          reject(new Error('Funcionário não encontrado para atualização'));
        }
      }, 500);
    });
  },
  
  // Delete a funcionário
  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const funcionarios = getFuncionariosFromStorage();
        const funcionarioIndex = funcionarios.findIndex(f => f.id === id);
        
        if (funcionarioIndex !== -1) {
          const funcionarioToDelete = funcionarios[funcionarioIndex];
          console.log(`Deleting funcionário: ${funcionarioToDelete.dadosPessoais.nome}`);
          
          const updatedFuncionarios = [
            ...funcionarios.slice(0, funcionarioIndex),
            ...funcionarios.slice(funcionarioIndex + 1)
          ];
          
          saveFuncionariosToStorage(updatedFuncionarios);
          resolve(true);
        } else {
          console.error(`Failed to delete: Funcionário with id ${id} not found`);
          reject(new Error('Funcionário não encontrado para exclusão'));
        }
      }, 500);
    });
  },
  
  // Add documento gerado
  addDocumentoGerado: async (funcionarioId: string, documento: Omit<DocumentoGerado, 'id'>): Promise<DocumentoGerado> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const funcionarios = getFuncionariosFromStorage();
          const funcionarioIndex = funcionarios.findIndex(f => f.id === funcionarioId);
          
          if (funcionarioIndex === -1) {
            throw new Error('Funcionário não encontrado');
          }
          
          const funcionario = funcionarios[funcionarioIndex];
          
          const newDocumento: DocumentoGerado = {
            ...documento,
            id: `doc-${Date.now()}`
          };
          
          const documentosGerados = [...(funcionario.documentosGerados || []), newDocumento];
          
          const updatedFuncionario = {
            ...funcionario,
            documentosGerados
          };
          
          funcionarios[funcionarioIndex] = updatedFuncionario;
          saveFuncionariosToStorage(funcionarios);
          
          resolve(newDocumento);
        } catch (error) {
          console.error('Error adding documento:', error);
          reject(error);
        }
      }, 300);
    });
  },
  
  // Update documento gerado status
  updateDocumentoStatus: async (
    funcionarioId: string, 
    documentoId: string, 
    status: 'gerado' | 'assinado' | 'pendente' | 'arquivado',
    assinaturaUrl?: string
  ): Promise<DocumentoGerado> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const funcionarios = getFuncionariosFromStorage();
          const funcionarioIndex = funcionarios.findIndex(f => f.id === funcionarioId);
          
          if (funcionarioIndex === -1) {
            throw new Error('Funcionário não encontrado');
          }
          
          const funcionario = funcionarios[funcionarioIndex];
          
          if (!funcionario.documentosGerados) {
            throw new Error('Funcionário não possui documentos');
          }
          
          const documentoIndex = funcionario.documentosGerados.findIndex(d => d.id === documentoId);
          
          if (documentoIndex === -1) {
            throw new Error('Documento não encontrado');
          }
          
          const documento = funcionario.documentosGerados[documentoIndex];
          
          const updatedDocumento = {
            ...documento,
            status,
            ...(status === 'assinado' && {
              dataAssinatura: new Date(),
              assinaturaFuncionario: assinaturaUrl
            })
          };
          
          const updatedDocumentos = [
            ...funcionario.documentosGerados.slice(0, documentoIndex),
            updatedDocumento,
            ...funcionario.documentosGerados.slice(documentoIndex + 1)
          ];
          
          const updatedFuncionario = {
            ...funcionario,
            documentosGerados: updatedDocumentos
          };
          
          funcionarios[funcionarioIndex] = updatedFuncionario;
          saveFuncionariosToStorage(funcionarios);
          
          resolve(updatedDocumento);
        } catch (error) {
          console.error('Error updating documento status:', error);
          reject(error);
        }
      }, 300);
    });
  }
};
