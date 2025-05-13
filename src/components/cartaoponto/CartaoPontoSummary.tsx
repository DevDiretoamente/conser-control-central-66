
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartaoPontoSummary as Summary } from '@/types/cartaoPonto';
import { Clock, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

interface CartaoPontoSummaryProps {
  summary: Summary;
  month: string;
}

const CartaoPontoSummary: React.FC<CartaoPontoSummaryProps> = ({ summary, month }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total de Horas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalHorasMes.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.totalHorasExtras > 0 ? (
              <span>Inclui {summary.totalHorasExtras.toFixed(1)}h extras</span>
            ) : (
              <span>Sem horas extras</span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Dias Trabalhados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dias Trabalhados</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.diasTrabalhados}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Em {month}
          </p>
        </CardContent>
      </Card>

      {/* Registros Incompletos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registros Pendentes</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.registrosIncompletos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Necessitam atenção
          </p>
        </CardContent>
      </Card>

      {/* Dias Faltantes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completude</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((summary.diasTrabalhados / (summary.diasTrabalhados + summary.diasFaltantes)) * 100)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.diasFaltantes > 0 
              ? `Faltam ${summary.diasFaltantes} dias`
              : 'Mês completo'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartaoPontoSummary;
