
-- Criar tabela obras no Supabase
CREATE TABLE public.obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('pavimentacao', 'construcao', 'reforma', 'manutencao', 'infraestrutura', 'outros')),
  status TEXT NOT NULL DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'aprovacao', 'execucao', 'pausada', 'concluida', 'cancelada')),
  prioridade TEXT NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  
  -- Informações do Cliente/Contratante
  cliente_id UUID,
  cliente_nome TEXT NOT NULL,
  contrato TEXT,
  valor_contrato DECIMAL(15,2) NOT NULL DEFAULT 0,
  
  -- Datas
  data_inicio DATE,
  data_fim_prevista DATE NOT NULL,
  data_fim_real DATE,
  
  -- Localização
  endereco JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Equipe
  responsavel_tecnico TEXT,
  encarregado TEXT,
  funcionarios_alocados JSONB DEFAULT '[]'::jsonb,
  
  -- Progresso
  progresso_percentual INTEGER DEFAULT 0 CHECK (progresso_percentual >= 0 AND progresso_percentual <= 100),
  etapas JSONB DEFAULT '[]'::jsonb,
  
  -- Recursos
  materiais JSONB DEFAULT '[]'::jsonb,
  equipamentos JSONB DEFAULT '[]'::jsonb,
  
  -- Documentos
  documentos JSONB DEFAULT '[]'::jsonb,
  
  -- Financeiro
  orcamento_total DECIMAL(15,2) DEFAULT 0,
  gasto_total DECIMAL(15,2) DEFAULT 0,
  receitas JSONB DEFAULT '[]'::jsonb,
  despesas JSONB DEFAULT '[]'::jsonb,
  
  -- Observações e histórico
  observacoes TEXT,
  historico_alteracoes JSONB DEFAULT '[]'::jsonb,
  
  -- Qualidade e segurança
  inspecoes JSONB DEFAULT '[]'::jsonb,
  ocorrencias JSONB DEFAULT '[]'::jsonb,
  
  -- Metadados
  criado_por TEXT NOT NULL DEFAULT 'system',
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_obras_status ON public.obras(status);
CREATE INDEX idx_obras_tipo ON public.obras(tipo);
CREATE INDEX idx_obras_prioridade ON public.obras(prioridade);
CREATE INDEX idx_obras_cliente_nome ON public.obras(cliente_nome);
CREATE INDEX idx_obras_data_fim_prevista ON public.obras(data_fim_prevista);
CREATE INDEX idx_obras_created_at ON public.obras(created_at);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_obras_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_obras_updated_at
  BEFORE UPDATE ON public.obras
  FOR EACH ROW
  EXECUTE FUNCTION update_obras_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS - permitir acesso a usuários autenticados
CREATE POLICY "Usuários autenticados podem visualizar obras"
  ON public.obras
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar obras"
  ON public.obras
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar obras"
  ON public.obras
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar obras"
  ON public.obras
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários para documentação
COMMENT ON TABLE public.obras IS 'Tabela para armazenar informações das obras/projetos';
COMMENT ON COLUMN public.obras.endereco IS 'Endereço da obra em formato JSON com campos: cep, rua, numero, complemento, bairro, cidade, uf, coordenadas';
COMMENT ON COLUMN public.obras.funcionarios_alocados IS 'Array de IDs dos funcionários alocados na obra';
COMMENT ON COLUMN public.obras.etapas IS 'Array de etapas da obra com informações de progresso';
COMMENT ON COLUMN public.obras.materiais IS 'Array de materiais utilizados na obra';
COMMENT ON COLUMN public.obras.equipamentos IS 'Array de equipamentos utilizados na obra';
COMMENT ON COLUMN public.obras.documentos IS 'Array de documentos relacionados à obra';
COMMENT ON COLUMN public.obras.receitas IS 'Array de receitas da obra';
COMMENT ON COLUMN public.obras.despesas IS 'Array de despesas da obra';
COMMENT ON COLUMN public.obras.historico_alteracoes IS 'Histórico de alterações da obra';
COMMENT ON COLUMN public.obras.inspecoes IS 'Array de inspeções realizadas na obra';
COMMENT ON COLUMN public.obras.ocorrencias IS 'Array de ocorrências registradas na obra';
