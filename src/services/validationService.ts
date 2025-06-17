
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  type: 'documento' | 'certificacao' | 'funcionario';
  severity: 'error' | 'warning';
  validate: (entity: any, context?: any) => string | null;
}

const businessRules: BusinessRule[] = [
  {
    id: 'doc_data_vencimento_logica',
    name: 'Data de Vencimento Lógica',
    description: 'Data de vencimento deve ser posterior à data do documento',
    type: 'documento',
    severity: 'error',
    validate: (doc: DocumentoRH) => {
      if (doc.dataVencimento && doc.dataDocumento) {
        const dataDoc = new Date(doc.dataDocumento);
        const dataVenc = new Date(doc.dataVencimento);
        if (dataVenc <= dataDoc) {
          return 'Data de vencimento deve ser posterior à data do documento';
        }
      }
      return null;
    }
  },
  {
    id: 'doc_assinatura_logica',
    name: 'Data de Assinatura Lógica',
    description: 'Data de assinatura deve ser posterior ou igual à data do documento',
    type: 'documento',
    severity: 'error',
    validate: (doc: DocumentoRH) => {
      if (doc.dataAssinatura && doc.dataDocumento) {
        const dataDoc = new Date(doc.dataDocumento);
        const dataAss = new Date(doc.dataAssinatura);
        if (dataAss < dataDoc) {
          return 'Data de assinatura não pode ser anterior à data do documento';
        }
      }
      return null;
    }
  },
  {
    id: 'doc_assinatura_obrigatoria',
    name: 'Assinatura Obrigatória',
    description: 'Documentos contratuais devem ser assinados',
    type: 'documento',
    severity: 'warning',
    validate: (doc: DocumentoRH) => {
      const tiposObrigatorios = ['contrato', 'termo_confidencialidade', 'acordo_horario'];
      if (tiposObrigatorios.includes(doc.tipo) && !doc.assinado) {
        return 'Este tipo de documento geralmente requer assinatura';
      }
      return null;
    }
  },
  {
    id: 'cert_data_obtencao_logica',
    name: 'Data de Obtenção Lógica',
    description: 'Data de obtenção não pode ser futura',
    type: 'certificacao',
    severity: 'error',
    validate: (cert: Certificacao) => {
      const hoje = new Date();
      const dataObtencao = new Date(cert.dataObtencao);
      if (dataObtencao > hoje) {
        return 'Data de obtenção não pode ser futura';
      }
      return null;
    }
  },
  {
    id: 'cert_vencimento_logica',
    name: 'Data de Vencimento Lógica',
    description: 'Data de vencimento deve ser posterior à data de obtenção',
    type: 'certificacao',
    severity: 'error',
    validate: (cert: Certificacao) => {
      if (cert.dataVencimento) {
        const dataObt = new Date(cert.dataObtencao);
        const dataVenc = new Date(cert.dataVencimento);
        if (dataVenc <= dataObt) {
          return 'Data de vencimento deve ser posterior à data de obtenção';
        }
      }
      return null;
    }
  },
  {
    id: 'cert_renovacao_valida',
    name: 'Renovação Válida',
    description: 'Nova data de vencimento deve ser posterior à anterior',
    type: 'certificacao',
    severity: 'error',
    validate: (cert: Certificacao) => {
      if (cert.renovacoes && cert.renovacoes.length > 0) {
        for (const renovacao of cert.renovacoes) {
          const dataAnterior = new Date(renovacao.dataVencimentoAnterior);
          const dataNova = new Date(renovacao.novaDataVencimento);
          if (dataNova <= dataAnterior) {
            return 'Nova data de vencimento deve ser posterior à data anterior na renovação';
          }
        }
      }
      return null;
    }
  }
];

export const validationService = {
  validateDocument: (documento: DocumentoRH, funcionarios?: Funcionario[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const documentRules = businessRules.filter(rule => rule.type === 'documento');
    
    for (const rule of documentRules) {
      const result = rule.validate(documento, { funcionarios });
      if (result) {
        if (rule.severity === 'error') {
          errors.push(result);
        } else {
          warnings.push(result);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  },

  validateCertification: (certificacao: Certificacao, funcionarios?: Funcionario[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const certRules = businessRules.filter(rule => rule.type === 'certificacao');
    
    for (const rule of certRules) {
      const result = rule.validate(certificacao, { funcionarios });
      if (result) {
        if (rule.severity === 'error') {
          errors.push(result);
        } else {
          warnings.push(result);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  },

  validateEmployee: (funcionario: Funcionario): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações básicas do funcionário - acessar email e telefone do objeto contato
    if (!funcionario.contato?.email) {
      warnings.push('Funcionário sem email cadastrado');
    }

    if (!funcionario.contato?.telefone) {
      warnings.push('Funcionário sem telefone cadastrado');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  },

  getBusinessRules: (): BusinessRule[] => {
    return businessRules;
  },

  validateComplianceChecklist: (funcionarioId: string, documentos: DocumentoRH[], certificacoes: Certificacao[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Documentos obrigatórios
    const documentosObrigatorios = ['contrato', 'termo_confidencialidade'];
    const tiposPresentes = documentos.map(d => d.tipo);
    
    for (const tipoObrigatorio of documentosObrigatorios) {
      if (!tiposPresentes.includes(tipoObrigatorio as any)) {
        errors.push(`Documento obrigatório ausente: ${tipoObrigatorio.replace('_', ' ')}`);
      }
    }

    // Certificações de segurança
    const certSeguranca = certificacoes.filter(c => c.categoria === 'seguranca');
    if (certSeguranca.length === 0) {
      warnings.push('Nenhuma certificação de segurança encontrada');
    }

    // Documentos vencidos
    const hoje = new Date();
    const documentosVencidos = documentos.filter(d => 
      d.dataVencimento && new Date(d.dataVencimento) < hoje && d.status !== 'vencido'
    );
    
    if (documentosVencidos.length > 0) {
      errors.push(`${documentosVencidos.length} documento(s) vencido(s)`);
    }

    // Certificações vencidas
    const certificacoesVencidas = certificacoes.filter(c => 
      c.dataVencimento && new Date(c.dataVencimento) < hoje && c.status !== 'vencida'
    );
    
    if (certificacoesVencidas.length > 0) {
      errors.push(`${certificacoesVencidas.length} certificação(ões) vencida(s)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
};
