import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator';
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SecureAuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  refreshProfile: () => Promise<void>;
  createUser: (userData: { email: string; password: string; name: string; role: 'admin' | 'manager' | 'operator' }) => Promise<void>;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  getAllUsers: () => Promise<UserProfile[]>;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export function SecureAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!session?.user;

  console.log('SecureAuth State:', { 
    user: !!user, 
    profile: !!profile, 
    session: !!session, 
    isAuthenticated,
    isLoading,
    userId: user?.id
  });

  const refreshProfile = async () => {
    if (!user?.id) {
      console.log('No user ID for profile refresh');
      return;
    }

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating basic profile...');
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.email || 'Usuário',
              role: 'admin',
              is_active: true
            });
          
          if (!insertError) {
            const { data: newData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', user.id)
              .single();
            
            if (newData) {
              setProfile(newData);
              console.log('Profile created and fetched:', newData);
            }
          }
        } else {
          // Criar perfil padrão em caso de erro
          setProfile({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email || 'Usuário',
            role: 'admin',
            company_id: '',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      // Criar perfil padrão em caso de erro
      setProfile({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email || 'Usuário',
        role: 'admin',
        company_id: '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          console.log('User authenticated, fetching profile...');
          // Use setTimeout para evitar problemas de concorrência
          setTimeout(() => {
            if (mounted) {
              refreshProfile();
            }
          }, 100);
        } else if (!session) {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          if (mounted) {
            refreshProfile();
          }
        }, 100);
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        toast.success('Login realizado com sucesso');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'operator') => {
    try {
      setIsLoading(true);
      
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
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Logout realizado com sucesso');
      window.location.href = '/secure-login';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const hasRole = (role: string): boolean => {
    if (!profile) return false;
    return profile.role === role || profile.role === 'admin';
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!profile || !profile.is_active) return false;
    
    if (profile.role === 'admin') return true;
    
    const permissions = {
      manager: {
        funcionarios: ['read', 'create', 'update'],
        obras: ['read'], frota: ['read'], patrimonio: ['read'], financeiro: ['read'],
        exames: ['read', 'create', 'update'], cartaoponto: ['read', 'create', 'update'],
        rh: ['read', 'create', 'update'], configuracoes: ['read'],
        funcoes: ['read'], setores: ['read'], clinicas: ['read'], emails: ['read'],
        beneficios: ['read']
      },
      operator: {
        funcionarios: ['read'], obras: ['read'], frota: ['read'], patrimonio: ['read'],
        financeiro: ['read'], exames: ['read'], cartaoponto: ['read'], rh: ['read'],
        configuracoes: ['read'], funcoes: ['read'], setores: ['read'], clinicas: ['read'],
        emails: ['read'], beneficios: ['read']
      }
    };

    const rolePermissions = permissions[profile.role as keyof typeof permissions];
    if (!rolePermissions) return false;

    const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions];
    return resourcePermissions ? resourcePermissions.includes(action) : false;
  };

  const createUser = async (userData: { email: string; password: string; name: string; role: 'admin' | 'manager' | 'operator' }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            name: userData.name,
            role: userData.role,
            email_confirm: false
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('Usuário criado:', data.user.id);
        toast.success('Usuário criado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast.error(error.message || 'Erro ao criar usuário');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erro ao atualizar perfil');
      throw error;
    }
  };

  const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    hasRole,
    hasPermission,
    refreshProfile,
    createUser,
    updateUserProfile,
    getAllUsers
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
}

export const useSecureAuth = (): SecureAuthContextType => {
  const context = useContext(SecureAuthContext);
  
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  
  return context;
};
