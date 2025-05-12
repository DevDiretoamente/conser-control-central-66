
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StatusDia } from '@/types/cartaoPonto';

interface StatusBadgeProps {
  status: StatusDia;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Determine badge style based on status
  const getBadgeStyle = (status: StatusDia) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'falta_injustificada':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'atestado':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'ferias':
        return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100';
      case 'dispensado':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'feriado':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'a_disposicao':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Get status display name
  const getStatusName = (status: StatusDia) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'falta_injustificada':
        return 'Falta Injustificada';
      case 'atestado':
        return 'Atestado';
      case 'ferias':
        return 'Férias';
      case 'dispensado':
        return 'Dispensado';
      case 'feriado':
        return 'Feriado';
      case 'a_disposicao':
        return 'À Disposição';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Badge variant="outline" className={getBadgeStyle(status)}>
      {getStatusName(status)}
    </Badge>
  );
};

export default StatusBadge;
