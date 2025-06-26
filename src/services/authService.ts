
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cleanupAuthState } from '@/utils/authUtils';

export const authService = {
  async signIn(email: string, password: string) {
    console.log('authService.signIn: Starting sign in process');
    
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('Pre-signin cleanup failed:', err);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('authService.signIn: Error:', error);
      throw error;
    }

    if (data.user) {
      console.log('authService.signIn: Login successful');
      toast.success('Login realizado com sucesso');
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
      console.log('authService.signOut: Starting sign out');
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
      console.log('authService.checkFirstTimeSetup: Checking for admin users');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin')
        .eq('is_active', true)
        .limit(1);

      if (error) {
        console.error('authService.checkFirstTimeSetup: Database error:', error);
        return true; // Assume first time on error
      }

      const hasActiveAdmin = data && data.length > 0;
      console.log('authService.checkFirstTimeSetup: Has active admin:', hasActiveAdmin);
      
      return !hasActiveAdmin;
    } catch (error) {
      console.error('authService.checkFirstTimeSetup: Unexpected error:', error);
      return true; // Assume first time on error
    }
  }
};
