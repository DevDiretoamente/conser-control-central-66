
import { supabase } from '@/integrations/supabase/client';
import { Funcionario } from '@/types/funcionario';

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
        dadosPessoais: item.dados_pessoais as Funcionario['dadosPessoais'],
        endereco: item.endereco as Funcionario['endereco'],
        contato: item.contato as Funcionario['contato'],
        dadosProfissionais: item.dados_profissionais as Funcionario['dadosProfissionais'],
        cnh: (item.cnh as Funcionario['cnh']) || {},
        dadosBancarios: item.dados_bancarios as Funcionario['dadosBancarios'],
        documentos: (item.documentos as Funcionario['documentos']) || {},
        dependentes: (item.dependentes as Funcionario['dependentes']) || [],
        tamanhoUniforme: (item.tamanho_uniforme as Funcionario['tamanhoUniforme']) || {},
        episEntregues: (item.epis_entregues as Funcionario['episEntregues']) || [],
        uniformesEntregues: (item.uniformes_entregues as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (item.exames_realizados as Funcionario['examesRealizados']) || [],
        documentosGerados: (item.documentos_gerados as Funcionario['documentosGerados']) || [],
        criadoEm: item.created_at,
        atualizadoEm: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Funcionario | null> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        dadosPessoais: data.dados_pessoais as Funcionario['dadosPessoais'],
        endereco: data.endereco as Funcionario['endereco'],
        contato: data.contato as Funcionario['contato'],
        dadosProfissionais: data.dados_profissionais as Funcionario['dadosProfissionais'],
        cnh: (data.cnh as Funcionario['cnh']) || {},
        dadosBancarios: data.dados_bancarios as Funcionario['dadosBancarios'],
        documentos: (data.documentos as Funcionario['documentos']) || {},
        dependentes: (data.dependentes as Funcionario['dependentes']) || [],
        tamanhoUniforme: (data.tamanho_uniforme as Funcionario['tamanhoUniforme']) || {},
        episEntregues: (data.epis_entregues as Funcionario['episEntregues']) || [],
        uniformesEntregues: (data.uniformes_entregues as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (data.exames_realizados as Funcionario['examesRealizados']) || [],
        documentosGerados: (data.documentos_gerados as Funcionario['documentosGerados']) || [],
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      return null;
    }
  },

  create: async (funcionario: Omit<Funcionario, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Funcionario> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .insert({
          dados_pessoais: funcionario.dadosPessoais,
          endereco: funcionario.endereco,
          contato: funcionario.contato,
          dados_profissionais: funcionario.dadosProfissionais,
          cnh: funcionario.cnh || {},
          dados_bancarios: funcionario.dadosBancarios,
          documentos: funcionario.documentos || {},
          dependentes: funcionario.dependentes || [],
          tamanho_uniforme: funcionario.tamanhoUniforme || {},
          epis_entregues: funcionario.episEntregues || [],
          uniformes_entregues: funcionario.uniformesEntregues || [],
          exames_realizados: funcionario.examesRealizados || [],
          documentos_gerados: funcionario.documentosGerados || []
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        dadosPessoais: data.dados_pessoais as Funcionario['dadosPessoais'],
        endereco: data.endereco as Funcionario['endereco'],
        contato: data.contato as Funcionario['contato'],
        dadosProfissionais: data.dados_profissionais as Funcionario['dadosProfissionais'],
        cnh: (data.cnh as Funcionario['cnh']) || {},
        dadosBancarios: data.dados_bancarios as Funcionario['dadosBancarios'],
        documentos: (data.documentos as Funcionario['documentos']) || {},
        dependentes: (data.dependentes as Funcionario['dependentes']) || [],
        tamanhoUniforme: (data.tamanho_uniforme as Funcionario['tamanhoUniforme']) || {},
        episEntregues: (data.epis_entregues as Funcionario['episEntregues']) || [],
        uniformesEntregues: (data.uniformes_entregues as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (data.exames_realizados as Funcionario['examesRealizados']) || [],
        documentosGerados: (data.documentos_gerados as Funcionario['documentosGerados']) || [],
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  },

  update: async (id: string, funcionario: Partial<Funcionario>): Promise<Funcionario> => {
    try {
      const updateData: any = {};
      
      if (funcionario.dadosPessoais) updateData.dados_pessoais = funcionario.dadosPessoais;
      if (funcionario.endereco) updateData.endereco = funcionario.endereco;
      if (funcionario.contato) updateData.contato = funcionario.contato;
      if (funcionario.dadosProfissionais) updateData.dados_profissionais = funcionario.dadosProfissionais;
      if (funcionario.cnh) updateData.cnh = funcionario.cnh;
      if (funcionario.dadosBancarios) updateData.dados_bancarios = funcionario.dadosBancarios;
      if (funcionario.documentos) updateData.documentos = funcionario.documentos;
      if (funcionario.dependentes) updateData.dependentes = funcionario.dependentes;
      if (funcionario.tamanhoUniforme) updateData.tamanho_uniforme = funcionario.tamanhoUniforme;
      if (funcionario.episEntregues) updateData.epis_entregues = funcionario.episEntregues;
      if (funcionario.uniformesEntregues) updateData.uniformes_entregues = funcionario.uniformesEntregues;
      if (funcionario.examesRealizados) updateData.exames_realizados = funcionario.examesRealizados;
      if (funcionario.documentosGerados) updateData.documentos_gerados = funcionario.documentosGerados;

      const { data, error } = await supabase
        .from('funcionarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        dadosPessoais: data.dados_pessoais as Funcionario['dadosPessoais'],
        endereco: data.endereco as Funcionario['endereco'],
        contato: data.contato as Funcionario['contato'],
        dadosProfissionais: data.dados_profissionais as Funcionario['dadosProfissionais'],
        cnh: (data.cnh as Funcionario['cnh']) || {},
        dadosBancarios: data.dados_bancarios as Funcionario['dadosBancarios'],
        documentos: (data.documentos as Funcionario['documentos']) || {},
        dependentes: (data.dependentes as Funcionario['dependentes']) || [],
        tamanhoUniforme: (data.tamanho_uniforme as Funcionario['tamanhoUniforme']) || {},
        episEntregues: (data.epis_entregues as Funcionario['episEntregues']) || [],
        uniformesEntregues: (data.uniformes_entregues as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (data.exames_realizados as Funcionario['examesRealizados']) || [],
        documentosGerados: (data.documentos_gerados as Funcionario['documentosGerados']) || [],
        criadoEm: data.created_at,
        atualizadoEm: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      throw error;
    }
  }
};
