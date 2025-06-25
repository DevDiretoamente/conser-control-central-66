
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Obra } from '@/types/obras';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ObraDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obra: Obra | null;
}

const ObraDetails: React.FC<ObraDetailsProps> = ({ open, onOpenChange, obra }) => {
  if (!obra) return null;

  const getStatusBadge = (status: string) => {
    const statusMap = {
      planejamento: { variant: 'secondary' as const, label: 'Planejamento' },
      aprovacao: { variant: 'outline' as const, label: 'Aprovação' },
      execucao: { variant: 'default' as const, label: 'Execução' },
      pausada: { variant: 'destructive' as const, label: 'Pausada' },
      concluida: { variant: 'outline' as const, label: 'Concluída' },
      cancelada: { variant: 'destructive' as const, label: 'Cancelada' }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.planejamento;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const prioridadeMap = {
      baixa: { variant: 'secondary' as const, label: 'Baixa' },
      media: { variant: 'outline' as const, label: 'Média' },
      alta: { variant: 'default' as const, label: 'Alta' },
      urgente: { variant: 'destructive' as const, label: 'Urgente' }
    };
    
    const config = prioridadeMap[prioridade as keyof typeof prioridadeMap] || prioridadeMap.media;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não definida';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {obra.nome}
            {getStatusBadge(obra.status)}
            {getPrioridadeBadge(obra.prioridade)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{obra.clienteNome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium capitalize">{obra.tipo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contrato</p>
                <p className="font-medium">{obra.contrato || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor do Contrato</p>
                <p className="font-medium">{formatCurrency(obra.valorContrato)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          {obra.descricao && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                <p className="text-sm">{obra.descricao}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Datas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Cronograma</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data de Início</p>
                <p className="font-medium">{formatDate(obra.dataInicio)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Término Previsto</p>
                <p className="font-medium">{formatDate(obra.dataFimPrevista)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Término Real</p>
                <p className="font-medium">{formatDate(obra.dataFimReal)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Progresso */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Progresso</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conclusão</span>
                <span>{obra.progressoPercentual}%</span>
              </div>
              <Progress value={obra.progressoPercentual} className="h-2" />
            </div>
          </div>

          <Separator />

          {/* Equipe */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Equipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Responsável Técnico</p>
                <p className="font-medium">{obra.responsavelTecnico || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Encarregado</p>
                <p className="font-medium">{obra.encarregado || 'Não definido'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financeiro */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Financeiro</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Total</p>
                <p className="font-medium">{formatCurrency(obra.orcamentoTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gasto Total</p>
                <p className="font-medium">{formatCurrency(obra.gastoTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={`font-medium ${obra.orcamentoTotal - obra.gastoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(obra.orcamentoTotal - obra.gastoTotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Observações */}
          {obra.observacoes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Observações</h3>
                <p className="text-sm">{obra.observacoes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObraDetails;
