
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format, addYears, addMonths, isPast, differenceInDays } from 'date-fns';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ComplianceItem {
  id: string;
  name: string;
  compliant: number;
  total: number;
  color: string;
}

interface ExamItem {
  id: string;
  employeeId: string;
  employeeName: string;
  examType: string;
  examName: string;
  lastExamDate: Date;
  validUntil: Date;
  isSpecial?: boolean; // For exams like spirometry with longer validity
  status: 'valid' | 'expiring' | 'expired';
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

// Sample upcoming exams (in a real app would come from API)
const upcomingExams: ExamItem[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'João Silva',
    examType: 'Periódico',
    examName: 'Exame Clínico',
    lastExamDate: new Date(2024, 1, 15), // Feb 15, 2024
    validUntil: new Date(2025, 1, 15),   // Feb 15, 2025
    status: 'valid'
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Maria Santos',
    examType: 'Periódico',
    examName: 'Audiometria',
    lastExamDate: new Date(2023, 11, 10), // Dec 10, 2023
    validUntil: new Date(2024, 11, 10),   // Dec 10, 2024
    status: 'valid'
  },
  {
    id: '3',
    employeeId: '103',
    employeeName: 'Carlos Ferreira',
    examType: 'Periódico',
    examName: 'Espirometria',
    lastExamDate: new Date(2023, 5, 20), // June 20, 2023
    validUntil: new Date(2025, 5, 20),   // June 20, 2025 (2-year validity)
    isSpecial: true,
    status: 'valid'
  },
  {
    id: '4',
    employeeId: '104',
    employeeName: 'Ana Oliveira',
    examType: 'Periódico',
    examName: 'Exame Clínico',
    lastExamDate: new Date(2023, 6, 5), // July 5, 2023
    validUntil: new Date(2024, 6, 5),   // July 5, 2024
    status: 'expiring'
  },
  {
    id: '5',
    employeeId: '105',
    employeeName: 'Paulo Costa',
    examType: 'Periódico',
    examName: 'Exame Clínico',
    lastExamDate: new Date(2023, 3, 12), // Apr 12, 2023
    validUntil: new Date(2024, 3, 12),   // Apr 12, 2024
    status: 'expired'
  }
];

// Process exams to update status based on current date
const processExams = (exams: ExamItem[]): ExamItem[] => {
  const today = new Date();
  
  return exams.map(exam => {
    const daysUntilExpiry = differenceInDays(exam.validUntil, today);
    
    if (isPast(exam.validUntil)) {
      return { ...exam, status: 'expired' };
    } else if (daysUntilExpiry <= 30) {
      return { ...exam, status: 'expiring' };
    } else {
      return { ...exam, status: 'valid' };
    }
  });
};

const ComplianceOverview: React.FC = () => {
  const processedExams = processExams(upcomingExams);
  
  // Count exams by status for summary
  const expiringCount = processedExams.filter(e => e.status === 'expiring').length;
  const expiredCount = processedExams.filter(e => e.status === 'expired').length;
  
  return (
    <div className="space-y-6">
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
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Próximos Exames Ocupacionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Exames vencidos: {expiredCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">A vencer em 30 dias: {expiringCount}</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              {processedExams.slice(0, 4).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{exam.employeeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.examName} {exam.isSpecial && "(Bienal)"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge 
                      variant={
                        exam.status === 'expired' ? "destructive" : 
                        exam.status === 'expiring' ? "outline" : 
                        "secondary"
                      }
                      className={
                        exam.status === 'expired' ? "bg-red-100 text-red-800 border-red-200" : 
                        exam.status === 'expiring' ? "bg-amber-50 text-amber-800 border-amber-200" : 
                        "bg-green-50 text-green-800 border-green-200"
                      }
                    >
                      {exam.status === 'expired' ? "Vencido" : 
                       exam.status === 'expiring' ? "A vencer" : 
                       "Válido"}
                    </Badge>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(exam.validUntil, "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {processedExams.length > 4 && (
              <div className="text-center mt-2">
                <a href="/funcionarios" className="text-sm text-primary hover:underline">
                  Ver todos os exames ({processedExams.length})
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceOverview;
