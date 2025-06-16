
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, X, Eye } from 'lucide-react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { documentosRHService } from '@/services/documentosRHService';
import { funcionariosService } from '@/services/funcionariosService';

interface Notification {
  id: string;
  type: 'documento_vencendo' | 'certificacao_vencendo' | 'documento_vencido' | 'certificacao_vencida';
  title: string;
  message: string;
  funcionarioNome: string;
  diasRestantes?: number;
  itemId: string;
  read: boolean;
  createdAt: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [documentos, certificacoes, funcionarios] = await Promise.all([
        documentosRHService.getAllDocumentos(),
        documentosRHService.getAllCertificacoes(),
        funcionariosService.getAll()
      ]);

      const newNotifications = generateNotifications(documentos, certificacoes, funcionarios);
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (
    documentos: DocumentoRH[],
    certificacoes: Certificacao[],
    funcionarios: Funcionario[]
  ): Notification[] => {
    const notifications: Notification[] = [];
    const hoje = new Date();
    const em30Dias = new Date();
    em30Dias.setDate(hoje.getDate() + 30);

    // Verificar documentos
    documentos.forEach(doc => {
      if (doc.dataVencimento) {
        const vencimento = new Date(doc.dataVencimento);
        const funcionario = funcionarios.find(f => f.id === doc.funcionarioId);
        const funcionarioNome = funcionario?.dadosPessoais.nome || 'N/A';
        const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

        if (vencimento < hoje) {
          notifications.push({
            id: `doc-vencido-${doc.id}`,
            type: 'documento_vencido',
            title: 'Documento Vencido',
            message: `${doc.titulo} está vencido há ${Math.abs(diasRestantes)} dias`,
            funcionarioNome,
            itemId: doc.id,
            read: false,
            createdAt: new Date().toISOString()
          });
        } else if (vencimento <= em30Dias) {
          notifications.push({
            id: `doc-vencendo-${doc.id}`,
            type: 'documento_vencendo',
            title: 'Documento Vencendo',
            message: `${doc.titulo} vence em ${diasRestantes} dias`,
            funcionarioNome,
            diasRestantes,
            itemId: doc.id,
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    // Verificar certificações
    certificacoes.forEach(cert => {
      if (cert.dataVencimento) {
        const vencimento = new Date(cert.dataVencimento);
        const funcionario = funcionarios.find(f => f.id === cert.funcionarioId);
        const funcionarioNome = funcionario?.dadosPessoais.nome || 'N/A';
        const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

        if (vencimento < hoje) {
          notifications.push({
            id: `cert-vencida-${cert.id}`,
            type: 'certificacao_vencida',
            title: 'Certificação Vencida',
            message: `${cert.nome} está vencida há ${Math.abs(diasRestantes)} dias`,
            funcionarioNome,
            itemId: cert.id,
            read: false,
            createdAt: new Date().toISOString()
          });
        } else if (vencimento <= em30Dias) {
          notifications.push({
            id: `cert-vencendo-${cert.id}`,
            type: 'certificacao_vencendo',
            title: 'Certificação Vencendo',
            message: `${cert.nome} vence em ${diasRestantes} dias`,
            funcionarioNome,
            diasRestantes,
            itemId: cert.id,
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    if (type === 'documento_vencido' || type === 'certificacao_vencida') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <Bell className="h-4 w-4 text-orange-500" />;
  };

  const getNotificationBadge = (type: Notification['type']) => {
    if (type === 'documento_vencido' || type === 'certificacao_vencida') {
      return <Badge className="bg-red-500">Vencido</Badge>;
    }
    return <Badge className="bg-orange-500">Vencendo</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-4">Carregando notificações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Central de Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-500">{unreadCount}</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Nenhuma notificação no momento</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 border rounded-lg ${
                  notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                }`}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    {getNotificationBadge(notification.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Funcionário: {notification.funcionarioNome}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
