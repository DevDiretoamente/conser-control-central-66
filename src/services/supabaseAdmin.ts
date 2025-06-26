
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vhetouswguygdowtvxxm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente separado para operações administrativas
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Verificar se a service role key está configurada
export const isAdminConfigured = () => {
  return !!SUPABASE_SERVICE_ROLE_KEY;
};
