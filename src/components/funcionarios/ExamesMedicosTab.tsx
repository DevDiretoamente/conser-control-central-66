
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Funcionario, ExameRealizado } from '@/types/funcionario';
import { CalendarIcon, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format, addYears, addMonths, isPast, differenceInMonths } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ExamesMedicosTabProps {
  form: UseFormReturn<Funcionario>;
}

// Determine the validity period based on exam type
const getExameValidityPeriod = (exameId: string): number => {
  // Espirometria has a validity period of 2 years
  if (exameId && exameId.toLowerCase().includes('espirometria')) {
    return 24; // 24 months (2 years)
  }
  
  // All other exams have a validity period of 1 year
  return 12; // 12 months (1 year)
};

const ExamesMedicosTab: React.FC<ExamesMedicosTabProps> = ({ form }) => {
  const [examesRealizados, setExamesRealizados] = useState<ExameRealizado[]>([]);
  
  // Load exames from form
  useEffect(() => {
    const formExames = form.getValues('examesRealizados') || [];
    setExamesRealizados(formExames);
  }, [form]);
  
  // Update form whenever exames changes
  useEffect(() => {
    form.setValue('examesRealizados', examesRealizados);
  }, [examesRealizados, form]);
  
  // Show only admission exams in this tab
  const admissionExames = examesRealizados.filter(exame => 
    exame.tipoSelecionado === 'admissional'
  );

  const redirectToFullExamesPage = () => {
    const funcionarioId = form.getValues('id');
    if (funcionarioId) {
      window.location.href = `/funcionarios/${funcionarioId}/exames-medicos`;
    } else {
      toast.error('É necessário salvar o funcionário antes de gerenciar todos os exames.');
    }
  };

  // Calculate exam status (valid, expiring, expired)
  const getExamStatus = (exame: ExameRealizado) => {
    if (!exame.dataRealizado || !exame.dataValidade) return 'unknown';
    
    const today = new Date();
    const validityDate = new Date(exame.dataValidade);
    const monthsLeft = differenceInMonths(validityDate, today);
    
    if (isPast(validityDate)) {
      return 'expired';
    } else if (monthsLeft <= 1) {
      return 'expiring';
    } else {
      return 'valid';
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Exames Médicos Admissionais</h3>
          <Button onClick={redirectToFullExamesPage} variant="outline">
            Gerenciar Todos os Exames
          </Button>
        </div>
        
        {admissionExames.length === 0 ? (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sem exames admissionais</h3>
              <p className="text-muted-foreground text-center mb-4">
                Não há exames médicos admissionais registrados para este funcionário.
              </p>
              <Button onClick={redirectToFullExamesPage}>
                <Plus className="mr-2 h-4 w-4" />
                Agendar Exames
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exame</TableHead>
                    <TableHead>Clínica</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissionExames.map((exame, index) => {
                    const status = getExamStatus(exame);
                    const isSpirometry = exame.exameId?.toLowerCase().includes('espirometria');
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {exame.exameId}
                          {isSpirometry && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                              Bienal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{exame.clinicaId}</TableCell>
                        <TableCell>
                          {exame.dataRealizado ? format(new Date(exame.dataRealizado), 'dd/MM/yyyy') : 'Agendado'}
                        </TableCell>
                        <TableCell>
                          {exame.dataValidade ? format(new Date(exame.dataValidade), 'dd/MM/yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>{exame.resultado || 'Pendente'}</TableCell>
                        <TableCell>
                          {status === 'valid' && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Válido</span>
                            </div>
                          )}
                          {status === 'expiring' && (
                            <div className="flex items-center text-amber-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-xs">A vencer</span>
                            </div>
                          )}
                          {status === 'expired' && (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Vencido</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default ExamesMedicosTab;
