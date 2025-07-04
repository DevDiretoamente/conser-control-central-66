
import { supabase } from '@/integrations/supabase/client';
import { Obra, ObrasFilter, ObrasDashboardData } from '@/types/obras';
import { toast } from 'sonner';

export const obrasSupabaseService = {
  // CRUD básico
  getAll: async (): Promise<Obra[]> => {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar obras:', error);
        throw new Error('Erro ao carregar obras');
      }

      return data?.map(mapSupabaseToObra) || [];
    } catch (error) {
      console.error('Erro no serviço de obras:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Obra | null> => {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar obra:', error);
        throw new Error('Erro ao carregar obra');
      }

      return data ? mapSupabaseToObra(data) : null;
    } catch (error) {
      console.error('Erro no serviço de obras:', error);
      throw error;
    }
  },

  create: async (obra: Omit<Obra, 'id' | 'criadoEm' | 'atualizadoEm' | 'historicoAlteracoes'>): Promise<Obra> => {
    try {
      const obraData = mapObraToSupabase(obra);

      const { data, error } = await supabase
        .from('obras')
        .insert([obraData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar obra:', error);
        throw new Error('Erro ao criar obra');
      }

      return mapSupabaseToObra(data);
    } catch (error) {
      console.error('Erro no serviço de obras:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Obra>): Promise<Obra | null> => {
    try {
      const updateData = mapObraToSupabase(updates);

      const { data, error } = await supabase
        .from('obras')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar obra:', error);
        throw new Error('Erro ao atualizar obra');
      }

      return mapSupabaseToObra(data);
    } catch (error) {
      console.error('Erro no serviço de obras:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('obras')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar obra:', error);
        throw new Error('Erro ao deletar obra');
      }

      return true;
    } catch (error) {
      console.error('Erro no serviço de obras:', error);
      throw error;
    }
  },

  // Dashboard
  getDashboardData: async (): Promise<ObrasDashboardData> => {
    try {
      const obras = await obrasSupabaseService.getAll();
      
      const dashboardData: ObrasDashboardData = {
        totalObras: obras.length,
        obrasAndamento: obras.filter(o => o.status === 'execucao').length,
        obrasConcluidas: obras.filter(o => o.status === 'concluida').length,
        obrasAtrasadas: obras.filter(o => {
          if (!o.dataFimPrevista || o.status === 'concluida') return false;
          return new Date(o.dataFimPrevista) < new Date();
        }).length,
        valorTotalContratos: obras.reduce((sum, o) => sum + o.valorContrato, 0),
        valorExecutado: obras.reduce((sum, o) => sum + o.gastoTotal, 0),
        progressoMedio: obras.length > 0 
          ? obras.reduce((sum, o) => sum + o.progressoPercentual, 0) / obras.length 
          : 0,
        obrasPorTipo: obras.reduce((acc, o) => {
          acc[o.tipo] = (acc[o.tipo] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        obrasPorStatus: obras.reduce((acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        evolucaoMensal: [], // Implementar conforme necessário
        proximosVencimentos: obras
          .filter(o => o.dataFimPrevista && o.status !== 'concluida')
          .map(o => ({
            obraId: o.id,
            obraNome: o.nome,
            dataVencimento: o.dataFimPrevista,
            diasRestantes: Math.ceil(
              (new Date(o.dataFimPrevista).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )
          }))
          .sort((a, b) => a.diasRestantes - b.diasRestantes)
          .slice(0, 5)
      };
      
      return dashboardData;
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      throw error;
    }
  },

  // Filtros
  search: async (filters: ObrasFilter): Promise<Obra[]> => {
    try {
      let query = supabase.from('obras').select('*');
      
      if (filters.search) {
        query = query.or(`nome.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%,cliente_nome.ilike.%${filters.search}%`);
      }
      
      if (filters.tipo && filters.tipo !== 'all') {
        query = query.eq('tipo', filters.tipo);
      }
      
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.prioridade && filters.prioridade !== 'all') {
        query = query.eq('prioridade', filters.prioridade);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao filtrar obras:', error);
        throw new Error('Erro ao filtrar obras');
      }
      
      return data?.map(mapSupabaseToObra) || [];
    } catch (error) {
      console.error('Erro no serviço de obras:', error);
      throw error;
    }
  }
};

// Função para mapear dados do Supabase para o tipo Obra
function mapSupabaseToObra(data: any): Obra {
  return {
    id: data.id,
    nome: data.nome,
    descricao: data.descricao || '',
    tipo: data.tipo,
    status: data.status,
    prioridade: data.prioridade,
    clienteId: data.cliente_id,
    clienteNome: data.cliente_nome,
    contrato: data.contrato,
    valorContrato: data.valor_contrato || 0,
    dataInicio: data.data_inicio,
    dataFimPrevista: data.data_fim_prevista,
    dataFimReal: data.data_fim_real,
    endereco: data.endereco || {},
    responsavelTecnico: data.responsavel_tecnico,
    encarregado: data.encarregado,
    funcionariosAlocados: data.funcionarios_alocados || [],
    progressoPercentual: data.progresso_percentual || 0,
    etapas: data.etapas || [],
    materiais: data.materiais || [],
    equipamentos: data.equipamentos || [],
    documentos: data.documentos || [],
    orcamentoTotal: data.orcamento_total || 0,
    gastoTotal: data.gasto_total || 0,
    receitas: data.receitas || [],
    despesas: data.despesas || [],
    observacoes: data.observacoes,
    historicoAlteracoes: data.historico_alteracoes || [],
    inspecoes: data.inspecoes || [],
    ocorrencias: data.ocorrencias || [],
    criadoPor: data.criado_por,
    criadoEm: data.criado_em,
    atualizadoEm: data.atualizado_em
  };
}

// Função para mapear dados do tipo Obra para o formato do Supabase
function mapObraToSupabase(obra: any): any {
  return {
    nome: obra.nome,
    descricao: obra.descricao,
    tipo: obra.tipo,
    status: obra.status,
    prioridade: obra.prioridade,
    cliente_id: obra.clienteId,
    cliente_nome: obra.clienteNome,
    contrato: obra.contrato,
    valor_contrato: obra.valorContrato,
    data_inicio: obra.dataInicio,
    data_fim_prevista: obra.dataFimPrevista,
    data_fim_real: obra.dataFimReal,
    endereco: obra.endereco,
    responsavel_tecnico: obra.responsavelTecnico,
    encarregado: obra.encarregado,
    funcionarios_alocados: obra.funcionariosAlocados,
    progresso_percentual: obra.progressoPercentual,
    etapas: obra.etapas,
    materiais: obra.materiais,
    equipamentos: obra.equipamentos,
    documentos: obra.documentos,
    orcamento_total: obra.orcamentoTotal,
    gasto_total: obra.gastoTotal,
    receitas: obra.receitas,
    despesas: obra.despesas,
    observacoes: obra.observacoes,
    historico_alteracoes: obra.historicoAlteracoes,
    inspecoes: obra.inspecoes,
    ocorrencias: obra.ocorrencias,
    criado_por: obra.criadoPor || 'system'
  };
}
