import { supabase } from '@/integrations/supabase/client';
import { Funcionario } from '@/types/funcionario';
import { Database } from '@/types/supabase'; // Importe os tipos gerados pelo Supabase

// Tipos auxiliares para facilitar a leitura
type FuncionarioRow = Database['public']['Tables']['funcionarios']['Row'];
type FuncionarioInsertDb = Database['public']['Tables']['funcionarios']['Insert'];
type FuncionarioUpdateDb = Database['public']['Tables']['funcionarios']['Update'];

export const funcionariosSupabaseService = {
  getAll: async (): Promise<Funcionario[]> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapeamento de snake_case do DB para camelCase do tipo Funcionario
      // Com as validações para null/undefined do DB para os padrões do app
      return data?.map((item: FuncionarioRow) => ({
        id: item.id,
        dadosPessoais: item.dados_pessoais,
        endereco: item.endereco,
        contato: item.contato,
        dadosProfissionais: item.dados_profissionais,
        cnh: (item.cnh || {}) as Funcionario['cnh'], // Se DB pode ser null, garanta um objeto vazio
        dadosBancarios: item.dados_bancarios,
        documentos: (item.documentos || {}) as Funcionario['documentos'], // Assumindo que documentos pode ser null no DB
        dependentes: (item.dependentes || []) as Funcionario['dependentes'],
        tamanhoUniforme: (item.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 }) as Funcionario['tamanhoUniforme'],
        episEntregues: (item.epis_entregues || []) as Funcionario['episEntregues'],
        uniformesEntregues: (item.uniformes_entregues || []) as Funcionario['uniformesEntregues'],
        examesRealizados: (item.exames_realizados || []) as Funcionario['examesRealizados'],
        documentosGerados: (item.documentos_gerados || []) as Funcionario['documentosGerados']
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

      // Mapeamento de snake_case do DB para camelCase do tipo Funcionario
      const item = data as FuncionarioRow; // Assegure que 'data' é do tipo Row
      return {
        id: item.id,
        dadosPessoais: item.dados_pessoais,
        endereco: item.endereco,
        contato: item.contato,
        dadosProfissionais: item.dados_profissionais,
        cnh: (item.cnh || {}) as Funcionario['cnh'],
        dadosBancarios: item.dados_bancarios,
        documentos: (item.documentos || {}) as Funcionario['documentos'],
        dependentes: (item.dependentes || []) as Funcionario['dependentes'],
        tamanhoUniforme: (item.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 }) as Funcionario['tamanhoUniforme'],
        episEntregues: (item.epis_entregues || []) as Funcionario['episEntregues'],
        uniformesEntregues: (item.uniformes_entregues || []) as Funcionario['uniformesEntregues'],
        examesRealizados: (item.exames_realizados || []) as Funcionario['examesRealizados'],
        documentosGerados: (item.documentos_gerados || []) as Funcionario['documentosGerados']
      };
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      return null;
    }
  },

  create: async (funcionario: Omit<Funcionario, 'id'>): Promise<Funcionario> => {
    try {
      // Mapeamento de camelCase do app para snake_case do DB para inserção
      const dataToInsert: FuncionarioInsertDb = {
        dados_pessoais: funcionario.dadosPessoais,
        endereco: funcionario.endereco,
        contato: funcionario.contato,
        dados_profissionais: funcionario.dadosProfissionais,
        cnh: funcionario.cnh || null, // Se cnh pode ser null, passe null
        dados_bancarios: funcionario.dadosBancarios,
        // IMPORTANTE: documents deve ser um objeto JSON sem File, ou null
        documentos: funcionario.documentos || null,
        dependentes: funcionario.dependentes || null,
        tamanho_uniforme: funcionario.tamanhoUniforme || null,
        epis_entregues: funcionario.episEntregues || null,
        uniformes_entregues: funcionario.uniformesEntregues || null,
        exames_realizados: funcionario.examesRealizados || null,
        documentos_gerados: funcionario.documentosGerados || null,
        // created_at e updated_at são geralmente gerados pelo DB, não inclua aqui
      };

      const { data, error } = await supabase
        .from('funcionarios')
        // Aqui, a função insert espera um único objeto ou um array de objetos.
        // O erro original era porque o tipo do objeto interno não batia.
        // Com FuncionarioInsertDb, o TypeScript vai validar.
        .insert([dataToInsert]) // Insert espera um array de objetos para múltiplos inserts
        .select()
        .single(); // Se você espera apenas um de volta

      if (error) throw error;

      // Mapeamento de volta para o tipo Funcionario do app
      const createdItem = data as FuncionarioRow;
      return {
        id: createdItem.id,
        dadosPessoais: createdItem.dados_pessoais,
        endereco: createdItem.endereco,
        contato: createdItem.contato,
        dadosProfissionais: createdItem.dados_profissionais,
        cnh: (createdItem.cnh || {}) as Funcionario['cnh'],
        dadosBancarios: createdItem.dados_bancarios,
        documentos: (createdItem.documentos || {}) as Funcionario['documentos'],
        dependentes: (createdItem.dependentes || []) as Funcionario['dependentes'],
        tamanhoUniforme: (createdItem.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 }) as Funcionario['tamanhoUniforme'],
        episEntregues: (createdItem.epis_entregues || []) as Funcionario['episEntregues'],
        uniformesEntregues: (createdItem.uniformes_entregues || []) as Funcionario['uniformesEntregues'],
        examesRealizados: (createdItem.exames_realizados || []) as Funcionario['examesRealizados'],
        documentosGerados: (createdItem.documentos_gerados || []) as Funcionario['documentosGerados']
      };
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  },

  update: async (id: string, funcionario: Partial<Funcionario>): Promise<Funcionario> => {
    try {
      const updateData: FuncionarioUpdateDb = {}; // Use o tipo de update gerado

      // Mapeamento condicional e para snake_case
      if (funcionario.dadosPessoais) updateData.dados_pessoais = funcionario.dadosPessoais;
      if (funcionario.endereco) updateData.endereco = funcionario.endereco;
      if (funcionario.contato) updateData.contato = funcionario.contato;
      if (funcionario.dadosProfissionais) updateData.dados_profissionais = funcionario.dadosProfissionais;
      if (funcionario.cnh !== undefined) updateData.cnh = funcionario.cnh || null; // Cuidado com 'undefined' vs 'null'
      if (funcionario.dadosBancarios) updateData.dados_bancarios = funcionario.dadosBancarios;
      if (funcionario.documentos !== undefined) updateData.documentos = funcionario.documentos || null;
      if (funcionario.dependentes !== undefined) updateData.dependentes = funcionario.dependentes || null;
      if (funcionario.tamanhoUniforme !== undefined) updateData.tamanho_uniforme = funcionario.tamanhoUniforme || null;
      if (funcionario.episEntregues !== undefined) updateData.epis_entregues = funcionario.episEntregues || null;
      if (funcionario.uniformesEntregues !== undefined) updateData.uniformes_entregues = funcionario.uniformesEntregues || null;
      if (funcionario.examesRealizados !== undefined) updateData.exames_realizados = funcionario.examesRealizados || null;
      if (funcionario.documentosGerados !== undefined) updateData.documentos_gerados = funcionario.documentosGerados || null;

      const { data, error } = await supabase
        .from('funcionarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Mapeamento de volta para o tipo Funcionario do app
      const updatedItem = data as FuncionarioRow;
      return {
        id: updatedItem.id,
        dadosPessoais: updatedItem.dados_pessoais,
        endereco: updatedItem.endereco,
        contato: updatedItem.contato,
        dadosProfissionais: updatedItem.dados_profissionais,
        cnh: (updatedItem.cnh || {}) as Funcionario['cnh'],
        dadosBancarios: updatedItem.dados_bancarios,
        documentos: (updatedItem.documentos || {}) as Funcionario['documentos'],
        dependentes: (updatedItem.dependentes || []) as Funcionario['dependentes'],
        tamanhoUniforme: (updatedItem.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 }) as Funcionario['tamanhoUniforme'],
        episEntregues: (updatedItem.epis_entregues || []) as Funcionario['episEntregues'],
        uniformesEntregues: (updatedItem.uniformes_entregues || []) as Funcionario['uniformesEntregues'],
        examesRealizados: (updatedItem.exames_realizados || []) as Funcionario['examesRealizados'],
        documentosGerados: (updatedItem.documentos_gerados || []) as Funcionario['documentosGerados']
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