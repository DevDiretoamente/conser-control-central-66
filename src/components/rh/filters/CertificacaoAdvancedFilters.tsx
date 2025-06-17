
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CertificacaoFilter } from '@/types/documentosRH';
import AdvancedFilters from './AdvancedFilters';
import { Funcionario } from '@/types/funcionario';

interface CertificacaoAdvancedFiltersProps {
  filter: CertificacaoFilter;
  onFilterChange: (filter: CertificacaoFilter) => void;
  funcionarios: Funcionario[];
  onClearFilters: () => void;
}

const CertificacaoAdvancedFilters: React.FC<CertificacaoAdvancedFiltersProps> = ({
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
      {/* Filtro por Categoria */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          value={filter.categoria || 'all'}
          onValueChange={(value) => onFilterChange({ ...filter, categoria: value === 'all' ? undefined : value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
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
            <SelectItem value="valida">Válida</SelectItem>
            <SelectItem value="vencida">Vencida</SelectItem>
            <SelectItem value="em_renovacao">Em Renovação</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Entidade Certificadora */}
      <div className="space-y-2">
        <Label>Entidade Certificadora</Label>
        <Input
          placeholder="Filtrar por entidade..."
          value={filter.entidade || ''}
          onChange={(e) => onFilterChange({ ...filter, entidade: e.target.value })}
        />
      </div>

      {/* Filtro por Vencimento Próximo */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="vencimento-proximo"
            checked={filter.vencimentoProximo || false}
            onCheckedChange={(checked) => onFilterChange({ ...filter, vencimentoProximo: checked })}
          />
          <Label htmlFor="vencimento-proximo">Vencimento em 30 dias</Label>
        </div>
      </div>
    </div>
  );

  return (
    <AdvancedFilters
      searchTerm={filter.search || ''}
      onSearchChange={(value) => onFilterChange({ ...filter, search: value })}
      funcionarioId={filter.funcionarioId}
      onFuncionarioChange={(value) => onFilterChange({ ...filter, funcionarioId: value === 'all' ? undefined : value })}
      funcionarios={funcionarios}
      additionalFilters={additionalFilters}
      onClearFilters={onClearFilters}
      activeFiltersCount={activeFiltersCount}
      dateFrom=""
      dateTo=""
      onDateFromChange={() => {}}
      onDateToChange={() => {}}
    />
  );
};

export default CertificacaoAdvancedFilters;
