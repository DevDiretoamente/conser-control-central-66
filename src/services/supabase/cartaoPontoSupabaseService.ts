
import { supabase } from '@/integrations/supabase/client';
import { CartaoPonto, CartaoPontoFilterOptions, CartaoPontoSummary } from '@/types/cartaoPonto';
import { toast } from 'sonner';

export const cartaoPontoSupabaseService = {
  // CRUD básico
  getAll: async (): Promise<CartaoPonto[]> => {
    try {
      const { data, error } = await supabase
        .from('cartao_ponto')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        console.error('Erro ao buscar registros de ponto:', error);
        throw new Error('Erro ao carregar registros de ponto');
      }

      return data?.map(mapSupabaseToCartaoPonto) || [];
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<CartaoPonto | null> => {
    try {
      const { data, error } = await supabase
        .from('cartao_ponto')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar registro de ponto:', error);
        throw new Error('Erro ao carregar registro de ponto');
      }

      return data ? mapSupabaseToCartaoPonto(data) : null;
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  },

  getByFuncionarioId: async (funcionarioId: string): Promise<CartaoPonto[]> => {
    try {
      const { data, error } = await supabase
        .from('cartao_ponto')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .order('data', { ascending: false });

      if (error) {
        console.error('Erro ao buscar registros por funcionário:', error);
        throw new Error('Erro ao carregar registros do funcionário');
      }

      return data?.map(mapSupabaseToCartaoPonto) || [];
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  },

  create: async (cartaoPonto: Omit<CartaoPonto, 'id' | 'createdAt' | 'updatedAt'>): Promise<CartaoPonto> => {
    try {
      const cartaoPontoData = mapCartaoPontoToSupabase(cartaoPonto);

      const { data, error } = await supabase
        .from('cartao_ponto')
        .insert([cartaoPontoData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar registro de ponto:', error);
        throw new Error('Erro ao criar registro de ponto');
      }

      return mapSupabaseToCartaoPonto(data);
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<CartaoPonto>): Promise<CartaoPonto | null> => {
    try {
      const updateData = mapCartaoPontoToSupabase(updates);

      const { data, error } = await supabase
        .from('cartao_ponto')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar registro de ponto:', error);
        throw new Error('Erro ao atualizar registro de ponto');
      }

      return mapSupabaseToCartaoPonto(data);
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cartao_ponto')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar registro de ponto:', error);
        throw new Error('Erro ao deletar registro de ponto');
      }

      return true;
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  },

  filter: async (filters: CartaoPontoFilterOptions): Promise<CartaoPonto[]> => {
    try {
      let query = supabase.from('cartao_ponto').select('*');
      
      if (filters.funcionarioId) {
        query = query.eq('funcionario_id', filters.funcionarioId);
      }
      
      if (filters.dataInicio) {
        query = query.gte('data', filters.dataInicio);
      }
      
      if (filters.dataFim) {
        query = query.lte('data', filters.dataFim);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query.order('data', { ascending: false });
      
      if (error) {
        console.error('Erro ao filtrar registros de ponto:', error);
        throw new Error('Erro ao filtrar registros de ponto');
      }
      
      return data?.map(mapSupabaseToCartaoPonto) || [];
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  },

  getSummary: async (funcionarioId: string, mes: number, ano: number): Promise<CartaoPontoSummary> => {
    try {
      const startDate = new Date(ano, mes - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(ano, mes, 0).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('cartao_ponto')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .gte('data', startDate)
        .lte('data', endDate);
      
      if (error) {
        console.error('Erro ao buscar resumo do cartão ponto:', error);
        throw new Error('Erro ao carregar resumo do cartão ponto');
      }
      
      const records = data?.map(mapSupabaseToCartaoPonto) || [];
      
      const totalHorasMes = records.reduce((sum, record) => sum + (record.totalHoras || 0), 0);
      const totalHorasExtras = records.reduce((sum, record) => sum + (record.horasExtras || 0), 0);
      
      // Calculate overtime by rate
      const totalHorasExtras50 = records.reduce((sum, record) => 
        sum + (record.taxaHoraExtra === 0.5 ? (record.horasExtras || 0) : 0), 
      0);
      
      const totalHorasExtras80 = records.reduce((sum, record) => 
        sum + (record.taxaHoraExtra === 0.8 ? (record.horasExtras || 0) : 0), 
      0);
      
      const totalHorasExtras110 = records.reduce((sum, record) => 
        sum + (record.taxaHoraExtra === 1.1 ? (record.horasExtras || 0) : 0), 
      0);
      
      const diasTrabalhados = records.filter(r => 
        r.status === 'normal' || r.status === 'sobreaviso'
      ).length;
      
      const diasUteis = 22; // Assuming 22 working days per month
      const diasFaltantes = diasUteis - diasTrabalhados;
      
      const registrosIncompletos = records.filter(r => 
        (r.status === 'normal' && (!r.horaEntrada || !r.horaSaida))
      ).length;
      
      // Check eligibility for food voucher (no unjustified absences)
      const elegibleValeAlimentacao = !records.some(r => r.status === 'falta_injustificada');
      
      return {
        totalHorasMes,
        totalHorasExtras,
        totalHorasExtras50,
        totalHorasExtras80,
        totalHorasExtras110,
        diasTrabalhados,
        diasFaltantes,
        registrosIncompletos,
        valorCestaBasica: elegibleValeAlimentacao ? 50 : 0, // Default value
        valorLanche: records.filter(r => r.eligibleLanche).length * 15, // Default value
        elegibleValeAlimentacao
      };
    } catch (error) {
      console.error('Erro no serviço de cartão ponto:', error);
      throw error;
    }
  }
};

// Função para mapear dados do Supabase para o tipo CartaoPonto
function mapSupabaseToCartaoPonto(data: any): CartaoPonto {
  return {
    id: data.id,
    funcionarioId: data.funcionario_id,
    funcionarioNome: data.funcionario_nome,
    data: data.data,
    horaEntrada: data.hora_entrada,
    horaSaida: data.hora_saida,
    inicioAlmoco: data.hora_almoco_saida,
    fimAlmoco: data.hora_almoco_retorno,
    totalHoras: data.total_horas || 0,
    horasExtras: data.horas_extras || 0,
    taxaHoraExtra: data.taxa_hora_extra || 0.5,
    eligibleCestaBasica: data.status !== 'falta_injustificada',
    eligibleLanche: (data.horas_extras || 0) > 1,
    tipoJornada: 'normal', // Default value
    status: data.status,
    justificativa: data.observacoes,
    observacoes: data.observacoes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

// Função para mapear dados do tipo CartaoPonto para o formato do Supabase
function mapCartaoPontoToSupabase(cartaoPonto: any): any {
  return {
    funcionario_id: cartaoPonto.funcionarioId,
    funcionario_nome: cartaoPonto.funcionarioNome,
    data: cartaoPonto.data,
    hora_entrada: cartaoPonto.horaEntrada,
    hora_saida: cartaoPonto.horaSaida,
    hora_almoco_saida: cartaoPonto.inicioAlmoco,
    hora_almoco_retorno: cartaoPonto.fimAlmoco,
    total_horas: cartaoPonto.totalHoras,
    horas_extras: cartaoPonto.horasExtras,
    taxa_hora_extra: cartaoPonto.taxaHoraExtra,
    status: cartaoPonto.status,
    observacoes: cartaoPonto.observacoes || cartaoPonto.justificativa,
    aprovado_por: cartaoPonto.aprovadoPor,
    data_aprovacao: cartaoPonto.dataAprovacao
  };
}
