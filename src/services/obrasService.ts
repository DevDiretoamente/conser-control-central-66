
// Migrado para usar Supabase em vez de localStorage
import { obrasSupabaseService } from './supabase/obrasSupabaseService';

// Re-export all functions from the Supabase service
export const obrasService = obrasSupabaseService;
