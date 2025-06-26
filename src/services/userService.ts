import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin, isAdminConfigured } from './supabaseAdmin';
import { toast } from 'sonner';
import { UserProfile } from '@/types/secureAuth';

// Utilitário para retry com exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const userService = {
  async refreshProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) {
      console.log('userService.refreshProfile: No user ID provided');
      return null;
    }

    console.log('userService.refreshProfile: Starting profile refresh for user:', userId);

    try {
      const profileData = await retryWithBackoff(async () => {
        console.log('userService.refreshProfile: Attempting to fetch profile...');
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('userService.refreshProfile: Database error:', error);
          throw error;
        }

        return data;
      });

      if (!profileData) {
        console.log('userService.refreshProfile: No profile found, creating default profile');
        
        // Verificar se é o primeiro usuário
        const { data: existingProfiles } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);

        const isFirstUser = !existingProfiles || existingProfiles.length === 0;
        
        const newProfileData = {
          id: userId,
          email: '',
          name: 'Usuário',
          role: isFirstUser ? 'admin' as const : 'operator' as const,
          is_active: true,
          company_id: 'default'
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert(newProfileData)
          .select()
          .single();

        if (insertError) {
          console.error('userService.refreshProfile: Error creating profile:', insertError);
          // Retornar perfil fallback em caso de erro
          return {
            ...newProfileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }

        console.log('userService.refreshProfile: Profile created successfully:', newProfile);
        return newProfile;
      }

      console.log('userService.refreshProfile: Profile fetched successfully:', profileData);
      return profileData;
    } catch (error) {
      console.error('userService.refreshProfile: Final error after retries:', error);
      
      // Perfil fallback para manter a aplicação funcionando
      const fallbackProfile: UserProfile = {
        id: userId,
        email: '',
        name: 'Admin',
        role: 'admin',
        company_id: 'default',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('userService.refreshProfile: Using fallback profile:', fallbackProfile);
      return fallbackProfile;
    }
  },

  async createUser(userData: { email: string; password: string; name: string; role: 'admin' | 'manager' | 'operator' }) {
    // Verificar se temos configuração admin
    if (!isAdminConfigured()) {
      console.warn('userService.createUser: Service role not configured, using regular client');
      toast.error('Configuração administrativa necessária para criar usuários');
      throw new Error('Service role not configured');
    }

    try {
      console.log('userService.createUser: Creating user with admin client');
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
          name: userData.name,
          role: userData.role
        },
        email_confirm: true
      });

      if (error) {
        console.error('userService.createUser: Admin create user error:', error);
        throw error;
      }

      if (data.user) {
        console.log('userService.createUser: User created, creating profile...');
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
          console.error('userService.createUser: Error creating user profile:', profileError);
          // Não falhar completamente se o usuário foi criado
          toast.error('Usuário criado, mas erro ao criar perfil');
        } else {
          console.log('userService.createUser: User and profile created successfully');
          toast.success('Usuário criado com sucesso!');
        }
      }
    } catch (error: any) {
      console.error('userService.createUser: Final error:', error);
      
      // Mensagens de erro mais específicas
      if (error.message?.includes('User already registered')) {
        toast.error('Este email já está em uso');
      } else if (error.message?.includes('not_admin')) {
        toast.error('Configuração administrativa necessária');
      } else {
        toast.error('Erro ao criar usuário: ' + (error.message || 'Erro desconhecido'));
      }
      
      throw error;
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
    toast.success('Perfil atualizado com sucesso!');
  },

  async getAllUsers(): Promise<UserProfile[]> {
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
  },

  async resetUserPassword(userId: string, newPassword: string) {
    if (!isAdminConfigured()) {
      toast.error('Configuração administrativa necessária para resetar senhas');
      throw new Error('Service role not configured');
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (error) throw error;
    toast.success('Senha resetada com sucesso!');
  },

  async toggleUserActivation(userId: string, isActive: boolean) {
    await this.updateUserProfile(userId, { is_active: isActive });
    toast.success(`Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso!`);
  }
};
