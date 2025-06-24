
import React from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, History } from 'lucide-react';

const UserActivationHistory: React.FC = () => {
  // Since we don't have activation history in SecureAuth, we'll show empty state
  const userActivationHistory: any[] = [];
  const users: any[] = [];
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário desconhecido';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  if (userActivationHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Ativação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Nenhuma alteração de status registrada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Ativação
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Quando</TableHead>
              <TableHead>Realizado por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...userActivationHistory].reverse().map((entry, index) => (
              <TableRow key={`${entry.userId}-${index}`}>
                <TableCell>{getUserName(entry.userId)}</TableCell>
                <TableCell>
                  {entry.action === 'activated' ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Ativado</Badge>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <Badge variant="secondary" className="bg-red-100 text-red-800">Desativado</Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell>{formatDate(entry.timestamp)}</TableCell>
                <TableCell>{entry.performedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserActivationHistory;
