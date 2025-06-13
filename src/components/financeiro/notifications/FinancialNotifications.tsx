
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { InvoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/financeiro';

interface Notification {
  id: string;
  type: 'overdue' | 'due_soon' | 'paid';
  title: string;
  message: string;
  invoice: Invoice;
  date: string;
}

const FinancialNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const overdueInvoices = InvoiceService.getOverdueInvoices();
    const dueSoonInvoices = InvoiceService.getDueSoonInvoices(7);
    
    const newNotifications: Notification[] = [];
    
    // Add overdue notifications
    overdueInvoices.forEach(invoice => {
      newNotifications.push({
        id: `overdue-${invoice.id}`,
        type: 'overdue',
        title: 'Nota Fiscal Vencida',
        message: `Nota ${invoice.number} de ${invoice.supplierName} está vencida`,
        invoice,
        date: new Date().toISOString()
      });
    });
    
    // Add due soon notifications
    dueSoonInvoices.forEach(invoice => {
      newNotifications.push({
        id: `due-soon-${invoice.id}`,
        type: 'due_soon',
        title: 'Vencimento Próximo',
        message: `Nota ${invoice.number} vence em breve`,
        invoice,
        date: new Date().toISOString()
      });
    });
    
    setNotifications(newNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'due_soon':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'destructive';
      case 'due_soon':
        return 'secondary';
      case 'paid':
        return 'default';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações Financeiras
          </div>
          {notifications.length > 0 && (
            <Badge variant="secondary">{notifications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <Badge variant={getNotificationBadgeVariant(notification.type)}>
                      {notification.type === 'overdue' ? 'Vencida' : 
                       notification.type === 'due_soon' ? 'Vence em breve' : 'Paga'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Valor: {formatCurrency(notification.invoice.totalAmount)}</span>
                    <span>Vencimento: {formatDate(notification.invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={loadNotifications}
            >
              Atualizar Notificações
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma notificação no momento
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={loadNotifications}
            >
              Verificar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialNotifications;
