
import React from 'react';
import { Funcionario } from '@/types/funcionario';
import DocumentPreview from './DocumentPreview';
import { FileText, UserIcon, Home, CreditCard, Car } from 'lucide-react';

interface DocumentosTabProps {
  funcionario: Funcionario;
  onRemoveDocument?: (documentKey: string) => void;
  isEditMode?: boolean;
}

const DocumentosTab: React.FC<DocumentosTabProps> = ({ 
  funcionario, 
  onRemoveDocument,
  isEditMode = false, 
}) => {
  const { documentos } = funcionario;

  // Function to calculate fake upload date for demo purposes
  const getUploadDate = (id: string) => {
    const now = new Date();
    // Subtract random days for demo
    return new Date(now.getTime() - parseInt(id) * 24 * 60 * 60 * 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Documentos Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentPreview
            file={documentos.rgFile}
            name="RG"
            icon={<FileText className="h-8 w-8 text-blue-500" />}
            uploadDate={documentos.rgFile ? getUploadDate('1') : undefined}
            onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument('rgFile') : undefined}
          />
          
          <DocumentPreview
            file={documentos.cpfFile}
            name="CPF"
            icon={<FileText className="h-8 w-8 text-blue-500" />}
            uploadDate={documentos.cpfFile ? getUploadDate('2') : undefined}
            onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument('cpfFile') : undefined}
          />
          
          <DocumentPreview
            file={documentos.comprovanteResidencia}
            name="Comprovante de Residência"
            icon={<Home className="h-8 w-8 text-green-500" />}
            uploadDate={documentos.comprovanteResidencia ? getUploadDate('3') : undefined}
            onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument('comprovanteResidencia') : undefined}
          />
          
          <DocumentPreview
            file={documentos.fotoFile}
            name="Foto"
            icon={<UserIcon className="h-8 w-8 text-purple-500" />}
            uploadDate={documentos.fotoFile ? getUploadDate('4') : undefined}
            onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument('fotoFile') : undefined}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Documentos Profissionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentPreview
            file={documentos.ctpsFile}
            name="CTPS"
            icon={<FileText className="h-8 w-8 text-red-500" />}
            uploadDate={documentos.ctpsFile ? getUploadDate('5') : undefined}
            onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument('ctpsFile') : undefined}
          />
          
          <DocumentPreview
            file={documentos.cnhFile}
            name="CNH"
            icon={<Car className="h-8 w-8 text-orange-500" />}
            uploadDate={documentos.cnhFile ? getUploadDate('6') : undefined}
            expirationDate={funcionario.cnh.validade}
            onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument('cnhFile') : undefined}
          />
          
          <DocumentPreview
            file={documentos.exameMedicoFile}
            name="Exame Médico"
            icon={<FileText className="h-8 w-8 text-teal-500" />}
            uploadDate={documentos.exameMedicoFile ? getUploadDate('7') : undefined}
            expirationDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // Example: 30 days from now
            onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument('exameMedicoFile') : undefined}
          />
        </div>
      </div>

      {documentos.outrosDocumentos && documentos.outrosDocumentos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Outros Documentos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentos.outrosDocumentos.map((doc, index) => (
              <DocumentPreview
                key={index}
                file={doc}
                name={`Documento ${index + 1}`}
                icon={<FileText className="h-8 w-8 text-gray-500" />}
                uploadDate={getUploadDate((8 + index).toString())}
                onRemove={isEditMode && onRemoveDocument ? () => onRemoveDocument(`outrosDocumentos[${index}]`) : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentosTab;
