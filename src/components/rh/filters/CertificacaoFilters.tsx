
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Certificacao, CertificacaoFilter } from '@/types/documentosRH';

interface CertificacaoFiltersProps {
  filter: CertificacaoFilter;
  onFilterChange: (filter: CertificacaoFilter) => void;
}

const CertificacaoFilters: React.FC<CertificacaoFiltersProps> = ({
  filter,
  onFilterChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar certificações..."
          value={filter.search || ''}
          onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select
        value={filter.categoria || 'all'}
        onValueChange={(value) => onFilterChange({ ...filter, categoria: value === 'all' ? undefined : value as Certificacao['categoria'] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          <SelectItem value="tecnica">Técnica</SelectItem>
          <SelectItem value="seguranca">Segurança</SelectItem>
          <SelectItem value="qualidade">Qualidade</SelectItem>
          <SelectItem value="gestao">Gestão</SelectItem>
          <SelectItem value="idioma">Idioma</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filter.status || 'all'}
        onValueChange={(value) => onFilterChange({ ...filter, status: value === 'all' ? undefined : value as Certificacao['status'] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="valida">Válida</SelectItem>
          <SelectItem value="vencida">Vencida</SelectItem>
          <SelectItem value="em_renovacao">Em Renovação</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CertificacaoFilters;
