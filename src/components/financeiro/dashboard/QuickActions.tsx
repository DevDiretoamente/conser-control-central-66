
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Users, 
  Building2, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  Download
} from 'lucide-react';

interface QuickActionsProps {
  onNewInvoice: () => void;
  onNewSupplier: () => void;
  onNewCustomer: () => void;
  onViewReports: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onNewInvoice,
  onNewSupplier,
  onNewCustomer,
  onViewReports
}) => {
  const pendingItems = [
    { type: 'invoice', description: 'Fatura Material Express', amount: 'R$ 12.500,00', daysOverdue: 2 },
    { type: 'payment', description: 'Pagamento DNIT', amount: 'R$ 45.000,00', daysUntilDue: 1 },
    { type: 'approval', description: 'Aprovação orçamento Obra BR-101', amount: 'R$ 125.000,00', daysUntilDue: 3 },
  ];

  const getStatusBadge = (item: any) => {
    if (item.daysOverdue > 0) {
      return <Badge variant="destructive">Vencido</Badge>;
    }
    if (item.daysUntilDue <= 1) {
      return <Badge variant="secondary">Urgente</Badge>;
    }
    return <Badge variant="outline">Pendente</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onNewInvoice} className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
          
          <Button onClick={onNewSupplier} className="w-full justify-start" variant="outline">
            <Building2 className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
          
          <Button onClick={onNewCustomer} className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
          
          <Button onClick={onViewReports} className="w-full justify-start" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
        </CardContent>
      </Card>

      {/* Pending Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Itens Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.amount}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getStatusBadge(item)}
                {item.daysOverdue ? (
                  <span className="text-xs text-red-600">
                    {item.daysOverdue} dia(s) atrasado
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {item.daysUntilDue} dia(s) restante(s)
                  </span>
                )}
              </div>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full">
            <Clock className="h-4 w-4 mr-2" />
            Ver todos os pendentes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
