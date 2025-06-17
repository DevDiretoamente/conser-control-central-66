
import { supabase } from '@/integrations/supabase/client';
import { Funcionario } from '@/types/funcionario';
import { toast } from 'sonner';

export const funcionariosSupabaseService = {
  getAll: async (): Promise<Funcionario[]> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        dadosPessoais: item.dados_pessoais,
        endereco: item.endereco,
        contato: item.contato,
        dadosProfissionais: item.dados_profissionais,
        cnh: item.cnh || {},
        dadosBancarios: item.dados_bancarios,
        documentos: item.documentos || {},
        dependentes: item.dependentes || [],
        tamanhoUniforme: item.tamanho_uniforme || {},
        episEntregues: item.epis_entregues || [],
        uniformesEntregues: item.uniformes_entregues || [],
        examesRealizados: item.exames_realizados || [],
        documentosGerados: item.documentos_gerados || []
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
      return [];
    }
  },

  getById: async (id: string): Promise<Funcionario | undefined> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return undefined;

      return {
        id: data.id,
        dadosPessoais: data.dados_pessoais,
        endereco: data.endereco,
        contato: data.contato,
        dadosProfissionais: data.dados_profissionais,
        cnh: data.cnh || {},
        dadosBancarios: data.dados_bancarios,
        documentos: data.documentos || {},
        dependentes: data.dependentes || [],
        tamanhoUniforme: data.tamanho_uniforme || {},
        episEntregues: data.epis_entregues || [],
        uniformesEntregues: data.uniformes_entregues || [],
        examesRealizados: data.exames_realizados || [],
        documentosGerados: data.documentos_gerados || []
      };
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      toast.error('Erro ao carregar funcionário');
      return undefined;
    }
  },

  create: async (funcionarioData: Omit<Funcionario, 'id'>): Promise<Funcionario> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .insert({
          dados_pessoais: funcionarioData.dadosPessoais,
          endereco: funcionarioData.endereco,
          contato: funcionarioData.contato,
          dados_profissionais: funcionarioData.dadosProfissionais,
          cnh: funcionarioData.cnh || {},
          dados_bancarios: funcionarioData.dadosBancarios,
          documentos: funcionarioData.documentos || {},
          dependentes: funcionarioData.dependentes || [],
          tamanho_uniforme: funcionarioData.tamanhoUniforme || {},
          epis_entregues: funcionarioData.episEntregues || [],
          uniformes_entregues: funcionarioData.uniformesEntregues || [],
          exames_realizados: funcionarioData.examesRealizados || [],
          documentos_gerados: funcionarioData.documentosGerados || []
        })
        .select()
        .single();

      if (error) throw error;

      const newFuncionario: Funcionario = {
        id: data.id,
        dadosPessoais: data.dados_pessoais,
        endereco: data.endereco,
        contato: data.contato,
        dadosProfissionais: data.dados_profissionais,
        cnh: data.cnh || {},
        dadosBancarios: data.dados_bancarios,
        documentos: data.documentos || {},
        dependentes: data.dependentes || [],
        tamanhoUniforme: data.tamanho_uniforme || {},
        episEntregues: data.epis_entregues || [],
        uniformesEntregues: data.uniformes_entregues || [],
        examesRealizados: data.exames_realizados || [],
        documentosGerados: data.documentos_gerados || []
      };

      console.log('Funcionário criado:', newFuncionario.dadosPessoais.nome);
      return newFuncionario;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      toast.error('Erro ao criar funcionário');
      throw error;
    }
  },

  update: async (id: string, funcionarioData: Partial<Funcionario>): Promise<Funcionario> => {
    try {
      const updateData: any = {};
      
      if (funcionarioData.dadosPessoais) updateData.dados_pessoais = funcionarioData.dadosPessoais;
      if (funcionarioData.endereco) updateData.endereco = funcionarioData.endereco;
      if (funcionarioData.contato) updateData.contato = funcionarioData.contato;
      if (funcionarioData.dadosProfissionais) updateData.dados_profissionais = funcionarioData.dadosProfissionais;
      if (funcionarioData.cnh) updateData.cnh = funcionarioData.cnh;
      if (funcionarioData.dadosBancarios) updateData.dados_bancarios = funcionarioData.dadosBancarios;
      if (funcionarioData.documentos) updateData.documentos = funcionarioData.documentos;
      if (funcionarioData.dependentes) updateData.dependentes = funcionarioData.dependentes;
      if (funcionarioData.tamanhoUniforme) updateData.tamanho_uniforme = funcionarioData.tamanhoUniforme;
      if (funcionarioData.episEntregues) updateData.epis_entregues = funcionarioData.episEntregues;
      if (funcionarioData.uniformesEntregues) updateData.uniformes_entregues = funcionarioData.uniformesEntregues;
      if (funcionarioData.examesRealizados) updateData.exames_realizados = funcionarioData.examesRealizados;
      if (funcionarioData.documentosGerados) updateData.documentos_gerados = funcionarioData.documentosGerados;

      const { data, error } = await supabase
        .from('funcionarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedFuncionario: Funcionario = {
        id: data.id,
        dadosPessoais: data.dados_pessoais,
        endereco: data.endereco,
        contato: data.contato,
        dadosProfissionais: data.dados_profissionais,
        cnh: data.cnh || {},
        dadosBancarios: data.dados_bancarios,
        documentos: data.documentos || {},
        dependentes: data.dependentes || [],
        tamanhoUniforme: data.tamanho_uniforme || {},
        episEntregues: data.epis_entregues || [],
        uniformesEntregues: data.uniformes_entregues || [],
        examesRealizados: data.exames_realizados || [],
        documentosGerados: data.documentos_gerados || []
      };

      console.log('Funcionário atualizado:', updatedFuncionario.dadosPessoais.nome);
      return updatedFuncionario;
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      toast.error('Erro ao atualizar funcionário');
      throw error;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Funcionário excluído:', id);
      return true;
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      toast.error('Erro ao excluir funcionário');
      return false;
    }
  },

  addDocumentoGerado: async (funcionarioId: string, documento: any): Promise<any> => {
    try {
      // Buscar funcionário atual
      const funcionario = await funcionariosSupabaseService.getById(funcionarioId);
      if (!funcionario) throw new Error('Funcionário não encontrado');

      const newDocumento = {
        ...documento,
        id: `doc-${Date.now()}`
      };

      const documentosGerados = [...(funcionario.documentosGerados || []), newDocumento];

      await funcionariosSupabaseService.update(funcionarioId, { documentosGerados });

      return newDocumento;
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    }
  },

  updateDocumentoStatus: async (
    funcionarioId: string, 
    documentoId: string, 
    status: string,
    assinaturaUrl?: string
  ): Promise<any> => {
    try {
      const funcionario = await funcionariosSupabaseService.getById(funcionarioId);
      if (!funcionario) throw new Error('Funcionário não encontrado');

      const documentosGerados = funcionario.documentosGerados?.map(doc => {
        if (doc.id === documentoId) {
          return {
            ...doc,
            status,
            ...(status === 'assinado' && {
              dataAssinatura: new Date(),
              assinaturaFuncionario: assinaturaUrl
            })
          };
        }
        return doc;
      }) || [];

      await funcionariosSupabaseService.update(funcionarioId, { documentosGerados });

      return documentosGerados.find(doc => doc.id === documentoId);
    } catch (error) {
      console.error('Erro ao atualizar status do documento:', error);
      throw error;
    }
  }
};
