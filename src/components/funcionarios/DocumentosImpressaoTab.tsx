
import React from 'react';
import { Funcionario } from '@/types/funcionario';
import DocumentGenerator from './DocumentGenerator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DocumentosImpressaoTabProps {
  funcionario: Funcionario;
  onUpdate?: (funcionario: Funcionario) => void;
  readOnly?: boolean;
}

const DocumentosImpressaoTab: React.FC<DocumentosImpressaoTabProps> = ({
  funcionario,
  readOnly = false
}) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Documentos para impressão</AlertTitle>
        <AlertDescription>
          Nesta seção você pode gerar, visualizar e imprimir documentos pré-formatados para o funcionário, como 
          declarações, termos e outros documentos necessários.
        </AlertDescription>
      </Alert>
      
      <DocumentGenerator funcionario={funcionario} />
    </div>
  );
};

export default DocumentosImpressaoTab;
