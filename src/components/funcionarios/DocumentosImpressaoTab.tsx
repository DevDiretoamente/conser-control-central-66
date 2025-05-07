
import React, { useState } from 'react';
import { Funcionario } from '@/types/funcionario';
import DocumentGenerator from './DocumentGenerator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import CompanyInfo from '@/components/CompanyInfo';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DocumentosImpressaoTabProps {
  funcionario: Funcionario;
  onUpdate?: (funcionario: Funcionario) => void;
  readOnly?: boolean;
}

const DocumentosImpressaoTab: React.FC<DocumentosImpressaoTabProps> = ({
  funcionario,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState("gerar");
  
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
              <DocumentGenerator funcionario={funcionario} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historico">
          <Card>
            <CardContent className="pt-6">
              <div className="p-6 text-center text-muted-foreground">
                <p>O histórico de documentos gerados será exibido aqui.</p>
                <p className="text-sm mt-2">Em breve: rastreamento de documentos assinados e pendentes.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentosImpressaoTab;
