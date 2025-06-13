
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Search, Eye, Edit, Trash2, AlertTriangle, FileText, Upload } from 'lucide-react';
import { VehicleDocument, DocumentFilter } from '@/types/frota';
import { FrotaService } from '@/services/frotaService';
import DocumentUploadForm from './DocumentUploadForm';
import DocumentViewer from './DocumentViewer';

interface VehicleDocumentManagerProps {
  vehicleId: string;
  documents: VehicleDocument[];
  onDocumentsChange: (documents: VehicleDocument[]) => void;
}

const VehicleDocumentManager: React.FC<VehicleDocumentManagerProps> = ({
  vehicleId,
  documents,
  onDocumentsChange
}) => {
  const [filteredDocuments, setFilteredDocuments] = useState<VehicleDocument[]>(documents);
  const [filter, setFilter] = useState<DocumentFilter>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<VehicleDocument | null>(null);
  const [viewingDocument, setViewingDocument] = useState<VehicleDocument | null>(null);

  React.useEffect(() => {
    applyFilters();
  }, [documents, filter]);

  const applyFilters = () => {
    let filtered = [...documents];

    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(search) ||
        d.description.toLowerCase().includes(search) ||
        d.documentNumber?.toLowerCase().includes(search)
      );
    }

    if (filter.type && filter.type !== 'all') {
      filtered = filtered.filter(d => d.type === filter.type);
    }

    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter(d => d.status === filter.status);
    }

    setFilteredDocuments(filtered);
  };

  const getDocumentTypeName = (type: VehicleDocument['type']) => {
    const typeMap = {
      crlv: 'CRLV',
      ipva: 'IPVA',
      insurance: 'Seguro',
      licensing: 'Licenciamento',
      inspection: 'Inspeção',
      aet: 'Autorização Especial de Trânsito',
      special_permit: 'Licença Especial',
      certificate: 'Certificado',
      custom: 'Personalizado',
      other: 'Outro'
    };
    return typeMap[type];
  };

  const getStatusBadge = (status: VehicleDocument['status']) => {
    const statusMap = {
      valid: { label: 'Válido', className: 'bg-green-500' },
      expiring_soon: { label: 'Vencendo', className: 'bg-yellow-500' },
      expired: { label: 'Vencido', className: 'bg-red-500' }
    };
    const config = statusMap[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreate = async (data: any) => {
    try {
      const newDocument = FrotaService.createDocument({
        ...data,
        vehicleId,
        reminderDays: data.reminderDays || 30
      });
      const updatedDocuments = [...documents, newDocument];
      onDocumentsChange(updatedDocuments);
      setIsFormOpen(false);
      toast.success('Documento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      toast.error('Erro ao criar documento');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingDocument) return;

    try {
      const updated = FrotaService.updateDocument(editingDocument.id, data);
      if (updated) {
        const updatedDocuments = documents.map(d => d.id === updated.id ? updated : d);
        onDocumentsChange(updatedDocuments);
        setEditingDocument(null);
        setIsFormOpen(false);
        toast.success('Documento atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      toast.error('Erro ao atualizar documento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      FrotaService.deleteDocument(id);
      const updatedDocuments = documents.filter(d => d.id !== id);
      onDocumentsChange(updatedDocuments);
      toast.success('Documento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento');
    }
  };

  const handleEdit = (document: VehicleDocument) => {
    setEditingDocument(document);
    setIsFormOpen(true);
  };

  const handleView = (document: VehicleDocument) => {
    setViewingDocument(document);
    setIsViewerOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingDocument) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Documentos do Veículo</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os documentos e suas datas de vencimento
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={filter.search || ''}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filter.type || 'all'}
          onValueChange={(value) => setFilter({ ...filter, type: value === 'all' ? undefined : value as VehicleDocument['type'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="crlv">CRLV</SelectItem>
            <SelectItem value="ipva">IPVA</SelectItem>
            <SelectItem value="insurance">Seguro</SelectItem>
            <SelectItem value="licensing">Licenciamento</SelectItem>
            <SelectItem value="inspection">Inspeção</SelectItem>
            <SelectItem value="aet">AET</SelectItem>
            <SelectItem value="special_permit">Licença Especial</SelectItem>
            <SelectItem value="certificate">Certificado</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.status || 'all'}
          onValueChange={(value) => setFilter({ ...filter, status: value === 'all' ? undefined : value as VehicleDocument['status'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="valid">Válido</SelectItem>
            <SelectItem value="expiring_soon">Vencendo</SelectItem>
            <SelectItem value="expired">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocuments.map((document) => {
          const daysUntilExpiry = getDaysUntilExpiry(document.expiryDate);
          
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <CardTitle className="text-base">{document.title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getDocumentTypeName(document.type)}
                      {document.documentNumber && ` - ${document.documentNumber}`}
                    </p>
                  </div>
                  {getStatusBadge(document.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Emissão:</span>
                    <p className="font-medium">
                      {new Date(document.issueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vencimento:</span>
                    <p className="font-medium">
                      {new Date(document.expiryDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {document.issuingAuthority && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Órgão Emissor:</span>
                      <p className="font-medium">{document.issuingAuthority}</p>
                    </div>
                  )}
                </div>

                {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Vence em {daysUntilExpiry} dias
                    </span>
                  </div>
                )}

                {daysUntilExpiry <= 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800">
                      Vencido há {Math.abs(daysUntilExpiry)} dias
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-1">
                    {document.pdfFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(document)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver PDF
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(document)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum documento encontrado</p>
        </div>
      )}

      {/* Dialog do Formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDocument ? 'Editar Documento' : 'Novo Documento'}
            </DialogTitle>
          </DialogHeader>
          <DocumentUploadForm
            document={editingDocument}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingDocument(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog do Visualizador */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Visualizar Documento</DialogTitle>
          </DialogHeader>
          {viewingDocument && (
            <DocumentViewer
              document={viewingDocument}
              onClose={() => setIsViewerOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleDocumentManager;
