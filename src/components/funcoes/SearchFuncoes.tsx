
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchFuncoesProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchFuncoes: React.FC<SearchFuncoesProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar funções..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default SearchFuncoes;
