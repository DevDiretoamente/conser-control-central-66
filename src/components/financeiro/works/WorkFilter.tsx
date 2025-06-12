
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface WorkFilterProps {
  onSearch: (searchTerm: string) => void;
  onStatusFilter: (status: 'all' | 'planning' | 'in_progress' | 'completed' | 'cancelled') => void;
}

const WorkFilter: React.FC<WorkFilterProps> = ({ onSearch, onStatusFilter }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'planning' | 'in_progress' | 'completed' | 'cancelled'>('all');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (status: 'all' | 'planning' | 'in_progress' | 'completed' | 'cancelled') => {
    setSelectedStatus(status);
    onStatusFilter(status);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    onSearch('');
    onStatusFilter('all');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nome, descrição, cliente..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="planning">Planejamento</SelectItem>
          <SelectItem value="in_progress">Em Andamento</SelectItem>
          <SelectItem value="completed">Concluída</SelectItem>
          <SelectItem value="cancelled">Cancelada</SelectItem>
        </SelectContent>
      </Select>

      {(searchTerm || selectedStatus !== 'all') && (
        <Button variant="outline" onClick={clearFilters} size="sm">
          <X className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
};

export default WorkFilter;
