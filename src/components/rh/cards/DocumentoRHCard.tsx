
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { DocumentoRH } from '@/types/documentosRH';

interface DocumentoRHCardProps {
  documento: DocumentoRH;
  onEdit: (documento: DocumentoRH) => void;
}

const DocumentoRHCard: React.FC<DocumentoRHCardProps> = ({
  documento,
  onEdit
}) => {
  const getDocumentoTypeName = (tipo: DocumentoRH['tipo']) => {
    const typeMap = {
      contrato: 'Contrato',
      termo_confidencialidade: 'Termo de Confidencialidade',
      acordo_horario: 'Acordo de Horário',
      advertencia: 'Advertência',
      elogio: 'Elogio',
      avaliacao: 'Avaliação',
      ferias: 'Férias',
      atestado: 'Atestado',
      licenca: 'Licença',
      rescisao: 'Rescisão',
      outros: 'Outros'
    };
    return typeMap[tipo];
  };

  const getStatusBadge = (status: string, isVencido?: boolean) => {
    if (isVencido) {
      return <Badge className="bg-red-500">Vencido</Badge>;
    }
    
    const statusMap = {
      ativo: { label: 'Ativo', className: 'bg-green-500' },
      vencido: { label: 'Vencido', className: 'bg-red-500' },
      arquivado: { label: 'Arquivado', className: 'bg-gray-500' }
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

  const isVencido = checkVencimento(documento.dataVencimento);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{documento.titulo}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {getDocumentoTypeName(documento.tipo)}
            </p>
          </div>
          {getStatusBadge(documento.status, isVencido)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{documento.descricao}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Data:</span>
            <p className="font-medium">
              {new Date(documento.dataDocumento).toLocaleDateString('pt-BR')}
            </p>
          </div>
          {documento.dataVencimento && (
            <div>
              <span className="text-muted-foreground">Vencimento:</span>
              <p className="font-medium">
                {new Date(documento.dataVencimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        {isVencido && (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">Documento vencido</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2">
            {documento.assinado && (
              <Badge variant="outline">Assinado</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(documento)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentoRHCard;
