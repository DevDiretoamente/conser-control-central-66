
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { formatarMinutosParaHora } from '@/types/cartaoPonto';
import { CartaoPonto } from '@/types/cartaoPonto';

interface HorasResumoProps {
  cartaoPonto: CartaoPonto;
}

const HorasResumo: React.FC<HorasResumoProps> = ({ cartaoPonto }) => {
  return (
    <Card className="mt-8 bg-gradient-to-br from-card to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Resumo de Horas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Horas normais
            </h3>
            <p className="text-2xl font-semibold">
              {formatarMinutosParaHora(cartaoPonto.totalHorasNormais)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Horas extras (50%)
            </h3>
            <p className="text-2xl font-semibold">
              {formatarMinutosParaHora(cartaoPonto.totalHorasExtras50)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Horas extras (80%)
            </h3>
            <p className="text-2xl font-semibold">
              {formatarMinutosParaHora(cartaoPonto.totalHorasExtras80)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Horas extras (110%)
            </h3>
            <p className="text-2xl font-semibold">
              {formatarMinutosParaHora(cartaoPonto.totalHorasExtras110)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Horas noturnas
            </h3>
            <p className="text-2xl font-semibold">
              {formatarMinutosParaHora(cartaoPonto.totalHorasNoturno)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Quantidade de lanches
            </h3>
            <p className="text-2xl font-semibold">
              {cartaoPonto.totalLanches} 
              <span className="text-sm font-normal text-muted-foreground ml-1">
                (R$ {cartaoPonto.totalLanches * 5},00)
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HorasResumo;
