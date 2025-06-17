
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Filter, X, Search } from 'lucide-react';
import { Funcionario } from '@/types/funcionario';

interface AdvancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  funcionarioId?: string;
  onFuncionarioChange: (value: string) => void;
  funcionarios: Funcionario[];
  additionalFilters?: React.ReactNode;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  searchTerm,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  funcionarioId,
  onFuncionarioChange,
  funcionarios,
  additionalFilters,
  onClearFilters,
  activeFiltersCount
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} ativos
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca Global */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar em todos os campos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por Funcionário */}
          <div className="space-y-2">
            <Label>Funcionário</Label>
            <Select
              value={funcionarioId || 'all'}
              onValueChange={onFuncionarioChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os funcionários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os funcionários</SelectItem>
                {funcionarios.map((func) => (
                  <SelectItem key={func.id} value={func.id}>
                    {func.dadosPessoais.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Data - Início */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Data Inicial
            </Label>
            <Input
              type="date"
              value={dateFrom || ''}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>

          {/* Filtro por Data - Fim */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Data Final
            </Label>
            <Input
              type="date"
              value={dateTo || ''}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros Adicionais */}
        {additionalFilters && (
          <div className="pt-4 border-t">
            {additionalFilters}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
