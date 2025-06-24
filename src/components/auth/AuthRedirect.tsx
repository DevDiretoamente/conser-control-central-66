
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2 } from 'lucide-react';

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useSecureAuth();

  console.log('AuthRedirect - Current state:', { 
    isAuthenticated, 
    isLoading, 
    location: window.location.pathname 
  });

  // Se ainda está carregando, mostra loading
  if (isLoading) {
    console.log('AuthRedirect - Still loading, showing spinner');
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
    console.log('AuthRedirect - User authenticated, redirecting to /app');
    return <Navigate to="/app" replace />;
  }

  // Se não está autenticado, vai para login
  console.log('AuthRedirect - User not authenticated, redirecting to /secure-login');
  return <Navigate to="/secure-login" replace />;
};

export default AuthRedirect;
