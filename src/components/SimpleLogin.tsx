
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RobustLogo from '@/components/RobustLogo';

const SimpleLogin: React.FC = () => {
  const [email, setEmail] = useState('suporte@conserviaspg.com.br');
  const [password, setPassword] = useState('sua_senha_aqui');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useSimpleAuth();
  const navigate = useNavigate();

  console.log('SimpleLogin - Rendered');
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('SimpleLogin - Attempting sign in');
    
    try {
      await signIn(email, password);
      console.log('SimpleLogin - Success, navigating to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('SimpleLogin - Error:', err);
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <RobustLogo size="lg" />
          </div>
          <CardTitle>Fazer Login</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleLogin;
