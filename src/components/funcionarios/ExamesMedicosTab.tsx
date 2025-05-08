
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Funcionario, ExameRealizado } from '@/types/funcionario';
import { CalendarIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ExamesMedicosTabProps {
  form: UseFormReturn<Funcionario>;
}

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
                    <TableHead>Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissionExames.map((exame, index) => (
                    <TableRow key={index}>
                      <TableCell>{exame.exameId}</TableCell>
                      <TableCell>{exame.clinicaId}</TableCell>
                      <TableCell>
                        {exame.dataRealizado ? format(new Date(exame.dataRealizado), 'dd/MM/yyyy') : 'Agendado'}
                      </TableCell>
                      <TableCell>{exame.resultado || 'Pendente'}</TableCell>
                    </TableRow>
                  ))}
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
