
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Funcionario, ExameRealizado } from '@/types/funcionario';
import GerenciamentoExamesMedicos from '@/components/exames/GerenciamentoExamesMedicos';

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
  const [funcionario, setFuncionario] = useState<Funcionario | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!funcionario) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Funcionário não encontrado.</p>
      </div>
    );
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
};

export default ExamesMedicosPage;
