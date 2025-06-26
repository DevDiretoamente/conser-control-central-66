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

  const isAuthenticated = !!session?.user;

  console.log('SecureAuth State:', { 
    user: !!user, 
    profile: profile ? { name: profile.name, role: profile.role } : null, 
    session: !!session, 
    isAuthenticated,
    isLoading
  });

  const refreshProfile = async () => {
    if (!user?.id) {
      console.log('No user ID available for profile refresh');
      return;
    }

    try {
      const profileData = await userService.refreshProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      // Fallback profile
      const fallbackProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'Admin',
        role: 'admin',
        company_id: 'default',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(fallbackProfile);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log('Initializing auth...');
        
        // Setup auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, !!session);
            
            if (!mounted) return;

            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user && event === 'SIGNED_IN') {
              setTimeout(() => {
                if (mounted) {
                  refreshProfile();
                }
              }, 100);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
              cleanupAuthState();
            }
          }
        );

        // Check initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            setTimeout(() => {
              if (mounted) {
                refreshProfile();
              }
            }, 100);
          }
          
          setIsLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('Auth initialization timeout, forcing completion');
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
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
