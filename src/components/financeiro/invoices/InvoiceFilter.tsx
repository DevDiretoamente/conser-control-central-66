
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Search, FilterIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FinanceFilterOptions } from '@/types/financeiro';

interface InvoiceFilterProps {
  onFilterChange: (filters: FinanceFilterOptions) => void;
  costCenters: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}

const InvoiceFilter: React.FC<InvoiceFilterProps> = ({ onFilterChange, costCenters, suppliers }) => {
  const [filters, setFilters] = useState<FinanceFilterOptions>({
    searchTerm: '',
    startDate: undefined,
    endDate: undefined,
    costCenterId: undefined,
    supplierId: undefined,
    status: undefined,
  });

  const handleFilterChange = (key: keyof FinanceFilterOptions, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('searchTerm', e.target.value);
  };

  const handleClear = () => {
    const clearedFilters: FinanceFilterOptions = {
      searchTerm: '',
      startDate: undefined,
      endDate: undefined,
      costCenterId: undefined,
      supplierId: undefined,
      status: undefined,
    };

    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-background border rounded-md p-4">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, fornecedor..."
                value={filters.searchTerm || ''}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Inicial</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.startDate && "text-muted-foreground"
                          )}
                        >
                          {filters.startDate ? (
                            format(new Date(filters.startDate), "dd/MM/yyyy")
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.startDate ? new Date(filters.startDate) : undefined}
                          onSelect={(date) => handleFilterChange('startDate', date?.toISOString())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Final</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.endDate && "text-muted-foreground"
                          )}
                        >
                          {filters.endDate ? (
                            format(new Date(filters.endDate), "dd/MM/yyyy")
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.endDate ? new Date(filters.endDate) : undefined}
                          onSelect={(date) => handleFilterChange('endDate', date?.toISOString())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Paga</SelectItem>
                      <SelectItem value="partial">Pagamento Parcial</SelectItem>
                      <SelectItem value="overdue">Vencida</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Centro de Custo</label>
                  <Select
                    value={filters.costCenterId}
                    onValueChange={(value) => handleFilterChange('costCenterId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os centros de custo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Todos</SelectItem>
                      {costCenters.map((center) => (
                        <SelectItem key={center.id} value={center.id}>
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fornecedor</label>
                  <Select
                    value={filters.supplierId}
                    onValueChange={(value) => handleFilterChange('supplierId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os fornecedores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Todos</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Active filters display */}
        <div className="flex flex-wrap gap-2">
          {filters.startDate && (
            <div className="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-full flex items-center gap-1">
              <span>A partir de: {format(new Date(filters.startDate), "dd/MM/yyyy")}</span>
              <button 
                onClick={() => handleFilterChange('startDate', undefined)}
                className="ml-1 hover:text-primary"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.endDate && (
            <div className="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-full flex items-center gap-1">
              <span>Até: {format(new Date(filters.endDate), "dd/MM/yyyy")}</span>
              <button 
                onClick={() => handleFilterChange('endDate', undefined)}
                className="ml-1 hover:text-primary"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.status && filters.status !== 'none' && (
            <div className="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-full flex items-center gap-1">
              <span>Status: {
                filters.status === 'pending' ? 'Pendente' :
                filters.status === 'paid' ? 'Paga' :
                filters.status === 'partial' ? 'Parcial' :
                filters.status === 'overdue' ? 'Vencida' :
                filters.status === 'cancelled' ? 'Cancelada' :
                filters.status === 'draft' ? 'Rascunho' : filters.status
              }</span>
              <button 
                onClick={() => handleFilterChange('status', undefined)}
                className="ml-1 hover:text-primary"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.costCenterId && filters.costCenterId !== 'none' && (
            <div className="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-full flex items-center gap-1">
              <span>Centro de Custo: {
                costCenters.find(c => c.id === filters.costCenterId)?.name || filters.costCenterId
              }</span>
              <button 
                onClick={() => handleFilterChange('costCenterId', undefined)}
                className="ml-1 hover:text-primary"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.supplierId && filters.supplierId !== 'none' && (
            <div className="bg-secondary text-secondary-foreground px-3 py-1 text-xs rounded-full flex items-center gap-1">
              <span>Fornecedor: {
                suppliers.find(s => s.id === filters.supplierId)?.name || filters.supplierId
              }</span>
              <button 
                onClick={() => handleFilterChange('supplierId', undefined)}
                className="ml-1 hover:text-primary"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceFilter;
