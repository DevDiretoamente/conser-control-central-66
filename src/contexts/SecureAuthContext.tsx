
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, SecureAuthContextType } from '@/types/secureAuth';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { hasRole, hasPermission, cleanupAuthState } from '@/utils/authUtils';

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export function SecureAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAuthenticated = !!session?.user;

  console.log('SecureAuth State:', { 
    user: !!user, 
    profile: profile ? { name: profile.name, role: profile.role, active: profile.is_active } : null, 
    session: !!session, 
    isAuthenticated,
    isLoading,
    isInitialized
  });

  const refreshProfile = async () => {
    if (!user?.id) {
      console.log('SecureAuthContext.refreshProfile: No user ID available');
      return;
    }

    console.log('SecureAuthContext.refreshProfile: Starting profile refresh');
    
    try {
      const profileData = await userService.refreshProfile(user.id);
      console.log('SecureAuthContext.refreshProfile: Profile loaded:', !!profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('SecureAuthContext.refreshProfile: Error loading profile:', error);
      // Em caso de erro, criar um perfil fallback básico
      if (user) {
        const fallbackProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 'Usuário',
          role: 'admin',
          company_id: 'default',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(fallbackProfile);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      console.log('SecureAuthContext: Initializing auth...');
      
      try {
        // Timeout de segurança para evitar loading infinito
        initTimeout = setTimeout(() => {
          if (mounted && !isInitialized) {
            console.log('SecureAuthContext: Initialization timeout, forcing completion');
            setIsLoading(false);
            setIsInitialized(true);
          }
        }, 5000);

        // Configurar listener de mudanças de estado primeiro
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('SecureAuthContext: Auth state changed:', event, session?.user?.id);
            
            if (!mounted) return;

            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user && event === 'SIGNED_IN') {
              console.log('SecureAuthContext: User signed in, fetching profile...');
              // Usar setTimeout para evitar deadlock
              setTimeout(() => {
                if (mounted) {
                  refreshProfile();
                }
              }, 100);
            } else if (event === 'SIGNED_OUT') {
              console.log('SecureAuthContext: User signed out, clearing state');
              setProfile(null);
              cleanupAuthState();
            }

            // Marcar como inicializado após qualquer evento
            if (!isInitialized) {
              setIsLoading(false);
              setIsInitialized(true);
            }
          }
        );

        // Verificar sessão inicial
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SecureAuthContext: Error getting initial session:', error);
        }

        console.log('SecureAuthContext: Initial session check:', !!initialSession);
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            // Carregar perfil de forma assíncrona
            setTimeout(() => {
              if (mounted) {
                refreshProfile();
              }
            }, 100);
          }
          
          setIsLoading(false);
          setIsInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
          if (initTimeout) {
            clearTimeout(initTimeout);
          }
        };
      } catch (error) {
        console.error('SecureAuthContext: Error during initialization:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.signIn(email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'operator') => {
    try {
      setIsLoading(true);
      await authService.signUp(email, password, name, role);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const createUser = async (userData: { email: string; password: string; name: string; role: 'admin' | 'manager' | 'operator' }) => {
    try {
      setIsLoading(true);
      await userService.createUser(userData);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
    hasRole: (role: string) => hasRole(profile, role),
    hasPermission: (resource: string, action: string) => hasPermission(profile, resource, action),
    refreshProfile,
    createUser,
    updateUserProfile: userService.updateUserProfile,
    getAllUsers: userService.getAllUsers,
    checkFirstTimeSetup: authService.checkFirstTimeSetup,
    resetUserPassword: userService.resetUserPassword,
    toggleUserActivation: userService.toggleUserActivation
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
