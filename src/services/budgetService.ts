
import { v4 as uuidv4 } from 'uuid';

export interface Budget {
  id: string;
  costCenterId: string;
  costCenterName: string;
  period: string; // YYYY-MM format
  plannedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  warningThreshold: number; // percentage (e.g., 80 for 80%)
  criticalThreshold: number; // percentage (e.g., 95 for 95%)
  status: 'safe' | 'warning' | 'critical' | 'exceeded';
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  costCenterName: string;
  period: string;
  type: 'warning' | 'critical' | 'exceeded';
  message: string;
  percentage: number;
  createdAt: string;
  acknowledged: boolean;
}

const BUDGET_STORAGE_KEY = 'financeiro_budgets';
const BUDGET_ALERTS_STORAGE_KEY = 'financeiro_budget_alerts';

export class BudgetService {
  static getAll(): Budget[] {
    const data = localStorage.getItem(BUDGET_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string): Budget | null {
    const budgets = this.getAll();
    return budgets.find(budget => budget.id === id) || null;
  }

  static getByCostCenter(costCenterId: string, period?: string): Budget[] {
    const budgets = this.getAll();
    return budgets.filter(budget => {
      const matchesCostCenter = budget.costCenterId === costCenterId;
      const matchesPeriod = period ? budget.period === period : true;
      return matchesCostCenter && matchesPeriod;
    });
  }

  static getCurrentPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  static create(budgetData: Omit<Budget, 'id' | 'spentAmount' | 'remainingAmount' | 'status' | 'createdAt' | 'updatedAt'>): Budget {
    const budget: Budget = {
      ...budgetData,
      id: uuidv4(),
      spentAmount: 0,
      remainingAmount: budgetData.plannedAmount,
      status: 'safe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const budgets = this.getAll();
    budgets.push(budget);
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    
    return budget;
  }

  static update(id: string, budgetData: Partial<Budget>): Budget | null {
    const budgets = this.getAll();
    const index = budgets.findIndex(budget => budget.id === id);
    
    if (index === -1) return null;
    
    budgets[index] = {
      ...budgets[index],
      ...budgetData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    return budgets[index];
  }

  static updateSpentAmount(costCenterId: string, amount: number, period?: string): void {
    const currentPeriod = period || this.getCurrentPeriod();
    const budgets = this.getAll();
    
    const budget = budgets.find(b => 
      b.costCenterId === costCenterId && b.period === currentPeriod
    );
    
    if (budget) {
      const updatedBudget = {
        ...budget,
        spentAmount: budget.spentAmount + amount,
        remainingAmount: budget.plannedAmount - (budget.spentAmount + amount),
        updatedAt: new Date().toISOString()
      };
      
      // Update status based on spending percentage
      const percentage = (updatedBudget.spentAmount / updatedBudget.plannedAmount) * 100;
      
      if (percentage >= 100) {
        updatedBudget.status = 'exceeded';
      } else if (percentage >= updatedBudget.criticalThreshold) {
        updatedBudget.status = 'critical';
      } else if (percentage >= updatedBudget.warningThreshold) {
        updatedBudget.status = 'warning';
      } else {
        updatedBudget.status = 'safe';
      }
      
      this.update(budget.id, updatedBudget);
      
      // Create alert if threshold exceeded
      if (percentage >= updatedBudget.warningThreshold) {
        this.createAlert(updatedBudget, percentage);
      }
    }
  }

  static createAlert(budget: Budget, percentage: number): void {
    const alerts = this.getAllAlerts();
    
    // Check if alert already exists for this budget and threshold
    const existingAlert = alerts.find(alert => 
      alert.budgetId === budget.id && 
      alert.type === budget.status &&
      !alert.acknowledged
    );
    
    if (!existingAlert) {
      let message = '';
      switch (budget.status) {
        case 'warning':
          message = `Orçamento de ${budget.costCenterName} atingiu ${percentage.toFixed(1)}% do limite`;
          break;
        case 'critical':
          message = `Orçamento de ${budget.costCenterName} atingiu ${percentage.toFixed(1)}% - CRÍTICO`;
          break;
        case 'exceeded':
          message = `Orçamento de ${budget.costCenterName} foi ultrapassado em ${(percentage - 100).toFixed(1)}%`;
          break;
      }
      
      const alert: BudgetAlert = {
        id: uuidv4(),
        budgetId: budget.id,
        costCenterName: budget.costCenterName,
        period: budget.period,
        type: budget.status as 'warning' | 'critical' | 'exceeded',
        message,
        percentage,
        createdAt: new Date().toISOString(),
        acknowledged: false
      };
      
      alerts.push(alert);
      localStorage.setItem(BUDGET_ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    }
  }

  static getAllAlerts(): BudgetAlert[] {
    const data = localStorage.getItem(BUDGET_ALERTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getUnacknowledgedAlerts(): BudgetAlert[] {
    return this.getAllAlerts().filter(alert => !alert.acknowledged);
  }

  static acknowledgeAlert(alertId: string): void {
    const alerts = this.getAllAlerts();
    const alert = alerts.find(a => a.id === alertId);
    
    if (alert) {
      alert.acknowledged = true;
      localStorage.setItem(BUDGET_ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    }
  }

  static delete(id: string): boolean {
    const budgets = this.getAll();
    const filteredBudgets = budgets.filter(budget => budget.id !== id);
    
    if (filteredBudgets.length === budgets.length) return false;
    
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(filteredBudgets));
    return true;
  }
}
