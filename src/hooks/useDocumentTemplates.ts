
import { useState, useEffect } from 'react';
import { DocumentTemplate } from '@/types/documentTemplate';
import { toast } from 'sonner';

export const useDocumentTemplates = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    templates,
    isLoading
  };
};
