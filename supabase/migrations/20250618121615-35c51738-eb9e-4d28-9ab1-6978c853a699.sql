
-- Criar enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'operator');

-- Criar tabela de perfis de usuário
CREATE TABLE public.user_profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'operator',
  company_id TEXT DEFAULT 'default',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Habilitar RLS na tabela user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar se usuário tem role específica
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Criar função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = _user_id
      AND role = 'admin'
      AND is_active = true
  )
$$;

-- Políticas RLS para user_profiles
-- Usuários podem ver todos os perfis (para listagem de usuários)
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Apenas admins podem inserir novos perfis
CREATE POLICY "Admins can insert profiles"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Usuários podem atualizar seu próprio perfil, admins podem atualizar qualquer perfil
CREATE POLICY "Users can update own profile, admins can update any"
  ON public.user_profiles
  FOR UPDATE
  USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

-- Apenas admins podem deletar perfis
CREATE POLICY "Admins can delete profiles"
  ON public.user_profiles
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Verificar se é o primeiro usuário (será admin)
  IF (SELECT COUNT(*) FROM public.user_profiles) = 0 THEN
    user_role := 'admin';
  ELSE
    user_role := 'operator';
  END IF;

  INSERT INTO public.user_profiles (
    id,
    email,
    name,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    user_role
  );
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
