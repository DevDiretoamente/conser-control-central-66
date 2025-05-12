
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Funcionario, ExameRealizado } from '@/types/funcionario';
import GerenciamentoExamesMedicos from '@/components/exames/GerenciamentoExamesMedicos';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isPast, isFuture, addMonths } from 'date-fns';

// Mock service function to get a list of employees with pending exams
const getMockEmployeesWithPendingExams = () => {
  return [
    {
      id: '1',
      name: 'João da Silva',
      cargo: 'Motorista',
      nextExamDate: addMonths(new Date(), -1), // Exam 1 month overdue
      examType: 'Periódico Anual',
      status: 'atrasado'
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      cargo: 'Operadora de Máquinas',
      nextExamDate: addMonths(new Date(), 1), // Exam in 1 month
      examType: 'Periódico Anual',
      status: 'agendado'
    },
    {
      id: '3',
      name: 'Carlos Santos',
      cargo: 'Engenheiro',
      nextExamDate: addMonths(new Date(), 0.5), // Exam in 15 days
      examType: 'Periódico Bienal',
      status: 'agendado'
    }
  ];
};

// This would be replaced with an API call in a real application
const getMockFuncionarioById = (id: string): Funcionario | undefined => {
  // Simplified mock - in a real app, this would fetch from an API
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
    dependentes: [],
    tamanhoUniforme: {
      camisa: 'M',
      calca: 'M',
      calcado: 42
    },
    episEntregues: [],
    uniformesEntregues: [],
    examesRealizados: [
      {
        exameId: '1',
        tipoSelecionado: 'admissional',
        dataRealizado: new Date('2022-01-05'),
        dataValidade: new Date('2023-01-05'),
        resultado: 'Apto',
        clinicaId: '1',
        documento: null,
        observacoes: ''
      }
    ],
    documentosGerados: []
  };
};

const ExamesMedicosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [funcionario, setFuncionario] = useState<Funcionario | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [pendingExams, setPendingExams] = useState<any[]>([]);

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
      setLoading(false);
    } else {
      // If no ID, we're on the general exams page
      setPendingExams(getMockEmployeesWithPendingExams());
      setLoading(false);
    }
  }, [id, navigate]);

  const handleSaveExames = (exames: ExameRealizado[]) => {
    if (funcionario) {
      const updatedFuncionario = {
        ...funcionario,
        examesRealizados: exames
      };
      setFuncionario(updatedFuncionario);
      toast.success('Exames médicos atualizados com sucesso!');
    }
  };

  const handleViewEmployeeExams = (employeeId: string) => {
    navigate(`/funcionarios/${employeeId}/exames-medicos`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  // Render specific employee's exams
  if (id && funcionario) {
    return (
      <div className="w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/funcionarios">Funcionários</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/funcionarios/${id}`}>{funcionario.dadosPessoais.nome}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Exames Médicos</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(`/funcionarios/${id}`)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Exames Médicos</h1>
          <p className="text-muted-foreground">
            Gerencie os exames médicos ocupacionais do funcionário: {funcionario.dadosPessoais.nome}
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <GerenciamentoExamesMedicos 
            funcionario={funcionario}
            onSave={handleSaveExames}
          />
        </ScrollArea>
      </div>
    );
  }

  // Render the general exams page with a list of employees with pending exams
  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/funcionarios">Funcionários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Exames Médicos</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Controle de Exames Médicos</h1>
        <p className="text-muted-foreground">
          Gerencie os exames médicos ocupacionais de todos os funcionários
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Exames Pendentes e Próximos</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Tipo de Exame</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingExams.length > 0 ? (
                pendingExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{exam.cargo}</TableCell>
                    <TableCell>{exam.examType}</TableCell>
                    <TableCell>{format(exam.nextExamDate, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      {exam.status === 'atrasado' ? (
                        <div className="flex items-center text-red-500">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>Atrasado</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Agendado</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewEmployeeExams(exam.id)}
                      >
                        Gerenciar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                      <p className="text-lg font-medium">Todos os exames estão em dia</p>
                      <p className="text-muted-foreground">Não há exames pendentes ou próximos no momento</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamesMedicosPage;
