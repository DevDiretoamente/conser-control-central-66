
import { 
  RegistroPonto,
  CartaoPonto,
  ResumoHoras,
  calcularMinutos,
  formatarMinutosParaHora,
  diaDaSemana,
  isFimDeSemana,
  getHorarioSaidaRegular
} from '@/types/cartaoPonto';
import { User } from '@/types/auth';

// Mock storage para cartões de ponto (em produção, isso seria um serviço de API)
let cartoesPonto: CartaoPonto[] = [];
let proximoIdCartao = 1;
let proximoIdRegistro = 1;

// Calcular horas normais e extras para um registro de ponto
export const calcularHorasPonto = (registro: RegistroPonto): RegistroPonto => {
  const calculado = { ...registro };
  const data = registro.data;
  const diaSemana = diaDaSemana(data);

  // Não calcular se não for dia normal ou se faltar informações essenciais
  if (registro.statusDia !== 'normal' || !registro.horaEntradaManha || !registro.horaSaidaTarde) {
    calculado.totalHorasNormais = 0;
    calculado.totalHorasExtras50 = 0;
    calculado.totalHorasExtras80 = 0;
    calculado.totalHorasExtras110 = 0;
    calculado.totalHorasNoturno = 0;
    calculado.temDireitoLanche = false;
    return calculado;
  }

  // Horários padrão
  const entradaPadrao = '07:00';
  const saidaAlmocoPadrao = '12:00';
  const retornoAlmocoPadrao = '13:00';
  const saidaTardePadrao = getHorarioSaidaRegular(data);

  let totalMinNormal = 0;
  let totalMinExtra50 = 0;
  let totalMinExtra80 = 0;
  let totalMinExtra110 = 0;
  let totalMinNoturno = 0;

  // Converter horários para minutos
  const minEntradaManha = calcularMinutos(registro.horaEntradaManha);
  const minEntradaExtra = registro.entradaExtra ? calcularMinutos(registro.entradaExtra) : 0;
  const minSaidaAlmoco = registro.horaSaidaAlmoco ? calcularMinutos(registro.horaSaidaAlmoco) : calcularMinutos(saidaAlmocoPadrao);
  const minRetornoAlmoco = registro.horaRetornoAlmoco ? calcularMinutos(registro.horaRetornoAlmoco) : calcularMinutos(retornoAlmocoPadrao);
  const minSaidaTarde = calcularMinutos(registro.horaSaidaTarde);
  const minSaidaExtra = registro.horaSaidaExtra ? calcularMinutos(registro.horaSaidaExtra) : 0;

  const minEntradaPadrao = calcularMinutos(entradaPadrao);
  const minSaidaTardePadrao = calcularMinutos(saidaTardePadrao);

  // É domingo ou feriado?
  const ehDomingoOuFeriado = diaSemana === 0 || registro.statusDia === 'feriado';

  // É sábado?
  const ehSabado = diaSemana === 6;

  // Cálculo conforme regras
  if (ehDomingoOuFeriado) {
    // Tudo é hora extra 110% em domingos e feriados
    totalMinExtra110 = (minSaidaAlmoco - minEntradaManha) + (minSaidaTarde - minRetornoAlmoco);
    if (minSaidaExtra > 0) {
      totalMinExtra110 += (minSaidaExtra - minSaidaTarde);
    }
  } else if (ehSabado) {
    // Tudo é hora extra 50% em sábados
    totalMinExtra50 = (minSaidaAlmoco - minEntradaManha) + (minSaidaTarde - minRetornoAlmoco);
    if (minSaidaExtra > 0) {
      totalMinExtra50 += (minSaidaExtra - minSaidaTarde);
    }
  } else {
    // Dias normais (segunda a sexta)
    
    // Manhã - hora extra antes do horário
    if (minEntradaManha < minEntradaPadrao) {
      totalMinExtra50 += (minEntradaPadrao - minEntradaManha);
    }

    // Manhã - hora normal
    totalMinNormal += (minSaidaAlmoco - Math.max(minEntradaManha, minEntradaPadrao));

    // Retorno do almoço antecipado (hora extra)
    if (minRetornoAlmoco < calcularMinutos(retornoAlmocoPadrao)) {
      totalMinExtra50 += (calcularMinutos(retornoAlmocoPadrao) - minRetornoAlmoco);
    }

    // Tarde - hora normal
    totalMinNormal += (Math.min(minSaidaTarde, minSaidaTardePadrao) - Math.max(minRetornoAlmoco, calcularMinutos(retornoAlmocoPadrao)));

    // Tarde - hora extra após horário normal
    if (minSaidaTarde > minSaidaTardePadrao) {
      totalMinExtra50 += (minSaidaTarde - minSaidaTardePadrao);
    }

    // Hora extra após o expediente
    if (minSaidaExtra > 0 && minSaidaExtra > minSaidaTarde) {
      totalMinExtra50 += (minSaidaExtra - minSaidaTarde);
    }
  }

  // Verificar horas noturnas (22:00 - 05:00)
  // Simplificação: apenas verificamos se os horários estão na faixa noturna
  const verificarHorasNoturnas = (horaInicio: string, horaFim: string) => {
    if (!horaInicio || !horaFim) return 0;
    
    const inicioMin = calcularMinutos(horaInicio);
    const fimMin = calcularMinutos(horaFim);
    
    // Início após 22:00 ou antes das 5:00
    const inicioNoturno = inicioMin >= 22 * 60 || inicioMin < 5 * 60;
    
    // Fim após 22:00 ou antes das 5:00
    const fimNoturno = fimMin >= 22 * 60 || fimMin < 5 * 60;
    
    // Se ambos estão dentro do período noturno
    if (inicioNoturno && fimNoturno) {
      return fimMin - inicioMin;
    }
    
    // Se apenas o início está no período noturno (até 5:00)
    if (inicioNoturno && inicioMin < 5 * 60) {
      return 5 * 60 - inicioMin;
    }
    
    // Se apenas o fim está no período noturno (após 22:00)
    if (fimNoturno && fimMin >= 22 * 60) {
      return fimMin - 22 * 60;
    }
    
    return 0;
  };

  // Calcular horas noturnas
  if (registro.entradaExtra) {
    totalMinNoturno += verificarHorasNoturnas(registro.entradaExtra, registro.horaEntradaManha);
  }
  
  if (registro.horaSaidaExtra) {
    totalMinNoturno += verificarHorasNoturnas(registro.horaSaidaTarde, registro.horaSaidaExtra);
  }

  // Direito a lanche (se total de horas extras > 1h)
  const temDireitoLanche = (totalMinExtra50 + totalMinExtra80 + totalMinExtra110) > 60;

  // Atualizar registro calculado
  calculado.totalHorasNormais = totalMinNormal;
  calculado.totalHorasExtras50 = totalMinExtra50;
  calculado.totalHorasExtras80 = totalMinExtra80;
  calculado.totalHorasExtras110 = totalMinExtra110;
  calculado.totalHorasNoturno = totalMinNoturno;
  calculado.temDireitoLanche = temDireitoLanche;

  return calculado;
};

