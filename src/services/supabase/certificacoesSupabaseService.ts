import { supabase } from '@/integrations/supabase/client';
import { Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';

export const certificacoesSupabaseService = {
  getAll: async (): Promise<Certificacao[]> => {
    try {
      const { data, error } = await supabase
        .from('certificacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        nome: item.nome,
        entidadeCertificadora: item.entidade_certificadora,
        dataObtencao: item.data_obtencao,
        dataVencimento: item.data_vencimento,
        numero: item.numero || '',
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || '',
        nomeArquivo: item.nome_arquivo || '',
        observacoes: item.observacoes || '',
        renovacoes: (item.renovacoes as unknown as RenovacaoCertificacao[]) || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar certificações:', error);
      return [];
    }
  },

  getByFuncionario: async (funcionarioId: string): Promise<Certificacao[]> => {
    try {
      const { data, error } = await supabase
        .from('certificacoes')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        nome: item.nome,
        entidadeCertificadora: item.entidade_certificadora,
        dataObtencao: item.data_obtencao,
        dataVencimento: item.data_vencimento,
        numero: item.numero || '',
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || '',
        nomeArquivo: item.nome_arquivo || '',
        observacoes: item.observacoes || '',
        renovacoes: (item.renovacoes as unknown as RenovacaoCertificacao[]) || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar certificações do funcionário:', error);
      return [];
    }
  },

  create: async (certificacao: Omit<Certificacao, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Certificacao> => {
    try {
      const { data, error } = await supabase
        .from('certificacoes')
        .insert({
          funcionario_id: certificacao.funcionarioId || null,
          nome: certificacao.nome,
          entidade_certificadora: certificacao.entidadeCertificadora,
          data_obtencao: certificacao.dataObtencao,
          data_vencimento: certificacao.dataVencimento || null,
          numero: certificacao.numero || null,
          categoria: certificacao.categoria,
          status: certificacao.status,
          arquivo: certificacao.arquivo || null,
          nome_arquivo: certificacao.nomeArquivo || null,
          observacoes: certificacao.observacoes || null,
          renovacoes: (certificacao.renovacoes || []) as any
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        funcionarioId: data.funcionario_id || '',
        nome: data.nome,
        entidadeCertificadora: data.entidade_certificadora,
        dataObtencao: data.data_obtencao,
        dataVencimento: data.data_vencimento,
        numero: data.numero || '',
        categoria: data.categoria as Certificacao['categoria'],
        status: data.status as Certificacao['status'],
        arquivo: data.arquivo || '',
        nomeArquivo: data.nome_arquivo || '',
        observacoes: data.observacoes || '',
        renovacoes: (data.renovacoes as unknown as RenovacaoCertificacao[]) || [],
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao criar certificação:', error);
      throw error;
    }
  },

  update: async (id: string, certificacao: Partial<Certificacao>): Promise<Certificacao> => {
    try {
      const updateData: any = {};
      
      if (certificacao.funcionarioId !== undefined) updateData.funcionario_id = certificacao.funcionarioId || null;
      if (certificacao.nome) updateData.nome = certificacao.nome;
      if (certificacao.entidadeCertificadora) updateData.entidade_certificadora = certificacao.entidadeCertificadora;
      if (certificacao.dataObtencao) updateData.data_obtencao = certificacao.dataObtencao;
      if (certificacao.dataVencimento !== undefined) updateData.data_vencimento = certificacao.dataVencimento || null;
      if (certificacao.numero !== undefined) updateData.numero = certificacao.numero || null;
      if (certificacao.categoria) updateData.categoria = certificacao.categoria;
      if (certificacao.status) updateData.status = certificacao.status;
      if (certificacao.arquivo !== undefined) updateData.arquivo = certificacao.arquivo || null;
      if (certificacao.nomeArquivo !== undefined) updateData.nome_arquivo = certificacao.nomeArquivo || null;
      if (certificacao.observacoes !== undefined) updateData.observacoes = certificacao.observacoes || null;
      if (certificacao.renovacoes) updateData.renovacoes = certificacao.renovacoes as any;

      const { data, error } = await supabase
        .from('certificacoes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        funcionarioId: data.funcionario_id || '',
        nome: data.nome,
        entidadeCertificadora: data.entidade_certificadora,
        dataObtencao: data.data_obtencao,
        dataVencimento: data.data_vencimento,
        numero: data.numero || '',
        categoria: data.categoria as Certificacao['categoria'],
        status: data.status as Certificacao['status'],
        arquivo: data.arquivo || '',
        nomeArquivo: data.nome_arquivo || '',
        observacoes: data.observacoes || '',
        renovacoes: (data.renovacoes as unknown as RenovacaoCertificacao[]) || [],
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao atualizar certificação:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('certificacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir certificação:', error);
      throw error;
    }
  },

  addRenovacao: async (id: string, renovacao: Omit<RenovacaoCertificacao, 'id'>): Promise<void> => {
    try {
      // Get current renovacoes
      const { data: currentData, error: fetchError } = await supabase
        .from('certificacoes')
        .select('renovacoes')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const currentRenovacoes = (currentData.renovacoes as unknown as RenovacaoCertificacao[]) || [];
      const newRenovacao = { ...renovacao, id: Date.now().toString() };
      const newRenovacoes = [...currentRenovacoes, newRenovacao];

      const { error } = await supabase
        .from('certificacoes')
        .update({ renovacoes: newRenovacoes as any })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao adicionar renovação:', error);
      throw error;
    }
  },

  getExpiringCertifications: async (days: number = 60): Promise<Certificacao[]> => {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const { data, error } = await supabase
        .from('certificacoes')
        .select('*')
        .gte('data_vencimento', today.toISOString().split('T')[0])
        .lte('data_vencimento', futureDate.toISOString().split('T')[0])
        .eq('status', 'valida')
        .order('data_vencimento', { ascending: true });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        nome: item.nome,
        entidadeCertificadora: item.entidade_certificadora,
        dataObtencao: item.data_obtencao,
        dataVencimento: item.data_vencimento,
        numero: item.numero || '',
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || '',
        nomeArquivo: item.nome_arquivo || '',
        observacoes: item.observacoes || '',
        renovacoes: (item.renovacoes as unknown as RenovacaoCertificacao[]) || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar certificações próximas ao vencimento:', error);
      return [];
    }
  },

  getExpiredCertifications: async (): Promise<Certificacao[]> => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('certificacoes')
        .select('*')
        .lt('data_vencimento', today)
        .eq('status', 'valida')
        .order('data_vencimento', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        nome: item.nome,
        entidadeCertificadora: item.entidade_certificadora,
        dataObtencao: item.data_obtencao,
        dataVencimento: item.data_vencimento,
        numero: item.numero || '',
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || '',
        nomeArquivo: item.nome_arquivo || '',
        observacoes: item.observacoes || '',
        renovacoes: (item.renovacoes as unknown as RenovacaoCertificacao[]) || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar certificações vencidas:', error);
      return [];
    }
  },

  updateExpiredCertificationsStatus: async (): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('certificacoes')
        .update({ status: 'vencida' })
        .lt('data_vencimento', today)
        .eq('status', 'valida');

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar status das certificações vencidas:', error);
    }
  }
};
