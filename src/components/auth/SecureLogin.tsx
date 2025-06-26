
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const SecureLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading, isAuthenticated, checkFirstTimeSetup } = useSecureAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/app';

  useEffect(() => {
    const checkSetup = async () => {
      try {
        if (isAuthenticated) {
          console.log('User already authenticated, redirecting to:', from);
          navigate(from, { replace: true });
          return;
        }

        const isFirstTime = await checkFirstTimeSetup();
        if (isFirstTime) {
          navigate('/master-admin-setup', { replace: true });
        }
      } catch (error) {
        console.error('Error checking setup:', error);
      }
    };

    checkSetup();
  }, [isAuthenticated, navigate, from, checkFirstTimeSetup]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      await signIn(email, password);
      // Aguardar um pouco para o perfil carregar completamente
      setTimeout(() => {
        console.log('Redirecting to:', from);
        navigate(from, { replace: true });
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-[450px] shadow-lg">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="w-48 mx-auto mb-6">
            <Logo size="lg" />
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Acesso Seguro</CardTitle>
          </div>
          <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar à página inicial
            </Button>
          </div>
          
          <div className="text-sm text-center text-muted-foreground">
            <p>Sistema protegido com autenticação segura</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecureLogin;
