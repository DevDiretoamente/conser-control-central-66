
import React from 'react';
import { PermissionArea } from '@/types/auth';
import { Card, CardContent } from '@/components/ui/card';
import PermissionBadge from './PermissionBadge';
import { useSecureAuth } from '@/contexts/SecureAuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface UserPermissionsSummaryProps {
  user: User;
  compact?: boolean;
  className?: string;
}

// Common areas that might be interesting to highlight
const keyAreas: { id: PermissionArea; label: string }[] = [
  { id: 'rh', label: 'RH' },
  { id: 'obras', label: 'Obras' },
  { id: 'frota', label: 'Frota' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'usuarios', label: 'Usuários' },
];

const UserPermissionsSummary: React.FC<UserPermissionsSummaryProps> = ({ 
  user,
  compact = false,
  className = ''
}) => {
  const { hasPermission } = useSecureAuth();
  
  if (!user) return null;
  
  if (compact) {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {keyAreas.map(area => {
          const hasAreaPermission = hasPermission(area.id, 'read');
          if (!hasAreaPermission) return null;
          
          return (
            <div key={area.id} className="flex items-center">
              <span className="text-xs mr-1">{area.label}:</span>
              <PermissionBadge level="read" showLabel={false} />
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h4 className="text-sm font-medium mb-3">Principais Permissões</h4>
        <div className="space-y-2">
          {keyAreas.map(area => {
            const hasAreaPermission = hasPermission(area.id, 'read');
            
            return (
              <div key={area.id} className="flex justify-between items-center">
                <span className="text-sm">{area.label}</span>
                {hasAreaPermission ? (
                  <PermissionBadge level="read" />
                ) : (
                  <span className="text-xs text-muted-foreground">Sem acesso</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPermissionsSummary;
