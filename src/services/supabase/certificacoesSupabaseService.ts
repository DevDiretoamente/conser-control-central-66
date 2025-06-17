
import { supabase } from '@/integrations/supabase/client';
import { Certificacao, RenovacaoCertificacao } from '@/types/documentosRH';
import { toast } from 'sonner';

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
        dataVencimento: item.data_vencimento || undefined,
        numero: item.numero || undefined,
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        renovacoes: item.renovacoes || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar certificações:', error);
      toast.error('Erro ao carregar certificações');
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
        dataVencimento: item.data_vencimento || undefined,
        numero: item.numero || undefined,
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        renovacoes: item.renovacoes || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar certificações:', error);
      toast.error('Erro ao carregar certificações');
      return [];
    }
  },

  create: async (certificacao: Omit<Certificacao, 'id' | 'criadoEm' | 'atualizadoEm' | 'renovacoes'>): Promise<Certificacao> => {
    try {
      const { data, error } = await supabase
        .from('certificacoes')
        .insert({
          funcionario_id: certificacao.funcionarioId,
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
          renovacoes: []
        })
        .select()
        .single();

      if (error) throw error;

      const newCertificacao: Certificacao = {
        id: data.id,
        funcionarioId: data.funcionario_id || '',
        nome: data.nome,
        entidadeCertificadora: data.entidade_certificadora,
        dataObtencao: data.data_obtencao,
        dataVencimento: data.data_vencimento || undefined,
        numero: data.numero || undefined,
        categoria: data.categoria as Certificacao['categoria'],
        status: data.status as Certificacao['status'],
        arquivo: data.arquivo || undefined,
        nomeArquivo: data.nome_arquivo || undefined,
        observacoes: data.observacoes || undefined,
        renovacoes: data.renovacoes || [],
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };

      console.log('Certificação criada:', newCertificacao.nome);
      return newCertificacao;
    } catch (error) {
      console.error('Erro ao criar certificação:', error);
      toast.error('Erro ao criar certificação');
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Certificacao>): Promise<Certificacao | null> => {
    try {
      const updateData: any = {};
      
      if (updates.funcionarioId) updateData.funcionario_id = updates.funcionarioId;
      if (updates.nome) updateData.nome = updates.nome;
      if (updates.entidadeCertificadora) updateData.entidade_certificadora = updates.entidadeCertificadora;
      if (updates.dataObtencao) updateData.data_obtencao = updates.dataObtencao;
      if (updates.dataVencimento !== undefined) updateData.data_vencimento = updates.dataVencimento;
      if (updates.numero !== undefined) updateData.numero = updates.numero;
      if (updates.categoria) updateData.categoria = updates.categoria;
      if (updates.status) updateData.status = updates.status;
      if (updates.arquivo !== undefined) updateData.arquivo = updates.arquivo;
      if (updates.nomeArquivo !== undefined) updateData.nome_arquivo = updates.nomeArquivo;
      if (updates.observacoes !== undefined) updateData.observacoes = updates.observacoes;
      if (updates.renovacoes) updateData.renovacoes = updates.renovacoes;

      const { data, error } = await supabase
        .from('certificacoes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      const updatedCertificacao: Certificacao = {
        id: data.id,
        funcionarioId: data.funcionario_id || '',
        nome: data.nome,
        entidadeCertificadora: data.entidade_certificadora,
        dataObtencao: data.data_obtencao,
        dataVencimento: data.data_vencimento || undefined,
        numero: data.numero || undefined,
        categoria: data.categoria as Certificacao['categoria'],
        status: data.status as Certificacao['status'],
        arquivo: data.arquivo || undefined,
        nomeArquivo: data.nome_arquivo || undefined,
        observacoes: data.observacoes || undefined,
        renovacoes: data.renovacoes || [],
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };

      console.log('Certificação atualizada:', updatedCertificacao.nome);
      return updatedCertificacao;
    } catch (error) {
      console.error('Erro ao atualizar certificação:', error);
      toast.error('Erro ao atualizar certificação');
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('certificacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Certificação excluída:', id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir certificação:', error);
      toast.error('Erro ao excluir certificação');
      return false;
    }
  },

  addRenovacao: async (certificacaoId: string, renovacao: Omit<RenovacaoCertificacao, 'id'>): Promise<boolean> => {
    try {
      // Buscar certificação atual
      const { data: certData, error: fetchError } = await supabase
        .from('certificacoes')
        .select('renovacoes')
        .eq('id', certificacaoId)
        .single();

      if (fetchError) throw fetchError;

      const novaRenovacao: RenovacaoCertificacao = {
        ...renovacao,
        id: `renov-${Date.now()}`
      };

      const renovacoes = [...(certData.renovacoes || []), novaRenovacao];

      const { error } = await supabase
        .from('certificacoes')
        .update({ renovacoes })
        .eq('id', certificacaoId);

      if (error) throw error;

      console.log('Renovação adicionada à certificação:', certificacaoId);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar renovação:', error);
      toast.error('Erro ao adicionar renovação');
      return false;
    }
  },

  getExpiringCertifications: async (days: number = 60): Promise<Certificacao[]> => {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      const { data, error } = await supabase
        .from('certificacoes')
        .select('*')
        .not('data_vencimento', 'is', null)
        .lte('data_vencimento', futureDate.toISOString().split('T')[0])
        .gte('data_vencimento', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        nome: item.nome,
        entidadeCertificadora: item.entidade_certificadora,
        dataObtencao: item.data_obtencao,
        dataVencimento: item.data_vencimento || undefined,
        numero: item.numero || undefined,
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        renovacoes: item.renovacoes || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar certificações vencendo:', error);
      return [];
    }
  },

  getExpiredCertifications: async (): Promise<Certificacao[]> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('certificacoes')
        .select('*')
        .not('data_vencimento', 'is', null)
        .lt('data_vencimento', today)
        .neq('status', 'vencida');

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        nome: item.nome,
        entidadeCertificadora: item.entidade_certificadora,
        dataObtencao: item.data_obtencao,
        dataVencimento: item.data_vencimento || undefined,
        numero: item.numero || undefined,
        categoria: item.categoria as Certificacao['categoria'],
        status: item.status as Certificacao['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        renovacoes: item.renovacoes || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar certificações vencidas:', error);
      return [];
    }
  },

  updateExpiredCertificationsStatus: async (): Promise<void> => {
    try {
      const expiredCerts = await certificacoesSupabaseService.getExpiredCertifications();
      
      for (const cert of expiredCerts) {
        await certificacoesSupabaseService.update(cert.id, { status: 'vencida' });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de certificações vencidas:', error);
    }
  }
};
