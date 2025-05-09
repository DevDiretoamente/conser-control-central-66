
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Funcionario, ExameRealizado } from '@/types/funcionario';
import { addYears, isBefore } from 'date-fns';
import { mockExamesFuncao } from '@/services/mockExameService';
import { isSpecialExam, groupExamsByType } from '@/utils/examUtils';

// Import our new components
import ProximosExamesTab from './tabs/ProximosExamesTab';
import HistoricoExamesTab from './tabs/HistoricoExamesTab';
import NovoExameTab from './tabs/NovoExameTab';

interface GerenciamentoExamesMedicosProps {
  funcionario: Funcionario;
  onSave: (exames: ExameRealizado[]) => void;
}

const GerenciamentoExamesMedicos: React.FC<GerenciamentoExamesMedicosProps> = ({ funcionario, onSave }) => {
  const [activeTab, setActiveTab] = useState<string>('proximos');
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState<string>('periodico');
  const [examesRealizados, setExamesRealizados] = useState<ExameRealizado[]>(funcionario.examesRealizados || []);
  const [examesPendentes, setExamesPendentes] = useState<any[]>([]);
  const [novoExame, setNovoExame] = useState<ExameRealizado | null>(null);
  const [dataAgendada, setDataAgendada] = useState<Date | undefined>(undefined);
  const [exameSelected, setExameSelected] = useState<string>('');
  
  // Calculate pending and upcoming exams based on already performed exams
  useEffect(() => {
    const ultimoAdmissional = examesRealizados.find(e => e.tipoSelecionado === 'admissional');
    
    if (ultimoAdmissional) {
      const proximosPeriodicos = [];
      
      // Get the function's exams
      const examesParaFuncao = funcionario.dadosProfissionais.funcaoId ? 
        mockExamesFuncao[funcionario.dadosProfissionais.funcaoId]?.periodico || [] : [];
      
      // Group exams by standard and special (biennial)
      const { standardExams, specialExams } = groupExamsByType(examesParaFuncao);
      
      // Standard exams (annual)
      if (standardExams.length > 0) {
        const dataLimiteStandard = addYears(new Date(ultimoAdmissional.dataRealizado), 1);
        const jaPassouStandard = isBefore(dataLimiteStandard, new Date());
        
        proximosPeriodicos.push({
          tipo: 'periodico',
          dataLimite: dataLimiteStandard,
          exames: standardExams,
          status: jaPassouStandard ? 'atrasado' : 'agendado',
          periodicidade: 'anual'
        });
      }
      
      // Special exams (biennial, like spirometry)
      if (specialExams.length > 0) {
        const dataLimiteSpecial = addYears(new Date(ultimoAdmissional.dataRealizado), 2);
        const jaPassouSpecial = isBefore(dataLimiteSpecial, new Date());
        
        proximosPeriodicos.push({
          tipo: 'periodico',
          dataLimite: dataLimiteSpecial,
          exames: specialExams,
          status: jaPassouSpecial ? 'atrasado' : 'agendado',
          periodicidade: 'bienal'
        });
      }
      
      setExamesPendentes(proximosPeriodicos);
    }
  }, [examesRealizados, funcionario.dadosProfissionais.funcaoId]);
  
  const handleNovoExame = (tipo: string) => {
    setTipoExameSelecionado(tipo);
    setNovoExame({
      exameId: '',
      tipoSelecionado: tipo,
      dataRealizado: new Date(),
      dataValidade: addYears(new Date(), 1), // Default 1 year, will be adjusted based on exam type
      resultado: 'Apto',
      documento: null,
      observacoes: ''
    });
    setActiveTab('novo');
  };
  
  const handleSalvarExame = () => {
    if (novoExame) {
      setExamesRealizados([...examesRealizados, novoExame]);
      onSave([...examesRealizados, novoExame]);
      setNovoExame(null);
      setExameSelected('');
      setDataAgendada(undefined);
      setActiveTab('historico');
    }
  };
  
  const handleAgendarExame = () => {
    // Lógica para agendar exame seria implementada aqui
    // Incluiria integração com calendário/lembretes
  };

  const handleCancelNovoExame = () => {
    setActiveTab('historico');
    setNovoExame(null);
    setExameSelected('');
    setDataAgendada(undefined);
  };
  
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="proximos">Próximos Exames</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="novo">Novo Exame</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proximos">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-4">
              <ProximosExamesTab 
                examesPendentes={examesPendentes}
                onAgendarExame={handleAgendarExame}
                onRegistrarExame={handleNovoExame}
              />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="historico">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-4">
              <HistoricoExamesTab examesRealizados={examesRealizados} />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="novo">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <NovoExameTab 
              funcionario={funcionario}
              tipoExameSelecionado={tipoExameSelecionado}
              setTipoExameSelecionado={setTipoExameSelecionado}
              novoExame={novoExame}
              setNovoExame={setNovoExame}
              dataAgendada={dataAgendada}
              setDataAgendada={setDataAgendada}
              exameSelected={exameSelected}
              setExameSelected={setExameSelected}
              mockExamesFuncao={mockExamesFuncao}
              onSalvar={handleSalvarExame}
              onCancel={handleCancelNovoExame}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciamentoExamesMedicos;
