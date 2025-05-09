
import React, { useState } from 'react';
import { UserRole, UserFilterOptions } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { FilterX, Filter, SortAsc, SortDesc, UserCheck, UserX, Search, X } from 'lucide-react';

interface UserFilterToolbarProps {
  onFilterChange: (filters: UserFilterOptions) => void;
}

const UserFilterToolbar: React.FC<UserFilterToolbarProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UserFilterOptions>({});

  const handleRoleToggle = (role: UserRole | undefined) => {
    const newFilters = { ...filters, role };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: boolean | undefined) => {
    const newFilters = { ...filters, isActive: status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const newFilters = { ...filters, searchTerm: e.target.value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSearchTerm('');
              handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            <span>Filtrar</span>
            {hasActiveFilters && <span className="rounded-full bg-primary w-2 h-2" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Função</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.role === 'admin'}
            onCheckedChange={() => handleRoleToggle(filters.role === 'admin' ? undefined : 'admin')}
          >
            Administrador
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.role === 'manager'}
            onCheckedChange={() => handleRoleToggle(filters.role === 'manager' ? undefined : 'manager')}
          >
            Gerente
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.role === 'operator'}
            onCheckedChange={() => handleRoleToggle(filters.role === 'operator' ? undefined : 'operator')}
          >
            Operador
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.isActive === true}
            onCheckedChange={() => handleStatusToggle(filters.isActive === true ? undefined : true)}
          >
            <div className="flex items-center">
              <UserCheck className="mr-2 h-4 w-4 text-green-500" />
              <span>Ativos</span>
            </div>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.isActive === false}
            onCheckedChange={() => handleStatusToggle(filters.isActive === false ? undefined : false)}
          >
            <div className="flex items-center">
              <UserX className="mr-2 h-4 w-4 text-red-500" />
              <span>Inativos</span>
            </div>
          </DropdownMenuCheckboxItem>

          {hasActiveFilters && (
            <>
              <DropdownMenuSeparator />
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={handleClearAll}
              >
                <FilterX className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 whitespace-nowrap">
            {filters.sortDirection === 'desc' ? (
              <SortDesc className="h-4 w-4" />
            ) : (
              <SortAsc className="h-4 w-4" />
            )}
            <span>Ordenar</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.sortField === 'name'}
            onCheckedChange={() => {
              const newFilters: UserFilterOptions = { 
                ...filters, 
                sortField: 'name',
                sortDirection: filters.sortDirection || 'asc'
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
          >
            Nome
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.sortField === 'createdAt'}
            onCheckedChange={() => {
              const newFilters: UserFilterOptions = { 
                ...filters, 
                sortField: 'createdAt',
                sortDirection: filters.sortDirection || 'desc' 
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
          >
            Data de Criação
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.sortField === 'lastLogin'}
            onCheckedChange={() => {
              const newFilters: UserFilterOptions = { 
                ...filters, 
                sortField: 'lastLogin',
                sortDirection: filters.sortDirection || 'desc' 
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
          >
            Último Login
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Direção</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.sortDirection === 'asc'}
            onCheckedChange={() => {
              const newFilters: UserFilterOptions = { 
                ...filters, 
                sortDirection: 'asc',
                sortField: filters.sortField || 'name'
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
          >
            <div className="flex items-center">
              <SortAsc className="mr-2 h-4 w-4" />
              <span>Crescente</span>
            </div>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.sortDirection === 'desc'}
            onCheckedChange={() => {
              const newFilters: UserFilterOptions = { 
                ...filters, 
                sortDirection: 'desc',
                sortField: filters.sortField || 'name'
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
          >
            <div className="flex items-center">
              <SortDesc className="mr-2 h-4 w-4" />
              <span>Decrescente</span>
            </div>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserFilterToolbar;
