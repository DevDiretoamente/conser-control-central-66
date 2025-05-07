
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, Funcao, EPI, Uniforme, ExameMedico, Setor } from '@/types/funcionario';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockFuncoes, mockSetores } from '@/data/funcionarioMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FuncaoTabProps {
  form: UseFormReturn<Funcionario>;
}

const FuncaoTab: React.FC<FuncaoTabProps> = ({ form }) => {
  const [funcaoSelecionada, setFuncaoSelecionada] = useState<Funcao | undefined>(undefined);
  const [setorAtual, setSetorAtual] = useState<Setor | undefined>(undefined);
  const [activeExamTab, setActiveExamTab] = useState<string>("admissional");

  // Obtém o ID da função atual do formulário
  const funcaoId = form.watch('dadosProfissionais.funcaoId');

  // Atualiza a função selecionada quando o ID muda
  useEffect(() => {
    if (funcaoId) {
      const funcao = mockFuncoes.find(f => f.id === funcaoId);
      setFuncaoSelecionada(funcao);

      if (funcao) {
        const setor = mockSetores.find(s => s.id === funcao.setorId);
        setSetorAtual(setor);
      } else {
        setSetorAtual(undefined);
      }
    } else {
      setFuncaoSelecionada(undefined);
      setSetorAtual(undefined);
    }
  }, [funcaoId]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="dadosProfissionais.funcaoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const funcao = mockFuncoes.find(f => f.id === value);
                setFuncaoSelecionada(funcao);
                
                if (funcao) {
                  const setor = mockSetores.find(s => s.id === funcao.setorId);
                  setSetorAtual(setor);
                }
              }}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Selecione uma função</SelectItem>
                {mockFuncoes.filter(f => f.ativo).map((funcao) => (
                  <SelectItem key={funcao.id} value={funcao.id}>
                    {funcao.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {funcaoSelecionada && (
        <div className="mt-6 space-y-6">
          {setorAtual && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Setor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{setorAtual.nome}</p>
                <p className="text-sm text-muted-foreground mt-1">{setorAtual.descricao}</p>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Descrição da Função</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{funcaoSelecionada.descricao}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Atribuições</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {funcaoSelecionada.atribuicoes.map((atribuicao, index) => (
                  <li key={index} className="text-sm">{atribuicao}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>EPIs Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              {funcaoSelecionada.epis.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {funcaoSelecionada.epis.map((epi) => (
                    <li key={epi.id} className="text-sm border rounded p-2 flex items-center">
                      <span className="flex-1">{epi.nome}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">CA: {epi.ca}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum EPI necessário para esta função.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Exames Médicos Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeExamTab} onValueChange={setActiveExamTab}>
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="admissional">Admissional</TabsTrigger>
                  <TabsTrigger value="periodico">Periódico</TabsTrigger>
                  <TabsTrigger value="mudancaFuncao">Mudança de Função</TabsTrigger>
                  <TabsTrigger value="retornoTrabalho">Retorno ao Trabalho</TabsTrigger>
                  <TabsTrigger value="demissional">Demissional</TabsTrigger>
                </TabsList>
                
                <TabsContent value="admissional">
                  {funcaoSelecionada.examesNecessarios.admissional.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {funcaoSelecionada.examesNecessarios.admissional.map((exame) => (
                        <li key={exame.id} className="text-sm border rounded p-2">
                          {exame.nome}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">Nenhum exame admissional necessário.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="periodico">
                  {funcaoSelecionada.examesNecessarios.periodico.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {funcaoSelecionada.examesNecessarios.periodico.map((exame) => (
                        <li key={exame.id} className="text-sm border rounded p-2">
                          {exame.nome}
                          {exame.periodicidade && (
                            <span className="text-xs block text-muted-foreground">
                              A cada {exame.periodicidade} {exame.periodicidade === 1 ? 'mês' : 'meses'}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">Nenhum exame periódico necessário.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="mudancaFuncao">
                  {funcaoSelecionada.examesNecessarios.mudancaFuncao.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {funcaoSelecionada.examesNecessarios.mudancaFuncao.map((exame) => (
                        <li key={exame.id} className="text-sm border rounded p-2">{exame.nome}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">Nenhum exame para mudança de função necessário.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="retornoTrabalho">
                  {funcaoSelecionada.examesNecessarios.retornoTrabalho.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {funcaoSelecionada.examesNecessarios.retornoTrabalho.map((exame) => (
                        <li key={exame.id} className="text-sm border rounded p-2">{exame.nome}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">Nenhum exame para retorno ao trabalho necessário.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="demissional">
                  {funcaoSelecionada.examesNecessarios.demissional.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {funcaoSelecionada.examesNecessarios.demissional.map((exame) => (
                        <li key={exame.id} className="text-sm border rounded p-2">{exame.nome}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">Nenhum exame demissional necessário.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Uniformes Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              {funcaoSelecionada.uniformes.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {funcaoSelecionada.uniformes.map((uniforme) => (
                    <li key={uniforme.id} className="text-sm border rounded p-2">
                      <span className="font-medium">{uniforme.tipo}</span>: {uniforme.descricao}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum uniforme necessário para esta função.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FuncaoTab;
