
-- Inserir o usuário admin diretamente na tabela user_profiles
-- Como não podemos criar usuários auth diretamente via SQL, vamos criar um perfil
-- que será associado quando o usuário se registrar
INSERT INTO public.user_profiles (
  id,
  email,
  name,
  role,
  is_active,
  company_id
) VALUES (
  'f3769d4d-7075-4796-89db-34af7ad03d6b',
  'suporte@conserviaspg.com.br',
  'Administrador do Sistema',
  'admin',
  true,
  'default'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  company_id = EXCLUDED.company_id;

-- Garantir que temos pelo menos um admin ativo
UPDATE public.user_profiles 
SET role = 'admin', is_active = true 
WHERE email = 'suporte@conserviaspg.com.br';
