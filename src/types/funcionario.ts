
export interface Dependente {
  id?: string;
  nome: string;
  dataNascimento: Date;
  parentesco: string; // Filho(a), Cônjuge, etc.
  cpf?: string;
  documentos: {
    certidaoNascimento?: File | null;
    outrosDocumentos?: File[] | null;
  };
}

// New Setor interface
export interface Setor {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface EPI {
  id: string;
  nome: string;
  ca: string; // Certificado de Aprovação
  validade: number; // em meses
  descricao?: string;
  obrigatorio: boolean;
  instrucoes?: string; // Orientações de uso
  imagem?: string; // URL da imagem do EPI
  ativo: boolean;
}

export interface Uniforme {
  id: string;
  tipo: string; // Camisa, Calça, Calçado
  descricao: string;
}

export interface ExameMedico {
  id: string;
  nome: string;
  tipo: 'admissional' | 'periodico' | 'mudancaFuncao' | 'retornoTrabalho' | 'demissional';
  periodicidade?: number; // em meses (para exames periódicos)
  descricao?: string;
  valor?: number; // Custo estimado do exame
  orientacoes?: string; // Orientações de preparação (jejum, etc.)
  clinicasRecomendadas?: string[]; // Lista de clínicas recomendadas
  ativo: boolean;
}

export interface Funcao {
  id: string;
  nome: string;
  descricao: string;
  setorId: string; // Referência ao setor ao qual a função pertence
  atribuicoes: string[]; // Atribuições conforme PGR
  epis: EPI[];
  examesNecessarios: ExameMedico[];
  uniformes: Uniforme[];
  ativo: boolean;
}

export interface EntregaEPI {
  epiId: string;
  dataEntrega: Date;
  dataVencimento?: Date;
  assinado: boolean;
  dataDevolucao?: Date;
}

export interface EntregaUniforme {
  uniformeId: string;
  tamanho: string; // P, M, G, GG
  dataEntrega: Date;
  assinado: boolean;
  dataDevolucao?: Date;
}

export interface TamanhoUniforme {
  camisa: string;
  calca: string;
  calcado: number;
}

export interface ExameRealizado {
  exameId: string;
  dataRealizado: Date;
  dataValidade: Date;
  resultado: string;
  documento?: File | null;
}

// New interface for generated documents
export interface DocumentoGerado {
  id: string;
  titulo: string;
  categoria: string;
  dataGeracao: Date;
  dataAssinatura?: Date;
  status: 'gerado' | 'assinado' | 'pendente' | 'arquivado';
  arquivoPdf?: string; // URL or path to the stored PDF
  assinaturaFuncionario?: string; // URL or path to signature image
  assinaturaEmpresa?: string; // URL or path to signature image
  observacoes?: string;
}

export interface Funcionario {
  id?: string;
  dadosPessoais: {
    nome: string;
    cpf: string;
    rg: string;
    dataNascimento: Date;
    escolaridade: string;
    estadoCivil: string;
    nomeConjuge?: string;
    telefoneConjuge?: string;
    contatoEmergenciaNome: string;
    contatoEmergenciaTelefone: string;
  };
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  contato: {
    telefone: string;
    email?: string;
  };
  dadosProfissionais: {
    funcaoId?: string;
    cargo: string;
    salario: number;
    dataAdmissao: Date;
    ctpsNumero: string;
    ctpsSerie: string;
    pis: string;
    tituloEleitor?: string;
    certificadoReservista?: string;
  };
  cnh: {
    numero?: string;
    categoria?: string;
    validade?: Date;
  };
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
  documentos: {
    rgFile: File | null;
    cpfFile: File | null;
    comprovanteResidencia: File | null;
    fotoFile: File | null;
    cnhFile?: File | null;
    ctpsFile?: File | null; // Changed from 'ctsFile' to 'ctpsFile' to match usage in the form
    exameMedicoFile?: File | null;
    outrosDocumentos: File[] | null;
  };
  dependentes: Dependente[];
  tamanhoUniforme: TamanhoUniforme;
  episEntregues: EntregaEPI[];
  uniformesEntregues: EntregaUniforme[];
  examesRealizados: ExameRealizado[];
  // New property to store generated documents
  documentosGerados: DocumentoGerado[];
}
