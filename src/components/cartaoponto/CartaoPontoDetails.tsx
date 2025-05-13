
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CartaoPonto } from '@/types/cartaoPonto';
import { ArrowLeft, Clock, Edit, User, Calendar, MessageSquare } from 'lucide-react';

interface CartaoPontoDetailsProps {
  registro: CartaoPonto;
  onEdit?: () => void;
  canEdit: boolean;
}

const CartaoPontoDetails: React.FC<CartaoPontoDetailsProps> = ({ 
  registro, 
  onEdit,
  canEdit
}) => {
  const navigate = useNavigate();
  
  // Helper function to format time if it exists
  const formatTime = (time?: string) => {
    return time || '--:--';
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost"
          onClick={() => navigate('/rh/cartao-ponto')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        {canEdit && (
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Registro de Ponto</CardTitle>
              <CardDescription>
                {registro.data && format(parseISO(registro.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </div>
            <div>
              {getStatusBadge(registro.status)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Funcionário Info */}
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="font-medium">{registro.funcionarioNome || 'Funcionário'}</p>
              <p className="text-sm text-muted-foreground">ID: {registro.funcionarioId}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Horários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-2 h-4 w-4" /> ENTRADA E SAÍDA
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Entrada</p>
                  <p className="text-xl font-semibold">{formatTime(registro.horaEntrada)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saída</p>
                  <p className="text-xl font-semibold">{formatTime(registro.horaSaida)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-2 h-4 w-4" /> ALMOÇO
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Início</p>
                  <p className="text-xl font-semibold">{formatTime(registro.inicioAlmoco)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fim</p>
                  <p className="text-xl font-semibold">{formatTime(registro.fimAlmoco)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Totalizadores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total de Horas</p>
              <p className="text-xl font-semibold">
                {registro.totalHoras !== undefined ? `${registro.totalHoras.toFixed(2)}h` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horas Extras</p>
              <p className="text-xl font-semibold">
                {registro.horasExtras !== undefined ? `${registro.horasExtras.toFixed(2)}h` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criado em</p>
              <p className="text-sm">
                {registro.createdAt && format(new Date(registro.createdAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </div>
          
          {/* Observações e Justificativas */}
          {(registro.observacoes || registro.justificativa) && (
            <>
              <Separator />
              
              <div className="space-y-4">
                {registro.justificativa && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" /> JUSTIFICATIVA
                    </h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p>{registro.justificativa}</p>
                    </div>
                  </div>
                )}
                
                {registro.observacoes && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" /> OBSERVAÇÕES
                    </h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p>{registro.observacoes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartaoPontoDetails;
