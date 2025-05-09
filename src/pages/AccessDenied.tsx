
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const AccessDenied: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-[500px] shadow-lg">
        <CardHeader className="bg-destructive/10 border-b">
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Acesso Negado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-destructive/10 p-6">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Permissão Insuficiente</h2>
            <p className="text-muted-foreground">
              {user ? (
                <>
                  Olá <span className="font-medium">{user.name}</span>, você não tem permissão para acessar esta página.
                  Seu perfil atual (<span className="font-medium">{user.role}</span>) não possui as permissões necessárias.
                </>
              ) : (
                <>Você não tem permissão para acessar esta página.</>
              )}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/">Voltar para o Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessDenied;
