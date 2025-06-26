
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const SecureLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useSecureAuth();
  const navigate = useNavigate();

  console.log('SecureLogin: Rendered', { email, isLoading });
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('SecureLogin: Attempting sign in');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      await signIn(email, password);
      console.log('SecureLogin: Sign in successful, navigating to /app');
      navigate('/app');
    } catch (err: any) {
      console.error('SecureLogin: Sign in error:', err);
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
              <Label htmlFor="password">Senha</Label>
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

          <div className="mt-4 p-3 bg-blue-50 rounded border">
            <p className="text-sm text-blue-800 mb-2">Para teste:</p>
            <p className="text-xs text-blue-600">Email: suporte@conserviaspg.com.br</p>
            <p className="text-xs text-blue-600">Senha: sua_senha_aqui</p>
          </div>
        </CardContent>
        
        <div className="p-6 pt-0 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar à página inicial
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SecureLogin;
