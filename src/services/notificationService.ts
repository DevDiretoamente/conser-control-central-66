
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';

export interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  category: 'documento_vencendo' | 'certificacao_vencida' | 'documento_pendente' | 'conformidade' | 'sistema';
  title: string;
  message: string;
  entityType: 'documento' | 'certificacao' | 'funcionario';
  entityId: string;
  entityName: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
}

const NOTIFICATIONS_KEY = 'app_notifications';

const getNotificationsFromStorage = (): Notification[] => {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar notificações:', error);
    return [];
  }
};

const saveNotificationsToStorage = (notifications: Notification[]): void => {
  try {
    // Manter apenas as últimas 200 notificações
    const recentNotifications = notifications.slice(-200);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(recentNotifications));
  } catch (error) {
    console.error('Erro ao salvar notificações:', error);
  }
};

export const notificationService = {
  getAll: (): Notification[] => {
    return getNotificationsFromStorage().filter(n => 
      !n.expiresAt || new Date(n.expiresAt) > new Date()
    );
  },

  getUnread: (): Notification[] => {
    return notificationService.getAll().filter(n => !n.isRead);
  },

  getByPriority: (priority: Notification['priority']): Notification[] => {
    return notificationService.getAll().filter(n => n.priority === priority);
  },

  create: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification => {
    const notifications = getNotificationsFromStorage();
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    notifications.push(newNotification);
    saveNotificationsToStorage(notifications);
    return newNotification;
  },

  markAsRead: (id: string): void => {
    const notifications = getNotificationsFromStorage();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      saveNotificationsToStorage(notifications);
    }
  },

  markAllAsRead: (): void => {
    const notifications = getNotificationsFromStorage();
    notifications.forEach(n => n.isRead = true);
    saveNotificationsToStorage(notifications);
  },

  delete: (id: string): void => {
    const notifications = getNotificationsFromStorage();
    const filtered = notifications.filter(n => n.id !== id);
    saveNotificationsToStorage(filtered);
  },

  clear: (): void => {
    localStorage.removeItem(NOTIFICATIONS_KEY);
  },

  // Gerar notificações automáticas baseadas em regras de negócio
  generateAutomaticNotifications: (documentos: DocumentoRH[], certificacoes: Certificacao[], funcionarios: Funcionario[]): void => {
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Documentos vencendo
    documentos.forEach(doc => {
      if (doc.dataVencimento) {
        const vencimento = new Date(doc.dataVencimento);
        const funcionario = funcionarios.find(f => f.id === doc.funcionarioId);
        
        if (vencimento < today && doc.status !== 'vencido') {
          notificationService.create({
            type: 'error',
            category: 'documento_vencendo',
            title: 'Documento Vencido',
            message: `O documento "${doc.titulo}" do funcionário ${funcionario?.dadosPessoais.nome} está vencido.`,
            entityType: 'documento',
            entityId: doc.id,
            entityName: doc.titulo,
            priority: 'high',
            actionUrl: `/rh/documentos/${doc.id}`,
            actionText: 'Ver Documento'
          });
        } else if (vencimento <= in7Days && vencimento > today) {
          notificationService.create({
            type: 'warning',
            category: 'documento_vencendo',
            title: 'Documento Vencendo em Breve',
            message: `O documento "${doc.titulo}" do funcionário ${funcionario?.dadosPessoais.nome} vence em ${Math.ceil((vencimento.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))} dias.`,
            entityType: 'documento',
            entityId: doc.id,
            entityName: doc.titulo,
            priority: 'medium',
            actionUrl: `/rh/documentos/${doc.id}`,
            actionText: 'Renovar'
          });
        }
      }
    });

    // Certificações vencidas ou vencendo
    certificacoes.forEach(cert => {
      if (cert.dataVencimento) {
        const vencimento = new Date(cert.dataVencimento);
        const funcionario = funcionarios.find(f => f.id === cert.funcionarioId);
        
        if (vencimento < today && cert.status !== 'vencida') {
          notificationService.create({
            type: 'error',
            category: 'certificacao_vencida',
            title: 'Certificação Vencida',
            message: `A certificação "${cert.nome}" do funcionário ${funcionario?.dadosPessoais.nome} está vencida.`,
            entityType: 'certificacao',
            entityId: cert.id,
            entityName: cert.nome,
            priority: 'high',
            actionUrl: `/rh/certificacoes/${cert.id}`,
            actionText: 'Renovar'
          });
        } else if (vencimento <= in30Days && vencimento > today) {
          notificationService.create({
            type: 'warning',
            category: 'certificacao_vencida',
            title: 'Certificação Vencendo',
            message: `A certificação "${cert.nome}" do funcionário ${funcionario?.dadosPessoais.nome} vence em ${Math.ceil((vencimento.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))} dias.`,
            entityType: 'certificacao',
            entityId: cert.id,
            entityName: cert.nome,
            priority: 'medium',
            actionUrl: `/rh/certificacoes/${cert.id}`,
            actionText: 'Renovar'
          });
        }
      }
    });
  }
};
