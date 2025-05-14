
import { Beneficio } from '@/types/cartaoPonto';
import { toast } from '@/hooks/use-toast';

// Mock storage key for benefits
const BENEFICIOS_STORAGE_KEY = 'app_beneficios';

// Default values
const DEFAULT_BENEFICIOS: Beneficio[] = [
  {
    id: 'cesta-basica-default',
    tipo: 'cesta_basica',
    valor: 450.00,
    dataAtualizacao: new Date().toISOString(),
    observacoes: 'Valor padrão da cesta básica'
  },
  {
    id: 'lanche-default',
    tipo: 'lanche',
    valor: 5.00,
    dataAtualizacao: new Date().toISOString(),
    observacoes: 'Valor padrão do lanche por hora extra'
  }
];

// Helper to get benefícios from storage or default values
const getBeneficiosFromStorage = (): Beneficio[] => {
  try {
    const savedBeneficios = localStorage.getItem(BENEFICIOS_STORAGE_KEY);
    return savedBeneficios ? JSON.parse(savedBeneficios) : DEFAULT_BENEFICIOS;
  } catch (error) {
    console.error('Error loading benefícios from storage:', error);
    return DEFAULT_BENEFICIOS;
  }
};

// Helper to save beneficios to storage
const saveBeneficiosToStorage = (beneficios: Beneficio[]): void => {
  try {
    localStorage.setItem(BENEFICIOS_STORAGE_KEY, JSON.stringify(beneficios));
    console.log('Benefícios saved to storage successfully');
  } catch (error) {
    console.error('Error saving benefícios to storage:', error);
    toast({
      title: 'Erro',
      description: 'Erro ao salvar benefícios no armazenamento local.',
      variant: 'destructive',
    });
  }
};

// Service object with operations for benefícios
export const beneficioService = {
  // Get all benefícios
  getAll: async (): Promise<Beneficio[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const beneficios = getBeneficiosFromStorage();
        resolve(beneficios);
      }, 300);
    });
  },
  
  // Get a specific benefício by ID
  getById: async (id: string): Promise<Beneficio | undefined> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const beneficios = getBeneficiosFromStorage();
        const beneficio = beneficios.find(b => b.id === id);
        
        if (beneficio) {
          resolve(beneficio);
        } else {
          reject(new Error('Benefício não encontrado'));
        }
      }, 300);
    });
  },
  
  // Get a specific benefício by type
  getByTipo: async (tipo: 'cesta_basica' | 'lanche'): Promise<Beneficio | undefined> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const beneficios = getBeneficiosFromStorage();
        const beneficio = beneficios.find(b => b.tipo === tipo);
        
        if (beneficio) {
          resolve(beneficio);
        } else {
          reject(new Error('Benefício não encontrado'));
        }
      }, 300);
    });
  },
  
  // Create a new benefício
  create: async (beneficioData: Omit<Beneficio, 'id'>): Promise<Beneficio> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const beneficios = getBeneficiosFromStorage();
        
        // Check if benefício of this type already exists
        const existingBeneficio = beneficios.find(b => b.tipo === beneficioData.tipo);
        if (existingBeneficio) {
          reject(new Error('Já existe um benefício deste tipo cadastrado'));
          return;
        }
        
        const newBeneficio: Beneficio = {
          ...beneficioData,
          id: `beneficio-${Date.now()}`
        };
        
        const updatedBeneficios = [...beneficios, newBeneficio];
        saveBeneficiosToStorage(updatedBeneficios);
        
        resolve(newBeneficio);
      }, 500);
    });
  },
  
  // Update an existing benefício
  update: async (id: string, beneficioData: Partial<Beneficio>): Promise<Beneficio> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const beneficios = getBeneficiosFromStorage();
        const index = beneficios.findIndex(b => b.id === id);
        
        if (index === -1) {
          reject(new Error('Benefício não encontrado para atualização'));
          return;
        }
        
        // If trying to change type, check if new type already exists (except for the current one)
        if (beneficioData.tipo && beneficioData.tipo !== beneficios[index].tipo) {
          const existingBeneficio = beneficios.find(b => 
            b.tipo === beneficioData.tipo && b.id !== id
          );
          if (existingBeneficio) {
            reject(new Error('Já existe um benefício deste tipo cadastrado'));
            return;
          }
        }
        
        const updatedBeneficio = {
          ...beneficios[index],
          ...beneficioData,
          dataAtualizacao: new Date().toISOString()
        };
        
        const updatedBeneficios = [
          ...beneficios.slice(0, index),
          updatedBeneficio,
          ...beneficios.slice(index + 1)
        ];
        
        saveBeneficiosToStorage(updatedBeneficios);
        resolve(updatedBeneficio);
      }, 500);
    });
  },
  
  // Delete a benefício
  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const beneficios = getBeneficiosFromStorage();
        const index = beneficios.findIndex(b => b.id === id);
        
        if (index === -1) {
          reject(new Error('Benefício não encontrado para exclusão'));
          return;
        }
        
        const updatedBeneficios = [
          ...beneficios.slice(0, index),
          ...beneficios.slice(index + 1)
        ];
        
        saveBeneficiosToStorage(updatedBeneficios);
        resolve(true);
      }, 500);
    });
  },
  
  // Get current benefit values (latest of each type)
  getCurrentValues: async (): Promise<{ cestaBasica: number; lanche: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const beneficios = getBeneficiosFromStorage();
        
        // Get the latest cesta básica and lanche values
        const cestaBasica = beneficios.find(b => b.tipo === 'cesta_basica')?.valor || 450.00;
        const lanche = beneficios.find(b => b.tipo === 'lanche')?.valor || 5.00;
        
        resolve({ cestaBasica, lanche });
      }, 300);
    });
  },
  
  // Update benefit value
  updateValue: async (tipo: 'cesta_basica' | 'lanche', valor: number, observacoes?: string): Promise<Beneficio> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const beneficios = getBeneficiosFromStorage();
          const beneficioIndex = beneficios.findIndex(b => b.tipo === tipo);
          
          if (beneficioIndex === -1) {
            // If this type doesn't exist, create a new one
            const newBeneficio = await beneficioService.create({
              tipo,
              valor,
              dataAtualizacao: new Date().toISOString(),
              observacoes
            });
            resolve(newBeneficio);
          } else {
            // Update existing benefit
            const updatedBeneficio = await beneficioService.update(beneficios[beneficioIndex].id, {
              valor,
              observacoes,
              dataAtualizacao: new Date().toISOString()
            });
            resolve(updatedBeneficio);
          }
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }
};

// Initialize default values if not already in storage
(async () => {
  const beneficios = getBeneficiosFromStorage();
  if (beneficios.length === 0) {
    saveBeneficiosToStorage(DEFAULT_BENEFICIOS);
  }
})();

export default beneficioService;
