
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { UserRole, PermissionArea, PermissionLevel } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: {
    area: PermissionArea;
    level?: PermissionLevel;
  };
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission
}) => {
  const { isAuthenticated, isLoading, profile, hasRole, hasPermission } = useSecureAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the current location
    return <Navigate to="/secure-login" state={{ from: location }} replace />;
  }

  // Check if the user is active
  if (profile && !profile.is_active) {
    return <Navigate to="/conta-inativa" replace />;
  }

  // If a specific role is required, check if the user has permission
  if (requiredRole && profile && !hasRole(requiredRole)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  // If a specific permission is required, check if the user has it
  if (requiredPermission && profile && 
      !hasPermission(
        requiredPermission.area, 
        requiredPermission.level || 'read'
      )) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
