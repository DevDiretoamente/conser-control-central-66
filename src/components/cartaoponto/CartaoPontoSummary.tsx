
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartaoPontoSummary as Summary } from '@/types/cartaoPonto';
import { Clock, AlertTriangle, Calendar, CheckCircle, ShoppingBag, Utensils } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

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
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Extras 50%:</span>
              <span>{summary.totalHorasExtras50.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Extras 80%:</span>
              <span>{summary.totalHorasExtras80.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Extras 110%:</span>
              <span>{summary.totalHorasExtras110.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium border-t border-gray-200 pt-1 mt-1">
              <span>Total Extras:</span>
              <span>{summary.totalHorasExtras.toFixed(1)}h</span>
            </div>
          </div>
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
          <div className="mt-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Dias faltantes:</span>
              <span className={summary.diasFaltantes > 0 ? "text-amber-500" : "text-green-500"}>
                {summary.diasFaltantes}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-muted-foreground">Completude:</span>
              <span>
                {Math.round((summary.diasTrabalhados / (summary.diasTrabalhados + summary.diasFaltantes)) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefícios */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Benefícios</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              {formatMoney(summary.valorCestaBasica + summary.valorLanche)}
            </div>
            {summary.elegibleValeAlimentacao && 
              <CheckCircle className="h-4 w-4 text-green-500" />
            }
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Cesta Básica:</span>
              <span>{formatMoney(summary.valorCestaBasica)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Lanches:</span>
              <span>{formatMoney(summary.valorLanche)}</span>
            </div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground mr-1">Vale Alimentação:</span>
              {summary.elegibleValeAlimentacao ? 
                <span className="text-green-500">Elegível</span> : 
                <span className="text-red-500">Não elegível</span>
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registros Incompletos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registros Pendentes</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${summary.registrosIncompletos > 0 ? "text-amber-500" : "text-green-500"}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.registrosIncompletos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.registrosIncompletos > 0 ? "Necessitam atenção" : "Todos registros completos"}
          </p>
          {summary.registrosIncompletos > 0 && (
            <div className="mt-2 text-xs">
              <span className="text-amber-500 font-medium">
                Registros incompletos afetam o cálculo correto das horas e benefícios.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartaoPontoSummary;
