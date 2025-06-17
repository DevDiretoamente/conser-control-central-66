
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  ExternalLink,
  FileText,
  Award,
  User
} from 'lucide-react';
import { Notification } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction?: (url: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onAction
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getEntityIcon = () => {
    switch (notification.entityType) {
      case 'documento':
        return <FileText className="h-3 w-3" />;
      case 'certificacao':
        return <Award className="h-3 w-3" />;
      case 'funcionario':
        return <User className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleAction = () => {
    if (notification.actionUrl && onAction) {
      onAction(notification.actionUrl);
      handleMarkAsRead();
    }
  };

  return (
    <Card className={`transition-all ${notification.isRead ? 'opacity-75' : 'shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3 flex-1">
            {getIcon()}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {getEntityIcon()}
                <span>{notification.entityName}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor() as any} className="text-xs">
                  {notification.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {notification.category.replace('_', ' ')}
                </Badge>
              </div>
              
              {notification.actionUrl && notification.actionText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAction}
                  className="mt-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {notification.actionText}
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                className="h-6 w-6 p-0"
                title="Marcar como lida"
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
              title="Excluir notificação"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
