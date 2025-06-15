
import { DocumentoRH } from '@/types/documentosRH';
import { toast } from 'sonner';

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
    return new Promise((resolve) => {
      setTimeout(() => {
        const documentos = getDocumentosFromStorage();
        const newDocumento: DocumentoRH = {
          ...documento,
          id: `doc-rh-${Date.now()}`,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
        
        const updatedDocumentos = [...documentos, newDocumento];
        saveDocumentosToStorage(updatedDocumentos);
        resolve(newDocumento);
      }, 500);
    });
  },

  update: async (id: string, updates: Partial<DocumentoRH>): Promise<DocumentoRH | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const documentos = getDocumentosFromStorage();
        const index = documentos.findIndex(d => d.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        documentos[index] = {
          ...documentos[index],
          ...updates,
          atualizadoEm: new Date().toISOString()
        };
        
        saveDocumentosToStorage(documentos);
        resolve(documentos[index]);
      }, 500);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const documentos = getDocumentosFromStorage();
        const filtered = documentos.filter(d => d.id !== id);
        
        if (filtered.length === documentos.length) {
          resolve(false);
          return;
        }
        
        saveDocumentosToStorage(filtered);
        resolve(true);
      }, 500);
    });
  }
};
