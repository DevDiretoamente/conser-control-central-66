
// Migrado para usar Supabase em vez de localStorage
import { notificationsSupabaseService } from './supabase/notificationsSupabaseService';

// Re-export all functions from the Supabase service
export const notificationService = notificationsSupabaseService;
