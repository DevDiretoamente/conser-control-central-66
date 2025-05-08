
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Calendar, Pencil, File, Paperclip, Stethoscope, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// This would be replaced with an API call in a real application
const getMockFuncionarioById = (id) => {
  // Mock data would go here
  return {
    id,
    dadosPessoais: {
      nome: id === '1' ? 'João da Silva' : 'Funcionário ' + id,
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      dataNascimento: new Date('1985-05-15'),
      escolaridade: 'Ensino Médio Completo',
      estadoCivil: 'Casado'
    },
    contato: {
      telefone: '(11) 99999-8888',
      email: 'joao.silva@conservias.com'
    },
    dadosProfissionais: {
      funcaoId: '1',
      cargo: 'Motorista',
      dataAdmissao: new Date('2022-01-10'),
      salario: 5000
    },
    uniformes: [],
    documentos: {},
    examesRealizados: [
      {
        exameId: '1',
        tipoSelecionado: 'admissional',
        dataRealizado: new Date('2022-01-05'),
        dataValidade: new Date('2023-01-05'),
        resultado: 'Apto',
        documento: null
      }
    ]
  };
};

const DetalheFuncionario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [funcionario, setFuncionario] = useState(null);
  const [activeTab, setActiveTab] = useState('geral');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const func = getMockFuncionarioById(id);
    if (func) {
      setFuncionario(func);
    } else {
      // Handle not found
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!funcionario) {
    return <div>Funcionário não encontrado</div>;
  }

  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/funcionarios">Funcionários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{funcionario.dadosPessoais.nome}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-start mb-6">
        <div>
          <Button variant="outline" onClick={() => navigate('/funcionarios')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{funcionario.dadosPessoais.nome}</h1>
          <p className="text-muted-foreground">
            {funcionario.dadosProfissionais.cargo} • CPF: {funcionario.dadosPessoais.cpf}
          </p>
        </div>
        
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/funcionarios/${id}/exames-medicos`}>
              <Stethoscope className="mr-2 h-4 w-4" />
              Exames Médicos
            </Link>
          </Button>
          <Button variant="outline">
            <File className="mr-2 h-4 w-4" />
            Documentos
          </Button>
          <Button asChild>
            <Link to={`/funcionarios/${id}/editar`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-250px)]">
          <TabsContent value="geral" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div>
                    <span className="text-sm font-medium">Nome Completo:</span>
                    <p>{funcionario.dadosPessoais.nome}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">CPF:</span>
                    <p>{funcionario.dadosPessoais.cpf}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">RG:</span>
                    <p>{funcionario.dadosPessoais.rg}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Data de Nascimento:</span>
                    <p>{format(funcionario.dadosPessoais.dataNascimento, 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Escolaridade:</span>
                    <p>{funcionario.dadosPessoais.escolaridade}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Estado Civil:</span>
                    <p>{funcionario.dadosPessoais.estadoCivil}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Dados de Contato</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div>
                    <span className="text-sm font-medium">Telefone:</span>
                    <p>{funcionario.contato.telefone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p>{funcionario.contato.email}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Dados Profissionais</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div>
                    <span className="text-sm font-medium">Cargo:</span>
                    <p>{funcionario.dadosProfissionais.cargo}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Data de Admissão:</span>
                    <p>{format(funcionario.dadosProfissionais.dataAdmissao, 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Salário:</span>
                    <p>R$ {funcionario.dadosProfissionais.salario.toLocaleString('pt-BR')}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Exames Médicos</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/funcionarios/${id}/exames-medicos`}>
                      Ver Todos
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {funcionario.examesRealizados && funcionario.examesRealizados.length > 0 ? (
                    <div className="space-y-2">
                      {funcionario.examesRealizados.slice(0, 3).map((exame, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{
                              exame.tipoSelecionado === 'admissional' ? 'Exame Admissional' :
                              exame.tipoSelecionado === 'periodico' ? 'Exame Periódico' :
                              exame.tipoSelecionado === 'mudancaFuncao' ? 'Mudança de Função' :
                              exame.tipoSelecionado === 'retornoTrabalho' ? 'Retorno ao Trabalho' :
                              'Exame Demissional'
                            }</p>
                            <p className="text-sm text-muted-foreground">
                              {format(exame.dataRealizado, 'dd/MM/yyyy')}
                            </p>
                          </div>
                          <Badge variant={exame.resultado === 'Apto' ? 'outline' : 'secondary'}>
                            {exame.resultado}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum exame médico registrado</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documentos" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Lista de documentos anexados ao cadastro</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="historico" className="p-1">
            <div className="grid grid-cols-1 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Registro de alterações e eventos</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default DetalheFuncionario;
