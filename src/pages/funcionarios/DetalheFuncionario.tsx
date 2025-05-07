
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Home, 
  Briefcase,
  CreditCard,
  Users,
  FileText
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Funcionario } from '@/types/funcionario';

// Mock data for funcionario details based on ID
const getMockFuncionarioById = (id: string): Funcionario | undefined => {
  // This is a simplified mock for example purposes
  return {
    id,
    dadosPessoais: {
      nome: id === '1' ? 'João da Silva' : 'Funcionário ' + id,
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      dataNascimento: new Date('1985-05-15'),
      escolaridade: 'Ensino Médio Completo',
      estadoCivil: 'Casado',
      nomeConjuge: 'Maria Silva',
      telefoneConjuge: '(11) 99999-8877',
      contatoEmergenciaNome: 'José Silva',
      contatoEmergenciaTelefone: '(11) 99999-7766'
    },
    endereco: {
      cep: '01234-567',
      rua: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP'
    },
    contato: {
      telefone: '(11) 99999-8888',
      email: 'joao.silva@conservias.com'
    },
    dadosProfissionais: {
      funcaoId: '1',
      cargo: 'Motorista',
      salario: 5000,
      dataAdmissao: new Date('2022-01-10'),
      ctpsNumero: '12345',
      ctpsSerie: '123',
      pis: '12345678901',
      tituloEleitor: '123456789012',
      certificadoReservista: '12345'
    },
    cnh: {
      numero: '12345678901',
      categoria: 'D',
      validade: new Date('2026-12-31')
    },
    dadosBancarios: {
      banco: 'Banco do Brasil',
      agencia: '1234',
      conta: '12345-6',
      tipoConta: 'corrente'
    },
    documentos: {
      rgFile: null,
      cpfFile: null,
      comprovanteResidencia: null,
      fotoFile: null,
      cnhFile: null,
      ctpsFile: null,
      exameMedicoFile: null,
      outrosDocumentos: null
    },
    dependentes: [
      {
        id: '1',
        nome: 'Pedro Silva',
        dataNascimento: new Date('2015-03-20'),
        parentesco: 'Filho',
        cpf: '987.654.321-00',
        documentos: {
          certidaoNascimento: null
        }
      },
      {
        id: '2',
        nome: 'Ana Silva',
        dataNascimento: new Date('2018-07-10'),
        parentesco: 'Filha',
        cpf: '876.543.210-00',
        documentos: {
          certidaoNascimento: null
        }
      }
    ],
    tamanhoUniforme: {
      camisa: 'M',
      calca: 'M',
      calcado: 42
    },
    episEntregues: [],
    uniformesEntregues: [],
    examesRealizados: []
  };
};

