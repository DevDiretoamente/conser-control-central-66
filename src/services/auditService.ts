
// Migrado para usar Supabase em vez de localStorage
import { auditSupabaseService } from './supabase/auditSupabaseService';

// Re-export all functions from the Supabase service
export const auditService = auditSupabaseService;
