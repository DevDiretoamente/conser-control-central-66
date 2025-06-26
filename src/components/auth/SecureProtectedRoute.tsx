
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2 } from 'lucide-react';

interface SecureProtectedRouteProps {
  children: React.ReactNode;
}

const SecureProtectedRoute: React.FC<SecureProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSecureAuth();
  const location = useLocation();

  console.log('SecureProtectedRoute - State:', { isAuthenticated, isLoading, path: location.pathname });

  // Enquanto está carregando, mostra spinner
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    console.log('SecureProtectedRoute - Redirecting to login');
    return <Navigate to="/secure-login" state={{ from: location }} replace />;
  }

  // Se está autenticado, renderiza os children
  return <>{children}</>;
};

export default SecureProtectedRoute;
