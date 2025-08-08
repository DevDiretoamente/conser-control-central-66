
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vhetouswguygdowtvxxm.supabase.co";

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Service role key should only be used server-side
const SUPABASE_SERVICE_ROLE_KEY = isBrowser ? '' : (typeof process !== 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY || '' : '');

// Cliente separado para operações administrativas - only works server-side
export const supabaseAdmin = isBrowser ? null : createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Verificar se a service role key está configurada
export const isAdminConfigured = () => {
  if (isBrowser) {
    console.warn('supabaseAdmin: Admin client should not be used in browser environment');
    return false;
  }
  return !!SUPABASE_SERVICE_ROLE_KEY;
};

// Helper function to ensure admin operations only run server-side
export const requireServerSide = () => {
  if (isBrowser) {
    throw new Error('Admin operations cannot be performed in browser environment');
  }
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }
  return supabaseAdmin;
};
