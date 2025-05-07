

import { Funcao, EPI, ExameMedico, Uniforme, Setor } from "@/types/funcionario";

// New mock data for Sectors
export const mockSetores: Setor[] = [
  {
    id: "setor-1",
    nome: "Operacional",
    descricao: "Setor responsável pela execução das obras",
    ativo: true
  },
  {
    id: "setor-2",
    nome: "Administrativo",
    descricao: "Setor responsável pelas atividades administrativas",
    ativo: true
  },
  {
    id: "setor-3",
    nome: "Transporte",
    descricao: "Setor responsável pelo transporte de materiais e pessoal",
    ativo: true
  },
  {
    id: "setor-4",
    nome: "Engenharia",
    descricao: "Setor responsável pelos projetos e supervisão técnica",
    ativo: true
  }
];

export const mockEPIs: EPI[] = [
  { 
    id: "epi-1", 
    nome: "Capacete de Segurança", 
    ca: "31.469", 
    validade: 12, 
    descricao: "Proteção da cabeça contra impactos",
    obrigatorio: true,
    instrucoes: "Ajustar corretamente à cabeça. Inspecionar regularmente quanto a rachaduras.",
    ativo: true
  },
  { 
    id: "epi-2", 
    nome: "Luvas de Proteção", 
    ca: "32.034", 
    validade: 3, 
    descricao: "Proteção das mãos contra agentes cortantes",
    obrigatorio: true,
    instrucoes: "Verificar integridade antes do uso. Não utilizar com óleos ou produtos químicos.",
    ativo: true 
  },
  { 
    id: "epi-3", 
    nome: "Protetor Auricular", 
    ca: "29.710", 
    validade: 6, 
    descricao: "Proteção auditiva",
    obrigatorio: true,
    instrucoes: "Inserir corretamente no canal auditivo. Manter limpo e seco após uso.",
    ativo: true
  },
  { 
    id: "epi-4", 
    nome: "Óculos de Proteção", 
    ca: "36.719", 
    validade: 12, 
    descricao: "Proteção dos olhos contra partículas",
    obrigatorio: true,
    instrucoes: "Limpar regularmente com pano macio. Guardar em local protegido.",
    ativo: true 
  },
  { 
    id: "epi-5", 
    nome: "Máscara Respiratória", 
    ca: "38.811", 
    validade: 3, 
    descricao: "Proteção respiratória",
    obrigatorio: true,
    instrucoes: "Verificar vedação antes do uso. Trocar filtros conforme saturação.",
    ativo: true
  },
  { 
    id: "epi-6", 
    nome: "Botina de Segurança", 
    ca: "42.554", 
    validade: 12, 
    descricao: "Proteção dos pés",
    obrigatorio: true,
    instrucoes: "Manter limpa e seca. Verificar solado regularmente.",
    ativo: true 
  },
  { 
    id: "epi-7", 
    nome: "Cinto de Segurança", 
    ca: "27.397", 
    validade: 12, 
    descricao: "Proteção contra quedas",
    obrigatorio: false,
    instrucoes: "Verificar costuras e fivelas antes do uso. Nunca utilizar após uma queda.",
    ativo: true
  },
  { 
    id: "epi-8", 
    nome: "Protetor Solar", 
    ca: "38.044", 
    validade: 3, 
    descricao: "Proteção contra raios UV",
    obrigatorio: true,
    instrucoes: "Aplicar 30 minutos antes da exposição ao sol. Reaplicar a cada 2 horas.",
    ativo: true 
  },
];

