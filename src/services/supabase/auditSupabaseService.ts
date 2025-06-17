
import { supabase } from '@/integrations/supabase/client';

interface AuditLog {
  id?: string;
  action: string;
  entityType: string;
  entityId: string;
  entityTitle?: string;
  changes?: Record<string, { from: any; to: any }>;
  details?: any;
  timestamp?: string;
}

export const auditSupabaseService = {
  log: async (auditData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action: auditData.action,
          entity_type: auditData.entityType,
          entity_id: auditData.entityId,
          entity_title: auditData.entityTitle,
          changes: auditData.changes || null,
          details: auditData.details || null
        });

      if (error) {
        console.error('Erro ao registrar log de auditoria:', error);
      } else {
        console.log('Log de auditoria registrado:', auditData.action, auditData.entityType, auditData.entityId);
      }
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error);
    }
  },

  getLogs: async (limit: number = 100): Promise<AuditLog[]> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        action: item.action,
        entityType: item.entity_type,
        entityId: item.entity_id,
        entityTitle: item.entity_title || undefined,
        changes: item.changes || undefined,
        details: item.details || undefined,
        timestamp: item.timestamp
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error);
      return [];
    }
  },

  getLogsByEntity: async (entityType: string, entityId: string): Promise<AuditLog[]> => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        action: item.action,
        entityType: item.entity_type,
        entityId: item.entity_id,
        entityTitle: item.entity_title || undefined,
        changes: item.changes || undefined,
        details: item.details || undefined,
        timestamp: item.timestamp
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria por entidade:', error);
      return [];
    }
  }
};
