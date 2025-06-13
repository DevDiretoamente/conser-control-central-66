
import { Obra, EtapaObra, MaterialObra, ObrasFilter, ObrasDashboardData } from '@/types/obras';
import { toast } from 'sonner';

const OBRAS_STORAGE_KEY = 'app_obras';

const getObrasFromStorage = (): Obra[] => {
  try {
    const saved = localStorage.getItem(OBRAS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar obras:', error);
    return [];
  }
};

const saveObrasToStorage = (obras: Obra[]): void => {
  try {
    localStorage.setItem(OBRAS_STORAGE_KEY, JSON.stringify(obras));
  } catch (error) {
    console.error('Erro ao salvar obras:', error);
    toast.error('Erro ao salvar obras');
  }
};

export const obrasService = {
  // CRUD básico
  getAll: async (): Promise<Obra[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getObrasFromStorage());
      }, 300);
    });
  },

  getById: async (id: string): Promise<Obra | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const obras = getObrasFromStorage();
        resolve(obras.find(o => o.id === id) || null);
      }, 300);
    });
  },

  create: async (obra: Omit<Obra, 'id' | 'criadoEm' | 'atualizadoEm' | 'historicoAlteracoes'>): Promise<Obra> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const obras = getObrasFromStorage();
        const newObra: Obra = {
          ...obra,
          id: `obra-${Date.now()}`,
          historicoAlteracoes: [],
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
        
        const updatedObras = [...obras, newObra];
        saveObrasToStorage(updatedObras);
        resolve(newObra);
      }, 500);
    });
  },

  update: async (id: string, updates: Partial<Obra>): Promise<Obra | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const obras = getObrasFromStorage();
        const index = obras.findIndex(o => o.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        obras[index] = {
          ...obras[index],
          ...updates,
          atualizadoEm: new Date().toISOString()
        };
        
        saveObrasToStorage(obras);
        resolve(obras[index]);
      }, 500);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const obras = getObrasFromStorage();
        const filtered = obras.filter(o => o.id !== id);
        
        if (filtered.length === obras.length) {
          resolve(false);
          return;
        }
        
        saveObrasToStorage(filtered);
        resolve(true);
      }, 500);
    });
  },

  // Dashboard
  getDashboardData: async (): Promise<ObrasDashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const obras = getObrasFromStorage();
        
        const dashboardData: ObrasDashboardData = {
          totalObras: obras.length,
          obrasAndamento: obras.filter(o => o.status === 'execucao').length,
          obrasConcluidas: obras.filter(o => o.status === 'concluida').length,
          obrasAtrasadas: obras.filter(o => {
            if (!o.dataFimPrevista || o.status === 'concluida') return false;
            return new Date(o.dataFimPrevista) < new Date();
          }).length,
          valorTotalContratos: obras.reduce((sum, o) => sum + o.valorContrato, 0),
          valorExecutado: obras.reduce((sum, o) => sum + o.gastoTotal, 0),
          progressoMedio: obras.length > 0 
            ? obras.reduce((sum, o) => sum + o.progressoPercentual, 0) / obras.length 
            : 0,
          obrasPorTipo: obras.reduce((acc, o) => {
            acc[o.tipo] = (acc[o.tipo] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          obrasPorStatus: obras.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          evolucaoMensal: [], // Implementar conforme necessário
          proximosVencimentos: obras
            .filter(o => o.dataFimPrevista && o.status !== 'concluida')
            .map(o => ({
              obraId: o.id,
              obraNome: o.nome,
              dataVencimento: o.dataFimPrevista,
              diasRestantes: Math.ceil(
                (new Date(o.dataFimPrevista).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )
            }))
            .sort((a, b) => a.diasRestantes - b.diasRestantes)
            .slice(0, 5)
        };
        
        resolve(dashboardData);
      }, 300);
    });
  },

  // Filtros
  search: async (filters: ObrasFilter): Promise<Obra[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let obras = getObrasFromStorage();
        
        if (filters.search) {
          const search = filters.search.toLowerCase();
          obras = obras.filter(o => 
            o.nome.toLowerCase().includes(search) ||
            o.descricao.toLowerCase().includes(search) ||
            o.clienteNome.toLowerCase().includes(search)
          );
        }
        
        if (filters.tipo && filters.tipo !== 'all') {
          obras = obras.filter(o => o.tipo === filters.tipo);
        }
        
        if (filters.status && filters.status !== 'all') {
          obras = obras.filter(o => o.status === filters.status);
        }
        
        if (filters.prioridade && filters.prioridade !== 'all') {
          obras = obras.filter(o => o.prioridade === filters.prioridade);
        }
        
        resolve(obras);
      }, 300);
    });
  }
};
