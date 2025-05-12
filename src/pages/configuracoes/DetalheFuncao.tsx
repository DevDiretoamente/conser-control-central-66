
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, HardHat, FileText, Shirt } from 'lucide-react';
import { toast } from 'sonner';
import { Funcao, Setor } from '@/types/funcionario';
import { funcionesService } from '@/services/funcionesService';
import { mockSetores } from '@/data/funcionarioMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const DetalheFuncao: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [funcao, setFuncao] = useState<Funcao | null>(null);
  const [setor, setSetor] = useState<Setor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeExamTab, setActiveExamTab] = useState<string>("admissional");
  
  useEffect(() => {
    const loadFuncao = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const funcaoData = await funcionesService.getById(id);
        setFuncao(funcaoData);
        
        // Find the setor
        if (funcaoData) {
          const setorData = mockSetores.find(s => s.id === funcaoData.setorId);
          setSetor(setorData || null);
        }
      } catch (error) {
        console.error('Error loading function details:', error);
        toast.error('Erro ao carregar detalhes da função');
        navigate('/funcoes');
      } finally {
        setLoading(false);
      }
    };
    
    loadFuncao();
  }, [id, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <span className="text-lg">Carregando...</span>
      </div>
    );
  }
  
  if (!funcao) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <span className="text-lg mb-4">Função não encontrada</span>
        <Button onClick={() => navigate('/funcoes')}>Voltar para Lista de Funções</Button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/funcoes">Funções</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{funcao.nome}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{funcao.nome}</h1>
          {!funcao.ativo && (
            <Badge variant="outline" className="ml-2">Inativa</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/funcoes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={() => navigate(`/funcoes/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="pr-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Setor</h3>
                  <p>{setor?.nome || 'Não definido'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Status</h3>
                  <p>{funcao.ativo ? 'Ativa' : 'Inativa'}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Descrição</h3>
                <p>{funcao.descricao}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Atribuições</CardTitle>
            </CardHeader>
            <CardContent>
              {funcao.atribuicoes.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma atribuição cadastrada para esta função.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {funcao.atribuicoes.map((atribuicao, index) => (
                    <li key={index}>{atribuicao}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center">
              <HardHat className="h-5 w-5 mr-2 text-muted-foreground" />
              <CardTitle>EPIs Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              {funcao.epis.length === 0 ? (
                <p className="text-muted-foreground">Nenhum EPI necessário para esta função.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {funcao.epis.map(epi => (
                    <div key={epi.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{epi.nome}</h3>
                        <Badge variant={epi.obrigatorio ? "destructive" : "outline"}>
                          {epi.obrigatorio ? 'Obrigatório' : 'Opcional'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">CA: {epi.ca}</p>
                      {epi.validade && (
                        <p className="text-sm mt-1">Validade: {epi.validade} meses</p>
                      )}
                      {epi.descricao && (
                        <p className="text-sm mt-2">{epi.descricao}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center">
              <Shirt className="h-5 w-5 mr-2 text-muted-foreground" />
              <CardTitle>Uniformes Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              {funcao.uniformes.length === 0 ? (
                <p className="text-muted-foreground">Nenhum uniforme necessário para esta função.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {funcao.uniformes.map(uniforme => (
                    <div key={uniforme.id} className="border rounded-md p-3">
                      <h3 className="font-medium">{uniforme.tipo}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{uniforme.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center">
              <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
              <CardTitle>Exames Médicos Necessários</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeExamTab} onValueChange={setActiveExamTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="admissional">Admissional</TabsTrigger>
                  <TabsTrigger value="periodico">Periódico</TabsTrigger>
                  <TabsTrigger value="mudancaFuncao">Mudança de Função</TabsTrigger>
                  <TabsTrigger value="retornoTrabalho">Retorno ao Trabalho</TabsTrigger>
                  <TabsTrigger value="demissional">Demissional</TabsTrigger>
                </TabsList>
                
                <TabsContent value="admissional">
                  {funcao.examesNecessarios.admissional.length === 0 ? (
                    <p className="text-muted-foreground p-3">Nenhum exame admissional necessário.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {funcao.examesNecessarios.admissional.map(exame => (
                        <div key={exame.id} className="border rounded-md p-3">
                          <h3 className="font-medium">{exame.nome}</h3>
                          {exame.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">{exame.descricao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="periodico">
                  {funcao.examesNecessarios.periodico.length === 0 ? (
                    <p className="text-muted-foreground p-3">Nenhum exame periódico necessário.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {funcao.examesNecessarios.periodico.map(exame => (
                        <div key={exame.id} className="border rounded-md p-3">
                          <h3 className="font-medium">{exame.nome}</h3>
                          {exame.periodicidade && (
                            <Badge variant="outline" className="mt-1">
                              A cada {exame.periodicidade} {exame.periodicidade === 1 ? 'mês' : 'meses'}
                            </Badge>
                          )}
                          {exame.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">{exame.descricao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="mudancaFuncao">
                  {funcao.examesNecessarios.mudancaFuncao.length === 0 ? (
                    <p className="text-muted-foreground p-3">Nenhum exame para mudança de função necessário.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {funcao.examesNecessarios.mudancaFuncao.map(exame => (
                        <div key={exame.id} className="border rounded-md p-3">
                          <h3 className="font-medium">{exame.nome}</h3>
                          {exame.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">{exame.descricao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="retornoTrabalho">
                  {funcao.examesNecessarios.retornoTrabalho.length === 0 ? (
                    <p className="text-muted-foreground p-3">Nenhum exame para retorno ao trabalho necessário.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {funcao.examesNecessarios.retornoTrabalho.map(exame => (
                        <div key={exame.id} className="border rounded-md p-3">
                          <h3 className="font-medium">{exame.nome}</h3>
                          {exame.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">{exame.descricao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="demissional">
                  {funcao.examesNecessarios.demissional.length === 0 ? (
                    <p className="text-muted-foreground p-3">Nenhum exame demissional necessário.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {funcao.examesNecessarios.demissional.map(exame => (
                        <div key={exame.id} className="border rounded-md p-3">
                          <h3 className="font-medium">{exame.nome}</h3>
                          {exame.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">{exame.descricao}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DetalheFuncao;
