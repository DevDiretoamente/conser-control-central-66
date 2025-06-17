
// Migrado para usar Supabase em vez de localStorage
import { notificationsSupabaseService } from './supabase/notificationsSupabaseService';

// Export types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read?: boolean;
  isRead?: boolean;
  created_at?: string;
  createdAt?: string;
  actionUrl?: string;
  actionText?: string;
}

// Re-export all functions from the Supabase service
export const notificationService = notificationsSupabaseService;
