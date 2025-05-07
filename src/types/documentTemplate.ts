
export interface DocumentVariable {
  name: string;
  key: string;
  description: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
}

export const DOCUMENT_VARIABLES: DocumentVariable[] = [
  { name: "Nome do Funcionário", key: "{NOME}", description: "Nome completo do funcionário" },
  { name: "CPF", key: "{CPF}", description: "CPF do funcionário" },
  { name: "RG", key: "{RG}", description: "RG do funcionário" },
  { name: "Data de Admissão", key: "{DATA_ADMISSAO}", description: "Data de admissão do funcionário" },
  { name: "Cargo", key: "{CARGO}", description: "Cargo do funcionário" },
  { name: "Salário", key: "{SALARIO}", description: "Salário do funcionário" },
  { name: "Endereço", key: "{ENDERECO}", description: "Endereço completo do funcionário" },
  { name: "Data Atual", key: "{DATA_ATUAL}", description: "Data atual" },
  { name: "Nome da Empresa", key: "{EMPRESA}", description: "Nome da empresa" }
];

export const DOCUMENT_CATEGORIES = [
  "Admissional", 
  "Declarações", 
  "Alojamento", 
  "Seguro de Vida", 
  "Benefícios", 
  "Outros"
];
