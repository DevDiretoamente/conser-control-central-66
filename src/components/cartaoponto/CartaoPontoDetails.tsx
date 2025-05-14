
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Clock, Edit, User, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

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
      case 'dispensado':
        return <Badge variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">Dispensado</Badge>;
      case 'feriado':
        return <Badge variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">Feriado</Badge>;
      case 'falta_justificada':
        return <Badge variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600">Falta Justificada</Badge>;
      case 'falta_injustificada':
        return <Badge variant="destructive">Falta Injustificada</Badge>;
      case 'sobreaviso':
        return <Badge variant="outline" className="bg-orange-500 text-white hover:bg-orange-600">Sobreaviso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Helper function to get jornada badge
  const getJornadaBadge = (tipoJornada?: string) => {
    switch (tipoJornada) {
      case 'normal':
        return <Badge variant="outline">Jornada Normal</Badge>;
      case 'sabado':
        return <Badge variant="outline" className="bg-blue-500 text-white">Sábado</Badge>;
      case 'domingo_feriado':
        return <Badge variant="outline" className="bg-purple-500 text-white">Domingo/Feriado</Badge>;
      default:
        return null;
    }
  };
  
  // Helper to get overtime rate display
  const getOvertimeRateDisplay = (rate?: number) => {
    if (rate === 0.5) return '50%';
    if (rate === 0.8) return '80%';
    if (rate === 1.1) return '110%';
    return '-';
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div>
              <CardTitle className="text-2xl">Registro de Ponto</CardTitle>
              <CardDescription>
                {registro.data && format(parseISO(registro.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </div>
            <div className="flex flex-col md:items-end gap-1">
              {getStatusBadge(registro.status)}
              {getJornadaBadge(registro.tipoJornada)}
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
          
          {/* Horários Regulares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-2 h-4 w-4" /> ENTRADA E SAÍDA
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Entrada Manhã</p>
                  <p className="text-xl font-semibold">{formatTime(registro.horaEntrada)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saída Tarde</p>
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
                  <p className="text-sm text-muted-foreground">Saída Almoço</p>
                  <p className="text-xl font-semibold">{formatTime(registro.inicioAlmoco)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retorno Almoço</p>
                  <p className="text-xl font-semibold">{formatTime(registro.fimAlmoco)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Horas Extras */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="mr-2 h-4 w-4" /> HORAS EXTRAS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Início</p>
                <p className="text-xl font-semibold">{formatTime(registro.horaExtraInicio)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Término</p>
                <p className="text-xl font-semibold">{formatTime(registro.horaExtraFim)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa</p>
                <p className="text-xl font-semibold">{getOvertimeRateDisplay(registro.taxaHoraExtra)}</p>
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
              <p className="text-sm text-muted-foreground">Atualizado em</p>
              <p className="text-sm">
                {registro.updatedAt && format(new Date(registro.updatedAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </div>
          
          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Elegível para Cesta Básica:</p>
              {registro.eligibleCestaBasica ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Elegível para Lanche da Tarde:</p>
              {registro.eligibleLanche ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
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
