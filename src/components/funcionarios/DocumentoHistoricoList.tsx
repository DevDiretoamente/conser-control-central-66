
import React, { useState } from 'react';
import { DocumentoGerado } from '@/types/funcionario';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  FileText, 
  Printer, 
  Download, 
  Eye, 
  Share,
  Pen,
  Files,
  Signature,
  MoreHorizontal
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface DocumentoHistoricoListProps {
  documentos: DocumentoGerado[];
  onView: (documento: DocumentoGerado) => void;
  onPrint: (documento: DocumentoGerado) => void;
  onDownload: (documento: DocumentoGerado) => void;
  onStatusChange?: (documento: DocumentoGerado, newStatus: 'gerado' | 'assinado' | 'pendente' | 'arquivado') => void;
}

const DocumentoHistoricoList: React.FC<DocumentoHistoricoListProps> = ({
  documentos,
  onView,
  onPrint,
  onDownload,
  onStatusChange
}) => {
  const [search, setSearch] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentoGerado | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Derived categories from documents for filter
  const categorias = [...new Set(documentos.map(doc => doc.categoria))];

  // Filter documents
  const documentosFiltrados = documentos.filter(doc => {
    const matchSearch = search === '' || 
      doc.titulo.toLowerCase().includes(search.toLowerCase()) ||
      doc.categoria.toLowerCase().includes(search.toLowerCase());
      
    const matchStatus = filtroStatus === '' || doc.status === filtroStatus;
    const matchCategoria = filtroCategoria === '' || doc.categoria === filtroCategoria;
    
    return matchSearch && matchStatus && matchCategoria;
  });

  const handleViewDetail = (documento: DocumentoGerado) => {
    setSelectedDocument(documento);
    setShowDetailDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'gerado':
        return <Badge variant="outline">Gerado</Badge>;
      case 'assinado':
        return <Badge className="bg-green-500 text-white">Assinado</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500">Pendente</Badge>;
      case 'arquivado':
        return <Badge variant="secondary">Arquivado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleShare = (doc: DocumentoGerado) => {
    // In a real implementation, this would generate a link or open a share dialog
    toast.success(`Link para compartilhamento do documento "${doc.titulo}" gerado`);
  };

  const handleRequestSignature = (doc: DocumentoGerado) => {
    if (onStatusChange) {
      onStatusChange(doc, 'pendente');
      toast.success(`Solicitação de assinatura para "${doc.titulo}" enviada`);
    }
  };

  const handleDuplicate = (doc: DocumentoGerado) => {
    // In a real implementation, this would duplicate the document
    toast.success(`Documento "${doc.titulo}" duplicado`);
  };

  const handleSetStatus = (doc: DocumentoGerado, status: 'gerado' | 'assinado' | 'pendente' | 'arquivado') => {
    if (onStatusChange) {
      onStatusChange(doc, status);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Pesquisar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categorias.map(categoria => (
                <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="gerado">Gerados</SelectItem>
              <SelectItem value="assinado">Assinados</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="arquivado">Arquivados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {documentosFiltrados.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Nenhum documento encontrado</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentosFiltrados.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.titulo}</TableCell>
                  <TableCell>{doc.categoria}</TableCell>
                  <TableCell>{format(doc.dataGeracao, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPrint(doc)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Opções</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetail(doc)}>
                            Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {onStatusChange && (
                            <>
                              <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleSetStatus(doc, 'gerado')}>
                                Marcar como Gerado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSetStatus(doc, 'assinado')}>
                                Marcar como Assinado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSetStatus(doc, 'pendente')}>
                                Marcar como Pendente
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSetStatus(doc, 'arquivado')}>
                                Arquivar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleShare(doc)}>
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(doc)}>
                            Duplicar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Documento</DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Título</p>
                  <p>{selectedDocument.titulo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                  <p>{selectedDocument.categoria}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Geração</p>
                  <p>{format(selectedDocument.dataGeracao, 'dd/MM/yyyy', { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>{getStatusBadge(selectedDocument.status)}</p>
                </div>
                {selectedDocument.dataAssinatura && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assinado em</p>
                    <p>{format(selectedDocument.dataAssinatura, 'dd/MM/yyyy', { locale: ptBR })}</p>
                  </div>
                )}
              </div>
              
              {selectedDocument.observacoes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Observações</p>
                  <p className="text-sm">{selectedDocument.observacoes}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => onView(selectedDocument)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDownload(selectedDocument)}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                </div>
                <div className="space-x-2">
                  {onStatusChange && selectedDocument.status !== 'assinado' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        handleSetStatus(selectedDocument, 'assinado');
                        setShowDetailDialog(false);
                      }}
                    >
                      <Signature className="h-4 w-4 mr-2" />
                      Marcar como Assinado
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleDuplicate(selectedDocument)}>
                    <Files className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare(selectedDocument)}>
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentoHistoricoList;
