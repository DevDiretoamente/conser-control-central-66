
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface FileUploadSectionProps {
  form: UseFormReturn<any>;
  label: string;
  fieldName: string;
  accept?: string;
  required?: boolean;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  form,
  label,
  fieldName,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  required = false
}) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Input
          id={fieldName}
          type="file"
          accept={accept}
          {...register(fieldName)}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
        />
        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      {errors[fieldName] && (
        <p className="text-sm text-red-500">
          {errors[fieldName]?.message?.toString() || 'Campo obrigatório'}
        </p>
      )}
    </div>
  );
};

export default FileUploadSection;
