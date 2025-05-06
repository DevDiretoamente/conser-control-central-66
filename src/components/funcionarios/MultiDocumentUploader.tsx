
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, FileText, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiDocumentUploaderProps {
  label?: string;
  description?: string;
  allowedTypes?: string;
  maxSize?: number; // in MB
  onFilesChange: (files: File[]) => void;
  onChange?: (files: File[]) => void; // Added for backward compatibility
  value?: File[];
}

const MultiDocumentUploader: React.FC<MultiDocumentUploaderProps> = ({
  label = "Documentos Adicionais",
  description = "PDF até 10MB",
  allowedTypes = ".pdf",
  maxSize = 10,
  onFilesChange,
  onChange,
  value: externalFiles,
}) => {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use either the external files (if provided) or the internal state
  const files = externalFiles || internalFiles;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      handleFiles(newFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      handleFiles(newFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter files based on type and size
    const validFiles = newFiles.filter(file => {
      // Check file type
      const fileTypeValid = allowedTypes
        .split(',')
        .some(type => file.name.toLowerCase().endsWith(type.replace('.', '').toLowerCase()));
      
      if (!fileTypeValid) {
        toast.error(`Arquivo "${file.name}": tipo não permitido. Formatos aceitos: ${allowedTypes}`);
        return false;
      }
      
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSize) {
        toast.error(`Arquivo "${file.name}" é muito grande. Tamanho máximo: ${maxSize}MB`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setInternalFiles(updatedFiles);
      onFilesChange(updatedFiles);
      if (onChange) {
        onChange(updatedFiles);
      }
      
      toast.success(`${validFiles.length} documento(s) adicionado(s) com sucesso!`);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setInternalFiles(updatedFiles);
    onFilesChange(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm font-medium mb-2">{label}</p>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6",
          isDragging && "border-conserv-primary bg-blue-50",
          "transition-colors duration-200"
        )}
      >
        <div className="text-center">
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="multi-file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-conserv-primary hover:text-conserv-primary/80"
            >
              <span>Adicionar arquivos</span>
              <input
                id="multi-file-upload"
                name="multi-file-upload"
                type="file"
                className="sr-only"
                accept={allowedTypes}
                onChange={handleFileInput}
                multiple
              />
            </label>
            <p className="pl-1">ou arraste e solte</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            {description}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Arquivos selecionados ({files.length})</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiDocumentUploader;
