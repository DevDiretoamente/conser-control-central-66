
import { DocumentoRH } from '@/types/documentosRH';
import { toast } from 'sonner';
import { auditService } from './auditService';
import { validationService } from './validationService';
import { notificationService } from './notificationService';

const DOCUMENTOS_RH_KEY = 'app_documentos_rh';

const getDocumentosFromStorage = (): DocumentoRH[] => {
  try {
    const saved = localStorage.getItem(DOCUMENTOS_RH_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar documentos RH:', error);
    return [];
  }
};

const saveDocumentosToStorage = (documentos: DocumentoRH[]): void => {
  try {
    localStorage.setItem(DOCUMENTOS_RH_KEY, JSON.stringify(documentos));
  } catch (error) {
    console.error('Erro ao salvar documentos RH:', error);
    toast.error('Erro ao salvar documentos');
  }
};

export const documentosService = {
  getAll: async (): Promise<DocumentoRH[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getDocumentosFromStorage());
      }, 300);
    });
  },

  getByFuncionario: async (funcionarioId: string): Promise<DocumentoRH[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const documentos = getDocumentosFromStorage();
        resolve(documentos.filter(d => d.funcionarioId === funcionarioId));
      }, 300);
    });
  },

  create: async (documento: Omit<DocumentoRH, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<DocumentoRH> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validar documento antes de criar
        const validation = validationService.validateDocument(documento as DocumentoRH);
        
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

        const documentos = getDocumentosFromStorage();
        const newDocumento: DocumentoRH = {
          ...documento,
          id: `doc-rh-${Date.now()}`,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
        
        const updatedDocumentos = [...documentos, newDocumento];
        saveDocumentosToStorage(updatedDocumentos);

        // Log de auditoria
        auditService.log({
          action: 'create',
          entityType: 'documento',
          entityId: newDocumento.id,
          entityTitle: newDocumento.titulo,
          details: { documento: newDocumento }
        });

        // Criar notificação se necessário
        if (newDocumento.dataVencimento) {
          const vencimento = new Date(newDocumento.dataVencimento);
          const hoje = new Date();
          const diasParaVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));
          
          if (diasParaVencimento <= 30 && diasParaVencimento > 0) {
            notificationService.create({
              type: 'info',
              category: 'documento_pendente',
              title: 'Novo Documento com Vencimento Próximo',
              message: `Documento "${newDocumento.titulo}" criado com vencimento em ${diasParaVencimento} dias`,
              entityType: 'documento',
              entityId: newDocumento.id,
              entityName: newDocumento.titulo,
              priority: 'medium'
            });
          }
        }

        resolve(newDocumento);
      }, 500);
    });
  },

  update: async (id: string, updates: Partial<DocumentoRH>): Promise<DocumentoRH | null> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const documentos = getDocumentosFromStorage();
        const index = documentos.findIndex(d => d.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }

        const oldDocumento = { ...documentos[index] };
        const updatedDocumento = { ...oldDocumento, ...updates, atualizadoEm: new Date().toISOString() };

        // Validar documento atualizado
        const validation = validationService.validateDocument(updatedDocumento);
        
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
        
        documentos[index] = updatedDocumento;
        saveDocumentosToStorage(documentos);

        // Log de auditoria com mudanças
        const changes: Record<string, { from: any; to: any }> = {};
        Object.keys(updates).forEach(key => {
          const oldValue = (oldDocumento as any)[key];
          const newValue = (updates as any)[key];
          if (oldValue !== newValue) {
            changes[key] = { from: oldValue, to: newValue };
          }
        });

        auditService.log({
          action: 'update',
          entityType: 'documento',
          entityId: id,
          entityTitle: updatedDocumento.titulo,
          changes,
          details: { oldDocumento, updatedDocumento }
        });

        resolve(updatedDocumento);
      }, 500);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const documentos = getDocumentosFromStorage();
        const documento = documentos.find(d => d.id === id);
        const filtered = documentos.filter(d => d.id !== id);
        
        if (filtered.length === documentos.length) {
          resolve(false);
          return;
        }
        
        saveDocumentosToStorage(filtered);

        // Log de auditoria
        if (documento) {
          auditService.log({
            action: 'delete',
            entityType: 'documento',
            entityId: id,
            entityTitle: documento.titulo,
            details: { documento }
          });
        }

        resolve(true);
      }, 500);
    });
  },

  getExpiringDocuments: async (days: number = 30): Promise<DocumentoRH[]> => {
    const documentos = await documentosService.getAll();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return documentos.filter(doc => {
      if (!doc.dataVencimento) return false;
      const vencimento = new Date(doc.dataVencimento);
      return vencimento <= futureDate && vencimento >= new Date();
    });
  },

  getExpiredDocuments: async (): Promise<DocumentoRH[]> => {
    const documentos = await documentosService.getAll();
    const hoje = new Date();
    
    return documentos.filter(doc => {
      if (!doc.dataVencimento) return false;
      return new Date(doc.dataVencimento) < hoje && doc.status !== 'vencido';
    });
  },

  updateExpiredDocumentsStatus: async (): Promise<void> => {
    const expiredDocs = await documentosService.getExpiredDocuments();
    
    for (const doc of expiredDocs) {
      await documentosService.update(doc.id, { status: 'vencido' });
    }
  }
};
