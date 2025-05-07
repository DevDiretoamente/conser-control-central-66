
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface DocumentPreviewProps {
  file: File | null;
  name: string;
  icon?: React.ReactNode;
  uploadDate?: Date;
  expirationDate?: Date;
  onRemove?: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  name,
  icon = <FileText className="h-8 w-8 text-red-500" />,
  uploadDate,
  expirationDate,
  onRemove,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  if (!file) {
    return (
      <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Nenhum documento</p>
        </div>
      </div>
    );
  }
  
  // Create URL for the file
  const fileUrl = URL.createObjectURL(file);
  
  // Check if document is expired
  const isExpired = expirationDate && new Date() > expirationDate;
  
  // Check if document will expire soon (within 30 days)
  const willExpireSoon = expirationDate && 
    !isExpired && 
    new Date() > new Date(expirationDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Format file size
  const fileSize = file.size / (1024 * 1024) < 1 
    ? `${(file.size / 1024).toFixed(2)} KB` 
    : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {icon}
          <div className="ml-3">
            <h4 className="text-sm font-medium">{name}</h4>
            <p className="text-xs text-muted-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{fileSize}</p>
            
            {uploadDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Enviado {formatDistanceToNow(uploadDate, { addSuffix: true, locale: ptBR })}
              </p>
            )}
            
            {expirationDate && (
              <div className="mt-1">
                {isExpired ? (
                  <Badge variant="destructive" className="text-xs">
                    Expirado em {expirationDate.toLocaleDateString()}
                  </Badge>
                ) : willExpireSoon ? (
                  <Badge variant="warning" className="text-xs">
                    Expira em {formatDistanceToNow(expirationDate, { locale: ptBR })}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Válido até {expirationDate.toLocaleDateString()}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{name}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0 overflow-auto mt-4">
                {file.type.includes('pdf') ? (
                  <iframe 
                    src={`${fileUrl}#toolbar=0`} 
                    title={name}
                    className="w-full h-full min-h-[60vh]" 
                  />
                ) : file.type.includes('image') ? (
                  <img 
                    src={fileUrl} 
                    alt={name} 
                    className="max-w-full max-h-[60vh] object-contain mx-auto" 
                  />
                ) : (
                  <div className="text-center p-12">
                    <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-4">Pré-visualização não disponível</p>
                    <Button 
                      className="mt-4"
                      onClick={() => window.open(fileUrl, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(fileUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {onRemove && (
            <Button 
              variant="destructive" 
              size="icon"
              className="h-8 w-8"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
