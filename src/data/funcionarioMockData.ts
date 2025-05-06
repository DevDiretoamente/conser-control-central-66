
import { Funcao, EPI, ExameMedico, Uniforme } from "@/types/funcionario";

export const mockEPIs: EPI[] = [
  { 
    id: "epi-1", 
    nome: "Capacete de Segurança", 
    ca: "31.469", 
    validade: 12, 
    descricao: "Proteção da cabeça contra impactos",
    obrigatorio: true 
  },
  { 
    id: "epi-2", 
    nome: "Luvas de Proteção", 
    ca: "32.034", 
    validade: 3, 
    descricao: "Proteção das mãos contra agentes cortantes",
    obrigatorio: true 
  },
  { 
    id: "epi-3", 
    nome: "Protetor Auricular", 
    ca: "29.710", 
    validade: 6, 
    descricao: "Proteção auditiva",
    obrigatorio: true 
  },
  { 
    id: "epi-4", 
    nome: "Óculos de Proteção", 
    ca: "36.719", 
    validade: 12, 
    descricao: "Proteção dos olhos contra partículas",
    obrigatorio: true 
  },
  { 
    id: "epi-5", 
    nome: "Máscara Respiratória", 
    ca: "38.811", 
    validade: 3, 
    descricao: "Proteção respiratória",
    obrigatorio: true 
  },
  { 
    id: "epi-6", 
    nome: "Botina de Segurança", 
    ca: "42.554", 
    validade: 12, 
    descricao: "Proteção dos pés",
    obrigatorio: true 
  },
  { 
    id: "epi-7", 
    nome: "Cinto de Segurança", 
    ca: "27.397", 
    validade: 12, 
    descricao: "Proteção contra quedas",
    obrigatorio: false 
  },
  { 
    id: "epi-8", 
    nome: "Protetor Solar", 
    ca: "38.044", 
    validade: 3, 
    descricao: "Proteção contra raios UV",
    obrigatorio: true 
  },
];

export const mockExamesMedicos: ExameMedico[] = [
  { 
    id: "exam-1", 
    nome: "Exame Clínico Ocupacional", 
    tipo: "admissional", 
    descricao: "Avaliação clínica geral" 
  },
  { 
    id: "exam-2", 
    nome: "Audiometria", 
    tipo: "admissional", 
    periodicidade: 12, 
    descricao: "Avaliação da capacidade auditiva" 
  },
  { 
    id: "exam-3", 
    nome: "Espirometria", 
    tipo: "admissional", 
    periodicidade: 12, 
    descricao: "Avaliação da função pulmonar" 
  },
  { 
    id: "exam-4", 
    nome: "Acuidade Visual", 
    tipo: "admissional", 
    periodicidade: 12, 
    descricao: "Avaliação da visão" 
  },
  { 
    id: "exam-5", 
    nome: "Eletrocardiograma", 
    tipo: "admissional", 
    periodicidade: 12, 
    descricao: "Avaliação cardíaca" 
  },
  { 
    id: "exam-6", 
    nome: "Glicemia", 
    tipo: "periodico", 
    periodicidade: 12, 
    descricao: "Avaliação dos níveis de açúcar no sangue" 
  },
  { 
    id: "exam-7", 
    nome: "Raio-X Coluna Lombar", 
    tipo: "mudancaFuncao", 
    descricao: "Avaliação da coluna lombar"
  },
  { 
    id: "exam-8", 
    nome: "Exame Toxicológico", 
    tipo: "admissional", 
    periodicidade: 24, 
    descricao: "Detecção de substâncias" 
  },
];

export const mockUniformes: Uniforme[] = [
  { id: "unif-1", tipo: "Camisa", descricao: "Camisa manga longa com proteção UV" },
  { id: "unif-2", tipo: "Camisa", descricao: "Camisa manga curta com faixas refletivas" },
  { id: "unif-3", tipo: "Calça", descricao: "Calça com reforço nos joelhos" },
  { id: "unif-4", tipo: "Calçado", descricao: "Botina com bico de aço" },
  { id: "unif-5", tipo: "Calçado", descricao: "Bota de borracha" },
  { id: "unif-6", tipo: "Calça", descricao: "Calça impermeável" },
];

