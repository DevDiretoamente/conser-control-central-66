
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2 } from 'lucide-react';

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useSecureAuth();

  console.log('AuthRedirect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Se ainda está carregando, mostra loading por pouco tempo
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

  // Se está autenticado, vai para app
  if (isAuthenticated) {
    console.log('AuthRedirect - Redirecting to /app');
    return <Navigate to="/app" replace />;
  }

  // Se não está autenticado, vai para login
  console.log('AuthRedirect - Redirecting to /secure-login');
  return <Navigate to="/secure-login" replace />;
};

export default AuthRedirect;
