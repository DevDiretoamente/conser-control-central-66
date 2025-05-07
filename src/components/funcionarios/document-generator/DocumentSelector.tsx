
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DocumentTemplate, DOCUMENT_CATEGORIES } from '@/types/documentTemplate';

interface DocumentSelectorProps {
  templates: DocumentTemplate[];
  isLoading: boolean;
  selectedCategory: string | undefined;
  selectedTemplate: DocumentTemplate | null;
  onCategoryChange: (category: string) => void;
  onTemplateChange: (template: DocumentTemplate | null) => void;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  templates,
  isLoading,
  selectedCategory,
  selectedTemplate,
  onCategoryChange,
  onTemplateChange,
}) => {
  // Filter templates by selected category
  const filteredTemplates = selectedCategory && selectedCategory !== 'todos'
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3">
        <Label htmlFor="category-select">Categoria</Label>
        <Select
          onValueChange={(value) => onCategoryChange(value)}
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
            onTemplateChange(template || null);
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
  );
};

export default DocumentSelector;
