
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Printer, Download } from 'lucide-react';
import { DocumentTemplate } from '@/types/documentTemplate';

interface DocumentPreviewActionsProps {
  template: DocumentTemplate;
  onPreview: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

const DocumentPreviewActions: React.FC<DocumentPreviewActionsProps> = ({
  template,
  onPreview,
  onPrint,
  onDownload
}) => {
  return (
    <div className="p-4 bg-muted rounded-md">
      <h4 className="font-medium">{template.title}</h4>
      <p className="text-sm text-muted-foreground">{template.description}</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Visualizar
        </Button>
        <Button size="sm" onClick={onPrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button size="sm" variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Baixar PDF
        </Button>
      </div>
    </div>
  );
};

export default DocumentPreviewActions;
