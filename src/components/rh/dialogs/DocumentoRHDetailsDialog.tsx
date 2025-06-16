
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, User, FileText } from 'lucide-react';
import { DocumentoRH } from '@/types/documentosRH';
import { TIPOS_DOCUMENTO } from '../constants/documentosRHConstants';

interface DocumentoRHDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documento: DocumentoRH;
}

const DocumentoRHDetailsDialog: React.FC<DocumentoRHDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  documento
}) => {
  const getTipoLabel = (tipo: string) => {
    return TIPOS_DOCUMENTO.find(t => t.value === tipo)?.label || tipo;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ativo: { label: 'Ativo', className: 'bg-green-500' },
      vencido: { label: 'Vencido', className: 'bg-red-500' },
      arquivado: { label: 'Arquivado', className: 'bg-gray-500' }
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const handleDownload = () => {
    if (documento.arquivo && documento.nomeArquivo) {
      // Simular download do arquivo
      console.log('Download do arquivo:', documento.nomeArquivo);
      // Aqui seria implementada a lógica real de download
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {documento.titulo}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {getStatusBadge(documento.status)}
            <Badge variant="outline">{getTipoLabel(documento.tipo)}</Badge>
            {documento.assinado && (
              <Badge className="bg-blue-500">Assinado</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Data do Documento
              </div>
              <p className="font-medium">
                {new Date(documento.dataDocumento).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {documento.dataVencimento && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Data de Vencimento
                </div>
                <p className="font-medium">
                  {new Date(documento.dataVencimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Criado por
              </div>
              <p className="font-medium">{documento.criadoPor}</p>
            </div>

            {documento.dataAssinatura && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Data de Assinatura
                </div>
                <p className="font-medium">
                  {new Date(documento.dataAssinatura).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Descrição</h4>
            <p className="text-sm text-muted-foreground">
              {documento.descricao}
            </p>
          </div>

          {documento.observacoes && (
            <div className="space-y-2">
              <h4 className="font-medium">Observações</h4>
              <p className="text-sm text-muted-foreground">
                {documento.observacoes}
              </p>
            </div>
          )}

          {documento.arquivo && (
            <div className="space-y-2">
              <h4 className="font-medium">Arquivo Anexado</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm">{documento.nomeArquivo}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>Criado em: {new Date(documento.criadoEm).toLocaleString('pt-BR')}</p>
            <p>Atualizado em: {new Date(documento.atualizadoEm).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentoRHDetailsDialog;
