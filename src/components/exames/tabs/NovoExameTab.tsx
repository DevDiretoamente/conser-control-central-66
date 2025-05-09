
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import DocumentUploader from '@/components/funcionarios/DocumentUploader';
import { Funcionario, ExameRealizado, ExameMedico } from '@/types/funcionario';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { calculateValidityDate, isSpecialExam } from '@/utils/examUtils';

interface NovoExameTabProps {
  funcionario: Funcionario;
  tipoExameSelecionado: string;
  setTipoExameSelecionado: (tipo: string) => void;
  novoExame: ExameRealizado | null;
  setNovoExame: (exame: ExameRealizado | null) => void;
  dataAgendada: Date | undefined;
  setDataAgendada: (date: Date | undefined) => void;
  exameSelected: string;
  setExameSelected: (exame: string) => void;
  mockExamesFuncao: Record<string, Record<string, ExameMedico[]>>;
  onSalvar: () => void;
  onCancel: () => void;
}

const NovoExameTab: React.FC<NovoExameTabProps> = ({
  funcionario,
  tipoExameSelecionado,
  setTipoExameSelecionado,
  novoExame,
  setNovoExame,
  dataAgendada,
  setDataAgendada,
  exameSelected,
  setExameSelected,
  mockExamesFuncao,
  onSalvar,
  onCancel
}) => {
  const handleExameChange = (exameName: string) => {
    setExameSelected(exameName);
    
    if (novoExame) {
      // Update validity based on exam type
      const newValidity = calculateValidityDate(novoExame.dataRealizado, exameName);
      setNovoExame({
        ...novoExame,
        exameId: exameName,
        dataValidade: newValidity
      });
    }
  };
  
  const handleDataRealizadoChange = (date: Date | undefined) => {
    if (date && novoExame) {
      // Calculate new validity date based on exam type
      const newValidity = calculateValidityDate(date, novoExame.exameId || '');
      
      setNovoExame({
        ...novoExame,
        dataRealizado: date,
        dataValidade: newValidity
      });
    }
    
    setDataAgendada(date);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Novo Exame</CardTitle>
        <CardDescription>
          Registrar um novo exame para este funcionário
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Exame</label>
              <Select 
                value={tipoExameSelecionado} 
                onValueChange={setTipoExameSelecionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="periodico">Periódico</SelectItem>
                  <SelectItem value="mudancaFuncao">Mudança de Função</SelectItem>
                  <SelectItem value="retornoTrabalho">Retorno ao Trabalho</SelectItem>
                  <SelectItem value="demissional">Demissional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Exame</label>
              <Select 
                value={exameSelected}
                onValueChange={handleExameChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o exame" />
                </SelectTrigger>
                <SelectContent>
                  {funcionario.dadosProfissionais.funcaoId && 
                   mockExamesFuncao[funcionario.dadosProfissionais.funcaoId] && 
                   mockExamesFuncao[funcionario.dadosProfissionais.funcaoId][tipoExameSelecionado] ? (
                     mockExamesFuncao[funcionario.dadosProfissionais.funcaoId][tipoExameSelecionado].map(exam => (
                       <SelectItem key={exam.id} value={exam.nome}>
                         {exam.nome} {isSpecialExam(exam.nome) && "(Bienal)"}
                       </SelectItem>
                     ))
                   ) : (
                     <SelectItem value="exame-clinico">Exame Clínico</SelectItem>
                   )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Realização</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !dataAgendada && "text-muted-foreground"
                    )}
                  >
                    {dataAgendada ? (
                      format(dataAgendada, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataAgendada}
                    onSelect={handleDataRealizadoChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Validade</label>
              <Input 
                value={novoExame?.dataValidade ? format(novoExame.dataValidade, "dd/MM/yyyy") : ""} 
                readOnly 
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                {exameSelected && isSpecialExam(exameSelected) 
                  ? "Validade de 2 anos para Espirometria" 
                  : "Validade de 1 ano"}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Clínica</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a clínica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">RP Medicina e Segurança do Trabalho</SelectItem>
                  <SelectItem value="2">Sindiconvenios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Resultado</label>
              <Select defaultValue="Apto">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apto">Apto</SelectItem>
                  <SelectItem value="Apto com restrições">Apto com restrições</SelectItem>
                  <SelectItem value="Inapto temporariamente">Inapto temporariamente</SelectItem>
                  <SelectItem value="Inapto definitivamente">Inapto definitivamente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Textarea placeholder="Observações sobre o exame" className="resize-none" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Documento do ASO</label>
            <DocumentUploader
              label="Anexar ASO"
              description="PDF ou imagem do ASO"
              allowedTypes=".pdf,.jpg,.jpeg,.png"
              onFileChange={() => {}}
              value={null}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSalvar}>
          Salvar Exame
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NovoExameTab;
