
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { DocumentoRH, DocumentoRHFilter } from '@/types/documentosRH';

interface DocumentoRHFiltersProps {
  filter: DocumentoRHFilter;
  onFilterChange: (filter: DocumentoRHFilter) => void;
}

const DocumentoRHFilters: React.FC<DocumentoRHFiltersProps> = ({
  filter,
  onFilterChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar documentos..."
          value={filter.search || ''}
          onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select
        value={filter.tipo || 'all'}
        onValueChange={(value) => onFilterChange({ ...filter, tipo: value === 'all' ? undefined : value as DocumentoRH['tipo'] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tipo de documento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="contrato">Contrato</SelectItem>
          <SelectItem value="termo_confidencialidade">Termo de Confidencialidade</SelectItem>
          <SelectItem value="acordo_horario">Acordo de Horário</SelectItem>
          <SelectItem value="advertencia">Advertência</SelectItem>
          <SelectItem value="elogio">Elogio</SelectItem>
          <SelectItem value="avaliacao">Avaliação</SelectItem>
          <SelectItem value="ferias">Férias</SelectItem>
          <SelectItem value="atestado">Atestado</SelectItem>
          <SelectItem value="licenca">Licença</SelectItem>
          <SelectItem value="rescisao">Rescisão</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filter.status || 'all'}
        onValueChange={(value) => onFilterChange({ ...filter, status: value === 'all' ? undefined : value as DocumentoRH['status'] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="vencido">Vencido</SelectItem>
          <SelectItem value="arquivado">Arquivado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentoRHFilters;
