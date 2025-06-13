
import React, { useCallback, useState } from 'react';
import { Upload, File, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FileUploadProps {
  files: string[];
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx'],
  maxSize = 10
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFiles = useCallback(async (fileList: FileList) => {
    if (files.length + fileList.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    setUploading(true);
    const newFiles: string[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          alert(`Arquivo ${file.name} excede o tamanho máximo de ${maxSize}MB`);
          continue;
        }

        const base64 = await convertToBase64(file);
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          uploadDate: new Date().toISOString()
        };
        
        newFiles.push(JSON.stringify(fileData));
      }

      onFilesChange([...files, ...newFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Erro ao fazer upload dos arquivos');
    } finally {
      setUploading(false);
    }
  }, [files, maxFiles, maxSize, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
  }, [handleFiles]);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const viewFile = (fileString: string) => {
    try {
      const fileData = JSON.parse(fileString);
      const link = document.createElement('a');
      link.href = fileData.data;
      link.target = '_blank';
      link.click();
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

  const getFileInfo = (fileString: string) => {
    try {
      const fileData = JSON.parse(fileString);
      return {
        name: fileData.name,
        type: fileData.type,
        size: fileData.size
      };
    } catch {
      return { name: 'Arquivo', type: '', size: 0 };
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <Button 
          type="button" 
          variant="outline" 
          asChild
          disabled={uploading || files.length >= maxFiles}
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            {uploading ? 'Uploading...' : 'Selecionar Arquivos'}
          </label>
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Máximo {maxFiles} arquivos, até {maxSize}MB cada
        </p>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Arquivos Anexados:</h4>
          {files.map((fileString, index) => {
            const fileInfo = getFileInfo(fileString);
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{fileInfo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileInfo.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => viewFile(fileString)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
