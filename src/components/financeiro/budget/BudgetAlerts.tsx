
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, XCircle, Check } from 'lucide-react';
import { BudgetAlert } from '@/services/budgetService';

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
  onAcknowledge: (alertId: string) => void;
  onClose: () => void;
}

const BudgetAlerts: React.FC<BudgetAlertsProps> = ({
  alerts,
  onAcknowledge,
  onClose
}) => {
  const getAlertIcon = (type: BudgetAlert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'exceeded':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getAlertBadgeVariant = (type: BudgetAlert['type']) => {
    switch (type) {
      case 'warning':
        return 'secondary';
      case 'critical':
        return 'destructive';
      case 'exceeded':
        return 'destructive';
    }
  };

  const getAlertTypeLabel = (type: BudgetAlert['type']) => {
    switch (type) {
      case 'warning':
        return 'Atenção';
      case 'critical':
        return 'Crítico';
      case 'exceeded':
        return 'Ultrapassado';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Alertas Orçamentários</h2>
          <p className="text-sm text-muted-foreground">
            {alerts.length} alerta(s) pendente(s) de reconhecimento
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum alerta pendente</h3>
          <p className="text-muted-foreground">
            Todos os alertas orçamentários foram reconhecidos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border rounded-lg p-4 space-y-3 bg-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.costCenterName}</span>
                      <Badge variant={getAlertBadgeVariant(alert.type)}>
                        {getAlertTypeLabel(alert.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatPeriod(alert.period)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Marcar como Lido
                </Button>
              </div>

              <div className="bg-muted p-3 rounded">
                <p className="text-sm">{alert.message}</p>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Percentual: {alert.percentage.toFixed(1)}%</span>
                <span>Criado em: {formatDate(alert.createdAt)}</span>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              onClick={() => {
                alerts.forEach(alert => onAcknowledge(alert.id));
              }}
            >
              Marcar Todos como Lidos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAlerts;
