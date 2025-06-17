
export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'download';
  entityType: 'documento' | 'certificacao' | 'renovacao';
  entityId: string;
  entityTitle: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

const AUDIT_KEY = 'app_audit_logs';

const getAuditLogs = (): AuditLog[] => {
  try {
    const saved = localStorage.getItem(AUDIT_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar logs de auditoria:', error);
    return [];
  }
};

const saveAuditLogs = (logs: AuditLog[]): void => {
  try {
    // Manter apenas os últimos 1000 logs para não sobrecarregar o localStorage
    const recentLogs = logs.slice(-1000);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(recentLogs));
  } catch (error) {
    console.error('Erro ao salvar logs de auditoria:', error);
  }
};

export const auditService = {
  log: async (logData: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName'>): Promise<void> => {
    const logs = getAuditLogs();
    const newLog: AuditLog = {
      ...logData,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: 'current-user', // Substituir pela sessão real
      userName: 'Usuário Admin' // Substituir pela sessão real
    };
    
    logs.push(newLog);
    saveAuditLogs(logs);
  },

  getLogs: async (filters?: {
    entityType?: AuditLog['entityType'];
    action?: AuditLog['action'];
    entityId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<AuditLog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let logs = getAuditLogs();
        
        if (filters) {
          if (filters.entityType) {
            logs = logs.filter(log => log.entityType === filters.entityType);
          }
          if (filters.action) {
            logs = logs.filter(log => log.action === filters.action);
          }
          if (filters.entityId) {
            logs = logs.filter(log => log.entityId === filters.entityId);
          }
          if (filters.dateFrom) {
            logs = logs.filter(log => log.timestamp >= filters.dateFrom!);
          }
          if (filters.dateTo) {
            logs = logs.filter(log => log.timestamp <= filters.dateTo!);
          }
        }
        
        // Ordenar por data mais recente
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        resolve(logs);
      }, 200);
    });
  },

  getEntityHistory: async (entityType: AuditLog['entityType'], entityId: string): Promise<AuditLog[]> => {
    return auditService.getLogs({ entityType, entityId });
  },

  clear: async (): Promise<void> => {
    localStorage.removeItem(AUDIT_KEY);
  }
};
