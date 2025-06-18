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
        dadosPessoais: item.dados_pessoais as unknown as Funcionario['dadosPessoais'],
        endereco: item.endereco as unknown as Funcionario['endereco'],
        contato: item.contato as unknown as Funcionario['contato'],
        dadosProfissionais: item.dados_profissionais as unknown as Funcionario['dadosProfissionais'],
        cnh: (item.cnh as unknown as Funcionario['cnh']) || {},
        dadosBancarios: item.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (item.documentos as unknown as Funcionario['documentos']) || {
          rgFile: null,
          cpfFile: null,
          comprovanteResidencia: null,
          fotoFile: null,
          cnhFile: null,
          ctpsFile: null,
          exameMedicoFile: null,
          outrosDocumentos: null
        },
        dependentes: (item.dependentes as unknown as Funcionario['dependentes']) || [],
        tamanhoUniforme: (item.tamanho_uniforme as unknown as Funcionario['tamanhoUniforme']) || {
          camisa: '',
          calca: '',
          calcado: 0
        },
        episEntregues: (item.epis_entregues as unknown as Funcionario['episEntregues']) || [],
        uniformesEntregues: (item.uniformes_entregues as unknown as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (item.exames_realizados as unknown as Funcionario['examesRealizados']) || [],
        documentosGerados: (item.documentos_gerados as unknown as Funcionario['documentosGerados']) || []
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
        dadosPessoais: data.dados_pessoais as unknown as Funcionario['dadosPessoais'],
        endereco: data.endereco as unknown as Funcionario['endereco'],
        contato: data.contato as unknown as Funcionario['contato'],
        dadosProfissionais: data.dados_profissionais as unknown as Funcionario['dadosProfissionais'],
        cnh: (data.cnh as unknown as Funcionario['cnh']) || {},
        dadosBancarios: data.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (data.documentos as unknown as Funcionario['documentos']) || {
          rgFile: null,
          cpfFile: null,
          comprovanteResidencia: null,
          fotoFile: null,
          cnhFile: null,
          ctpsFile: null,
          exameMedicoFile: null,
          outrosDocumentos: null
        },
        dependentes: (data.dependentes as unknown as Funcionario['dependentes']) || [],
        tamanhoUniforme: (data.tamanho_uniforme as unknown as Funcionario['tamanhoUniforme']) || {
          camisa: '',
          calca: '',
          calcado: 0
        },
        episEntregues: (data.epis_entregues as unknown as Funcionario['episEntregues']) || [],
        uniformesEntregues: (data.uniformes_entregues as unknown as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (data.exames_realizados as unknown as Funcionario['examesRealizados']) || [],
        documentosGerados: (data.documentos_gerados as unknown as Funcionario['documentosGerados']) || []
      };
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      return null;
    }
  },

  create: async (funcionario: Omit<Funcionario, 'id'>): Promise<Funcionario> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .insert([{
          dados_pessoais: funcionario.dadosPessoais as any,
          endereco: funcionario.endereco as any,
          contato: funcionario.contato as any,
          dados_profissionais: funcionario.dadosProfissionais as any,
          cnh: funcionario.cnh || {},
          dados_bancarios: funcionario.dadosBancarios as any,
          documentos: funcionario.documentos || {},
          dependentes: funcionario.dependentes || [],
          tamanho_uniforme: funcionario.tamanhoUniforme || { camisa: '', calca: '', calcado: 0 },
          epis_entregues: funcionario.episEntregues || [],
          uniformes_entregues: funcionario.uniformesEntregues || [],
          exames_realizados: funcionario.examesRealizados || [],
          documentos_gerados: funcionario.documentosGerados || []
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        dadosPessoais: data.dados_pessoais as unknown as Funcionario['dadosPessoais'],
        endereco: data.endereco as unknown as Funcionario['endereco'],
        contato: data.contato as unknown as Funcionario['contato'],
        dadosProfissionais: data.dados_profissionais as unknown as Funcionario['dadosProfissionais'],
        cnh: (data.cnh as unknown as Funcionario['cnh']) || {},
        dadosBancarios: data.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (data.documentos as unknown as Funcionario['documentos']) || {
          rgFile: null,
          cpfFile: null,
          comprovanteResidencia: null,
          fotoFile: null,
          cnhFile: null,
          ctpsFile: null,
          exameMedicoFile: null,
          outrosDocumentos: null
        },
        dependentes: (data.dependentes as unknown as Funcionario['dependentes']) || [],
        tamanhoUniforme: (data.tamanho_uniforme as unknown as Funcionario['tamanhoUniforme']) || {
          camisa: '',
          calca: '',
          calcado: 0
        },
        episEntregues: (data.epis_entregues as unknown as Funcionario['episEntregues']) || [],
        uniformesEntregues: (data.uniformes_entregues as unknown as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (data.exames_realizados as unknown as Funcionario['examesRealizados']) || [],
        documentosGerados: (data.documentos_gerados as unknown as Funcionario['documentosGerados']) || []
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
        dadosPessoais: data.dados_pessoais as unknown as Funcionario['dadosPessoais'],
        endereco: data.endereco as unknown as Funcionario['endereco'],
        contato: data.contato as unknown as Funcionario['contato'],
        dadosProfissionais: data.dados_profissionais as unknown as Funcionario['dadosProfissionais'],
        cnh: (data.cnh as unknown as Funcionario['cnh']) || {},
        dadosBancarios: data.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (data.documentos as unknown as Funcionario['documentos']) || {
          rgFile: null,
          cpfFile: null,
          comprovanteResidencia: null,
          fotoFile: null,
          cnhFile: null,
          ctpsFile: null,
          exameMedicoFile: null,
          outrosDocumentos: null
        },
        dependentes: (data.dependentes as unknown as Funcionario['dependentes']) || [],
        tamanhoUniforme: (data.tamanho_uniforme as unknown as Funcionario['tamanhoUniforme']) || {
          camisa: '',
          calca: '',
          calcado: 0
        },
        episEntregues: (data.epis_entregues as unknown as Funcionario['episEntregues']) || [],
        uniformesEntregues: (data.uniformes_entregues as unknown as Funcionario['uniformesEntregues']) || [],
        examesRealizados: (data.exames_realizados as unknown as Funcionario['examesRealizados']) || [],
        documentosGerados: (data.documentos_gerados as unknown as Funcionario['documentosGerados']) || []
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
