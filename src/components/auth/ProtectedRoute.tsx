
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAuthenticated, isLoading, user, hasPermission, hasSpecificPermission } = useAuth();
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if the user has permission
  if (requiredRole && user && !hasPermission(requiredRole)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  // If a specific permission is required, check if the user has it
  if (requiredPermission && user && 
      !hasSpecificPermission(
        requiredPermission.area, 
        requiredPermission.level
      )) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
