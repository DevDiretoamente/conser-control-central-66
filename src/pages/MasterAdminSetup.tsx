
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Shield, Crown } from 'lucide-react';
import RobustLogo from '@/components/RobustLogo';
import { toast } from 'sonner';

const MasterAdminSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasExistingAdmins, setHasExistingAdmins] = useState(false);
  const navigate = useNavigate();

  console.log('MasterAdminSetup - Component mounted');

  useEffect(() => {
    console.log('MasterAdminSetup - Starting initialization check...');
    
    const checkFirstTimeSetup = async () => {
      try {
        console.log('MasterAdminSetup - Checking for existing admins...');
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);

        if (error) {
          console.error('MasterAdminSetup - Error checking admins:', error);
          // Continuar mesmo com erro para permitir setup
        } else {
          console.log('MasterAdminSetup - Admin check result:', data);
          const hasAdmins = data && data.length > 0;
          setHasExistingAdmins(hasAdmins);
          
          if (hasAdmins) {
            console.log('MasterAdminSetup - Admins exist, redirecting to login...');
            navigate('/secure-login');
            return;
          }
        }
      } catch (err) {
        console.error('MasterAdminSetup - Unexpected error during check:', err);
        // Continuar para permitir setup mesmo com erro
      } finally {
        console.log('MasterAdminSetup - Initialization complete');
        setIsInitializing(false);
      }
    };

    checkFirstTimeSetup();
  }, [navigate]);

  const handleMasterAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('MasterAdminSetup - Starting admin creation process...');
    
    setError('');
    setIsLoading(true);

    if (!name || !email || !password) {
      setError('Todos os campos são obrigatórios');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      console.log('MasterAdminSetup - Creating user with Supabase auth...');
      
      // Criar usuário diretamente com Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'admin'
          },
          emailRedirectTo: `${window.location.origin}/secure-login`
        }
      });

      if (authError) {
        console.error('MasterAdminSetup - Auth signup error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('MasterAdminSetup - User created, creating profile...');
        
        // Criar perfil diretamente na tabela user_profiles
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email,
            name,
            role: 'admin',
            is_active: true,
            company_id: 'default'
          });

        if (profileError) {
          console.error('MasterAdminSetup - Profile creation error:', profileError);
          // Não falhar completamente se o perfil não foi criado
          toast.error('Usuário criado, mas erro ao criar perfil. Tente fazer login.');
        } else {
          console.log('MasterAdminSetup - Profile created successfully');
          toast.success('Master Admin criado com sucesso! Verifique seu email para confirmar a conta.');
        }
      }
      
      // Redirecionar para login
      setTimeout(() => {
        navigate('/secure-login');
      }, 2000);
      
    } catch (err: any) {
      console.error('MasterAdminSetup - Final error:', err);
      
      // Mensagens de erro mais específicas
      if (err.message?.includes('User already registered')) {
        setError('Este email já está em uso');
      } else if (err.message?.includes('Invalid email')) {
        setError('Email inválido');
      } else {
        setError('Erro ao criar master admin: ' + (err.message || 'Erro desconhecido'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log('MasterAdminSetup - Render state:', { 
    isInitializing, 
    hasExistingAdmins, 
    isLoading,
    email: !!email,
    name: !!name 
  });

  // Loading inicial
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando configuração...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-[450px] shadow-lg">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="w-48 mx-auto mb-6">
            <RobustLogo size="lg" />
          </div>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <CardTitle className="text-2xl">Setup Master Admin</CardTitle>
          </div>
          <CardDescription className="text-center">
            Configure o primeiro administrador do sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <Shield className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Esta página permite criar o primeiro administrador do sistema. 
              Após criar o master admin, use a página de login normal.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleMasterAdminSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                <Crown className="mr-2 h-4 w-4" />}
              Criar Master Admin
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/secure-login')}
              className="text-sm"
            >
              Já tem uma conta? Fazer login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterAdminSetup;
