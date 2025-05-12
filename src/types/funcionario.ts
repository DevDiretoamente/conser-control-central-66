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

// Novo tipo para representar os preços por clínica
export interface PrecoClinica {
  clinicaId: string;
  clinicaNome: string;
  valor: number;
}

export interface ExameMedico {
  id: string;
  nome: string;
  tipos: Array<'admissional' | 'periodico' | 'mudancaFuncao' | 'retornoTrabalho' | 'demissional'>;
  periodicidade?: number; // em meses (para exames periódicos)
  descricao?: string;
  precosPorClinica: PrecoClinica[]; // Preços diferentes por clínica
  orientacoes?: string; // Orientações de preparação (jejum, etc.)
  clinicasDisponiveis?: string[]; // Lista de clínicas que realizam este exame
  ativo: boolean;
}

// New interface to map exam types to required exams
export interface ExamesPorTipo {
  admissional: ExameMedico[];
  periodico: ExameMedico[];
  mudancaFuncao: ExameMedico[];
  retornoTrabalho: ExameMedico[];
  demissional: ExameMedico[];
}

export interface Funcao {
  id: string;
  nome: string;
  descricao: string;
  setorId: string; // Referência ao setor ao qual a função pertence
  atribuicoes: string[]; // Atribuições conforme PGR
  epis: EPI[];
  examesNecessarios: ExamesPorTipo; // Changed from ExameMedico[] to ExamesPorTipo
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
  tipoSelecionado: string; // Changed from optional to required - the exam type must be specified
  clinicaId?: string; // Id da clínica onde foi realizado
  dataRealizado: Date;
  dataValidade: Date;
  resultado: string;
  documento?: File | null;
  observacoes?: string; // Campo adicional para observações
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

// The FuncionarioCartaoPonto definition is in the .d.ts file but is missing in the .ts file
// Let's add it to the main funcionario.ts file

// New interface specifically for employee data in the time card system
export interface FuncionarioCartaoPonto {
  id: string;  // Can be the same as user id for linked accounts
  nome: string;
  cargo: string;
  setor: string;
  matricula?: string;
  dataAdmissao: Date | string;
  horarioEntrada: string; // Default entry time
  horarioSaida: string;   // Default exit time
  temIntervalo: boolean;  // Whether employee has break time
  horarioInicioIntervalo?: string;
  horarioFimIntervalo?: string;
  cargaHorariaSemanal: number; // Weekly hours
  diasTrabalho: number[];  // 0 = Sunday, 6 = Saturday
  ativo: boolean;
  userId?: string;  // Optional reference to user account
}
