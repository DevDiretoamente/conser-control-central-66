
export interface Obra {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'pavimentacao' | 'construcao' | 'reforma' | 'manutencao' | 'infraestrutura' | 'outros';
  status: 'planejamento' | 'aprovacao' | 'execucao' | 'pausada' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  
  // Informações do Cliente/Contratante
  clienteId?: string;
  clienteNome: string;
  contrato?: string;
  valorContrato: number;
  
  // Datas
  dataInicio?: string;
  dataFimPrevista: string;
  dataFimReal?: string;
  
  // Localização
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    coordenadas?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Equipe
  responsavelTecnico?: string;
  encarregado?: string;
  funcionariosAlocados: string[]; // IDs dos funcionários
  
  // Progresso
  progressoPercentual: number;
  etapas: EtapaObra[];
  
  // Recursos
  materiais: MaterialObra[];
  equipamentos: EquipamentoObra[];
  
  // Documentos
  documentos: DocumentoObra[];
  
  // Financeiro
  orcamentoTotal: number;
  gastoTotal: number;
  receitas: ReceitaObra[];
  despesas: DespesaObra[];
  
  // Observações e histórico
  observacoes?: string;
  historicoAlteracoes: HistoricoAlteracaoObra[];
  
  // Qualidade e segurança
  inspecoes: InspecaoObra[];
  ocorrencias: OcorrenciaObra[];
  
  // Metadados
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EtapaObra {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  dataInicioPrevista: string;
  dataFimPrevista: string;
  dataInicioReal?: string;
  dataFimReal?: string;
  progressoPercentual: number;
  responsavel?: string;
  dependencias: string[]; // IDs de outras etapas
  observacoes?: string;
}

export interface MaterialObra {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  quantidadePrevista: number;
  quantidadeUtilizada: number;
  precoUnitario: number;
  fornecedor?: string;
  dataEntrega?: string;
  observacoes?: string;
}

export interface EquipamentoObra {
  id: string;
  nome: string;
  tipo: string;
  marca?: string;
  modelo?: string;
  dataAlocacao: string;
  dataLiberacao?: string;
  operador?: string;
  horasUtilizadas: number;
  custoHora?: number;
  observacoes?: string;
}

export interface DocumentoObra {
  id: string;
  titulo: string;
  tipo: 'projeto' | 'licenca' | 'contrato' | 'ata' | 'medicao' | 'laudo' | 'certificado' | 'outros';
  arquivo?: string; // Base64 ou URL
  nomeArquivo?: string;
  dataDocumento: string;
  dataValidade?: string;
  responsavel?: string;
  observacoes?: string;
}

export interface ReceitaObra {
  id: string;
  descricao: string;
  valor: number;
  dataRecebimento: string;
  formaPagamento: string;
  observacoes?: string;
}

export interface DespesaObra {
  id: string;
  descricao: string;
  categoria: 'material' | 'mao_obra' | 'equipamento' | 'servicos' | 'combustivel' | 'outros';
  valor: number;
  dataPagamento: string;
  fornecedor?: string;
  numeroNota?: string;
  observacoes?: string;
}

export interface HistoricoAlteracaoObra {
  id: string;
  data: string;
  usuario: string;
  acao: string;
  descricao: string;
  camposAlterados: string[];
}

export interface InspecaoObra {
  id: string;
  data: string;
  tipo: 'qualidade' | 'seguranca' | 'ambiental' | 'tecnica';
  responsavel: string;
  status: 'aprovada' | 'reprovada' | 'condicional';
  observacoes: string;
  anexos: string[];
}

export interface OcorrenciaObra {
  id: string;
  data: string;
  tipo: 'acidente' | 'incidente' | 'desvio' | 'melhoria';
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  descricao: string;
  responsavel: string;
  providencias?: string;
  status: 'aberta' | 'em_andamento' | 'resolvida' | 'fechada';
  dataResolucao?: string;
}

export interface ObrasFilter {
  search?: string;
  tipo?: Obra['tipo'] | 'all';
  status?: Obra['status'] | 'all';
  prioridade?: Obra['prioridade'] | 'all';
  responsavel?: string;
  cidade?: string;
  dataInicioFrom?: string;
  dataInicioTo?: string;
}

export interface ObrasDashboardData {
  totalObras: number;
  obrasAndamento: number;
  obrasConcluidas: number;
  obrasAtrasadas: number;
  valorTotalContratos: number;
  valorExecutado: number;
  progressoMedio: number;
  obrasPorTipo: Record<string, number>;
  obrasPorStatus: Record<string, number>;
  evolucaoMensal: Array<{
    mes: string;
    iniciadas: number;
    concluidas: number;
    valor: number;
  }>;
  proximosVencimentos: Array<{
    obraId: string;
    obraNome: string;
    dataVencimento: string;
    diasRestantes: number;
  }>;
}
