
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DocumentoRH, DocumentoRHFilter } from '@/types/documentosRH';
import DocumentoRHFilters from '../filters/DocumentoRHFilters';
import DocumentoRHCard from '../cards/DocumentoRHCard';

interface DocumentosTabProps {
  documentos: DocumentoRH[];
  filteredDocumentos: DocumentoRH[];
  documentoFilter: DocumentoRHFilter;
  setDocumentoFilter: (filter: DocumentoRHFilter) => void;
  onNewDocument: () => void;
  onEditDocument: (documento: DocumentoRH) => void;
  onViewDocument: (documento: DocumentoRH) => void;
  onDeleteDocument: (documento: DocumentoRH) => void;
}

const DocumentosTab: React.FC<DocumentosTabProps> = ({
  documentos,
  filteredDocumentos,
  documentoFilter,
  setDocumentoFilter,
  onNewDocument,
  onEditDocument,
  onViewDocument,
  onDeleteDocument
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Documentos RH</CardTitle>
          <Button onClick={onNewDocument}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Documento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DocumentoRHFilters 
          filter={documentoFilter}
          onFilterChange={setDocumentoFilter}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocumentos.map((documento) => (
            <DocumentoRHCard
              key={documento.id}
              documento={documento}
              onEdit={onEditDocument}
              onView={onViewDocument}
              onDelete={onDeleteDocument}
            />
          ))}
        </div>

        {filteredDocumentos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum documento encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentosTab;
