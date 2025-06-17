
// Migrado para usar Supabase em vez de localStorage
import { auditSupabaseService } from './supabase/auditSupabaseService';

// Export types
export interface AuditLog {
  id?: string;
  action: string;
  entityType: string;
  entityId: string;
  entityTitle?: string;
  entityName?: string;
  userName?: string;
  changes?: Record<string, { from: any; to: any }>;
  details?: any;
  timestamp?: string;
}

// Re-export all functions from the Supabase service
export const auditService = auditSupabaseService;
