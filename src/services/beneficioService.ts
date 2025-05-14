
import { Beneficio } from '@/types/cartaoPonto';
import { v4 as uuidv4 } from 'uuid';

// Mock data for benefits - These are now global values applied to all eligible employees
const mockBeneficios: Beneficio[] = [
  {
    id: '1',
    tipo: 'cesta_basica',
    valor: 120.00,
    dataAtualizacao: '2025-05-01T10:00:00Z',
    observacoes: 'Valor base da cesta básica para todos os funcionários elegíveis'
  },
  {
    id: '2',
    tipo: 'lanche',
    valor: 15.00,
    dataAtualizacao: '2025-05-01T10:00:00Z',
    observacoes: 'Valor do lanche da tarde para cada dia de trabalho com hora extra'
  }
];

export const beneficioService = {
  getAll: async (): Promise<Beneficio[]> => {
    return [...mockBeneficios];
  },
  
  getByTipo: async (tipo: 'cesta_basica' | 'lanche'): Promise<Beneficio | null> => {
    const beneficio = mockBeneficios.find(b => b.tipo === tipo);
    return beneficio || null;
  },
  
  update: async (id: string, data: Partial<Beneficio>): Promise<Beneficio | null> => {
    const index = mockBeneficios.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    const updatedBeneficio = {
      ...mockBeneficios[index],
      ...data,
      dataAtualizacao: new Date().toISOString()
    };
    
    mockBeneficios[index] = updatedBeneficio;
    return updatedBeneficio;
  },
  
  create: async (data: Omit<Beneficio, 'id' | 'dataAtualizacao'>): Promise<Beneficio> => {
    const now = new Date().toISOString();
    
    const newBeneficio: Beneficio = {
      id: uuidv4(),
      ...data,
      dataAtualizacao: now
    };
    
    mockBeneficios.push(newBeneficio);
    return newBeneficio;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const index = mockBeneficios.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    mockBeneficios.splice(index, 1);
    return true;
  },
  
  // Get the current global values for benefits
  getCurrentValues: async (): Promise<{cestaBasica: number, lanche: number}> => {
    const cestaBasica = mockBeneficios.find(b => b.tipo === 'cesta_basica')?.valor || 0;
    const lanche = mockBeneficios.find(b => b.tipo === 'lanche')?.valor || 0;
    
    return {
      cestaBasica,
      lanche
    };
  }
};

export type BeneficioService = typeof beneficioService;