export const mockFuncoes: Funcao[] = [
  {
    id: "funcao-1",
    nome: "Operador de Máquinas",
    descricao: "Responsável pela operação de máquinas pesadas",
    atribuicoes: [
      "Operar máquinas pesadas seguindo normas de segurança",
      "Realizar verificações diárias de equipamentos",
      "Reportar problemas mecânicos",
      "Seguir orientações do supervisor",
      "Manter a cabine limpa e organizada"
    ],
    epis: [mockEPIs[0], mockEPIs[1], mockEPIs[2], mockEPIs[3], mockEPIs[5], mockEPIs[7]],
    examesNecessarios: [
      mockExamesMedicos[0], mockExamesMedicos[1], mockExamesMedicos[3], 
      mockExamesMedicos[4], mockExamesMedicos[7]
    ],
    uniformes: [mockUniformes[0], mockUniformes[2], mockUniformes[3]]
  },
  {
    id: "funcao-2",
    nome: "Motorista",
    descricao: "Condução de veículos para transporte de materiais e pessoas",
    atribuicoes: [
      "Dirigir veículos leves e pesados",
      "Realizar o transporte de materiais e equipamentos",
      "Efetuar verificações básicas do veículo",
      "Manter a documentação e registros em ordem",
      "Seguir normas de trânsito e segurança"
    ],
    epis: [mockEPIs[5], mockEPIs[7]],
    examesNecessarios: [
      mockExamesMedicos[0], mockExamesMedicos[3], mockExamesMedicos[4], 
      mockExamesMedicos[7], mockExamesMedicos[5]
    ],
    uniformes: [mockUniformes[1], mockUniformes[2], mockUniformes[3]]
  },
  {
    id: "funcao-3",
    nome: "Auxiliar de Obras",
    descricao: "Suporte às atividades de construção e manutenção",
    atribuicoes: [
      "Auxiliar na execução de serviços de construção e manutenção",
      "Carregar e descarregar materiais",
      "Preparar misturas de materiais conforme orientação",
      "Manter o local de trabalho limpo e organizado",
      "Utilizar corretamente ferramentas e equipamentos"
    ],
    epis: [mockEPIs[0], mockEPIs[1], mockEPIs[3], mockEPIs[4], mockEPIs[5], mockEPIs[7]],
    examesNecessarios: [
      mockExamesMedicos[0], mockExamesMedicos[2], mockExamesMedicos[3], 
      mockExamesMedicos[6]
    ],
    uniformes: [mockUniformes[0], mockUniformes[2], mockUniformes[3]]
  },
  {
    id: "funcao-4",
    nome: "Engenheiro Civil",
    descricao: "Responsável pelo planejamento e supervisão de obras",
    atribuicoes: [
      "Elaborar projetos de engenharia civil",
      "Supervisionar e fiscalizar obras",
      "Realizar vistorias técnicas",
      "Elaborar relatórios de acompanhamento",
      "Garantir o cumprimento das normas técnicas"
    ],
    epis: [mockEPIs[0], mockEPIs[3], mockEPIs[5], mockEPIs[7]],
    examesNecessarios: [
      mockExamesMedicos[0], mockExamesMedicos[3], mockExamesMedicos[5]
    ],
    uniformes: [mockUniformes[1], mockUniformes[2], mockUniformes[3]]
  },
  {
    id: "funcao-5",
    nome: "Auxiliar Administrativo",
    descricao: "Suporte administrativo às operações da empresa",
    atribuicoes: [
      "Organizar e arquivar documentos",
      "Atender chamadas telefônicas",
      "Auxiliar na elaboração de relatórios",
      "Controlar entrada e saída de materiais",
      "Apoiar demais áreas administrativas"
    ],
    epis: [],
    examesNecessarios: [
      mockExamesMedicos[0], mockExamesMedicos[3], mockExamesMedicos[5]
    ],
    uniformes: [mockUniformes[1], mockUniformes[2]]
  }
];
