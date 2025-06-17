
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read?: boolean;
  created_at?: string;
}

export const notificationsSupabaseService = {
  create: async (notification: Omit<Notification, 'id' | 'read' | 'created_at'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          type: notification.type,
          category: notification.category,
          title: notification.title,
          message: notification.message,
          entity_type: notification.entityType || null,
          entity_id: notification.entityId || null,
          entity_name: notification.entityName || null,
          priority: notification.priority
        });

      if (error) {
        console.error('Erro ao criar notificação:', error);
      } else {
        console.log('Notificação criada:', notification.title);
      }
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  },

  getAll: async (limit: number = 50): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        type: item.type as Notification['type'],
        category: item.category,
        title: item.title,
        message: item.message,
        entityType: item.entity_type || undefined,
        entityId: item.entity_id || undefined,
        entityName: item.entity_name || undefined,
        priority: item.priority as Notification['priority'],
        read: item.read,
        created_at: item.created_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      return [];
    }
  },

  getUnread: async (): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        type: item.type as Notification['type'],
        category: item.category,
        title: item.title,
        message: item.message,
        entityType: item.entity_type || undefined,
        entityId: item.entity_id || undefined,
        entityName: item.entity_name || undefined,
        priority: item.priority as Notification['priority'],
        read: item.read,
        created_at: item.created_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar notificações não lidas:', error);
      return [];
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Erro ao marcar notificação como lida:', error);
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  markAllAsRead: async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) {
        console.error('Erro ao marcar todas as notificações como lidas:', error);
      }
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir notificação:', error);
      }
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  },

  generateAutomaticNotifications: async (): Promise<void> => {
    // This method exists for backward compatibility but is not implemented yet
    console.log('Automatic notification generation not implemented yet');
  }
};
