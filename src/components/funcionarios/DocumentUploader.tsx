
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  label: string;
  description?: string;
  allowedTypes?: string;
  maxSize?: number; // in MB
  onFileChange?: (file: File | null) => void;
  onChange?: (file: File | null) => void; // For backward compatibility
  value?: File | null;
  currentFile?: File | null;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  description = "PDF até 10MB",
  allowedTypes = ".pdf",
  maxSize = 10,
  onFileChange,
  onChange,
  value: externalValue,
  currentFile,
}) => {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use external value prop if provided (for controlled component usage)
  const file = externalValue !== undefined ? externalValue : 
               (currentFile !== undefined ? currentFile : internalFile);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    const fileTypeValid = allowedTypes
      .split(',')
      .some(type => file.name.toLowerCase().endsWith(type.replace('.', '').toLowerCase()));
    
    if (!fileTypeValid) {
      toast.error(`Tipo de arquivo não permitido. Formatos aceitos: ${allowedTypes}`);
      return;
    }
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      toast.error(`O arquivo é muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }
    
    setInternalFile(file);
    
    // Call both handlers for maximum compatibility
    if (onFileChange) onFileChange(file);
    if (onChange) onChange(file);
    
    toast.success('Documento adicionado com sucesso!');
  };

  const removeFile = () => {
    setInternalFile(null);
    
    // Call both handlers for maximum compatibility
    if (onFileChange) onFileChange(null);
    if (onChange) onChange(null);
  };

  return (
    <div className="w-full">
      <p className="text-sm font-medium mb-2">{label}</p>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10",
            isDragging && "border-conserv-primary bg-blue-50",
            "transition-colors duration-200"
          )}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-conserv-primary hover:text-conserv-primary/80"
              >
                <span>Faça upload de um arquivo</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept={allowedTypes}
                  onChange={handleFileInput}
                />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              {description}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-lg border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-red-500" />
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
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
