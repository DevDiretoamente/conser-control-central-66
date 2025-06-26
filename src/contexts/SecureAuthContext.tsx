
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, SecureAuthContextType } from '@/types/secureAuth';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';

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

  useEffect(() => {
    console.log('SecureAuth: Initializing...');
    
    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          setProfile(null);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      console.log('SecureAuth: Timeout reached, stopping loading');
      setIsLoading(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signIn(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'operator') => {
    setIsLoading(true);
    try {
      await authService.signUp(email, password, name, role);
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

  const refreshProfile = async () => {
    if (!user?.id) return;
    try {
      const profileData = await userService.refreshProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
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
    hasRole: () => true, // Simplificado
    hasPermission: () => true, // Simplificado
    refreshProfile,
    createUser: userService.createUser,
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
