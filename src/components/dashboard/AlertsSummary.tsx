
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar, FileWarning, TruckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AlertItem {
  id: string;
  type: 'aso' | 'documento' | 'cnh' | 'manutencao';
  title: string;
  description: string;
  expiry: string;
  severity: 'high' | 'medium' | 'low';
  link?: string;
}

const alertsData: AlertItem[] = [
  {
    id: '1',
    type: 'aso',
    title: 'ASO de João Silva vence em 7 dias',
    description: 'Agende os exames médicos o quanto antes para evitar não conformidades',
    expiry: '2023-06-15',
    severity: 'high',
    link: '/app/funcionarios/1'
  },
  {
    id: '2',
    type: 'documento',
    title: 'NR-35 de Carlos Pereira vencida',
    description: 'O certificado de treinamento NR-35 venceu há 5 dias',
    expiry: '2023-06-01',
    severity: 'high',
    link: '/app/funcionarios/2'
  },
  {
    id: '3',
    type: 'cnh',
    title: 'CNH de Maria Santos vence em 30 dias',
    description: 'A renovação deve ser iniciada com antecedência',
    expiry: '2023-07-08',
    severity: 'medium',
    link: '/app/funcionarios/3'
  },
  {
    id: '4',
    type: 'manutencao',
    title: 'Manutenção preventiva agendada',
    description: 'Veículos XYZ-1234 e ABC-5678 para amanhã às 08:00',
    expiry: '2023-06-09',
    severity: 'low'
  }
];

const getSeverityStyles = (severity: AlertItem['severity']) => {
  switch (severity) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-yellow-500';
    case 'low':
      return 'border-l-blue-500';
    default:
      return 'border-l-blue-500';
  }
};

const getAlertIcon = (type: AlertItem['type']) => {
  switch (type) {
    case 'aso':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'documento':
      return <FileWarning className="h-5 w-5 text-yellow-500" />;
    case 'cnh':
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case 'manutencao':
      return <TruckIcon className="h-5 w-5 text-blue-600" />;
    default:
      return <AlertTriangle className="h-5 w-5" />;
  }
};

const AlertsSummary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Alertas Críticos</CardTitle>
          <Badge variant="secondary">{alertsData.length} alertas</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {alertsData.map((alert) => (
            <div key={alert.id} className="p-4">
              <div className={`flex gap-4 border-l-4 pl-3 ${getSeverityStyles(alert.severity)}`}>
                <div className="flex-shrink-0 pt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  {alert.link && (
                    <Button 
                      variant="link" 
                      className="mt-2 h-auto p-0 text-sm" 
                      onClick={() => navigate(alert.link!)}
                    >
                      Ver detalhes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsSummary;
