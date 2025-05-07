import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Download, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Funcionario } from '@/types/funcionario';
import { DocumentTemplate, DOCUMENT_CATEGORIES } from '@/types/documentTemplate';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CompanyInfo from '@/components/CompanyInfo';
import jsPDF from 'jspdf';
import { generatePDF, openPrintWindow, replaceTemplateVariables } from '@/utils/documentUtils';

interface DocumentGeneratorProps {
  funcionario: Funcionario;
  onDocumentGenerated?: (titulo: string, categoria: string) => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ 
  funcionario,
  onDocumentGenerated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const documentContentRef = useRef<HTMLDivElement>(null);
  
  // Fetch document templates (simulated with mock data)
  useEffect(() => {
    // This would be an API call in a real application
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        // Simulating API fetch with mock data
        const response = await new Promise<DocumentTemplate[]>((resolve) => {
          setTimeout(() => {
            resolve([
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
            ]);
          }, 500);
        });
        
        setTemplates(response);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Erro ao carregar os modelos de documento');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  // Filter templates by selected category
  const filteredTemplates = selectedCategory 
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  const handlePreviewDocument = () => {
    if (!selectedTemplate) return;
    
    const content = replaceTemplateVariables(selectedTemplate.content, funcionario);
    setGeneratedDocument(content);
    setIsDialogOpen(true);
  };

  const handlePrintDocument = () => {
    if (!selectedTemplate || !documentContentRef.current) return;
    
    // Get the HTML content
    const content = documentContentRef.current.innerHTML || '';
    
    // Open print window
    const success = openPrintWindow(content, `${selectedTemplate.title} - ${funcionario.dadosPessoais.nome}`);
    
    if (!success) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.');
      return;
    }
    
    toast.success(`Documento "${selectedTemplate.title}" enviado para impressão`);
    
    // Notify that document was generated
    if (onDocumentGenerated) {
      onDocumentGenerated(selectedTemplate.title, selectedTemplate.category);
    }
  };

  const handleDownloadDocument = () => {
    if (!selectedTemplate) return;
    
    try {
      const content = replaceTemplateVariables(selectedTemplate.content, funcionario);
      const doc = generatePDF(selectedTemplate.title, content, funcionario);
      
      // Save the PDF
      const fileName = `${selectedTemplate.title.toLowerCase().replace(/\s+/g, '_')}_${funcionario.dadosPessoais.nome.toLowerCase().replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
      
      toast.success(`Documento "${selectedTemplate.title}" baixado com sucesso`);
      
      // Notify that document was generated
      if (onDocumentGenerated) {
        onDocumentGenerated(selectedTemplate.title, selectedTemplate.category);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar o PDF. Tente novamente.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Label htmlFor="category-select">Categoria</Label>
          <Select
            onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedTemplate(null);
            }}
            disabled={isLoading}
          >
            <SelectTrigger id="category-select">
              <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione uma categoria"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os documentos</SelectItem>
              {DOCUMENT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-2/3">
          <Label htmlFor="template-select">Documento</Label>
          <Select
            onValueChange={(value) => {
              const template = templates.find(t => t.id === value);
              setSelectedTemplate(template || null);
            }}
            disabled={isLoading}
          >
            <SelectTrigger id="template-select">
              <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um documento"} />
            </SelectTrigger>
            <SelectContent>
              {filteredTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-pulse">Carregando modelos de documentos...</div>
        </div>
      )}

      {selectedTemplate && !isLoading && (
        <div className="p-4 bg-muted rounded-md">
          <h4 className="font-medium">{selectedTemplate.title}</h4>
          <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={handlePreviewDocument}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button size="sm" onClick={handlePrintDocument}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadDocument}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate?.title}
            </DialogTitle>
          </DialogHeader>
          <div ref={documentContentRef} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <CompanyInfo variant="letterhead" showFooter={true} className="mb-6" />
            <div className="pt-6">
              <div className="whitespace-pre-wrap">
                {generatedDocument}
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button onClick={handlePrintDocument}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" onClick={handleDownloadDocument}>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentGenerator;
