
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator';
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SecureAuthContextType {
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
