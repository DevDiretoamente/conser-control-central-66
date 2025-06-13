
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Budget, BudgetAlert, BudgetService } from '@/services/budgetService';
import { CostCenterService } from '@/services/costCenterService';
import BudgetForm from './BudgetForm';
import BudgetAlerts from './BudgetAlerts';

const BudgetManagement: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [costCenters] = useState(CostCenterService.getAll());

  useEffect(() => {
    loadBudgets();
    loadAlerts();
  }, []);

  const loadBudgets = () => {
    setBudgets(BudgetService.getAll());
  };

  const loadAlerts = () => {
    setAlerts(BudgetService.getUnacknowledgedAlerts());
  };

  const handleCreateBudget = (data: any) => {
    try {
      BudgetService.create(data);
      loadBudgets();
      setIsFormOpen(false);
      toast.success('Orçamento criado com sucesso!');
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Erro ao criar orçamento.');
    }
  };

  const handleUpdateBudget = (data: any) => {
    if (!selectedBudget) return;
    
    try {
      BudgetService.update(selectedBudget.id, data);
      loadBudgets();
      setIsFormOpen(false);
      setSelectedBudget(null);
      toast.success('Orçamento atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Erro ao atualizar orçamento.');
    }
  };

  const getStatusColor = (status: Budget['status']) => {
    switch (status) {
      case 'safe':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'critical':
        return 'destructive';
      case 'exceeded':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: Budget['status']) => {
    switch (status) {
      case 'safe':
        return 'Seguro';
      case 'warning':
        return 'Atenção';
      case 'critical':
        return 'Crítico';
      case 'exceeded':
        return 'Ultrapassado';
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getSpentPercentage = (budget: Budget) => {
    return (budget.spentAmount / budget.plannedAmount) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Controle Orçamentário</h2>
          <p className="text-muted-foreground">
            Gerencie orçamentos e monitore gastos por centro de custo
          </p>
        </div>
        <div className="flex gap-2">
          {alerts.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setIsAlertsOpen(true)}
              className="relative"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alertas ({alerts.length})
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {alerts.length}
              </Badge>
            </Button>
          )}
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <Card key={budget.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{budget.costCenterName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatPeriod(budget.period)}
                  </p>
                </div>
                <Badge variant={getStatusColor(budget.status)}>
                  {getStatusLabel(budget.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gasto: {formatCurrency(budget.spentAmount)}</span>
                  <span>Orçado: {formatCurrency(budget.plannedAmount)}</span>
                </div>
                <Progress 
                  value={Math.min(getSpentPercentage(budget), 100)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{getSpentPercentage(budget).toFixed(1)}% utilizado</span>
                  <span>Restante: {formatCurrency(budget.remainingAmount)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-2 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">Alerta</div>
                  <div className="text-sm font-medium">{budget.warningThreshold}%</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">Crítico</div>
                  <div className="text-sm font-medium">{budget.criticalThreshold}%</div>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setSelectedBudget(budget);
                  setIsFormOpen(true);
                }}
              >
                Editar Orçamento
              </Button>
            </CardContent>
          </Card>
        ))}

        {budgets.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum orçamento configurado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Configure orçamentos para centros de custo e monitore gastos automaticamente
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Orçamento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Budget Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <BudgetForm
            budget={selectedBudget || undefined}
            costCenters={costCenters}
            onSubmit={selectedBudget ? handleUpdateBudget : handleCreateBudget}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedBudget(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Budget Alerts Dialog */}
      <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
        <DialogContent className="max-w-2xl">
          <BudgetAlerts
            alerts={alerts}
            onAcknowledge={(alertId) => {
              BudgetService.acknowledgeAlert(alertId);
              loadAlerts();
              toast.success('Alerta marcado como lido');
            }}
            onClose={() => setIsAlertsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetManagement;
