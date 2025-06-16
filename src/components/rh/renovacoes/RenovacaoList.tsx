
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { RenovacaoCertificacao } from '@/types/documentosRH';

interface RenovacaoListProps {
  renovacoes: RenovacaoCertificacao[];
}

const RenovacaoList: React.FC<RenovacaoListProps> = ({ renovacoes }) => {
  if (renovacoes.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Nenhuma renovação registrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {renovacoes.map((renovacao) => (
        <Card key={renovacao.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Renovação em {new Date(renovacao.dataRenovacao).toLocaleDateString('pt-BR')}
              </CardTitle>
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(renovacao.novaDataVencimento).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              <p>Vencimento anterior: {new Date(renovacao.dataVencimentoAnterior).toLocaleDateString('pt-BR')}</p>
              {renovacao.observacoes && (
                <p className="mt-1">{renovacao.observacoes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RenovacaoList;
