
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import CompanyInfo from '@/components/CompanyInfo';

interface DocumentPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  content: string | null;
  onPrint: () => void;
  onDownload: () => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  content,
  onPrint,
  onDownload
}) => {
  const documentContentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div ref={documentContentRef} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <CompanyInfo variant="letterhead" showFooter={true} className="mb-6" />
          <div className="pt-6">
            <div className="whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <Button onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
