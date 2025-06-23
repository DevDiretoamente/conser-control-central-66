
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2 } from 'lucide-react';

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isLoading, session } = useSecureAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Timeout para evitar loading infinito
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 2000); // 2 segundos de timeout

    return () => clearTimeout(timer);
  }, []);

  console.log('AuthRedirect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'session:', !!session);

  // Se ainda está carregando e não passou do timeout, mostra loading
  if (isLoading && !timeoutReached) {
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