const DetalheFuncionario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [funcionario, setFuncionario] = useState<Funcionario | undefined>(undefined);
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    return tab || 'info';
  });

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const func = getMockFuncionarioById(id);
      if (func) {
        setFuncionario(func);
      } else {
        toast.error('Funcionário não encontrado');
        navigate('/funcionarios');
      }
    }
  }, [id, navigate]);

  if (!funcionario) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  const handleDelete = () => {
    // In a real app, this would be an API call
    toast.success('Funcionário excluído com sucesso');
    navigate('/funcionarios');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/funcionarios')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{funcionario.dadosPessoais.nome}</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/funcionarios/${id}/editar`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={funcionario.documentos.fotoFile?.name} alt={funcionario.dadosPessoais.nome} />
              <AvatarFallback className="bg-conserv-primary text-white text-xl">
                {getInitials(funcionario.dadosPessoais.nome)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
            <div>
              <p className="text-sm text-muted-foreground">Cargo</p>
              <p className="font-medium">{funcionario.dadosProfissionais.cargo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPF</p>
              <p className="font-medium">{funcionario.dadosPessoais.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contato</p>
              <p className="font-medium">{funcionario.contato.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{funcionario.contato.email || "Não informado"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Admissão</p>
              <p className="font-medium">{formatDate(funcionario.dadosProfissionais.dataAdmissao)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dependentes</p>
              <Badge variant="outline" className="flex gap-1 items-center w-fit">
                <Users size={14} />
                <span>{funcionario.dependentes.length}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info" className="flex gap-2">
            <User size={16} />
            <span>Informações Pessoais</span>
          </TabsTrigger>
          <TabsTrigger value="profissional" className="flex gap-2">
            <Briefcase size={16} />
            <span>Informações Profissionais</span>
          </TabsTrigger>
          <TabsTrigger value="dependentes" className="flex gap-2">
            <Users size={16} />
            <span>Dependentes</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex gap-2">
            <FileText size={16} />
            <span>Documentos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <User size={18} />
                  Dados Pessoais
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome Completo</p>
                      <p className="font-medium">{funcionario.dadosPessoais.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                      <p className="font-medium">{formatDate(funcionario.dadosPessoais.dataNascimento)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPF</p>
                      <p className="font-medium">{funcionario.dadosPessoais.cpf}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RG</p>
                      <p className="font-medium">{funcionario.dadosPessoais.rg}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado Civil</p>
                      <p className="font-medium">{funcionario.dadosPessoais.estadoCivil}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Escolaridade</p>
                      <p className="font-medium">{funcionario.dadosPessoais.escolaridade}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Home size={18} />
                  Endereço
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço Completo</p>
                    <p className="font-medium">
                      {funcionario.endereco.rua}, {funcionario.endereco.numero}
                      {funcionario.endereco.complemento && `, ${funcionario.endereco.complemento}`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bairro</p>
                      <p className="font-medium">{funcionario.endereco.bairro}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cidade</p>
                      <p className="font-medium">{funcionario.endereco.cidade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">UF</p>
                      <p className="font-medium">{funcionario.endereco.uf}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CEP</p>
                    <p className="font-medium">{funcionario.endereco.cep}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Phone size={18} />
                  Contato
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{funcionario.contato.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{funcionario.contato.email || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  Contatos de Emergência
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome do Contato</p>
                      <p className="font-medium">{funcionario.dadosPessoais.contatoEmergenciaNome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone do Contato</p>
                      <p className="font-medium">{funcionario.dadosPessoais.contatoEmergenciaTelefone}</p>
                    </div>
                    
                    {funcionario.dadosPessoais.nomeConjuge && (
                      <>
                        <div className="border-t pt-4">
                          <p className="text-sm text-muted-foreground">Nome do Cônjuge</p>
                          <p className="font-medium">{funcionario.dadosPessoais.nomeConjuge}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone do Cônjuge</p>
                          <p className="font-medium">{funcionario.dadosPessoais.telefoneConjuge}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profissional">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Briefcase size={18} />
                  Dados Profissionais
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cargo</p>
                      <p className="font-medium">{funcionario.dadosProfissionais.cargo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Admissão</p>
                      <p className="font-medium">{formatDate(funcionario.dadosProfissionais.dataAdmissao)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salário</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(funcionario.dadosProfissionais.salario)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <FileText size={18} />
                  Documentos Profissionais
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">CTPS Número</p>
                      <p className="font-medium">{funcionario.dadosProfissionais.ctpsNumero}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CTPS Série</p>
                      <p className="font-medium">{funcionario.dadosProfissionais.ctpsSerie}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">PIS/PASEP</p>
                      <p className="font-medium">{funcionario.dadosProfissionais.pis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Título de Eleitor</p>
                      <p className="font-medium">{funcionario.dadosProfissionais.tituloEleitor || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {funcionario.cnh.numero && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <FileText size={18} />
                    CNH
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Número da CNH</p>
                        <p className="font-medium">{funcionario.cnh.numero}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Categoria</p>
                        <p className="font-medium">{funcionario.cnh.categoria}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Validade</p>
                        <p className="font-medium">{formatDate(funcionario.cnh.validade!)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  Dados Bancários
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Banco</p>
                      <p className="font-medium">{funcionario.dadosBancarios.banco}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Agência</p>
                        <p className="font-medium">{funcionario.dadosBancarios.agencia}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conta</p>
                        <p className="font-medium">{funcionario.dadosBancarios.conta}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Conta</p>
                      <p className="font-medium capitalize">{funcionario.dadosBancarios.tipoConta}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dependentes">
          <div className="bg-white rounded-lg border">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Users size={18} />
                Dependentes ({funcionario.dependentes.length})
              </h3>
              
              {funcionario.dependentes.length > 0 ? (
                <div className="space-y-6">
                  {funcionario.dependentes.map((dependente) => (
                    <Card key={dependente.id} className="bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{dependente.nome}</h4>
                            <p className="text-sm text-muted-foreground">{dependente.parentesco}</p>
                          </div>
                          <div className="mt-2 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                              <p className="font-medium">{formatDate(dependente.dataNascimento)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">CPF</p>
                              <p className="font-medium">{dependente.cpf || "Não informado"}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum dependente cadastrado.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <FileText size={18} />
              Documentos
            </h3>
            
            <div className="space-y-8">
              <div className="border-b pb-4">
                <h4 className="text-base font-medium mb-4">Documentos Pessoais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <Card className="bg-slate-50 flex flex-col items-center justify-center p-6 border-dashed">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">RG</p>
                    <p className="text-xs text-muted-foreground">Nenhum arquivo enviado</p>
                  </Card>
                  
                  <Card className="bg-slate-50 flex flex-col items-center justify-center p-6 border-dashed">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">CPF</p>
                    <p className="text-xs text-muted-foreground">Nenhum arquivo enviado</p>
                  </Card>
                  
                  <Card className="bg-slate-50 flex flex-col items-center justify-center p-6 border-dashed">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Comprovante de Residência</p>
                    <p className="text-xs text-muted-foreground">Nenhum arquivo enviado</p>
                  </Card>

                  <Card className="bg-slate-50 flex flex-col items-center justify-center p-6 border-dashed">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Foto</p>
                    <p className="text-xs text-muted-foreground">Nenhum arquivo enviado</p>
                  </Card>
                </div>
              </div>

              <div className="border-b pb-4">
                <h4 className="text-base font-medium mb-4">Documentos Profissionais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {funcionario.cnh.numero && (
                    <Card className="bg-slate-50 flex flex-col items-center justify-center p-6 border-dashed">
                      <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-medium">CNH</p>
                      <p className="text-xs text-muted-foreground">Nenhum arquivo enviado</p>
                    </Card>
                  )}
                  
                  <Card className="bg-slate-50 flex flex-col items-center justify-center p-6 border-dashed">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">CTPS</p>
                    <p className="text-xs text-muted-foreground">Nenhum arquivo enviado</p>
                  </Card>
                  
                  <Card className="bg-slate-50 flex flex-col items-center justify-center p-6 border-dashed">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Exame Médico</p>
                    <p className="text-xs text-muted-foreground">Nenhum arquivo enviado</p>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium mb-4">Outros Documentos</h4>
                <p className="text-muted-foreground">Nenhum documento adicional enviado.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário e todos os dados relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetalheFuncionario;
