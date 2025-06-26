
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  checkFirstTimeSetup: () => Promise<boolean>;
  resetUserPassword: (userId: string, newPassword: string) => Promise<void>;
  toggleUserActivation: (userId: string, isActive: boolean) => Promise<void>;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

// Função para limpar estado de autenticação
const cleanupAuthState = () => {
  try {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn('Error cleaning auth state:', error);
  }
};

export function SecureAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!session?.user;

  console.log('SecureAuth State:', { 
    user: !!user, 
    profile: profile ? { name: profile.name, role: profile.role, active: profile.is_active } : null, 
    session: !!session, 
    isAuthenticated,
    isLoading
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (!data) {
        console.log('No profile found, creating default admin profile');
        const { data: existingProfiles } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);

        const isFirstUser = !existingProfiles || existingProfiles.length === 0;
        
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email || 'Usuário',
            role: isFirstUser ? 'admin' : 'operator',
            is_active: true,
            company_id: 'default'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        console.log('Profile created successfully:', newProfile);
        setProfile(newProfile);
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in refreshProfile:', error);
      
      const fallbackProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email || 'Admin',
        role: 'admin',
        company_id: 'default',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Setting fallback admin profile:', fallbackProfile);
      setProfile(fallbackProfile);
    }
  };

  const checkFirstTimeSetup = async (): Promise<boolean> => {
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
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          console.log('User signed in, fetching profile...');
          setTimeout(() => {
            if (mounted) {
              refreshProfile().finally(() => {
                setIsLoading(false);
              });
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          cleanupAuthState();
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
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
            refreshProfile().finally(() => {
              setIsLoading(false);
            });
          }
        }, 100);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
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
        
        // Aguardar carregamento do perfil antes de redirecionar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Não usar window.location.href - deixar o React Router lidar com isso
        return;
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
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Sign out error:', err);
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Logout realizado com sucesso');
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const hasRole = (role: string): boolean => {
    if (!profile) {
      console.log('hasRole: No profile available');
      return false;
    }
    
    if (profile.role === 'admin') {
      console.log('hasRole: Admin user, always has access');
      return true;
    }
    
    const hasRoleResult = profile.role === role;
    console.log('hasRole check:', { userRole: profile.role, requiredRole: role, result: hasRoleResult });
    return hasRoleResult;
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!profile || !profile.is_active) {
      console.log('hasPermission: No profile or inactive user');
      return false;
    }
    
    if (profile.role === 'admin') {
      console.log('hasPermission: Admin user, allowing access to', resource);
      return true;
    }
    
    const permissions = {
      manager: {
        funcionarios: ['read', 'create', 'update'],
        obras: ['read'], frota: ['read'], patrimonio: ['read'], financeiro: ['read'],
        exames: ['read', 'create', 'update'], cartaoponto: ['read', 'create', 'update'],
        rh: ['read', 'create', 'update'], configuracoes: ['read'],
        funcoes: ['read'], setores: ['read'], clinicas: ['read'], emails: ['read'],
        beneficios: ['read'], usuarios: ['read']
      },
      operator: {
        funcionarios: ['read'], obras: ['read'], frota: ['read'], patrimonio: ['read'],
        financeiro: ['read'], exames: ['read'], cartaoponto: ['read'], rh: ['read'],
        configuracoes: ['read'], funcoes: ['read'], setores: ['read'], clinicas: ['read'],
        emails: ['read'], beneficios: ['read'], usuarios: ['read']
      }
    };

    const rolePermissions = permissions[profile.role as keyof typeof permissions];
    if (!rolePermissions) return false;

    const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions];
    const hasPermissionResult = resourcePermissions ? resourcePermissions.includes(action) : false;
    
    console.log('hasPermission check:', { 
      userRole: profile.role, 
      resource, 
      action, 
      resourcePermissions, 
      result: hasPermissionResult 
    });
    
    return hasPermissionResult;
  };

  const createUser = async (userData: { email: string; password: string; name: string; role: 'admin' | 'manager' | 'operator' }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
          name: userData.name,
          role: userData.role
        },
        email_confirm: true
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            is_active: true,
            company_id: 'default'
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

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

  const resetUserPassword = async (userId: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );

      if (error) throw error;
      toast.success('Senha resetada com sucesso!');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Erro ao resetar senha');
      throw error;
    }
  };

  const toggleUserActivation = async (userId: string, isActive: boolean) => {
    try {
      await updateUserProfile(userId, { is_active: isActive });
      toast.success(`Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error: any) {
      console.error('Error toggling user activation:', error);
      toast.error(error.message || 'Erro ao alterar status do usuário');
      throw error;
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
    getAllUsers,
    checkFirstTimeSetup,
    resetUserPassword,
    toggleUserActivation
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
