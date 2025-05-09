
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PermissionLevel } from '@/types/auth';

interface PermissionBadgeProps {
  level: PermissionLevel | null;
  showLabel?: boolean;
  className?: string;
}

const PermissionBadge: React.FC<PermissionBadgeProps> = ({ 
  level, 
  showLabel = true,
  className
}) => {
  const getVariantByLevel = () => {
    switch(level) {
      case 'manage':
        return 'default'; // primary color
      case 'delete':
        return 'destructive'; // red color
      case 'write':
        return 'secondary'; // secondary color
      case 'read':
        return 'outline'; // outline style
      default:
        return 'outline';
    }
  };
  
  const getLabelByLevel = () => {
    switch(level) {
      case 'manage':
        return 'Gerenciar';
      case 'delete':
        return 'Excluir';
      case 'write':
        return 'Editar';
      case 'read':
        return 'Visualizar';
      default:
        return 'Sem acesso';
    }
  };

  if (!level) return null;

  return (
    <Badge 
      variant={getVariantByLevel()} 
      className={className}
    >
      {showLabel ? getLabelByLevel() : null}
    </Badge>
  );
};

export default PermissionBadge;
