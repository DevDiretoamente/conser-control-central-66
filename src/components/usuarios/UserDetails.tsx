
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Mail, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import UserPermissionsSummary from './UserPermissionsSummary';
import { User } from '@/types/auth';

interface UserDetailsProps {
  user: User;
  className?: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, className = '' }) => {
  const formatDate = (dateString: string, showTime: boolean = false) => {
    try {
      const date = new Date(dateString);
      if (showTime) {
        return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
      }
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case 'admin':
        return <Badge className="bg-primary">Administrador</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500">Gerente</Badge>;
      case 'operator':
        return <Badge className="bg-slate-500">Operador</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-muted">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-xl font-bold">{user.name}</h3>
                {getRoleBadge()}
              </div>
              <div className="flex items-center justify-center sm:justify-start mt-1">
                <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                <a href={`mailto:${user.email}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {user.email}
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">ID: {user.id}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Criado em: {formatDate(user.createdAt)}</span>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Último login: {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>
              
              <UserPermissionsSummary user={user} compact className="md:mt-0" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
