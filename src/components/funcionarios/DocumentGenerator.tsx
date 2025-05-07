import React, { useState, useRef } from 'react';
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

interface DocumentGeneratorProps {
  funcionario: Funcionario;
  onDocumentGenerated?: (titulo: string, categoria: string) => void;
}

// Mock document templates data
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
    content: "Eu, {NOME}, CPF {CPF}, funcionário da empresa CONSERVIAS TRANSPORTES E PAVIMENTAÇÃO LTDA, indico como beneficiário(s) do meu seguro de vida: __________________.",
    createdAt: new Date(2023, 9, 5),
    updatedAt: new Date(2023, 9, 5),
    category: "Seguro de Vida"
  }
];

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ 
  funcionario,
  onDocumentGenerated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const documentContentRef = useRef<HTMLDivElement>(null);
  
  // Filter templates by selected category
  const filteredTemplates = selectedCategory 
    ? mockTemplates.filter(t => t.category === selectedCategory)
    : mockTemplates;

  const generateDocument = (template: DocumentTemplate) => {
    if (!funcionario) return '';
    
    let content = template.content;
    
    // Replace variables with actual data
    content = content.replace(/\{NOME\}/g, funcionario.dadosPessoais.nome || '');
    content = content.replace(/\{CPF\}/g, funcionario.dadosPessoais.cpf || '');
    content = content.replace(/\{RG\}/g, funcionario.dadosPessoais.rg || '');
    content = content.replace(/\{DATA_ADMISSAO\}/g, 
      funcionario.dadosProfissionais.dataAdmissao 
        ? format(funcionario.dadosProfissionais.dataAdmissao, 'dd/MM/yyyy', { locale: ptBR })
        : ''
    );
    content = content.replace(/\{CARGO\}/g, funcionario.dadosProfissionais.cargo || '');
    content = content.replace(/\{SALARIO\}/g, 
      funcionario.dadosProfissionais.salario 
        ? funcionario.dadosProfissionais.salario.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        : ''
    );
    
    // Formato completo de endereço
    const endereco = funcionario.endereco 
      ? `${funcionario.endereco.rua}, ${funcionario.endereco.numero}${
          funcionario.endereco.complemento ? ', ' + funcionario.endereco.complemento : ''
        } - ${funcionario.endereco.bairro}, ${funcionario.endereco.cidade}/${funcionario.endereco.uf}, CEP: ${funcionario.endereco.cep}`
      : '';
    content = content.replace(/\{ENDERECO\}/g, endereco);
    
    // Data atual
    content = content.replace(/\{DATA_ATUAL\}/g, format(new Date(), 'dd/MM/yyyy', { locale: ptBR }));
    
    // Nome da empresa
    content = content.replace(/\{EMPRESA\}/g, 'CONSERVIAS TRANSPORTES E PAVIMENTAÇÃO LTDA');
    
    return content;
  };

  const handlePrintDocument = () => {
    if (!selectedTemplate) return;
    
    // Open a print-specific layout in a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.');
      return;
    }
    
    // Generate content
    const content = documentContentRef.current?.innerHTML || '';
    
    // Create the print window content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedTemplate.title} - ${funcionario.dadosPessoais.nome}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            .document-content {
              max-width: 800px;
              margin: 0 auto;
            }
            .signature-line {
              margin-top: 50px;
              border-top: 1px solid #000;
              width: 250px;
              text-align: center;
              padding-top: 5px;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              .no-print {
                display: none;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="document-content">
            ${content}
            <div style="margin-top: 60px;">
              <div class="signature-line">Assinatura do Funcionário</div>
              <div style="margin-top: 40px;">
                <p>${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            </div>
          </div>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Fechar</button>
          </div>
          <script>
            // Auto print
            window.onload = function() {
              setTimeout(() => window.print(), 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    toast.success(`Documento "${selectedTemplate.title}" enviado para impressão`);
    
    // Notify that document was generated
    if (onDocumentGenerated) {
      onDocumentGenerated(selectedTemplate.title, selectedTemplate.category);
    }
  };

  const handlePreviewDocument = () => {
    if (!selectedTemplate) return;
    
    const content = generateDocument(selectedTemplate);
    setGeneratedDocument(content);
    setIsDialogOpen(true);
  };

  const handleDownloadDocument = () => {
    if (!selectedTemplate || !documentContentRef.current) return;
    
    try {
      const doc = new jsPDF();
      
      // Set font and size
      doc.setFont('helvetica');
      doc.setFontSize(12);
      
      // Add the document title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(selectedTemplate.title, 20, 20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Add the company information
      doc.text('CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA.', 20, 30);
      doc.text('Avenida General Aldo Bonde, nº 551 - Contorno', 20, 35);
      doc.text('(42) 3239 4358 / (42) 9 99161 9031 (ambos com whats)', 20, 40);
      doc.text('CEP 84 060- 170 Ponta Grossa - Paraná', 20, 45);
      doc.text('CNPJ: 02.205.149/0001-32 I.E. 90150007-05', 20, 50);
      
      // Add a separator line
      doc.line(20, 55, 190, 55);
      
      // Add the document content
      const content = generatedDocument || '';
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, 20, 65);
      
      // Add signature line
      doc.text('Assinatura do Funcionário', 20, 160);
      doc.line(20, 155, 100, 155);
      
      // Add date
      const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
      doc.text(currentDate, 20, 170);
      
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
          >
            <SelectTrigger id="category-select">
              <SelectValue placeholder="Selecione uma categoria" />
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
              const template = mockTemplates.find(t => t.id === value);
              setSelectedTemplate(template || null);
            }}
            disabled={!selectedCategory && selectedCategory !== 'todos'}
          >
            <SelectTrigger id="template-select">
              <SelectValue placeholder="Selecione um documento" />
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

      {selectedTemplate && (
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
            <CompanyInfo className="mb-6" />
            <div className="border-t pt-6">
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
