import { v4 as uuidv4 } from 'uuid';

export interface AuditLog {
  id: string;
  entityType: 'invoice' | 'supplier' | 'customer' | 'cost_center' | 'work' | 'budget';
  entityId: string;
  entityName: string;
  action: 'create' | 'update' | 'delete';
  changes: Record<string, { from: any; to: any }>;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

const AUDIT_STORAGE_KEY = 'financeiro_audit_logs';

export class AuditService {
  static getAll(): AuditLog[] {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getByEntity(entityType: AuditLog['entityType'], entityId: string): AuditLog[] {
    const logs = this.getAll();
    return logs.filter(log => log.entityType === entityType && log.entityId === entityId);
  }

  static getByUser(userId: string): AuditLog[] {
    const logs = this.getAll();
    return logs.filter(log => log.userId === userId);
  }

  static log(data: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName'>): AuditLog {
    const auditLog: AuditLog = {
      ...data,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: 'current-user', // This would come from auth context
      userName: 'Usuário Atual', // This would come from auth context
    };

    const logs = this.getAll();
    logs.push(auditLog);
    
    // Keep only last 1000 logs to prevent storage bloat
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    return auditLog;
  }

  static logCreate(entityType: AuditLog['entityType'], entityId: string, entityName: string, data: any): void {
    const changes: Record<string, { from: any; to: any }> = {};
    
    // Convert all properties to "created" changes
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        changes[key] = { from: null, to: data[key] };
      }
    });

    this.log({
      entityType,
      entityId,
      entityName,
      action: 'create',
      changes
    });
  }

  static logUpdate(entityType: AuditLog['entityType'], entityId: string, entityName: string, oldData: any, newData: any): void {
    const changes: Record<string, { from: any; to: any }> = {};
    
    // Compare old and new data to find changes
    Object.keys(newData).forEach(key => {
      if (key !== 'updatedAt' && oldData[key] !== newData[key]) {
        changes[key] = { from: oldData[key], to: newData[key] };
      }
    });

    // Only log if there are actual changes
    if (Object.keys(changes).length > 0) {
      this.log({
        entityType,
        entityId,
        entityName,
        action: 'update',
        changes
      });
    }
  }

  static logDelete(entityType: AuditLog['entityType'], entityId: string, entityName: string): void {
    this.log({
      entityType,
      entityId,
      entityName,
      action: 'delete',
      changes: {}
    });
  }

  static getRecentActivity(limit: number = 20): AuditLog[] {
    const logs = this.getAll();
    return logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  static clear(): void {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }

  static exportLogs(startDate?: string, endDate?: string): AuditLog[] {
    let logs = this.getAll();
    
    if (startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(startDate));
    }
    
    if (endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }
    
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
