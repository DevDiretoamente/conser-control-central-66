
import { supabase } from '@/integrations/supabase/client';
import { DocumentoRH } from '@/types/documentosRH';
import { toast } from 'sonner';

export const documentosSupabaseService = {
  getAll: async (): Promise<DocumentoRH[]> => {
    try {
      const { data, error } = await supabase
        .from('documentos_rh')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        tipo: item.tipo as DocumentoRH['tipo'],
        titulo: item.titulo,
        descricao: item.descricao,
        dataDocumento: item.data_documento,
        dataVencimento: item.data_vencimento || undefined,
        status: item.status as DocumentoRH['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        assinado: item.assinado,
        dataAssinatura: item.data_assinatura || undefined,
        criadoPor: item.criado_por,
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast.error('Erro ao carregar documentos');
      return [];
    }
  },

  getByFuncionario: async (funcionarioId: string): Promise<DocumentoRH[]> => {
    try {
      const { data, error } = await supabase
        .from('documentos_rh')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        tipo: item.tipo as DocumentoRH['tipo'],
        titulo: item.titulo,
        descricao: item.descricao,
        dataDocumento: item.data_documento,
        dataVencimento: item.data_vencimento || undefined,
        status: item.status as DocumentoRH['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        assinado: item.assinado,
        dataAssinatura: item.data_assinatura || undefined,
        criadoPor: item.criado_por,
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      toast.error('Erro ao carregar documentos');
      return [];
    }
  },

  create: async (documento: Omit<DocumentoRH, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<DocumentoRH> => {
    try {
      const { data, error } = await supabase
        .from('documentos_rh')
        .insert({
          funcionario_id: documento.funcionarioId,
          tipo: documento.tipo,
          titulo: documento.titulo,
          descricao: documento.descricao,
          data_documento: documento.dataDocumento,
          data_vencimento: documento.dataVencimento || null,
          status: documento.status,
          arquivo: documento.arquivo || null,
          nome_arquivo: documento.nomeArquivo || null,
          observacoes: documento.observacoes || null,
          assinado: documento.assinado,
          data_assinatura: documento.dataAssinatura || null,
          criado_por: documento.criadoPor
        })
        .select()
        .single();

      if (error) throw error;

      const newDocumento: DocumentoRH = {
        id: data.id,
        funcionarioId: data.funcionario_id || '',
        tipo: data.tipo as DocumentoRH['tipo'],
        titulo: data.titulo,
        descricao: data.descricao,
        dataDocumento: data.data_documento,
        dataVencimento: data.data_vencimento || undefined,
        status: data.status as DocumentoRH['status'],
        arquivo: data.arquivo || undefined,
        nomeArquivo: data.nome_arquivo || undefined,
        observacoes: data.observacoes || undefined,
        assinado: data.assinado,
        dataAssinatura: data.data_assinatura || undefined,
        criadoPor: data.criado_por,
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };

      console.log('Documento criado:', newDocumento.titulo);
      return newDocumento;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      toast.error('Erro ao criar documento');
      throw error;
    }
  },

  update: async (id: string, updates: Partial<DocumentoRH>): Promise<DocumentoRH | null> => {
    try {
      const updateData: any = {};
      
      if (updates.funcionarioId) updateData.funcionario_id = updates.funcionarioId;
      if (updates.tipo) updateData.tipo = updates.tipo;
      if (updates.titulo) updateData.titulo = updates.titulo;
      if (updates.descricao) updateData.descricao = updates.descricao;
      if (updates.dataDocumento) updateData.data_documento = updates.dataDocumento;
      if (updates.dataVencimento !== undefined) updateData.data_vencimento = updates.dataVencimento;
      if (updates.status) updateData.status = updates.status;
      if (updates.arquivo !== undefined) updateData.arquivo = updates.arquivo;
      if (updates.nomeArquivo !== undefined) updateData.nome_arquivo = updates.nomeArquivo;
      if (updates.observacoes !== undefined) updateData.observacoes = updates.observacoes;
      if (updates.assinado !== undefined) updateData.assinado = updates.assinado;
      if (updates.dataAssinatura !== undefined) updateData.data_assinatura = updates.dataAssinatura;

      const { data, error } = await supabase
        .from('documentos_rh')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      const updatedDocumento: DocumentoRH = {
        id: data.id,
        funcionarioId: data.funcionario_id || '',
        tipo: data.tipo as DocumentoRH['tipo'],
        titulo: data.titulo,
        descricao: data.descricao,
        dataDocumento: data.data_documento,
        dataVencimento: data.data_vencimento || undefined,
        status: data.status as DocumentoRH['status'],
        arquivo: data.arquivo || undefined,
        nomeArquivo: data.nome_arquivo || undefined,
        observacoes: data.observacoes || undefined,
        assinado: data.assinado,
        dataAssinatura: data.data_assinatura || undefined,
        criadoPor: data.criado_por,
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };

      console.log('Documento atualizado:', updatedDocumento.titulo);
      return updatedDocumento;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      toast.error('Erro ao atualizar documento');
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('documentos_rh')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Documento excluído:', id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento');
      return false;
    }
  },

  getExpiringDocuments: async (days: number = 30): Promise<DocumentoRH[]> => {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      const { data, error } = await supabase
        .from('documentos_rh')
        .select('*')
        .not('data_vencimento', 'is', null)
        .lte('data_vencimento', futureDate.toISOString().split('T')[0])
        .gte('data_vencimento', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        tipo: item.tipo as DocumentoRH['tipo'],
        titulo: item.titulo,
        descricao: item.descricao,
        dataDocumento: item.data_documento,
        dataVencimento: item.data_vencimento || undefined,
        status: item.status as DocumentoRH['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        assinado: item.assinado,
        dataAssinatura: item.data_assinatura || undefined,
        criadoPor: item.criado_por,
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar documentos vencendo:', error);
      return [];
    }
  },

  getExpiredDocuments: async (): Promise<DocumentoRH[]> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('documentos_rh')
        .select('*')
        .not('data_vencimento', 'is', null)
        .lt('data_vencimento', today)
        .neq('status', 'vencido');

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        funcionarioId: item.funcionario_id || '',
        tipo: item.tipo as DocumentoRH['tipo'],
        titulo: item.titulo,
        descricao: item.descricao,
        dataDocumento: item.data_documento,
        dataVencimento: item.data_vencimento || undefined,
        status: item.status as DocumentoRH['status'],
        arquivo: item.arquivo || undefined,
        nomeArquivo: item.nome_arquivo || undefined,
        observacoes: item.observacoes || undefined,
        assinado: item.assinado,
        dataAssinatura: item.data_assinatura || undefined,
        criadoPor: item.criado_por,
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar documentos vencidos:', error);
      return [];
    }
  },

  updateExpiredDocumentsStatus: async (): Promise<void> => {
    try {
      const expiredDocs = await documentosSupabaseService.getExpiredDocuments();
      
      for (const doc of expiredDocs) {
        await documentosSupabaseService.update(doc.id, { status: 'vencido' });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de documentos vencidos:', error);
    }
  }
};
