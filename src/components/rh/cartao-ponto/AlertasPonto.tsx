
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";
import { CartaoPonto } from '@/types/cartaoPonto';

interface AlertasPontoProps {
  podeEditar: boolean;
  cartaoPonto: CartaoPonto | null;
}

const AlertasPonto: React.FC<AlertasPontoProps> = ({ podeEditar, cartaoPonto }) => {
  return (
    <>
      {!podeEditar && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Modo de visualização</AlertTitle>
          <AlertDescription>
            Você não tem permissão para editar os registros de ponto.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.fechado && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Período fechado</AlertTitle>
          <AlertDescription>
            Este cartão ponto já foi fechado e não pode mais ser editado.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.validado && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Período validado</AlertTitle>
          <AlertDescription>
            Este cartão ponto foi validado por {cartaoPonto.validadoPor} 
            em {new Date(cartaoPonto.dataValidacao || '').toLocaleString()}.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertasPonto;
