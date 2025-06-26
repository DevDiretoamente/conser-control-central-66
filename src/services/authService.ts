
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/secureAuth';
import { cleanupAuthState } from '@/utils/authUtils';

export const authService = {
  async signIn(email: string, password: string) {
    cleanupAuthState();
    
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('Sign out before sign in failed:', err);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      console.log('Login successful for user:', data.user.id);
      toast.success('Login realizado com sucesso');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }
  },

  async signUp(email: string, password: string, name: string, role: string = 'operator') {
    const redirectUrl = `${window.location.origin}/app`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          role
        }
      }
    });

    if (error) throw error;
    toast.success('Conta criada com sucesso! Verifique seu email.');
  },

  async signOut() {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Sign out error:', err);
      }
      
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Erro ao fazer logout');
    }
  },

  async checkFirstTimeSetup(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Error checking first time setup:', error);
        return true;
      }

      return !data || data.length === 0;
    } catch (error) {
      console.error('Error in checkFirstTimeSetup:', error);
      return true;
    }
  }
};
