
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

interface FilePreviewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileUrl?: string;
  fileType?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  isOpen,
  onOpenChange,
  fileName,
  fileUrl,
  fileType
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!fileUrl) {
      toast.error('Arquivo não encontrado');
      return;
    }

    try {
      setLoading(true);
      // Simular download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download iniciado');
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error('Erro ao baixar arquivo');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Preview não disponível</p>
          </div>
        </div>
      );
    }

    if (fileType?.includes('pdf')) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-96 border rounded-lg"
          title={fileName}
        />
      );
    }

    if (fileType?.includes('image')) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-96 mx-auto rounded-lg"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Preview não suportado para este tipo de arquivo</p>
          <p className="text-sm text-gray-400 mt-2">{fileName}</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="truncate">{fileName}</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={loading || !fileUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Baixando...' : 'Baixar'}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;
