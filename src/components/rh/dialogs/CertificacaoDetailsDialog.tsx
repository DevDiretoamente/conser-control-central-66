
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Award, Calendar, Building, Hash, FileText, RefreshCw } from 'lucide-react';
import { Certificacao } from '@/types/documentosRH';
import RenovacaoList from '../renovacoes/RenovacaoList';

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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      valida: { label: 'Válida', className: 'bg-green-500' },
      vencida: { label: 'Vencida', className: 'bg-red-500' },
      em_renovacao: { label: 'Em Renovação', className: 'bg-orange-500' }
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {certificacao.nome}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">
                {certificacao.entidadeCertificadora}
              </p>
            </div>
            {getStatusBadge(certificacao.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Data de Obtenção
              </div>
              <p className="text-sm">
                {new Date(certificacao.dataObtencao).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {certificacao.dataVencimento && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Data de Vencimento
                </div>
                <p className="text-sm">
                  {new Date(certificacao.dataVencimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Building className="h-4 w-4" />
                Categoria
              </div>
              <p className="text-sm">{getCategoriaName(certificacao.categoria)}</p>
            </div>

            {certificacao.numero && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4" />
                  Número
                </div>
                <p className="text-sm">{certificacao.numero}</p>
              </div>
            )}
          </div>

          {/* Observações */}
          {certificacao.observacoes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Observações
                </div>
                <p className="text-sm whitespace-pre-wrap">{certificacao.observacoes}</p>
              </div>
            </>
          )}

          {/* Arquivo */}
          {certificacao.nomeArquivo && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Arquivo
                </div>
                <p className="text-sm">{certificacao.nomeArquivo}</p>
              </div>
            </>
          )}

          {/* Histórico de Renovações */}
          {certificacao.renovacoes.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <RefreshCw className="h-4 w-4" />
                  Histórico de Renovações ({certificacao.renovacoes.length})
                </div>
                <RenovacaoList renovacoes={certificacao.renovacoes} />
              </div>
            </>
          )}

          {/* Informações de Sistema */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Criado em:</span>
              <p>{new Date(certificacao.criadoEm).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <span className="font-medium">Atualizado em:</span>
              <p>{new Date(certificacao.atualizadoEm).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificacaoDetailsDialog;
