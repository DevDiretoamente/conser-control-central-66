
import { useMemo } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

interface UseOptimizedSearchProps<T> {
  items: T[];
  searchTerm: string;
  searchFields: (keyof T)[];
  delay?: number;
}

export function useOptimizedSearch<T>({
  items,
  searchTerm,
  searchFields,
  delay = 300
}: UseOptimizedSearchProps<T>) {
  const debouncedSearchTerm = useDebouncedValue(searchTerm, delay);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
  }, [items, debouncedSearchTerm, searchFields]);

  return {
    filteredItems,
    isSearching: searchTerm !== debouncedSearchTerm,
    searchTerm: debouncedSearchTerm,
  };
}
