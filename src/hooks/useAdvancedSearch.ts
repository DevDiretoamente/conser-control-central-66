
import { useMemo } from 'react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';
import { useOptimizedSearch } from './useOptimizedSearch';

interface AdvancedSearchOptions {
  searchTerm: string;
  dateFrom?: string;
  dateTo?: string;
  funcionarioId?: string;
  tags?: string[];
}

interface UseAdvancedSearchProps<T> {
  items: T[];
  funcionarios: Funcionario[];
  options: AdvancedSearchOptions;
  searchFields: (keyof T)[];
}

export function useAdvancedSearch<T extends DocumentoRH | Certificacao>({
  items,
  funcionarios,
  options,
  searchFields
}: UseAdvancedSearchProps<T>) {
  const { searchTerm, dateFrom, dateTo, funcionarioId, tags } = options;

  // Primeiro aplica busca por texto
  const { filteredItems: textFiltered } = useOptimizedSearch({
    items,
    searchTerm,
    searchFields
  });

  // Depois aplica filtros avançados
  const filteredItems = useMemo(() => {
    let result = textFiltered;

    // Filtro por funcionário
    if (funcionarioId && funcionarioId !== 'all') {
      result = result.filter(item => item.funcionarioId === funcionarioId);
    }

    // Filtro por data
    if (dateFrom || dateTo) {
      result = result.filter(item => {
        const itemDate = 'dataDocumento' in item ? item.dataDocumento : item.dataObtencao;
        const date = new Date(itemDate);
        
        if (dateFrom && date < new Date(dateFrom)) return false;
        if (dateTo && date > new Date(dateTo)) return false;
        
        return true;
      });
    }

    // Filtro por tags (implementação futura)
    if (tags && tags.length > 0) {
      // Placeholder para sistema de tags
      result = result.filter(item => {
        const itemTags = (item as any).tags || [];
        return tags.some(tag => itemTags.includes(tag));
      });
    }

    return result;
  }, [textFiltered, funcionarioId, dateFrom, dateTo, tags]);

  const funcionarioOptions = useMemo(() => {
    return funcionarios.map(func => ({
      value: func.id,
      label: func.dadosPessoais.nome
    }));
  }, [funcionarios]);

  return {
    filteredItems,
    funcionarioOptions,
    totalItems: items.length,
    filteredCount: filteredItems.length
  };
}