// Função para calcular os totais do cartão ponto
export const calcularTotaisCartao = (cartao: CartaoPonto): CartaoPonto => {
  const atualizado = { ...cartao };
  
  let totalNormal = 0;
  let totalExtra50 = 0;
  let totalExtra80 = 0;
  let totalExtra110 = 0;
  let totalNoturno = 0;
  let totalLanches = 0;
  
  cartao.registros.forEach(registro => {
    totalNormal += registro.totalHorasNormais || 0;
    totalExtra50 += registro.totalHorasExtras50 || 0;
    totalExtra80 += registro.totalHorasExtras80 || 0;
    totalExtra110 += registro.totalHorasExtras110 || 0;
    totalNoturno += registro.totalHorasNoturno || 0;
    if (registro.temDireitoLanche) totalLanches++;
  });
  
  // Aplicar regra de horas excedentes a 50h (passam a 80%)
  if (totalExtra50 > 50 * 60) { // 50 horas em minutos
    totalExtra80 += totalExtra50 - (50 * 60);
    totalExtra50 = 50 * 60;
  }
  
  atualizado.totalHorasNormais = totalNormal;
  atualizado.totalHorasExtras50 = totalExtra50;
  atualizado.totalHorasExtras80 = totalExtra80;
  atualizado.totalHorasExtras110 = totalExtra110;
  atualizado.totalHorasNoturno = totalNoturno;
  atualizado.totalLanches = totalLanches;
  
  return atualizado;
};