export const mockExamesMedicos: ExameMedico[] = [
  { 
    id: "exam-1", 
    nome: "Exame Clínico Ocupacional", 
    tipos: ["admissional"], 
    descricao: "Avaliação clínica geral",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 120 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 110 }
    ],
    orientacoes: "Não é necessário jejum. Levar documentos pessoais e carteira de vacinação.",
    clinicasDisponiveis: ["Clínica Saúde", "MedOcupacional"], 
    ativo: true
  },
  { 
    id: "exam-2", 
    nome: "Audiometria", 
    tipos: ["admissional"], 
    periodicidade: 12, 
    descricao: "Avaliação da capacidade auditiva",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 80 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 75 }
    ],
    orientacoes: "Evitar exposição a ruídos intensos nas 14h que antecedem o exame.",
    clinicasDisponiveis: ["AudioClin", "Clínica Saúde"],
    ativo: true
  },
  { 
    id: "exam-3", 
    nome: "Espirometria", 
    tipos: ["periodico"], 
    periodicidade: 12, 
    descricao: "Avaliação da função pulmonar",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 90 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 85 }
    ],
    orientacoes: "Evitar fumar nas 2h anteriores ao exame. Não realizar atividade física intensa no dia.",
    clinicasDisponiveis: ["PulmoClinic", "Clínica Saúde"],
    ativo: true
  },
  { 
    id: "exam-4", 
    nome: "Acuidade Visual", 
    tipos: ["admissional"], 
    periodicidade: 12, 
    descricao: "Avaliação da visão",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 70 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 65 }
    ],
    orientacoes: "Levar óculos ou lentes se fizer uso.",
    clinicasDisponiveis: ["VisãoPlena", "OftalmoClin"],
    ativo: true
  },
  { 
    id: "exam-5", 
    nome: "Eletrocardiograma", 
    tipos: ["admissional"], 
    periodicidade: 12, 
    descricao: "Avaliação cardíaca",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 130 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 120 }
    ],
    orientacoes: "Não é necessário jejum. Evitar cafeína nas 3h anteriores.",
    clinicasDisponiveis: ["CardioCenter", "Clínica Saúde"],
    ativo: true
  },
  { 
    id: "exam-6", 
    nome: "Glicemia", 
    tipos: ["periodico"], 
    periodicidade: 12, 
    descricao: "Avaliação dos níveis de açúcar no sangue",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 40 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 35 }
    ],
    orientacoes: "Jejum de 8-12 horas. Pode tomar água.",
    clinicasDisponiveis: ["LabCheck", "MedOcupacional"],
    ativo: true
  },
  { 
    id: "exam-7", 
    nome: "Raio-X Coluna Lombar", 
    tipos: ["mudancaFuncao"], 
    descricao: "Avaliação da coluna lombar",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 150 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 145 }
    ],
    orientacoes: "Retirar objetos metálicos antes do exame. Não é necessário jejum.",
    clinicasDisponiveis: ["ImagemDiag", "RaioXExpress"],
    ativo: true
  },
  { 
    id: "exam-8", 
    nome: "Exame Toxicológico", 
    tipos: ["admissional"], 
    periodicidade: 24, 
    descricao: "Detecção de substâncias",
    precosPorClinica: [
      { clinicaId: "1", clinicaNome: "RP Medicina e Segurança do Trabalho", valor: 280 },
      { clinicaId: "2", clinicaNome: "Sindiconvenios", valor: 260 }
    ],
    orientacoes: "Coleta de cabelo ou pelo. Não requer preparação especial.",
    clinicasDisponiveis: ["LabCheck", "ToxicoLab"],
    ativo: true
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
    setorId: "setor-1", // Operacional
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
    uniformes: [mockUniformes[0], mockUniformes[2], mockUniformes[3]],
    ativo: true
  },
  {
    id: "funcao-2",
    nome: "Motorista",
    descricao: "Condução de veículos para transporte de materiais e pessoas",
    setorId: "setor-3", // Transporte
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
    uniformes: [mockUniformes[1], mockUniformes[2], mockUniformes[3]],
    ativo: true
  },
  {
    id: "funcao-3",
    nome: "Auxiliar de Obras",
    descricao: "Suporte às atividades de construção e manutenção",
    setorId: "setor-1", // Operacional
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
    uniformes: [mockUniformes[0], mockUniformes[2], mockUniformes[3]],
    ativo: true
  },
  {
    id: "funcao-4",
    nome: "Engenheiro Civil",
    descricao: "Responsável pelo planejamento e supervisão de obras",
    setorId: "setor-4", // Engenharia
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
    uniformes: [mockUniformes[1], mockUniformes[2], mockUniformes[3]],
    ativo: true
  },
  {
    id: "funcao-5",
    nome: "Auxiliar Administrativo",
    descricao: "Suporte administrativo às operações da empresa",
    setorId: "setor-2", // Administrativo
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
    uniformes: [mockUniformes[1], mockUniformes[2]],
    ativo: true
  }
];
