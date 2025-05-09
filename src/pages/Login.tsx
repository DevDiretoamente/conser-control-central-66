
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import Logo from '@/components/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous location or default to home
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    
    // Navigation will be handled in the useEffect in AuthContext after successful login
    setTimeout(() => {
      if (!error) {
        navigate(from, { replace: true });
      }
    }, 100);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@conservias.com', password: 'admin123' },
    { role: 'Gerente', email: 'gerente@conservias.com', password: 'gerente123' },
    { role: 'Operador', email: 'operador@conservias.com', password: 'operador123' }
  ];

  const setDemoAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="w-48 mx-auto mb-6">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo</CardTitle>
          <CardDescription>Acesse sua conta para continuar</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-muted-foreground mt-2 mb-4">
            Para demonstração, use uma das contas abaixo:
          </div>
          <div className="grid grid-cols-1 gap-2 w-full">
            {demoAccounts.map((account) => (
              <Button 
                key={account.role} 
                variant="outline" 
                size="sm"
                className="text-xs justify-start gap-2"
                onClick={() => setDemoAccount(account.email, account.password)}
              >
                <strong>{account.role}:</strong> {account.email} / {account.password}
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
