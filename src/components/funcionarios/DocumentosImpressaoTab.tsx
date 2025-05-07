
import React, { useState } from 'react';
import { Funcionario, DocumentoGerado } from '@/types/funcionario';
import DocumentGenerator from './DocumentGenerator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import CompanyInfo from '@/components/CompanyInfo';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DocumentoHistoricoList from './DocumentoHistoricoList';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentosImpressaoTabProps {
  funcionario: Funcionario;
  onUpdate?: (funcionario: Funcionario) => void;
  readOnly?: boolean;
}

// Mock data for document history
const mockDocumentos: DocumentoGerado[] = [
  {
    id: "1",
    titulo: "Declaração de Obra",
    categoria: "Declarações",
    dataGeracao: new Date(2023, 6, 15),
    status: 'assinado',
    dataAssinatura: new Date(2023, 6, 16)
  },
  {
    id: "2",
    titulo: "Opção de Vale Alimentação",
    categoria: "Benefícios",
    dataGeracao: new Date(2023, 7, 20),
    status: 'pendente',
    observacoes: "Aguardando assinatura do funcionário"
  },
  {
    id: "3",
    titulo: "Normas de Alojamento",
    categoria: "Alojamento",
    dataGeracao: new Date(2023, 8, 5),
    status: 'gerado'
  },
  {
    id: "4",
    titulo: "Designação de Beneficiário",
    categoria: "Seguro de Vida",
    dataGeracao: new Date(2023, 9, 10),
    status: 'arquivado',
    dataAssinatura: new Date(2023, 9, 12)
  }
];

const DocumentosImpressaoTab: React.FC<DocumentosImpressaoTabProps> = ({
  funcionario,
  onUpdate,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState("gerar");
  
  // In a real implementation, we would use funcionario.documentosGerados
  // For now, we'll use mock data
  const [documentos, setDocumentos] = useState<DocumentoGerado[]>(mockDocumentos);

  const handleDocumentGenerated = (titulo: string, categoria: string) => {
    if (!onUpdate) return;
    
    const novoDocumento: DocumentoGerado = {
      id: Date.now().toString(),
      titulo,
      categoria,
      dataGeracao: new Date(),
      status: 'gerado'
    };
    
    const documentosAtualizados = [...documentos, novoDocumento];
    setDocumentos(documentosAtualizados);
    
    // In a real implementation, we would update the funcionario object
    // onUpdate({
    //   ...funcionario,
    //   documentosGerados: documentosAtualizados
    // });
    
    toast.success(`Documento "${titulo}" gerado com sucesso!`);
    setActiveTab("historico"); // Switch to history tab
  };

  const handleViewDocument = (documento: DocumentoGerado) => {
    toast.info(`Visualizando documento: ${documento.titulo}`);
    // In a real implementation, this would show the document in a viewer
  };

  const handlePrintDocument = (documento: DocumentoGerado) => {
    toast.info(`Imprimindo documento: ${documento.titulo}`);
    // In a real implementation, this would print the document
  };

  const handleDownloadDocument = (documento: DocumentoGerado) => {
    toast.success(`Download do documento "${documento.titulo}" iniciado`);
    // In a real implementation, this would download the document
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <CompanyInfo />
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Documentos para impressão</AlertTitle>
        <AlertDescription>
          Nesta seção você pode gerar, visualizar e imprimir documentos pré-formatados para o funcionário, como 
          declarações, termos e outros documentos necessários. Todos os documentos incluirão o logotipo da CONSERVIAS 
          e informações de contato da empresa automaticamente.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="gerar">Gerar Documento</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gerar">
          <Card>
            <CardContent className="pt-6">
              <DocumentGenerator 
                funcionario={funcionario} 
                onDocumentGenerated={handleDocumentGenerated}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historico">
          <Card>
            <CardContent className="pt-6">
              {documentos.length > 0 ? (
                <DocumentoHistoricoList
                  documentos={documentos}
                  onView={handleViewDocument}
                  onPrint={handlePrintDocument}
                  onDownload={handleDownloadDocument}
                />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p>Nenhum documento foi gerado para este funcionário.</p>
                  <p className="text-sm mt-2">Gere um documento na aba 'Gerar Documento'.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentosImpressaoTab;
