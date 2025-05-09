
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PermissionLevel } from '@/types/auth';

interface PermissionBadgeProps {
  level: PermissionLevel;
  showLabel?: boolean;
  className?: string;
}

const PermissionBadge: React.FC<PermissionBadgeProps> = ({ 
  level, 
  showLabel = true,
  className = ''
}) => {
  let variant: 
    | 'default'    // manage (blue)
    | 'destructive' // delete (red)
    | 'secondary'   // write (purple)
    | 'success'     // create (green)
    | 'outline';    // read (gray)
  
  let label: string;
  let icon: JSX.Element | null = null;
  
  switch (level) {
    case 'manage':
      variant = 'default';
      label = 'Gerenciar';
      break;
    case 'delete':
      variant = 'destructive';
      label = 'Excluir';
      break;
    case 'write':
      variant = 'secondary';
      label = 'Editar';
      break;
    case 'create':
      variant = 'success';
      label = 'Incluir';
      break;
    case 'read':
      variant = 'outline';
      label = 'Visualizar';
      break;
    default:
      variant = 'outline';
      label = 'Desconhecido';
  }
  
  return (
    <Badge 
      variant={variant} 
      className={`${className} px-2 py-1 ${level === 'create' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
    >
      {icon}
      {showLabel && <span className="ml-1">{label}</span>}
    </Badge>
  );
};

export default PermissionBadge;
