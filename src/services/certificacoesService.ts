
import { Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';
import { auditService } from './auditService';
import { toast } from 'sonner';

const CERTIFICACOES_KEY = 'app_certificacoes';

const getCertificacoesFromStorage = (): Certificacao[] => {
  try {
    const saved = localStorage.getItem(CERTIFICACOES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar certificações:', error);
    return [];
  }
};

const saveCertificacoesToStorage = (certificacoes: Certificacao[]): void => {
  try {
    localStorage.setItem(CERTIFICACOES_KEY, JSON.stringify(certificacoes));
  } catch (error) {
    console.error('Erro ao salvar certificações:', error);
    toast.error('Erro ao salvar certificações');
  }
};

export const certificacoesService = {
  getAll: async (): Promise<Certificacao[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getCertificacoesFromStorage());
      }, 300);
    });
  },

  getByFuncionario: async (funcionarioId: string): Promise<Certificacao[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const certificacoes = getCertificacoesFromStorage();
        resolve(certificacoes.filter(c => c.funcionarioId === funcionarioId));
      }, 300);
    });
  },

  create: async (certificacao: Omit<Certificacao, 'id' | 'criadoEm' | 'atualizadoEm' | 'renovacoes'>): Promise<Certificacao> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const certificacoes = getCertificacoesFromStorage();
        const newCertificacao: Certificacao = {
          ...certificacao,
          id: `cert-${Date.now()}`,
          renovacoes: [],
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
        
        const updatedCertificacoes = [...certificacoes, newCertificacao];
        saveCertificacoesToStorage(updatedCertificacoes);
        
        // Log de auditoria
        await auditService.log({
          action: 'create',
          entityType: 'certificacao',
          entityId: newCertificacao.id,
          entityTitle: newCertificacao.nome,
          details: {
            entidadeCertificadora: newCertificacao.entidadeCertificadora,
            categoria: newCertificacao.categoria
          }
        });
        
        resolve(newCertificacao);
      }, 500);
    });
  },

  update: async (id: string, updates: Partial<Certificacao>): Promise<Certificacao | null> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const certificacoes = getCertificacoesFromStorage();
        const index = certificacoes.findIndex(c => c.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const oldCertificacao = { ...certificacoes[index] };
        certificacoes[index] = {
          ...certificacoes[index],
          ...updates,
          atualizadoEm: new Date().toISOString()
        };
        
        saveCertificacoesToStorage(certificacoes);
        
        // Log de auditoria
        await auditService.log({
          action: 'update',
          entityType: 'certificacao',
          entityId: id,
          entityTitle: certificacoes[index].nome,
          details: {
            changes: Object.keys(updates),
            oldStatus: oldCertificacao.status,
            newStatus: certificacoes[index].status
          }
        });
        
        resolve(certificacoes[index]);
      }, 500);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const certificacoes = getCertificacoesFromStorage();
        const certificacao = certificacoes.find(c => c.id === id);
        const filtered = certificacoes.filter(c => c.id !== id);
        
        if (filtered.length === certificacoes.length) {
          resolve(false);
          return;
        }
        
        saveCertificacoesToStorage(filtered);
        
        // Log de auditoria
        if (certificacao) {
          await auditService.log({
            action: 'delete',
            entityType: 'certificacao',
            entityId: id,
            entityTitle: certificacao.nome,
            details: {
              entidadeCertificadora: certificacao.entidadeCertificadora,
              categoria: certificacao.categoria
            }
          });
        }
        
        resolve(true);
      }, 500);
    });
  },

  addRenovacao: async (certificacaoId: string, renovacao: Omit<RenovacaoCertificacao, 'id'>): Promise<Certificacao | null> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const certificacoes = getCertificacoesFromStorage();
        const index = certificacoes.findIndex(c => c.id === certificacaoId);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const newRenovacao: RenovacaoCertificacao = {
          ...renovacao,
          id: `ren-${Date.now()}`
        };
        
        certificacoes[index].renovacoes.push(newRenovacao);
        certificacoes[index].atualizadoEm = new Date().toISOString();
        
        saveCertificacoesToStorage(certificacoes);
        
        // Log de auditoria
        await auditService.log({
          action: 'create',
          entityType: 'renovacao',
          entityId: newRenovacao.id,
          entityTitle: `Renovação - ${certificacoes[index].nome}`,
          details: {
            certificacaoId,
            dataRenovacao: renovacao.dataRenovacao,
            novaDataVencimento: renovacao.novaDataVencimento
          }
        });
        
        resolve(certificacoes[index]);
      }, 500);
    });
  }
};
