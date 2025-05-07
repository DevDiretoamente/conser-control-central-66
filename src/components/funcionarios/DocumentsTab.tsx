
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario } from '@/types/funcionario';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import DocumentUploader from './DocumentUploader';
import MultiDocumentUploader from './MultiDocumentUploader';
import DocumentPreview from './DocumentPreview';
import { DocumentInfo } from './DocumentPreview';

interface DocumentsTabProps {
  form: UseFormReturn<Funcionario>;
  onDocumentChange: (documentKey: string, file: File | null) => void;
  onMultiDocumentChange: (files: File[]) => void;
  documentFiles: {
    rgFile: File | null;
    cpfFile: File | null;
    comprovanteResidencia: File | null;
    fotoFile: File | null;
    cnhFile: File | null;
    ctpsFile: File | null;
    exameMedicoFile: File | null;
    outrosDocumentos: File[];
  };
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  form,
  onDocumentChange,
  onMultiDocumentChange,
  documentFiles
}) => {
  const [activeTab, setActiveTab] = useState("documentos-pessoais");

  // Example of current date for uploaded documents
  const currentDate = new Date();
  
  // Example of expiration dates
  const exampleExpirationDate = new Date();
  exampleExpirationDate.setFullYear(exampleExpirationDate.getFullYear() + 1);
  
  const exampleSoonExpirationDate = new Date();
  exampleSoonExpirationDate.setDate(exampleSoonExpirationDate.getDate() + 20);
  
  const exampleExpiredDate = new Date();
  exampleExpiredDate.setFullYear(exampleExpiredDate.getFullYear() - 1);

  return (
    <Tabs defaultValue="documentos-pessoais" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="documentos-pessoais">Documentos Pessoais</TabsTrigger>
        <TabsTrigger value="documentos-profissionais">Documentos Profissionais</TabsTrigger>
        <TabsTrigger value="outros-documentos">Outros Documentos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="documentos-pessoais" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentFiles.rgFile ? (
            <DocumentPreview 
              file={documentFiles.rgFile}
              name="RG"
              uploadDate={currentDate}
              onRemove={() => onDocumentChange('rgFile', null)}
            />
          ) : (
            <DocumentUploader 
              label="RG" 
              onFileChange={(file) => onDocumentChange('rgFile', file)}
              value={documentFiles.rgFile}
            />
          )}
          
          {documentFiles.cpfFile ? (
            <DocumentPreview 
              file={documentFiles.cpfFile}
              name="CPF"
              uploadDate={currentDate}
              onRemove={() => onDocumentChange('cpfFile', null)}
            />
          ) : (
            <DocumentUploader 
              label="CPF" 
              onFileChange={(file) => onDocumentChange('cpfFile', file)}
              value={documentFiles.cpfFile}
            />
          )}
          
          {documentFiles.comprovanteResidencia ? (
            <DocumentPreview 
              file={documentFiles.comprovanteResidencia}
              name="Comprovante de Residência"
              uploadDate={currentDate}
              // Example of document that expires soon
              expirationDate={exampleSoonExpirationDate}
              onRemove={() => onDocumentChange('comprovanteResidencia', null)}
            />
          ) : (
            <DocumentUploader 
              label="Comprovante de Residência" 
              onFileChange={(file) => onDocumentChange('comprovanteResidencia', file)}
              value={documentFiles.comprovanteResidencia}
            />
          )}
          
          {documentFiles.fotoFile ? (
            <DocumentPreview 
              file={documentFiles.fotoFile}
              name="Foto"
              uploadDate={currentDate}
              onRemove={() => onDocumentChange('fotoFile', null)}
            />
          ) : (
            <DocumentUploader 
              label="Foto" 
              allowedTypes=".jpg,.jpeg,.png"
              description="Imagem até 5MB"
              onFileChange={(file) => onDocumentChange('fotoFile', file)}
              value={documentFiles.fotoFile}
            />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="documentos-profissionais" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentFiles.ctpsFile ? (
            <DocumentPreview 
              file={documentFiles.ctpsFile}
              name="CTPS"
              uploadDate={currentDate}
              onRemove={() => onDocumentChange('ctpsFile', null)}
            />
          ) : (
            <DocumentUploader 
              label="CTPS" 
              onFileChange={(file) => onDocumentChange('ctpsFile', file)}
              value={documentFiles.ctpsFile}
            />
          )}
          
          {documentFiles.cnhFile ? (
            <DocumentPreview 
              file={documentFiles.cnhFile}
              name="CNH"
              uploadDate={currentDate}
              // Example of valid document with expiration date
              expirationDate={exampleExpirationDate}
              onRemove={() => onDocumentChange('cnhFile', null)}
            />
          ) : (
            <DocumentUploader 
              label="CNH" 
              onFileChange={(file) => onDocumentChange('cnhFile', file)}
              value={documentFiles.cnhFile}
            />
          )}
          
          {documentFiles.exameMedicoFile ? (
            <DocumentPreview 
              file={documentFiles.exameMedicoFile}
              name="Exame Médico (ASO)"
              uploadDate={currentDate}
              // Example of expired document
              expirationDate={exampleExpiredDate}
              onRemove={() => onDocumentChange('exameMedicoFile', null)}
            />
          ) : (
            <DocumentUploader 
              label="Exame Médico (ASO)" 
              onFileChange={(file) => onDocumentChange('exameMedicoFile', file)}
              value={documentFiles.exameMedicoFile}
            />
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="outros-documentos">
        <Card>
          <CardContent className="pt-6">
            <MultiDocumentUploader 
              onFilesChange={onMultiDocumentChange}
              value={documentFiles.outrosDocumentos}
            />
            
            {documentFiles.outrosDocumentos.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Documentos adicionados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentFiles.outrosDocumentos.map((file, index) => (
                    <DocumentPreview 
                      key={index}
                      file={file}
                      name={`Documento ${index + 1}`}
                      uploadDate={currentDate}
                      onRemove={() => {
                        const newFiles = [...documentFiles.outrosDocumentos];
                        newFiles.splice(index, 1);
                        onMultiDocumentChange(newFiles);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentsTab;
