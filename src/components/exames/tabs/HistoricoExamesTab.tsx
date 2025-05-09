
import React from 'react';
import { format, isBefore } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExameRealizado } from '@/types/funcionario';
import { isSpecialExam } from '@/utils/examUtils';

interface HistoricoExamesTabProps {
  examesRealizados: ExameRealizado[];
}

const HistoricoExamesTab: React.FC<HistoricoExamesTabProps> = ({
  examesRealizados
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Exames</CardTitle>
        <CardDescription>
          Todos os exames realizados por este funcionário
        </CardDescription>
      </CardHeader>
      <CardContent>
        {examesRealizados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum exame foi registrado para este funcionário</p>
          </div>
        ) : (
          <div className="space-y-4">
            {examesRealizados.map((exame, idx) => {
              const isSpecial = exame.exameId && isSpecialExam(exame.exameId);
              
              return (
                <Card key={idx} className="border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center gap-2">
                        {exame.tipoSelecionado === 'admissional' ? 'Exame Admissional' : 
                        exame.tipoSelecionado === 'periodico' ? 'Exame Periódico' :
                        exame.tipoSelecionado === 'mudancaFuncao' ? 'Mudança de Função' :
                        exame.tipoSelecionado === 'retornoTrabalho' ? 'Retorno ao Trabalho' : 'Demissional'}
                        
                        {isSpecial && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Bienal
                          </Badge>
                        )}
                      </CardTitle>
                      <Badge variant={isBefore(exame.dataValidade, new Date()) ? "destructive" : "outline"}>
                        {isBefore(exame.dataValidade, new Date()) ? 'Vencido' : 'Válido'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Exame:</p>
                        <p>{exame.exameId || 'Não especificado'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Data de realização:</p>
                        <p>{format(exame.dataRealizado, "dd/MM/yyyy")}</p>
                      </div>
                      <div>
                        <p className="font-medium">Validade:</p>
                        <p>{format(exame.dataValidade, "dd/MM/yyyy")}</p>
                      </div>
                      <div>
                        <p className="font-medium">Resultado:</p>
                        <p>{exame.resultado}</p>
                      </div>
                      <div>
                        <p className="font-medium">Clínica:</p>
                        <p>{exame.clinicaId === '1' ? 'RP Medicina e Segurança do Trabalho' : 
                            exame.clinicaId === '2' ? 'Sindiconvenios' : 'Não informada'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Periodicidade:</p>
                        <p>{isSpecial ? '2 anos' : '1 ano'}</p>
                      </div>
                    </div>
                    
                    {exame.observacoes && (
                      <div className="mt-2">
                        <p className="font-medium">Observações:</p>
                        <p className="text-sm">{exame.observacoes}</p>
                      </div>
                    )}
                    
                    {exame.documento && (
                      <div className="mt-2">
                        <p className="font-medium">Documento:</p>
                        <p className="text-sm text-blue-600 underline cursor-pointer">
                          Ver documento
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricoExamesTab;
