
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isAfter, isBefore, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Download, FileText, FileUp, Plus, AlertTriangle, Trash2, Clock } from 'lucide-react';
import DocumentUploader from '../funcionarios/DocumentUploader';
import { Badge } from '@/components/ui/badge';

interface DocumentoOcupacional {
  id: string;
  tipo: 'PCMSO' | 'PGR' | 'LTCAT' | 'PPP' | 'AET' | 'Outro';
  titulo: string;
  descricao: string;
  dataEmissao: Date;
  dataValidade: Date;
  arquivo: File | null;
  status: 'Válido' | 'Vencido' | 'A vencer';
  observacoes?: string;
}

const DocumentosOcupacionais: React.FC = () => {
  const hoje = new Date();
  
  // Mock inicial de documentos
  const [documentos, setDocumentos] = useState<DocumentoOcupacional[]>([
    {
      id: '1',
      tipo: 'PCMSO',
      titulo: 'PCMSO 2023',
      descricao: 'Programa de Controle Médico de Saúde Ocupacional',
      dataEmissao: new Date('2023-01-15'),
      dataValidade: new Date('2024-01-15'),
      arquivo: null,
      status: isBefore(new Date('2024-01-15'), hoje) ? 'Vencido' : 
              isAfter(new Date('2024-01-15'), addMonths(hoje, 1)) ? 'Válido' : 'A vencer'
    },
    {
      id: '2',
      tipo: 'PGR',
      titulo: 'PGR 2023',
      descricao: 'Programa de Gerenciamento de Riscos',
      dataEmissao: new Date('2023-02-10'),
      dataValidade: new Date('2024-02-10'),
      arquivo: null,
      status: isBefore(new Date('2024-02-10'), hoje) ? 'Vencido' : 
              isAfter(new Date('2024-02-10'), addMonths(hoje, 1)) ? 'Válido' : 'A vencer'
    }
  ]);
  
  const [dialogoAberto, setDialogoAberto] = useState<boolean>(false);
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState<DocumentoOcupacional | null>(null);
  const [novoDocumento, setNovoDocumento] = useState<DocumentoOcupacional>({
    id: '',
    tipo: 'PCMSO',
    titulo: '',
    descricao: '',
    dataEmissao: new Date(),
    dataValidade: new Date(),
    arquivo: null,
    status: 'Válido'
  });
  const [dialogoExclusao, setDialogoExclusao] = useState<boolean>(false);
  const [documentoParaExcluir, setDocumentoParaExcluir] = useState<string>('');

  const handleAdicionarDocumento = () => {
    setDocumentoEmEdicao(null);
    setNovoDocumento({
      id: '',
      tipo: 'PCMSO',
      titulo: '',
      descricao: '',
      dataEmissao: new Date(),
      dataValidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      arquivo: null,
      status: 'Válido'
    });
    setDialogoAberto(true);
  };

  const handleEditarDocumento = (documento: DocumentoOcupacional) => {
    setDocumentoEmEdicao(documento);
    setNovoDocumento({...documento});
    setDialogoAberto(true);
  };

  const handleExcluirDocumento = (id: string) => {
    setDocumentoParaExcluir(id);
    setDialogoExclusao(true);
  };

  const confirmarExclusao = () => {
    const novosDocumentos = documentos.filter(d => d.id !== documentoParaExcluir);
    setDocumentos(novosDocumentos);
    toast.success('Documento excluído com sucesso');
    setDialogoExclusao(false);
  };
  
  const calcularStatus = (dataValidade: Date): 'Válido' | 'Vencido' | 'A vencer' => {
    if (isBefore(dataValidade, hoje)) {
      return 'Vencido';
    } else if (isBefore(dataValidade, addMonths(hoje, 1))) {
      return 'A vencer';
    } else {
      return 'Válido';
    }
  };

  const handleSalvar = () => {
    if (!novoDocumento.titulo || !novoDocumento.tipo) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    // Calcular o status baseado na data de validade
    const status = calcularStatus(novoDocumento.dataValidade);
    
    if (documentoEmEdicao) {
      // Editar documento existente
      const novosDocumentos = documentos.map(d => 
        d.id === documentoEmEdicao.id ? {...novoDocumento, status} : d
      );
      setDocumentos(novosDocumentos);
      toast.success('Documento atualizado com sucesso');
    } else {
      // Adicionar novo documento
      const novoId = String(Date.now());
      const novosDocumentos = [...documentos, {...novoDocumento, id: novoId, status}];
      setDocumentos(novosDocumentos);
      toast.success('Documento adicionado com sucesso');
    }
    
    setDialogoAberto(false);
  };
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Válido': return "success";
      case 'Vencido': return "destructive";
      case 'A vencer': return "warning";
      default: return "secondary";
    }
  };
  
  const getBadgeIcon = (status: string) => {
    switch (status) {
      case 'Válido': return <FileText className="h-4 w-4 mr-1" />;
      case 'Vencido': return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'A vencer': return <Clock className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Documentos Ocupacionais</h2>
        <Button onClick={handleAdicionarDocumento}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Documento
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>PCMSO, PGR e Outros Documentos</CardTitle>
          <CardDescription>
            Gerencie documentos relacionados à saúde e segurança ocupacional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Data de Emissão</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentos.map((documento) => (
                  <TableRow key={documento.id}>
                    <TableCell>{documento.tipo}</TableCell>
                    <TableCell className="font-medium">{documento.titulo}</TableCell>
                    <TableCell>{format(documento.dataEmissao, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{format(documento.dataValidade, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(documento.status) as any} className="flex w-fit items-center">
                        {getBadgeIcon(documento.status)}
                        {documento.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditarDocumento(documento)}>
                          <FileUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleExcluirDocumento(documento.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Diálogo para adicionar/editar documento */}
      <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{documentoEmEdicao ? 'Editar Documento' : 'Adicionar Novo Documento'}</DialogTitle>
            <DialogDescription>
              {documentoEmEdicao 
                ? 'Atualize as informações do documento conforme necessário.' 
                : 'Preencha os dados para adicionar um novo documento.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid gap-4 py-4 px-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Documento*</Label>
                  <Select
                    value={novoDocumento.tipo}
                    onValueChange={(val) => setNovoDocumento({...novoDocumento, tipo: val as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PCMSO">PCMSO</SelectItem>
                      <SelectItem value="PGR">PGR</SelectItem>
                      <SelectItem value="LTCAT">LTCAT</SelectItem>
                      <SelectItem value="PPP">PPP</SelectItem>
                      <SelectItem value="AET">AET</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título do Documento*</Label>
                  <Input 
                    id="titulo" 
                    value={novoDocumento.titulo} 
                    onChange={(e) => setNovoDocumento({...novoDocumento, titulo: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dataEmissao">Data de Emissão</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !novoDocumento.dataEmissao && "text-muted-foreground"
                        )}
                      >
                        {novoDocumento.dataEmissao ? (
                          format(novoDocumento.dataEmissao, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={novoDocumento.dataEmissao}
                        onSelect={(date) => date && setNovoDocumento({...novoDocumento, dataEmissao: date})}
                        disabled={(date) => isAfter(date, new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dataValidade">Data de Validade</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !novoDocumento.dataValidade && "text-muted-foreground"
                        )}
                      >
                        {novoDocumento.dataValidade ? (
                          format(novoDocumento.dataValidade, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={novoDocumento.dataValidade}
                        onSelect={(date) => date && setNovoDocumento({...novoDocumento, dataValidade: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea 
                  id="descricao" 
                  value={novoDocumento.descricao} 
                  onChange={(e) => setNovoDocumento({...novoDocumento, descricao: e.target.value})}
                  className="resize-none"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea 
                  id="observacoes" 
                  value={novoDocumento.observacoes || ''} 
                  onChange={(e) => setNovoDocumento({...novoDocumento, observacoes: e.target.value})}
                  className="resize-none"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="arquivo">Arquivo do Documento</Label>
                <DocumentUploader
                  label="Anexar documento"
                  description="PDF ou outro formato de documento"
                  allowedTypes=".pdf,.doc,.docx,.xls,.xlsx"
                  onFileChange={(file) => setNovoDocumento({...novoDocumento, arquivo: file})}
                  value={novoDocumento.arquivo}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAberto(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmação de exclusão */}
      <Dialog open={dialogoExclusao} onOpenChange={setDialogoExclusao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoExclusao(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarExclusao}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentosOcupacionais;
