
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SecureProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredResource?: string;
  requiredAction?: string;
}

const SecureProtectedRoute: React.FC<SecureProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredResource,
  requiredAction = 'read'
}) => {
  const { isAuthenticated, isLoading, profile, hasRole, hasPermission, signOut } = useSecureAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/secure-login" state={{ from: location }} replace />;
  }

  // Check if the user profile is active
  if (profile && !profile.is_active) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle>Conta Inativa</CardTitle>
            <CardDescription>
              Sua conta foi desativada. Entre em contato com o administrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={signOut}>
              Fazer Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
              <br />
              Função necessária: {requiredRole}
              <br />
              Sua função: {profile?.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check resource-based permissions
  if (requiredResource && !hasPermission(requiredResource, requiredAction)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle>Permissão Insuficiente</CardTitle>
            <CardDescription>
              Você não tem permissão para {requiredAction} em {requiredResource}.
              <br />
              Entre em contato com o administrador para solicitar acesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecureProtectedRoute;
