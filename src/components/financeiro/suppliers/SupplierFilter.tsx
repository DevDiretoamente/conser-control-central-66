
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FilterIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SupplierFilterProps {
  onSearch: (term: string) => void;
  onTypeFilter: (type: 'all' | 'physical' | 'legal') => void;
}

const SupplierFilter: React.FC<SupplierFilterProps> = ({ onSearch, onTypeFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleTypeChange = (value: string) => {
    onTypeFilter(value as 'all' | 'physical' | 'legal');
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    onTypeFilter('all');
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar fornecedor..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Limpar filtros
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <Card className="mt-2">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <Select defaultValue="all" onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="physical">Pessoa Física</SelectItem>
                    <SelectItem value="legal">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupplierFilter;
