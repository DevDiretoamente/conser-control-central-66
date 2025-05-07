import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, FileText, Plus, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DocumentTemplate, DOCUMENT_CATEGORIES, DOCUMENT_VARIABLES } from '@/types/documentTemplate';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CompanyInfo from '@/components/CompanyInfo';

// Mock data for demonstration
const mockTemplates: DocumentTemplate[] = [
  {
    id: "1",
    title: "Declaração de Obra",
    description: "Informa o funcionário sobre os locais diversos de trabalho",
    content: "Eu, {NOME}, portador do CPF {CPF}, declaro estar ciente que os locais de trabalho serão em obras diversas e não na sede da empresa.",
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15),
    category: "Declarações"
  },
  {
    id: "2",
    title: "Declaração de Opção - Vale Alimentação",
    description: "Opção de recebimento de créditos em cartão alimentação",
    content: "Eu, {NOME}, CPF {CPF}, opto por receber os créditos referentes à cesta básica através de cartão alimentação, conforme convenção coletiva.",
    createdAt: new Date(2023, 6, 20),
    updatedAt: new Date(2023, 7, 5),
    category: "Benefícios"
  },
  {
    id: "3",
    title: "Normas de Alojamento",
    description: "Orientações de comportamento no alojamento",
    content: "Eu, {NOME}, CPF {CPF}, declaro estar ciente e de acordo com as normas de convivência do alojamento da empresa, comprometendo-me a respeitá-las integralmente.",
    createdAt: new Date(2023, 8, 10),
    updatedAt: new Date(2023, 8, 10),
    category: "Alojamento"
  },
  {
    id: "4",
    title: "Designação de Beneficiário - Seguro de Vida",
    description: "Indicação de beneficiários para seguro de vida",
    content: "Eu, {NOME}, CPF {CPF}, funcionário da empresa {EMPRESA}, indico como beneficiário(s) do meu seguro de vida: __________________.",
    createdAt: new Date(2023, 9, 5),
    updatedAt: new Date(2023, 9, 5),
    category: "Seguro de Vida"
  }
];

