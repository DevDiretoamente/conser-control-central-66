
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { ObrasDashboardData } from '@/types/obras';

interface ObrasDashboardProps {
  data: ObrasDashboardData;
}

const ObrasDashboard: React.FC<ObrasDashboardProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    });
  };

  const getTipoName = (tipo: string) => {
    const tipoMap: Record<string, string> = {
      pavimentacao: 'Pavimentação',
      construcao: 'Construção',
      reforma: 'Reforma',
      manutencao: 'Manutenção',
      infraestrutura: 'Infraestrutura',
      outros: 'Outros'
    };
    return tipoMap[tipo] || tipo;
  };

  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      planejamento: 'Planejamento',
      aprovacao: 'Aprovação',
      execucao: 'Execução',
      pausada: 'Pausada',
      concluida: 'Concluída',
      cancelada: 'Cancelada'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Obras</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalObras}</div>
            <p className="text-xs text-muted-foreground">
              Obras cadastradas no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.obrasAndamento}</div>
            <p className="text-xs text-muted-foreground">
              Obras em execução
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.obrasConcluidas}</div>
            <p className="text-xs text-muted-foreground">
              Obras finalizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.obrasAtrasadas}</div>
            <p className="text-xs text-muted-foreground">
              Obras com atraso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Contratos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.valorTotalContratos)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os contratos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Executado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.valorExecutado)}</div>
            <p className="text-xs text-muted-foreground">
              Total gasto até agora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.progressoMedio.toFixed(1)}%</div>
            <Progress value={data.progressoMedio} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Distribuições */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Obras por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.obrasPorTipo).map(([tipo, quantidade]) => (
                <div key={tipo} className="flex justify-between items-center">
                  <span className="text-sm">{getTipoName(tipo)}</span>
                  <Badge variant="outline">{quantidade}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Obras por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.obrasPorStatus).map(([status, quantidade]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm">{getStatusName(status)}</span>
                  <Badge variant="outline">{quantidade}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Vencimentos */}
      {data.proximosVencimentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próximos Vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.proximosVencimentos.map((vencimento) => (
                <div key={vencimento.obraId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{vencimento.obraNome}</p>
                    <p className="text-sm text-muted-foreground">
                      Vence em {new Date(vencimento.dataVencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge className={
                    vencimento.diasRestantes <= 0 ? 'bg-red-500' :
                    vencimento.diasRestantes <= 7 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }>
                    {vencimento.diasRestantes <= 0 ? 'Vencido' : `${vencimento.diasRestantes} dias`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ObrasDashboard;
