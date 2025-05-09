
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, Clock, CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { isSpecialExam } from '@/utils/examUtils';
import { ExameMedico } from '@/types/funcionario';

interface ProximoExame {
  tipo: string;
  dataLimite: Date;
  exames: ExameMedico[];
  status: string;
  periodicidade: string;
}

interface ProximosExamesTabProps {
  examesPendentes: ProximoExame[];
  onAgendarExame: () => void;
  onRegistrarExame: (tipo: string) => void;
}

const ProximosExamesTab: React.FC<ProximosExamesTabProps> = ({
  examesPendentes,
  onAgendarExame,
  onRegistrarExame
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Exames</CardTitle>
        <CardDescription>
          Exames que precisam ser realizados em breve ou que estão atrasados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {examesPendentes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Check className="mx-auto h-12 w-12 mb-2" />
            <p>Não há exames pendentes para este funcionário</p>
          </div>
        ) : (
          <div className="space-y-4">
            {examesPendentes.map((exame, idx) => (
              <Card key={idx} className={cn(
                "border",
                exame.status === "atrasado" ? "border-red-300 bg-red-50" : "border-amber-200 bg-amber-50"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                      {exame.status === "atrasado" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                      {exame.tipo === 'periodico' ? 'Exame Periódico' : exame.tipo}
                      <Badge 
                        variant="outline" 
                        className={exame.periodicidade === 'bienal' ? 
                          "bg-blue-50 text-blue-700 border-blue-200" : 
                          "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {exame.periodicidade === 'bienal' ? '2 anos' : '1 ano'}
                      </Badge>
                    </CardTitle>
                    <Badge variant={exame.status === "atrasado" ? "destructive" : "outline"}>
                      {exame.status === "atrasado" ? "Atrasado" : "Pendente"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Data limite: {format(exame.dataLimite, "dd/MM/yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium mb-2">Exames necessários:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {exame.exames.map((ex) => (
                      <li key={ex.id} className="text-sm border rounded p-2 flex justify-between items-center">
                        <span>{ex.nome}</span>
                        {isSpecialExam(ex.nome) && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Bienal
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onAgendarExame}>
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                  <Button onClick={() => onRegistrarExame(exame.tipo)}>
                    Registrar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProximosExamesTab;
