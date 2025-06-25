
-- Criar tabela cartao_ponto no Supabase
CREATE TABLE public.cartao_ponto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  funcionario_nome TEXT NOT NULL,
  data DATE NOT NULL,
  hora_entrada TIME,
  hora_saida TIME,
  hora_almoco_saida TIME,
  hora_almoco_retorno TIME,
  total_horas DECIMAL(4,2) DEFAULT 0,
  horas_extras DECIMAL(4,2) DEFAULT 0,
  taxa_hora_extra DECIMAL(3,2) DEFAULT 0.5,
  status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'dispensado', 'feriado', 'falta_justificada', 'falta_injustificada', 'sobreaviso', 'ferias')),
  observacoes TEXT,
  aprovado_por TEXT,
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE(funcionario_id, data)
);

-- Criar índices para performance
CREATE INDEX idx_cartao_ponto_funcionario_id ON public.cartao_ponto(funcionario_id);
CREATE INDEX idx_cartao_ponto_data ON public.cartao_ponto(data);
CREATE INDEX idx_cartao_ponto_status ON public.cartao_ponto(status);
CREATE INDEX idx_cartao_ponto_funcionario_data ON public.cartao_ponto(funcionario_id, data);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_cartao_ponto_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cartao_ponto_updated_at
  BEFORE UPDATE ON public.cartao_ponto
  FOR EACH ROW
  EXECUTE FUNCTION update_cartao_ponto_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.cartao_ponto ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS - permitir acesso a usuários autenticados
CREATE POLICY "Usuários autenticados podem visualizar cartão ponto"
  ON public.cartao_ponto
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar registros de cartão ponto"
  ON public.cartao_ponto
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar cartão ponto"
  ON public.cartao_ponto
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar cartão ponto"
  ON public.cartao_ponto
  FOR DELETE
  TO authenticated
  USING (true);

-- Comentários para documentação
COMMENT ON TABLE public.cartao_ponto IS 'Tabela para armazenar registros de ponto dos funcionários';
COMMENT ON COLUMN public.cartao_ponto.funcionario_id IS 'Referência ao funcionário';
COMMENT ON COLUMN public.cartao_ponto.data IS 'Data do registro de ponto';
COMMENT ON COLUMN public.cartao_ponto.total_horas IS 'Total de horas trabalhadas no dia';
COMMENT ON COLUMN public.cartao_ponto.horas_extras IS 'Horas extras trabalhadas';
COMMENT ON COLUMN public.cartao_ponto.taxa_hora_extra IS 'Taxa de multiplicação para horas extras (ex: 0.5 = 50%)';
COMMENT ON COLUMN public.cartao_ponto.status IS 'Status do dia: normal, dispensado, feriado, faltas, etc.';
