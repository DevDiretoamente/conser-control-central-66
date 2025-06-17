
-- Criar tabela de funcionários
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dados_pessoais JSONB NOT NULL,
  endereco JSONB NOT NULL,
  contato JSONB NOT NULL,
  dados_profissionais JSONB NOT NULL,
  cnh JSONB DEFAULT '{}',
  dados_bancarios JSONB NOT NULL,
  documentos JSONB DEFAULT '{}',
  dependentes JSONB DEFAULT '[]',
  tamanho_uniforme JSONB DEFAULT '{}',
  epis_entregues JSONB DEFAULT '[]',
  uniformes_entregues JSONB DEFAULT '[]',
  exames_realizados JSONB DEFAULT '[]',
  documentos_gerados JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de documentos RH
CREATE TABLE public.documentos_rh (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('contrato', 'termo_confidencialidade', 'acordo_horario', 'advertencia', 'elogio', 'avaliacao', 'ferias', 'atestado', 'licenca', 'rescisao', 'outros')),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data_documento DATE NOT NULL,
  data_vencimento DATE,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'vencido', 'arquivado')),
  arquivo TEXT, -- Base64 do PDF
  nome_arquivo TEXT,
  observacoes TEXT,
  assinado BOOLEAN NOT NULL DEFAULT false,
  data_assinatura DATE,
  criado_por TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de certificações
CREATE TABLE public.certificacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  entidade_certificadora TEXT NOT NULL,
  data_obtencao DATE NOT NULL,
  data_vencimento DATE,
  numero TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('tecnica', 'seguranca', 'qualidade', 'gestao', 'idioma', 'outros')),
  status TEXT NOT NULL DEFAULT 'valida' CHECK (status IN ('valida', 'vencida', 'em_renovacao')),
  arquivo TEXT, -- Base64 do certificado
  nome_arquivo TEXT,
  observacoes TEXT,
  renovacoes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de auditoria
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_title TEXT,
  changes JSONB,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('success', 'error', 'warning', 'info')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  entity_name TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (Row Level Security) nas tabelas
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_rh ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS básicas (permitir tudo por enquanto para desenvolvimento)
CREATE POLICY "Allow all operations on funcionarios" ON public.funcionarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on documentos_rh" ON public.documentos_rh FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on certificacoes" ON public.certificacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX idx_funcionarios_created_at ON public.funcionarios(created_at);
CREATE INDEX idx_documentos_rh_funcionario_id ON public.documentos_rh(funcionario_id);
CREATE INDEX idx_documentos_rh_tipo ON public.documentos_rh(tipo);
CREATE INDEX idx_documentos_rh_status ON public.documentos_rh(status);
CREATE INDEX idx_documentos_rh_data_vencimento ON public.documentos_rh(data_vencimento);
CREATE INDEX idx_certificacoes_funcionario_id ON public.certificacoes(funcionario_id);
CREATE INDEX idx_certificacoes_categoria ON public.certificacoes(categoria);
CREATE INDEX idx_certificacoes_status ON public.certificacoes(status);
CREATE INDEX idx_certificacoes_data_vencimento ON public.certificacoes(data_vencimento);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_funcionarios_updated_at 
  BEFORE UPDATE ON public.funcionarios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentos_rh_updated_at 
  BEFORE UPDATE ON public.documentos_rh 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificacoes_updated_at 
  BEFORE UPDATE ON public.certificacoes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
