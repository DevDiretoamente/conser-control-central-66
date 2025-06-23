
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2 } from 'lucide-react';

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useSecureAuth();

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

  // Redirect authenticated users to the app, unauthenticated to login
  return isAuthenticated ? <Navigate to="/app" replace /> : <Navigate to="/secure-login" replace />;
};

export default AuthRedirect;
