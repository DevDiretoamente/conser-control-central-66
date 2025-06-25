
// Migrado para usar Supabase em vez de localStorage
import { cartaoPontoSupabaseService } from './supabase/cartaoPontoSupabaseService';

// Re-export all functions from the Supabase service
export const cartaoPontoService = cartaoPontoSupabaseService;
