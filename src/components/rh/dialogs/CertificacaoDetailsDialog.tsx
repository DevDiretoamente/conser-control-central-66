
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Award, Building, Hash } from 'lucide-react';
import { Certificacao } from '@/types/documentosRH';
import { CATEGORIAS_CERTIFICACAO } from '../constants/documentosRHConstants';

interface CertificacaoDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  certificacao: Certificacao;
}

const CertificacaoDetailsDialog: React.FC<CertificacaoDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  certificacao
}) => {
  const getCategoriaLabel = (categoria: string) => {
    return CATEGORIAS_CERTIFICACAO.find(c => c.value === categoria)?.label || categoria;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      valida: { label: 'Válida', className: 'bg-green-500' },
      vencida: { label: 'Vencida', className: 'bg-red-500' },
      em_renovacao: { label: 'Em Renovação', className: 'bg-yellow-500' }
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const handleDownload = () => {
    if (certificacao.arquivo && certificacao.nomeArquivo) {
      console.log('Download do certificado:', certificacao.nomeArquivo);
      // Aqui seria implementada a lógica real de download
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {certificacao.nome}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {getStatusBadge(certificacao.status)}
            <Badge variant="outline">{getCategoriaLabel(certificacao.categoria)}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                Entidade Certificadora
              </div>
              <p className="font-medium">{certificacao.entidadeCertificadora}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Data de Obtenção
              </div>
              <p className="font-medium">
                {new Date(certificacao.dataObtencao).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {certificacao.dataVencimento && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Data de Vencimento
                </div>
                <p className="font-medium">
                  {new Date(certificacao.dataVencimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            {certificacao.numero && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Número da Certificação
                </div>
                <p className="font-medium font-mono">{certificacao.numero}</p>
              </div>
            )}
          </div>

          {certificacao.observacoes && (
            <div className="space-y-2">
              <h4 className="font-medium">Observações</h4>
              <p className="text-sm text-muted-foreground">
                {certificacao.observacoes}
              </p>
            </div>
          )}

          {certificacao.renovacoes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Histórico de Renovações</h4>
              <div className="space-y-2">
                {certificacao.renovacoes.map((renovacao) => (
                  <div key={renovacao.id} className="p-3 border rounded-md text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p><strong>Data:</strong> {new Date(renovacao.dataRenovacao).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Nova validade:</strong> {new Date(renovacao.novaDataVencimento).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    {renovacao.observacoes && (
                      <p className="mt-2 text-muted-foreground">{renovacao.observacoes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificacao.arquivo && (
            <div className="space-y-2">
              <h4 className="font-medium">Certificado Anexado</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm">{certificacao.nomeArquivo}</span>
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
            <p>Criado em: {new Date(certificacao.criadoEm).toLocaleString('pt-BR')}</p>
            <p>Atualizado em: {new Date(certificacao.atualizadoEm).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificacaoDetailsDialog;
