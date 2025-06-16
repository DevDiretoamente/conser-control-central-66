
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Certificacao } from '@/types/documentosRH';

interface CertificacaoCardProps {
  certificacao: Certificacao;
  onEdit: (certificacao: Certificacao) => void;
  onView: (certificacao: Certificacao) => void;
  onDelete: (certificacao: Certificacao) => void;
  onRenew?: (certificacao: Certificacao) => void;
}

const CertificacaoCard: React.FC<CertificacaoCardProps> = ({
  certificacao,
  onEdit,
  onView,
  onDelete,
  onRenew
}) => {
  const getCategoriaName = (categoria: Certificacao['categoria']) => {
    const categoryMap = {
      tecnica: 'Técnica',
      seguranca: 'Segurança',
      qualidade: 'Qualidade',
      gestao: 'Gestão',
      idioma: 'Idioma',
      outros: 'Outros'
    };
    return categoryMap[categoria];
  };

  const getStatusBadge = (status: string, isVencida?: boolean) => {
    if (isVencida) {
      return <Badge className="bg-red-500">Vencida</Badge>;
    }
    
    const statusMap = {
      valida: { label: 'Válida', className: 'bg-green-500' },
      vencida: { label: 'Vencida', className: 'bg-red-500' },
      em_renovacao: { label: 'Em Renovação', className: 'bg-orange-500' }
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const checkVencimento = (dataVencimento?: string) => {
    if (!dataVencimento) return false;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };

  const isProximoVencimento = (dataVencimento?: string) => {
    if (!dataVencimento) return false;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 30 && diasRestantes > 0;
  };

  const isVencida = checkVencimento(certificacao.dataVencimento);
  const proximoVencimento = isProximoVencimento(certificacao.dataVencimento);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{certificacao.nome}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {certificacao.entidadeCertificadora}
            </p>
          </div>
          {getStatusBadge(certificacao.status, isVencida)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Categoria:</span>
            <p className="font-medium">{getCategoriaName(certificacao.categoria)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Obtida em:</span>
            <p className="font-medium">
              {new Date(certificacao.dataObtencao).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {certificacao.dataVencimento && (
          <div className="text-sm">
            <span className="text-muted-foreground">Vencimento:</span>
            <p className="font-medium">
              {new Date(certificacao.dataVencimento).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        {certificacao.numero && (
          <div className="text-sm">
            <span className="text-muted-foreground">Número:</span>
            <p className="font-medium">{certificacao.numero}</p>
          </div>
        )}

        {certificacao.renovacoes.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Renovações:</span>
            <p className="font-medium">{certificacao.renovacoes.length}</p>
          </div>
        )}

        {isVencida && (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">Certificação vencida</span>
          </div>
        )}

        {proximoVencimento && !isVencida && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-800">Vence em breve</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onView(certificacao)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(certificacao)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {onRenew && certificacao.dataVencimento && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRenew(certificacao)}
                className="text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(certificacao)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificacaoCard;
