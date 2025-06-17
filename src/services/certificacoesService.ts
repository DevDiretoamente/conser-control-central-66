
import { Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';
import { toast } from 'sonner';
import { auditService } from './auditService';
import { validationService } from './validationService';
import { notificationService } from './notificationService';

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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validar certificação antes de criar
        const certWithRenovacoes = { ...certificacao, renovacoes: [] } as Certificacao;
        const validation = validationService.validateCertification(certWithRenovacoes);
        
        if (!validation.isValid) {
          reject(new Error(`Validação falhou: ${validation.errors.join(', ')}`));
          return;
        }

        // Mostrar avisos se existirem
        if (validation.warnings.length > 0) {
          validation.warnings.forEach(warning => {
            toast.warning(warning);
          });
        }

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
        auditService.log({
          action: 'create',
          entityType: 'certificacao',
          entityId: newCertificacao.id,
          entityTitle: newCertificacao.nome,
          details: { certificacao: newCertificacao }
        });

        // Criar notificação se necessário
        if (newCertificacao.dataVencimento) {
          const vencimento = new Date(newCertificacao.dataVencimento);
          const hoje = new Date();
          const diasParaVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));
          
          if (diasParaVencimento <= 60 && diasParaVencimento > 0) {
            notificationService.create({
              type: 'info',
              category: 'certificacao_vencida',
              title: 'Nova Certificação com Vencimento Próximo',
              message: `Certificação "${newCertificacao.nome}" criada com vencimento em ${diasParaVencimento} dias`,
              entityType: 'certificacao',
              entityId: newCertificacao.id,
              entityName: newCertificacao.nome,
              priority: 'medium'
            });
          }
        }

        resolve(newCertificacao);
      }, 500);
    });
  },

  update: async (id: string, updates: Partial<Certificacao>): Promise<Certificacao | null> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const certificacoes = getCertificacoesFromStorage();
        const index = certificacoes.findIndex(c => c.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }

        const oldCertificacao = { ...certificacoes[index] };
        const updatedCertificacao = { ...oldCertificacao, ...updates, atualizadoEm: new Date().toISOString() };

        // Validar certificação atualizada
        const validation = validationService.validateCertification(updatedCertificacao);
        
        if (!validation.isValid) {
          reject(new Error(`Validação falhou: ${validation.errors.join(', ')}`));
          return;
        }

        // Mostrar avisos se existirem
        if (validation.warnings.length > 0) {
          validation.warnings.forEach(warning => {
            toast.warning(warning);
          });
        }
        
        certificacoes[index] = updatedCertificacao;
        saveCertificacoesToStorage(certificacoes);

        // Log de auditoria com mudanças
        const changes: Record<string, { from: any; to: any }> = {};
        Object.keys(updates).forEach(key => {
          const oldValue = (oldCertificacao as any)[key];
          const newValue = (updates as any)[key];
          if (oldValue !== newValue) {
            changes[key] = { from: oldValue, to: newValue };
          }
        });

        auditService.log({
          action: 'update',
          entityType: 'certificacao',
          entityId: id,
          entityTitle: updatedCertificacao.nome,
          changes,
          details: { oldCertificacao, updatedCertificacao }
        });

        resolve(updatedCertificacao);
      }, 500);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
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
          auditService.log({
            action: 'delete',
            entityType: 'certificacao',
            entityId: id,
            entityTitle: certificacao.nome,
            details: { certificacao }
          });
        }

        resolve(true);
      }, 500);
    });
  },

  addRenovacao: async (certificacaoId: string, renovacao: Omit<RenovacaoCertificacao, 'id'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const certificacoes = getCertificacoesFromStorage();
        const certificacao = certificacoes.find(c => c.id === certificacaoId);
        
        if (!certificacao) {
          resolve(false);
          return;
        }

        const novaRenovacao: RenovacaoCertificacao = {
          ...renovacao,
          id: `renov-${Date.now()}`
        };

        certificacao.renovacoes.push(novaRenovacao);
        certificacao.atualizadoEm = new Date().toISOString();
        
        saveCertificacoesToStorage(certificacoes);

        // Log de auditoria
        auditService.log({
          action: 'create',
          entityType: 'renovacao',
          entityId: novaRenovacao.id,
          entityTitle: `Renovação de ${certificacao.nome}`,
          details: { renovacao: novaRenovacao, certificacao }
        });

        resolve(true);
      }, 500);
    });
  },

  getExpiringCertifications: async (days: number = 60): Promise<Certificacao[]> => {
    const certificacoes = await certificacoesService.getAll();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return certificacoes.filter(cert => {
      if (!cert.dataVencimento) return false;
      const vencimento = new Date(cert.dataVencimento);
      return vencimento <= futureDate && vencimento >= new Date();
    });
  },

  getExpiredCertifications: async (): Promise<Certificacao[]> => {
    const certificacoes = await certificacoesService.getAll();
    const hoje = new Date();
    
    return certificacoes.filter(cert => {
      if (!cert.dataVencimento) return false;
      return new Date(cert.dataVencimento) < hoje && cert.status !== 'vencida';
    });
  },

  updateExpiredCertificationsStatus: async (): Promise<void> => {
    const expiredCerts = await certificacoesService.getExpiredCertifications();
    
    for (const cert of expiredCerts) {
      await certificacoesService.update(cert.id, { status: 'vencida' });
    }
  }
};
