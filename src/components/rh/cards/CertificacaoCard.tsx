
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Certificacao } from '@/types/documentosRH';

interface CertificacaoCardProps {
  certificacao: Certificacao;
  onEdit: (certificacao: Certificacao) => void;
  onView: (certificacao: Certificacao) => void;
  onDelete: (certificacao: Certificacao) => void;
}

const CertificacaoCard: React.FC<CertificacaoCardProps> = ({
  certificacao,
  onEdit,
  onView,
  onDelete
}) => {
  const getStatusBadge = (status: string, isVencida?: boolean) => {
    if (isVencida) {
      return <Badge className="bg-red-500">Vencida</Badge>;
    }
    
    const statusMap = {
      valida: { label: 'Válida', className: 'bg-green-500' },
      vencida: { label: 'Vencida', className: 'bg-red-500' },
      em_renovacao: { label: 'Em Renovação', className: 'bg-yellow-500' }
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const getCategoriaLabel = (categoria: string) => {
    const categoriaMap = {
      tecnica: 'Técnica',
      seguranca: 'Segurança',
      qualidade: 'Qualidade',
      gestao: 'Gestão',
      idioma: 'Idioma',
      outros: 'Outros'
    } as const;
    
    return categoriaMap[categoria as keyof typeof categoriaMap] || categoria;
  };

  const checkVencimento = (dataVencimento?: string) => {
    if (!dataVencimento) return false;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };

  const isVencida = checkVencimento(certificacao.dataVencimento);

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
            <span className="text-muted-foreground">Obtida em:</span>
            <p className="font-medium">
              {new Date(certificacao.dataObtencao).toLocaleDateString('pt-BR')}
            </p>
          </div>
          {certificacao.dataVencimento && (
            <div>
              <span className="text-muted-foreground">Vencimento:</span>
              <p className="font-medium">
                {new Date(certificacao.dataVencimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        {certificacao.numero && (
          <div className="text-sm">
            <span className="text-muted-foreground">Número:</span>
            <span className="ml-2 font-mono">{certificacao.numero}</span>
          </div>
        )}

        {isVencida && (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">Certificação vencida</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <Badge variant="outline">{getCategoriaLabel(certificacao.categoria)}</Badge>
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
