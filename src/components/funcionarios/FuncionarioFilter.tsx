
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface FuncionarioFilterValues {
  search?: string;
  cargo?: string;
  departamento?: string;
  statusAso?: 'todos' | 'valido' | 'vencido' | 'vence-em-breve';
}

interface FuncionarioFilterProps {
  values: FuncionarioFilterValues;
  onChange: (values: FuncionarioFilterValues) => void;
  availableCargos: Array<{ id: string; nome: string }>;
  availableDepartamentos: Array<{ id: string; nome: string }>;
}

const FuncionarioFilter: React.FC<FuncionarioFilterProps> = ({
  values,
  onChange,
  availableCargos,
  availableDepartamentos,
}) => {
  const [localValues, setLocalValues] = React.useState<FuncionarioFilterValues>(values);

  const handleChange = (field: keyof FuncionarioFilterValues, value: any) => {
    const newValues = { ...localValues, [field]: value };
    setLocalValues(newValues);
  };

  const applyFilters = () => {
    onChange(localValues);
  };

  const resetFilters = () => {
    const resetValues: FuncionarioFilterValues = {
      search: '',
      cargo: undefined,
      departamento: undefined,
      statusAso: 'todos' as const,
    };
    setLocalValues(resetValues);
    onChange(resetValues);
  };

  const activeFilterCount = Object.values(localValues).filter(value => 
    value !== undefined && value !== '' && value !== 'todos'
  ).length;

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="Buscar funcionário..."
            value={localValues.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>

        <Select
          value={localValues.cargo}
          onValueChange={(value) => handleChange('cargo', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os cargos</SelectItem>
            {availableCargos.map((cargo) => (
              <SelectItem key={cargo.id} value={cargo.id}>{cargo.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={localValues.departamento}
          onValueChange={(value) => handleChange('departamento', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os departamentos</SelectItem>
            {availableDepartamentos.map((dep) => (
              <SelectItem key={dep.id} value={dep.id}>{dep.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={localValues.statusAso || 'todos'}
          onValueChange={(value: 'todos' | 'valido' | 'vencido' | 'vence-em-breve') => 
            handleChange('statusAso', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status do ASO" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="valido">ASO Válido</SelectItem>
            <SelectItem value="vencido">ASO Vencido</SelectItem>
            <SelectItem value="vence-em-breve">ASO Vence em Breve</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">
              {activeFilterCount} {activeFilterCount === 1 ? 'filtro ativo' : 'filtros ativos'}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={activeFilterCount === 0}
          >
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
          <Button size="sm" onClick={applyFilters}>
            <Search className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioFilter;
