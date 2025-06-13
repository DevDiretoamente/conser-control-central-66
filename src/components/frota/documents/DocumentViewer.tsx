// src/components/frota/documents/DocumentViewer.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Download,
  FileText,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';
import { VehicleDocument } from '@/types/frota';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentViewerProps {
  document: VehicleDocument;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document: vehicleDocument,
  onClose
}) => {
  const downloadPdf = () => {
    if (!vehicleDocument.pdfFile || !vehicleDocument.fileName) return;

    try {
      // Cria blob a partir do base64
      const byteCharacters = atob(
        vehicleDocument.pdfFile.split(',')[1]
      );
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Usa window.document para acessar o DOM
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = vehicleDocument.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download do arquivo:', error);
    }
  };

  const getDocumentTypeName = (type: VehicleDocument['type']) => {
    const typeMap: Record<VehicleDocument['type'], string> = {
      crlv: 'CRLV',
      ipva: 'IPVA',
      insurance: 'Seguro',
      licensing: 'Licenciamento',
      inspection: 'Inspeção',
      aet: 'Autorização Especial de Trânsito',
      special_permit: 'Licença Especial',
      certificate: 'Certificado',
      custom: 'Personalizado',
      other: 'Outro'
    };
    return typeMap[type];
  };

  const getStatusBadge = (status: VehicleDocument['status']) => {
    const statusMap = {
      valid: { label: 'Válido', className: 'bg-green-500' },
      expiring_soon: {
        label: 'Vencendo',
        className: 'bg-yellow-500'
      },
      expired: { label: 'Vencido', className: 'bg-red-500' }
    } as const;
    const config = statusMap[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry(
    vehicleDocument.expiryDate
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho e ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <CardTitle>{vehicleDocument.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {getDocumentTypeName(vehicleDocument.type)}
                  {vehicleDocument.documentNumber &&
                    ` – ${vehicleDocument.documentNumber}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(vehicleDocument.status)}
              {vehicleDocument.pdfFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPdf}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Informações do documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Data de Emissão
                </p>
                <p className="font-medium">
                  {new Date(
                    vehicleDocument.issueDate
                  ).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Data de Vencimento
                </p>
                <p className="font-medium">
                  {new Date(
                    vehicleDocument.expiryDate
                  ).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            {vehicleDocument.issuingAuthority && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Órgão Emissor
                  </p>
                  <p className="font-medium">
                    {vehicleDocument.issuingAuthority}
                  </p>
                </div>
              </div>
            )}
            {vehicleDocument.value && vehicleDocument.value > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Valor Pago
                  </p>
                  <p className="font-medium">
                    R${' '}
                    {vehicleDocument.value.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Descrição */}
          {vehicleDocument.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Descrição
              </p>
              <p className="mt-1">
                {vehicleDocument.description}
              </p>
            </div>
          )}

          {/* Status de vencimento */}
          <div className="mt-4 pt-4 border-t">
            {daysUntilExpiry > 30 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-800">
                  Documento válido por mais {daysUntilExpiry} dias
                </span>
              </div>
            )}
            {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                <span className="text-sm text-yellow-800">
                  Documento vence em {daysUntilExpiry} dias – Atenção
                  necessária
                </span>
              </div>
            )}
            {daysUntilExpiry <= 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                <span className="text-sm text-red-800">
                  Documento vencido há{' '}
                  {Math.abs(daysUntilExpiry)} dias – Renovação urgente
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualização do PDF */}
      {vehicleDocument.pdfFile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Visualização do Documento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={vehicleDocument.pdfFile}
                width="100%"
                height="600px"
                title={`PDF – ${vehicleDocument.title}`}
                className="border-0"
              >
                <p>
                  Seu navegador não suporta PDF.{' '}
                  <button
                    onClick={downloadPdf}
                    className="text-blue-600 underline"
                  >
                    Clique aqui para download
                  </button>
                </p>
              </iframe>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de renovações */}
      {vehicleDocument.renewalHistory?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Histórico de Renovações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {vehicleDocument.renewalHistory.map((renewal) => (
                  <div
                    key={renewal.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        Renovado em{' '}
                        {new Date(
                          renewal.renewalDate
                        ).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento anterior:{' '}
                        {new Date(
                          renewal.previousExpiryDate
                        ).toLocaleDateString('pt-BR')}{' '}
                        → Novo vencimento:{' '}
                        {new Date(
                          renewal.newExpiryDate
                        ).toLocaleDateString('pt-BR')}
                      </p>
                      {renewal.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {renewal.notes}
                        </p>
                      )}
                    </div>
                    {renewal.cost != null && (
                      <div className="text-right">
                        <p className="font-medium">
                          R${' '}
                          {renewal.cost.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentViewer;
