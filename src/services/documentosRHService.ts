
import { DocumentoRH, Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';
import { toast } from 'sonner';

const DOCUMENTOS_RH_KEY = 'app_documentos_rh';
const CERTIFICACOES_KEY = 'app_certificacoes';

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

export const documentosRHService = {
  // Documentos RH
  getAllDocumentos: async (): Promise<DocumentoRH[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getDocumentosFromStorage());
      }, 300);
    });
  },

  getDocumentosByFuncionario: async (funcionarioId: string): Promise<DocumentoRH[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const documentos = getDocumentosFromStorage();
        resolve(documentos.filter(d => d.funcionarioId === funcionarioId));
      }, 300);
    });
  },

  createDocumento: async (documento: Omit<DocumentoRH, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<DocumentoRH> => {
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

  updateDocumento: async (id: string, updates: Partial<DocumentoRH>): Promise<DocumentoRH | null> => {
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

  deleteDocumento: async (id: string): Promise<boolean> => {
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
  },

  // Certificações
  getAllCertificacoes: async (): Promise<Certificacao[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getCertificacoesFromStorage());
      }, 300);
    });
  },

  getCertificacoesByFuncionario: async (funcionarioId: string): Promise<Certificacao[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const certificacoes = getCertificacoesFromStorage();
        resolve(certificacoes.filter(c => c.funcionarioId === funcionarioId));
      }, 300);
    });
  },

  createCertificacao: async (certificacao: Omit<Certificacao, 'id' | 'criadoEm' | 'atualizadoEm' | 'renovacoes'>): Promise<Certificacao> => {
    return new Promise((resolve) => {
      setTimeout(() => {
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
        resolve(newCertificacao);
      }, 500);
    });
  },

  updateCertificacao: async (id: string, updates: Partial<Certificacao>): Promise<Certificacao | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const certificacoes = getCertificacoesFromStorage();
        const index = certificacoes.findIndex(c => c.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        certificacoes[index] = {
          ...certificacoes[index],
          ...updates,
          atualizadoEm: new Date().toISOString()
        };
        
        saveCertificacoesToStorage(certificacoes);
        resolve(certificacoes[index]);
      }, 500);
    });
  },

  addRenovacao: async (certificacaoId: string, renovacao: Omit<RenovacaoCertificacao, 'id'>): Promise<Certificacao | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
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
        resolve(certificacoes[index]);
      }, 500);
    });
  }
};
