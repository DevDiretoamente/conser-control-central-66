
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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

    const profileData = await userService.refreshProfile(user.id);
    setProfile(profileData);
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
