
// Migrado para usar Supabase em vez de localStorage
import { funcionariosSupabaseService } from './supabase/funcionariosSupabaseService';

// Re-export all functions from the Supabase service
export const funcionariosService = funcionariosSupabaseService;
