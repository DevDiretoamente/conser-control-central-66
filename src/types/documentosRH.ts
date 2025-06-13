
export interface DocumentoRH {
  id: string;
  funcionarioId: string;
  tipo: 'contrato' | 'termo_confidencialidade' | 'acordo_horario' | 'advertencia' | 'elogio' | 'avaliacao' | 'ferias' | 'atestado' | 'licenca' | 'rescisao' | 'outros';
  titulo: string;
  descricao: string;
  dataDocumento: string;
  dataVencimento?: string;
  status: 'ativo' | 'vencido' | 'arquivado';
  arquivo?: string; // Base64 do PDF
  nomeArquivo?: string;
  observacoes?: string;
  assinado: boolean;
  dataAssinatura?: string;
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Certificacao {
  id: string;
  funcionarioId: string;
  nome: string;
  entidadeCertificadora: string;
  dataObtencao: string;
  dataVencimento?: string;
  numero?: string;
  categoria: 'tecnica' | 'seguranca' | 'qualidade' | 'gestao' | 'idioma' | 'outros';
  status: 'valida' | 'vencida' | 'em_renovacao';
  arquivo?: string; // Base64 do certificado
  nomeArquivo?: string;
  observacoes?: string;
  renovacoes: RenovacaoCertificacao[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface RenovacaoCertificacao {
  id: string;
  dataRenovacao: string;
  dataVencimentoAnterior: string;
  novaDataVencimento: string;
  observacoes?: string;
}

export interface DocumentoRHFilter {
  search?: string;
  funcionarioId?: string;
  tipo?: DocumentoRH['tipo'] | 'all';
  status?: DocumentoRH['status'] | 'all';
  dataFrom?: string;
  dataTo?: string;
  assinado?: boolean;
}

export interface CertificacaoFilter {
  search?: string;
  funcionarioId?: string;
  categoria?: Certificacao['categoria'] | 'all';
  status?: Certificacao['status'] | 'all';
  entidade?: string;
  vencimentoProximo?: boolean;
}
