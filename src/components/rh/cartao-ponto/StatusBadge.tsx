
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StatusDia } from '@/types/cartaoPonto';

interface StatusBadgeProps {
  status: StatusDia;
}

export const renderStatusBadge = (status: StatusDia): JSX.Element => {
  const statusOptions: { valor: StatusDia, nome: string }[] = [
    { valor: 'normal', nome: 'Normal' },
    { valor: 'falta_injustificada', nome: 'Falta Injustificada' },
    { valor: 'atestado', nome: 'Atestado' },
    { valor: 'ferias', nome: 'Férias' },
    { valor: 'dispensado', nome: 'Dispensado' },
    { valor: 'feriado', nome: 'Feriado' },
    { valor: 'a_disposicao', nome: 'À Disposição' }
  ];

  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  
  switch(status) {
    case 'normal':
      variant = 'default';
      break;
    case 'falta_injustificada':
      variant = 'destructive';
      break;
    case 'atestado':
      variant = 'secondary';
      break;
    case 'ferias':
    case 'dispensado':
    case 'feriado':
    case 'a_disposicao':
      variant = 'outline';
      break;
  }
  
  const label = statusOptions.find(opt => opt.valor === status)?.nome || status;
  
  return <Badge variant={variant}>{label}</Badge>;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return renderStatusBadge(status);
};

export default StatusBadge;
