
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useLocation } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  const { profile } = useSecureAuth();
  const location = useLocation();
  
  // Try to determine which resource was being accessed
  const getResourceName = (path: string) => {
    if (path.includes('/funcionarios')) return 'Funcionários';
    if (path.includes('/obras')) return 'Obras';
    if (path.includes('/frota')) return 'Frota';
    if (path.includes('/patrimonio')) return 'Patrimônio';
    if (path.includes('/financeiro')) return 'Financeiro';
    if (path.includes('/configuracoes')) return 'Configurações';
    return 'este recurso';
  };
  
  const resourceName = getResourceName(location.pathname);
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-[550px] shadow-lg">
        <CardHeader className="bg-destructive/10 border-b">
          <CardTitle className="text-destructive flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
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
              {profile ? (
                <>
                  Olá <span className="font-medium">{profile.name}</span>, você não tem permissão para acessar <span className="font-medium">{resourceName}</span>.
                  <div className="mt-2">
                    Seu perfil atual (<span className="font-medium">{profile.role === 'admin' ? 'Administrador' : 
                      profile.role === 'manager' ? 'Gerente' : 'Operador'}</span>) não possui as permissões necessárias para esta operação.
                  </div>
                  <div className="mt-4 text-sm">
                    Para solicitar acesso, entre em contato com o administrador do sistema.
                  </div>
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
