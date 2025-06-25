export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          details: Json | null
          entity_id: string
          entity_title: string | null
          entity_type: string
          id: string
          timestamp: string
        }
        Insert: {
          action: string
          changes?: Json | null
          details?: Json | null
          entity_id: string
          entity_title?: string | null
          entity_type: string
          id?: string
          timestamp?: string
        }
        Update: {
          action?: string
          changes?: Json | null
          details?: Json | null
          entity_id?: string
          entity_title?: string | null
          entity_type?: string
          id?: string
          timestamp?: string
        }
        Relationships: []
      }
      cartao_ponto: {
        Row: {
          aprovado_por: string | null
          created_at: string
          data: string
          data_aprovacao: string | null
          funcionario_id: string | null
          funcionario_nome: string
          hora_almoco_retorno: string | null
          hora_almoco_saida: string | null
          hora_entrada: string | null
          hora_saida: string | null
          horas_extras: number | null
          id: string
          observacoes: string | null
          status: string
          taxa_hora_extra: number | null
          total_horas: number | null
          updated_at: string
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          data: string
          data_aprovacao?: string | null
          funcionario_id?: string | null
          funcionario_nome: string
          hora_almoco_retorno?: string | null
          hora_almoco_saida?: string | null
          hora_entrada?: string | null
          hora_saida?: string | null
          horas_extras?: number | null
          id?: string
          observacoes?: string | null
          status?: string
          taxa_hora_extra?: number | null
          total_horas?: number | null
          updated_at?: string
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          data?: string
          data_aprovacao?: string | null
          funcionario_id?: string | null
          funcionario_nome?: string
          hora_almoco_retorno?: string | null
          hora_almoco_saida?: string | null
          hora_entrada?: string | null
          hora_saida?: string | null
          horas_extras?: number | null
          id?: string
          observacoes?: string | null
          status?: string
          taxa_hora_extra?: number | null
          total_horas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartao_ponto_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      certificacoes: {
        Row: {
          arquivo: string | null
          categoria: string
          created_at: string
          data_obtencao: string
          data_vencimento: string | null
          entidade_certificadora: string
          funcionario_id: string | null
          id: string
          nome: string
          nome_arquivo: string | null
          numero: string | null
          observacoes: string | null
          renovacoes: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          arquivo?: string | null
          categoria: string
          created_at?: string
          data_obtencao: string
          data_vencimento?: string | null
          entidade_certificadora: string
          funcionario_id?: string | null
          id?: string
          nome: string
          nome_arquivo?: string | null
          numero?: string | null
          observacoes?: string | null
          renovacoes?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          arquivo?: string | null
          categoria?: string
          created_at?: string
          data_obtencao?: string
          data_vencimento?: string | null
          entidade_certificadora?: string
          funcionario_id?: string | null
          id?: string
          nome?: string
          nome_arquivo?: string | null
          numero?: string | null
          observacoes?: string | null
          renovacoes?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificacoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_rh: {
        Row: {
          arquivo: string | null
          assinado: boolean
          created_at: string
          criado_por: string
          data_assinatura: string | null
          data_documento: string
          data_vencimento: string | null
          descricao: string
          funcionario_id: string | null
          id: string
          nome_arquivo: string | null
          observacoes: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo?: string | null
          assinado?: boolean
          created_at?: string
          criado_por: string
          data_assinatura?: string | null
          data_documento: string
          data_vencimento?: string | null
          descricao: string
          funcionario_id?: string | null
          id?: string
          nome_arquivo?: string | null
          observacoes?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo?: string | null
          assinado?: boolean
          created_at?: string
          criado_por?: string
          data_assinatura?: string | null
          data_documento?: string
          data_vencimento?: string | null
          descricao?: string
          funcionario_id?: string | null
          id?: string
          nome_arquivo?: string | null
          observacoes?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_rh_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          cnh: Json | null
          contato: Json
          created_at: string
          dados_bancarios: Json
          dados_pessoais: Json
          dados_profissionais: Json
          dependentes: Json | null
          documentos: Json | null
          documentos_gerados: Json | null
          endereco: Json
          epis_entregues: Json | null
          exames_realizados: Json | null
          id: string
          tamanho_uniforme: Json | null
          uniformes_entregues: Json | null
          updated_at: string
        }
        Insert: {
          cnh?: Json | null
          contato: Json
          created_at?: string
          dados_bancarios: Json
          dados_pessoais: Json
          dados_profissionais: Json
          dependentes?: Json | null
          documentos?: Json | null
          documentos_gerados?: Json | null
          endereco: Json
          epis_entregues?: Json | null
          exames_realizados?: Json | null
          id?: string
          tamanho_uniforme?: Json | null
          uniformes_entregues?: Json | null
          updated_at?: string
        }
        Update: {
          cnh?: Json | null
          contato?: Json
          created_at?: string
          dados_bancarios?: Json
          dados_pessoais?: Json
          dados_profissionais?: Json
          dependentes?: Json | null
          documentos?: Json | null
          documentos_gerados?: Json | null
          endereco?: Json
          epis_entregues?: Json | null
          exames_realizados?: Json | null
          id?: string
          tamanho_uniforme?: Json | null
          uniformes_entregues?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          id: string
          message: string
          priority: string
          read: boolean
          title: string
          type: string
        }
        Insert: {
          category: string
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          id?: string
          message: string
          priority?: string
          read?: boolean
          title: string
          type: string
        }
        Update: {
          category?: string
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          priority?: string
          read?: boolean
          title?: string
          type?: string
        }
        Relationships: []
      }
      obras: {
        Row: {
          atualizado_em: string
          cliente_id: string | null
          cliente_nome: string
          contrato: string | null
          created_at: string
          criado_em: string
          criado_por: string
          data_fim_prevista: string
          data_fim_real: string | null
          data_inicio: string | null
          descricao: string | null
          despesas: Json | null
          documentos: Json | null
          encarregado: string | null
          endereco: Json
          equipamentos: Json | null
          etapas: Json | null
          funcionarios_alocados: Json | null
          gasto_total: number | null
          historico_alteracoes: Json | null
          id: string
          inspecoes: Json | null
          materiais: Json | null
          nome: string
          observacoes: string | null
          ocorrencias: Json | null
          orcamento_total: number | null
          prioridade: string
          progresso_percentual: number | null
          receitas: Json | null
          responsavel_tecnico: string | null
          status: string
          tipo: string
          updated_at: string
          valor_contrato: number
        }
        Insert: {
          atualizado_em?: string
          cliente_id?: string | null
          cliente_nome: string
          contrato?: string | null
          created_at?: string
          criado_em?: string
          criado_por?: string
          data_fim_prevista: string
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          despesas?: Json | null
          documentos?: Json | null
          encarregado?: string | null
          endereco?: Json
          equipamentos?: Json | null
          etapas?: Json | null
          funcionarios_alocados?: Json | null
          gasto_total?: number | null
          historico_alteracoes?: Json | null
          id?: string
          inspecoes?: Json | null
          materiais?: Json | null
          nome: string
          observacoes?: string | null
          ocorrencias?: Json | null
          orcamento_total?: number | null
          prioridade?: string
          progresso_percentual?: number | null
          receitas?: Json | null
          responsavel_tecnico?: string | null
          status?: string
          tipo: string
          updated_at?: string
          valor_contrato?: number
        }
        Update: {
          atualizado_em?: string
          cliente_id?: string | null
          cliente_nome?: string
          contrato?: string | null
          created_at?: string
          criado_em?: string
          criado_por?: string
          data_fim_prevista?: string
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          despesas?: Json | null
          documentos?: Json | null
          encarregado?: string | null
          endereco?: Json
          equipamentos?: Json | null
          etapas?: Json | null
          funcionarios_alocados?: Json | null
          gasto_total?: number | null
          historico_alteracoes?: Json | null
          id?: string
          inspecoes?: Json | null
          materiais?: Json | null
          nome?: string
          observacoes?: string | null
          ocorrencias?: Json | null
          orcamento_total?: number | null
          prioridade?: string
          progresso_percentual?: number | null
          receitas?: Json | null
          responsavel_tecnico?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor_contrato?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "operator"],
    },
  },
} as const