// Criar um novo cartão de ponto para um funcionário/mês
export const criarCartaoPonto = (funcionarioId: string, mes: number, ano: number): CartaoPonto => {
  // Verificar se já existe
  const existente = cartoesPonto.find(
    cp => cp.funcionarioId === funcionarioId && cp.mes === mes && cp.ano === ano
  );
  
  if (existente) return existente;
  
  // Criar novo cartão de ponto
  const novoCatao: CartaoPonto = {
    id: (proximoIdCartao++).toString(),
    funcionarioId,
    mes,
    ano,
    registros: [],
    totalHorasNormais: 0,
    totalHorasExtras50: 0,
    totalHorasExtras80: 0,
    totalHorasExtras110: 0,
    totalHorasNoturno: 0,
    totalLanches: 0,
    fechado: false,
    validado: false
  };
  
  // Inicializar registros para todos os dias do mês
  const diasNoMes = new Date(ano, mes, 0).getDate();
  
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataStr = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    const diaSemana = diaDaSemana(dataStr);
    
    // Definir status padrão baseado no dia da semana
    let statusDiaPadrao: 'normal' | 'folga' = 'normal';
    if (diaSemana === 0) statusDiaPadrao = 'folga'; // domingo é folga
    
    const novoRegistro: RegistroPonto = {
      id: (proximoIdRegistro++).toString(),
      funcionarioId,
      data: dataStr,
      statusDia: statusDiaPadrao,
      registradoPor: 'sistema',
      dataRegistro: new Date().toISOString(),
      bloqueado: false,
      temDireitoLanche: false
    };
    
    novoCatao.registros.push(novoRegistro);
  }
  
  cartoesPonto.push(novoCatao);
  return novoCatao;
};

// Salvar registro de ponto
export const salvarRegistroPonto = (
  cartaoId: string, 
  registroId: string, 
  dados: Partial<RegistroPonto>,
  usuarioAtual: User
): RegistroPonto | null => {
  // Buscar cartão
  const cartaoIndex = cartoesPonto.findIndex(c => c.id === cartaoId);
  if (cartaoIndex === -1) return null;
  
  // Buscar registro
  const registroIndex = cartoesPonto[cartaoIndex].registros.findIndex(r => r.id === registroId);
  if (registroIndex === -1) return null;
  
  const registro = cartoesPonto[cartaoIndex].registros[registroIndex];
  
  // Verificar se está bloqueado
  if (registro.bloqueado) {
    throw new Error('Este registro está bloqueado para edição');
  }
  
  // Atualizar dados
  const registroAtualizado = {
    ...registro,
    ...dados,
    ultimaModificacao: new Date().toISOString(),
    modificadoPor: usuarioAtual.name
  };
  
  // Recalcular horas
  const calculado = calcularHorasPonto(registroAtualizado);
  
  // Atualizar no array
  cartoesPonto[cartaoIndex].registros[registroIndex] = calculado;
  
  // Recalcular totais do cartão
  cartoesPonto[cartaoIndex] = calcularTotaisCartao(cartoesPonto[cartaoIndex]);
  
  // Verificar se deve bloquear (mais de 24h)
  const agora = new Date();
  const dataRegistro = new Date(registro.dataRegistro);
  const diffHoras = (agora.getTime() - dataRegistro.getTime()) / (1000 * 60 * 60);
  
  if (diffHoras > 24) {
    calculado.bloqueado = true;
  }
  
  return calculado;
};

// Buscar cartão de ponto
export const getCartaoPonto = (funcionarioId: string, mes: number, ano: number): CartaoPonto => {
  let cartao = cartoesPonto.find(
    cp => cp.funcionarioId === funcionarioId && cp.mes === mes && cp.ano === ano
  );
  
  if (!cartao) {
    cartao = criarCartaoPonto(funcionarioId, mes, ano);
  }
  
  return cartao;
};

// Calcular resumo de horas para um cartão
export const calcularResumoHoras = (cartao: CartaoPonto): ResumoHoras => {
  return {
    totalNormal: cartao.totalHorasNormais,
    totalExtra50: cartao.totalHorasExtras50,
    totalExtra80: cartao.totalHorasExtras80,
    totalExtra110: cartao.totalHorasExtras110,
    totalNoturno: cartao.totalHorasNoturno,
    totalLanches: cartao.totalLanches,
    valorLanches: cartao.totalLanches * 5 // R$ 5,00 por lanche
  };
};

// Função para validar cartão ponto
export const validarCartaoPonto = (cartaoId: string, usuarioAtual: User): CartaoPonto | null => {
  const index = cartoesPonto.findIndex(c => c.id === cartaoId);
  if (index === -1) return null;
  
  cartoesPonto[index].validado = true;
  cartoesPonto[index].validadoPor = usuarioAtual.name;
  cartoesPonto[index].dataValidacao = new Date().toISOString();
  
  return cartoesPonto[index];
};

// Função para fechar cartão ponto
export const fecharCartaoPonto = (cartaoId: string): CartaoPonto | null => {
  const index = cartoesPonto.findIndex(c => c.id === cartaoId);
  if (index === -1) return null;
  
  cartoesPonto[index].fechado = true;
  
  return cartoesPonto[index];
};
