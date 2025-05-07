
import React, { useState, useRef } from 'react';
import { Funcionario } from '@/types/funcionario';
import { DocumentTemplate } from '@/types/documentTemplate';
import { toast } from 'sonner';
import { generatePDF, openPrintWindow, replaceTemplateVariables } from '@/utils/documentUtils';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import DocumentSelector from './document-generator/DocumentSelector';
import DocumentPreviewActions from './document-generator/DocumentPreviewActions';
import DocumentPreviewDialog from './document-generator/DocumentPreviewDialog';

interface DocumentGeneratorProps {
  funcionario: Funcionario;
  onDocumentGenerated?: (titulo: string, categoria: string) => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ 
  funcionario,
  onDocumentGenerated
}) => {
  const { templates, isLoading } = useDocumentTemplates();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handlePreviewDocument = () => {
    if (!selectedTemplate) return;
    
    const content = replaceTemplateVariables(selectedTemplate.content, funcionario);
    setGeneratedDocument(content);
    setIsDialogOpen(true);
  };

  const handlePrintDocument = () => {
    if (!selectedTemplate) return;
    
    // Get the HTML content from the replaced template
    const content = replaceTemplateVariables(selectedTemplate.content, funcionario);
    
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-4">
      <DocumentSelector
        templates={templates}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        selectedTemplate={selectedTemplate}
        onCategoryChange={handleCategoryChange}
        onTemplateChange={setSelectedTemplate}
      />

      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-pulse">Carregando modelos de documentos...</div>
        </div>
      )}

      {selectedTemplate && !isLoading && (
        <DocumentPreviewActions
          template={selectedTemplate}
          onPreview={handlePreviewDocument}
          onPrint={handlePrintDocument}
          onDownload={handleDownloadDocument}
        />
      )}

      <DocumentPreviewDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedTemplate?.title || ''}
        content={generatedDocument}
        onPrint={handlePrintDocument}
        onDownload={handleDownloadDocument}
      />
    </div>
  );
};

export default DocumentGenerator;
