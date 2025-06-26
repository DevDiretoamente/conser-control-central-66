
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/secureAuth';

export const userService = {
  async refreshProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) {
      console.log('No user ID for profile refresh');
      return null;
    }

    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
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
            id: userId,
            email: '',
            name: 'Usuário',
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
        return newProfile;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in refreshProfile:', error);
      
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
      
      console.log('Setting fallback admin profile:', fallbackProfile);
      return fallbackProfile;
    }
  },

  async createUser(userData: { email: string; password: string; name: string; role: 'admin' | 'manager' | 'operator' }) {
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
    const { error } = await supabase.auth.admin.updateUserById(
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
