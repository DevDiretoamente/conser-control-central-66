
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DocumentoRHFilter } from '@/types/documentosRH';
import AdvancedFilters from './AdvancedFilters';
import { Funcionario } from '@/types/funcionario';

interface DocumentoAdvancedFiltersProps {
  filter: DocumentoRHFilter;
  onFilterChange: (filter: DocumentoRHFilter) => void;
  funcionarios: Funcionario[];
  onClearFilters: () => void;
}

const DocumentoAdvancedFilters: React.FC<DocumentoAdvancedFiltersProps> = ({
  filter,
  onFilterChange,
  funcionarios,
  onClearFilters
}) => {
  const activeFiltersCount = Object.values(filter).filter(value => 
    value && value !== 'all' && value !== ''
  ).length;

  const additionalFilters = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Filtro por Tipo */}
      <div className="space-y-2">
        <Label>Tipo de Documento</Label>
        <Select
          value={filter.tipo || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, tipo: value === 'all' ? undefined : value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
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
      </div>

      {/* Filtro por Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={filter.status || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, status: value === 'all' ? undefined : value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
            <SelectItem value="arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Assinatura */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="documento-assinado"
            checked={filter.assinado === true}
            onCheckedChange={(checked) => onFilterChange({ ...filter, assinado: checked ? true : undefined })}
          />
          <Label htmlFor="documento-assinado">Apenas Assinados</Label>
        </div>
      </div>
    </div>
  );

  return (
    <AdvancedFilters
      searchTerm={filter.search || ''}
      onSearchChange={(value) => onFilterChange({ ...filter, search: value })}
      dateFrom={filter.dataFrom}
      dateTo={filter.dataTo}
      onDateFromChange={(value) => onFilterChange({ ...filter, dataFrom: value })}
      onDateToChange={(value) => onFilterChange({ ...filter, dataTo: value })}
      funcionarioId={filter.funcionarioId}
      onFuncionarioChange={(value) => onFilterChange({ ...filter, funcionarioId: value === 'all' ? undefined : value })}
      funcionarios={funcionarios}
      additionalFilters={additionalFilters}
      onClearFilters={onClearFilters}
      activeFiltersCount={activeFiltersCount}
    />
  );
};

export default DocumentoAdvancedFilters;