const DocumentosTab: React.FC = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(mockTemplates);
  const [search, setSearch] = useState('');
  const [viewTemplate, setViewTemplate] = useState<DocumentTemplate | null>(null);
  const [editTemplate, setEditTemplate] = useState<DocumentTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<DocumentTemplate>>({
    title: '',
    description: '',
    content: '',
    category: 'Declarações'
  });
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);

  // Filter templates based on search
  const filteredTemplates = templates.filter(
    template => 
      template.title.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase()) ||
      template.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveNewTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const template: DocumentTemplate = {
      id: Date.now().toString(),
      title: newTemplate.title,
      description: newTemplate.description || '',
      content: newTemplate.content,
      category: newTemplate.category || 'Outros',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      title: '',
      description: '',
      content: '',
      category: 'Declarações'
    });
    setIsNewTemplateDialogOpen(false);
    toast.success("Modelo de documento criado com sucesso!");
  };

  const handleSaveEditTemplate = () => {
    if (!editTemplate) return;
    
    const updatedTemplates = templates.map(t => 
      t.id === editTemplate.id 
        ? { ...editTemplate, updatedAt: new Date() } 
        : t
    );
    
    setTemplates(updatedTemplates);
    setEditTemplate(null);
    toast.success("Modelo atualizado com sucesso!");
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este modelo de documento?")) {
      setTemplates(templates.filter(t => t.id !== id));
      toast.success("Modelo excluído com sucesso");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input 
            placeholder="Pesquisar modelos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80"
          />
        </div>
        
        <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Modelo de Documento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título*
                </Label>
                <Input
                  id="title"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={newTemplate.description || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoria
                </Label>
                <Select
                  value={newTemplate.category || 'Declarações'}
                  onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Conteúdo*
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="content"
                    value={newTemplate.content || ''}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                    rows={10}
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="mb-2">Variáveis disponíveis:</p>
                    <div className="flex flex-wrap gap-2">
                      {DOCUMENT_VARIABLES.map((variable) => (
                        <div 
                          key={variable.key} 
                          className="text-xs bg-muted px-2 py-1 rounded cursor-pointer hover:bg-muted/80"
                          onClick={() => {
                            const textarea = document.getElementById('content') as HTMLTextAreaElement;
                            if (textarea) {
                              const startPos = textarea.selectionStart;
                              const endPos = textarea.selectionEnd;
                              const currentContent = newTemplate.content || '';
                              const newContent = 
                                currentContent.substring(0, startPos) + 
                                variable.key + 
                                currentContent.substring(endPos);
                              
                              setNewTemplate({...newTemplate, content: newContent});
                              // Focus and set cursor position after inserted variable
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(
                                  startPos + variable.key.length, 
                                  startPos + variable.key.length
                                );
                              }, 0);
                            }
                          }}
                          title={variable.description}
                        >
                          {variable.key}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTemplateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handleSaveNewTemplate}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center p-10 border rounded-md">
          <p className="text-muted-foreground">Nenhum modelo de documento encontrado.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Atualizado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.title}</TableCell>
                <TableCell>{template.description}</TableCell>
                <TableCell>{template.category}</TableCell>
                <TableCell>{format(template.updatedAt, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewTemplate(template)}
                      >
                        <Eye size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{viewTemplate?.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <CompanyInfo className="mb-4" />
                        <div className="space-y-2">
                          <Label>Categoria</Label>
                          <div className="px-3 py-2 bg-muted rounded-md">{viewTemplate?.category}</div>
                        </div>
                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <div className="px-3 py-2 bg-muted rounded-md">{viewTemplate?.description}</div>
                        </div>
                        <div className="space-y-2">
                          <Label>Conteúdo</Label>
                          <div className="px-3 py-2 bg-muted rounded-md whitespace-pre-wrap">{viewTemplate?.content}</div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditTemplate({...template})}
                      >
                        <Pencil size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>Editar Modelo</DialogTitle>
                      </DialogHeader>
                      {editTemplate && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-title" className="text-right">
                              Título*
                            </Label>
                            <Input
                              id="edit-title"
                              value={editTemplate.title}
                              onChange={(e) => setEditTemplate({...editTemplate, title: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">
                              Descrição
                            </Label>
                            <Input
                              id="edit-description"
                              value={editTemplate.description}
                              onChange={(e) => setEditTemplate({...editTemplate, description: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-category" className="text-right">
                              Categoria
                            </Label>
                            <Select
                              value={editTemplate.category}
                              onValueChange={(value) => setEditTemplate({...editTemplate, category: value})}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {DOCUMENT_CATEGORIES.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <Label htmlFor="edit-content" className="text-right pt-2">
                              Conteúdo*
                            </Label>
                            <div className="col-span-3">
                              <Textarea
                                id="edit-content"
                                value={editTemplate.content}
                                onChange={(e) => setEditTemplate({...editTemplate, content: e.target.value})}
                                rows={10}
                              />
                              <div className="mt-2 text-sm text-muted-foreground">
                                <p className="mb-2">Variáveis disponíveis:</p>
                                <div className="flex flex-wrap gap-2">
                                  {DOCUMENT_VARIABLES.map((variable) => (
                                    <div 
                                      key={variable.key} 
                                      className="text-xs bg-muted px-2 py-1 rounded cursor-pointer hover:bg-muted/80"
                                      onClick={() => {
                                        const textarea = document.getElementById('edit-content') as HTMLTextAreaElement;
                                        if (textarea) {
                                          const startPos = textarea.selectionStart;
                                          const endPos = textarea.selectionEnd;
                                          const currentContent = editTemplate.content || '';
                                          const newContent = 
                                            currentContent.substring(0, startPos) + 
                                            variable.key + 
                                            currentContent.substring(endPos);
                                          
                                          setEditTemplate({...editTemplate, content: newContent});
                                          setTimeout(() => {
                                            textarea.focus();
                                            textarea.setSelectionRange(
                                              startPos + variable.key.length, 
                                              startPos + variable.key.length
                                            );
                                          }, 0);
                                        }
                                      }}
                                      title={variable.description}
                                    >
                                      {variable.key}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditTemplate(null)}>
                          Cancelar
                        </Button>
                        <Button type="submit" onClick={handleSaveEditTemplate}>
                          Salvar Alterações
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DocumentosTab;
