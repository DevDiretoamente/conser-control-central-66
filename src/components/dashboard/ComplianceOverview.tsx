
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ComplianceItem {
  id: string;
  name: string;
  compliant: number;
  total: number;
  color: string;
}

const complianceData: ComplianceItem[] = [
  {
    id: '1',
    name: 'ASO',
    compliant: 18,
    total: 26,
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Treinamentos NR',
    compliant: 22,
    total: 26,
    color: '#10B981',
  },
  {
    id: '3',
    name: 'EPIs Entregues',
    compliant: 25,
    total: 26,
    color: '#8B5CF6',
  },
  {
    id: '4',
    name: 'CNH Válida',
    compliant: 8,
    total: 10,
    color: '#F59E0B',
  },
];

const ComplianceOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Conformidade Ocupacional</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {complianceData.map((item) => {
            const percentage = Math.round((item.compliant / item.total) * 100);
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.compliant} de {item.total} ({percentage}%)
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2" 
                  style={{ "--progress-color": item.color } as React.CSSProperties} 
                  indicatorClassName={`bg-[color:var(--progress-color)]`} 
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceOverview;
