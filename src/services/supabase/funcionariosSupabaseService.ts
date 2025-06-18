
import { supabase } from '@/integrations/supabase/client';
import { Funcionario } from '@/types/funcionario';
import { Database } from '@/integrations/supabase/types';

// Tipos auxiliares para facilitar a leitura
type FuncionarioRow = Database['public']['Tables']['funcionarios']['Row'];
type FuncionarioInsertDb = Database['public']['Tables']['funcionarios']['Insert'];
type FuncionarioUpdateDb = Database['public']['Tables']['funcionarios']['Update'];

// Helper function to convert Date objects to ISO strings for JSON storage
const serializeDateForJson = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeDateForJson);
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeDateForJson(value);
    }
    return serialized;
  }
  
  return obj;
};

// Helper function to convert ISO strings back to Date objects
const deserializeDateFromJson = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
    return new Date(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deserializeDateFromJson);
  }
  
  if (typeof obj === 'object') {
    const deserialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      deserialized[key] = deserializeDateFromJson(value);
    }
    return deserialized;
  }
  
  return obj;
};

export const funcionariosSupabaseService = {
  getAll: async (): Promise<Funcionario[]> => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map((item: FuncionarioRow) => ({
        id: item.id,
        dadosPessoais: deserializeDateFromJson(item.dados_pessoais as unknown) as Funcionario['dadosPessoais'],
        endereco: item.endereco as unknown as Funcionario['endereco'],
        contato: item.contato as unknown as Funcionario['contato'],
        dadosProfissionais: deserializeDateFromJson(item.dados_profissionais as unknown) as Funcionario['dadosProfissionais'],
        cnh: deserializeDateFromJson(item.cnh || {} as unknown) as Funcionario['cnh'],
        dadosBancarios: item.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (item.documentos || {} as unknown) as Funcionario['documentos'],
        dependentes: deserializeDateFromJson(item.dependentes || [] as unknown) as Funcionario['dependentes'],
        tamanhoUniforme: (item.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 } as unknown) as Funcionario['tamanhoUniforme'],
        episEntregues: deserializeDateFromJson(item.epis_entregues || [] as unknown) as Funcionario['episEntregues'],
        uniformesEntregues: deserializeDateFromJson(item.uniformes_entregues || [] as unknown) as Funcionario['uniformesEntregues'],
        examesRealizados: deserializeDateFromJson(item.exames_realizados || [] as unknown) as Funcionario['examesRealizados'],
        documentosGerados: deserializeDateFromJson(item.documentos_gerados || [] as unknown) as Funcionario['documentosGerados']
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

      const item = data as FuncionarioRow;
      return {
        id: item.id,
        dadosPessoais: deserializeDateFromJson(item.dados_pessoais as unknown) as Funcionario['dadosPessoais'],
        endereco: item.endereco as unknown as Funcionario['endereco'],
        contato: item.contato as unknown as Funcionario['contato'],
        dadosProfissionais: deserializeDateFromJson(item.dados_profissionais as unknown) as Funcionario['dadosProfissionais'],
        cnh: deserializeDateFromJson(item.cnh || {} as unknown) as Funcionario['cnh'],
        dadosBancarios: item.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (item.documentos || {} as unknown) as Funcionario['documentos'],
        dependentes: deserializeDateFromJson(item.dependentes || [] as unknown) as Funcionario['dependentes'],
        tamanhoUniforme: (item.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 } as unknown) as Funcionario['tamanhoUniforme'],
        episEntregues: deserializeDateFromJson(item.epis_entregues || [] as unknown) as Funcionario['episEntregues'],
        uniformesEntregues: deserializeDateFromJson(item.uniformes_entregues || [] as unknown) as Funcionario['uniformesEntregues'],
        examesRealizados: deserializeDateFromJson(item.exames_realizados || [] as unknown) as Funcionario['examesRealizados'],
        documentosGerados: deserializeDateFromJson(item.documentos_gerados || [] as unknown) as Funcionario['documentosGerados']
      };
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      return null;
    }
  },

  create: async (funcionario: Omit<Funcionario, 'id'>): Promise<Funcionario> => {
    try {
      // Create a serialized version for database storage (excluding File objects)
      const documentosForDb = {
        // Note: File objects should be handled separately via file upload
        // For now, we'll store empty objects as placeholders
        rgFile: null,
        cpfFile: null,
        comprovanteResidencia: null,
        fotoFile: null,
        cnhFile: null,
        ctpsFile: null,
        exameMedicoFile: null,
        outrosDocumentos: []
      };

      const dataToInsert: FuncionarioInsertDb = {
        dados_pessoais: serializeDateForJson(funcionario.dadosPessoais) as any,
        endereco: funcionario.endereco as any,
        contato: funcionario.contato as any,
        dados_profissionais: serializeDateForJson(funcionario.dadosProfissionais) as any,
        cnh: serializeDateForJson(funcionario.cnh || {}) as any,
        dados_bancarios: funcionario.dadosBancarios as any,
        documentos: documentosForDb as any,
        dependentes: serializeDateForJson(funcionario.dependentes || []) as any,
        tamanho_uniforme: funcionario.tamanhoUniforme as any,
        epis_entregues: serializeDateForJson(funcionario.episEntregues || []) as any,
        uniformes_entregues: serializeDateForJson(funcionario.uniformesEntregues || []) as any,
        exames_realizados: serializeDateForJson(funcionario.examesRealizados || []) as any,
        documentos_gerados: serializeDateForJson(funcionario.documentosGerados || []) as any,
      };

      const { data, error } = await supabase
        .from('funcionarios')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      const createdItem = data as FuncionarioRow;
      return {
        id: createdItem.id,
        dadosPessoais: deserializeDateFromJson(createdItem.dados_pessoais as unknown) as Funcionario['dadosPessoais'],
        endereco: createdItem.endereco as unknown as Funcionario['endereco'],
        contato: createdItem.contato as unknown as Funcionario['contato'],
        dadosProfissionais: deserializeDateFromJson(createdItem.dados_profissionais as unknown) as Funcionario['dadosProfissionais'],
        cnh: deserializeDateFromJson(createdItem.cnh || {} as unknown) as Funcionario['cnh'],
        dadosBancarios: createdItem.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (createdItem.documentos || {} as unknown) as Funcionario['documentos'],
        dependentes: deserializeDateFromJson(createdItem.dependentes || [] as unknown) as Funcionario['dependentes'],
        tamanhoUniforme: (createdItem.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 } as unknown) as Funcionario['tamanhoUniforme'],
        episEntregues: deserializeDateFromJson(createdItem.epis_entregues || [] as unknown) as Funcionario['episEntregues'],
        uniformesEntregues: deserializeDateFromJson(createdItem.uniformes_entregues || [] as unknown) as Funcionario['uniformesEntregues'],
        examesRealizados: deserializeDateFromJson(createdItem.exames_realizados || [] as unknown) as Funcionario['examesRealizados'],
        documentosGerados: deserializeDateFromJson(createdItem.documentos_gerados || [] as unknown) as Funcionario['documentosGerados']
      };
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  },

  update: async (id: string, funcionario: Partial<Funcionario>): Promise<Funcionario> => {
    try {
      const updateData: FuncionarioUpdateDb = {};

      if (funcionario.dadosPessoais) updateData.dados_pessoais = serializeDateForJson(funcionario.dadosPessoais) as any;
      if (funcionario.endereco) updateData.endereco = funcionario.endereco as any;
      if (funcionario.contato) updateData.contato = funcionario.contato as any;
      if (funcionario.dadosProfissionais) updateData.dados_profissionais = serializeDateForJson(funcionario.dadosProfissionais) as any;
      if (funcionario.cnh !== undefined) updateData.cnh = serializeDateForJson(funcionario.cnh || {}) as any;
      if (funcionario.dadosBancarios) updateData.dados_bancarios = funcionario.dadosBancarios as any;
      if (funcionario.documentos !== undefined) {
        // Handle File objects - convert to placeholder for now
        const documentosForDb = {
          rgFile: null,
          cpfFile: null,
          comprovanteResidencia: null,
          fotoFile: null,
          cnhFile: null,
          ctpsFile: null,
          exameMedicoFile: null,
          outrosDocumentos: []
        };
        updateData.documentos = documentosForDb as any;
      }
      if (funcionario.dependentes !== undefined) updateData.dependentes = serializeDateForJson(funcionario.dependentes || []) as any;
      if (funcionario.tamanhoUniforme !== undefined) updateData.tamanho_uniforme = funcionario.tamanhoUniforme as any;
      if (funcionario.episEntregues !== undefined) updateData.epis_entregues = serializeDateForJson(funcionario.episEntregues || []) as any;
      if (funcionario.uniformesEntregues !== undefined) updateData.uniformes_entregues = serializeDateForJson(funcionario.uniformesEntregues || []) as any;
      if (funcionario.examesRealizados !== undefined) updateData.exames_realizados = serializeDateForJson(funcionario.examesRealizados || []) as any;
      if (funcionario.documentosGerados !== undefined) updateData.documentos_gerados = serializeDateForJson(funcionario.documentosGerados || []) as any;

      const { data, error } = await supabase
        .from('funcionarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedItem = data as FuncionarioRow;
      return {
        id: updatedItem.id,
        dadosPessoais: deserializeDateFromJson(updatedItem.dados_pessoais as unknown) as Funcionario['dadosPessoais'],
        endereco: updatedItem.endereco as unknown as Funcionario['endereco'],
        contato: updatedItem.contato as unknown as Funcionario['contato'],
        dadosProfissionais: deserializeDateFromJson(updatedItem.dados_profissionais as unknown) as Funcionario['dadosProfissionais'],
        cnh: deserializeDateFromJson(updatedItem.cnh || {} as unknown) as Funcionario['cnh'],
        dadosBancarios: updatedItem.dados_bancarios as unknown as Funcionario['dadosBancarios'],
        documentos: (updatedItem.documentos || {} as unknown) as Funcionario['documentos'],
        dependentes: deserializeDateFromJson(updatedItem.dependentes || [] as unknown) as Funcionario['dependentes'],
        tamanhoUniforme: (updatedItem.tamanho_uniforme || { camisa: '', calca: '', calcado: 0 } as unknown) as Funcionario['tamanhoUniforme'],
        episEntregues: deserializeDateFromJson(updatedItem.epis_entregues || [] as unknown) as Funcionario['episEntregues'],
        uniformesEntregues: deserializeDateFromJson(updatedItem.uniformes_entregues || [] as unknown) as Funcionario['uniformesEntregues'],
        examesRealizados: deserializeDateFromJson(updatedItem.exames_realizados || [] as unknown) as Funcionario['examesRealizados'],
        documentosGerados: deserializeDateFromJson(updatedItem.documentos_gerados || [] as unknown) as Funcionario['documentosGerados']
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
