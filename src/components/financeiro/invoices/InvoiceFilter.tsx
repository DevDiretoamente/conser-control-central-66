import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { CostCenter, Supplier, FinanceFilterOptions, Work, ExpenseCategoryType, InvoiceStatus } from '@/types/financeiro';
import { Search, Filter, X } from 'lucide-react';
import { mockWorks } from './form/WorkProjectSection';

interface InvoiceFilterProps {
  onFilterChange: (filters: FinanceFilterOptions) => void;
  costCenters: CostCenter[];
  suppliers: Supplier[];
}

const InvoiceFilter: React.FC<InvoiceFilterProps> = ({ onFilterChange, costCenters, suppliers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<InvoiceStatus | 'none'>('none');
  const [costCenterId, setCostCenterId] = useState<string>('none');
  const [supplierId, setSupplierId] = useState<string>('none');
  const [workId, setWorkId] = useState<string>('none');
  const [categoryType, setCategoryType] = useState<string>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  // Array of expense categories for filter
  const expenseCategories = [
    { id: 'administration', name: 'Administração' },
    { id: 'fuel', name: 'Combustível' },
    { id: 'hotel', name: 'Hospedagem' },
    { id: 'food', name: 'Alimentação' },
    { id: 'maintenance', name: 'Manutenção' },
    { id: 'supplies', name: 'Materiais' },
    { id: 'transportation', name: 'Transporte' },
    { id: 'utilities', name: 'Utilidades' },
    { id: 'other', name: 'Outros' }
  ];

  const handleApplyFilters = () => {
    onFilterChange({
      searchTerm,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      status: status === 'none' ? undefined : status,
      costCenterId: costCenterId === 'none' ? undefined : costCenterId,
      supplierId: supplierId === 'none' ? undefined : supplierId,
      workId: workId === 'none' ? undefined : workId,
      categoryType: categoryType === 'none' ? undefined : categoryType as ExpenseCategoryType,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('none');
    setCostCenterId('none');
    setSupplierId('none');
    setWorkId('none');
    setCategoryType('none');
    
    onFilterChange({});
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por número, fornecedor ou centro de custo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={handleApplyFilters}>Aplicar</Button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Data Inicial</Label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Selecione"
                className="w-full"
              />
            </div>
            <div>
              <Label>Data Final</Label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="Selecione"
                className="w-full"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(value: InvoiceStatus | 'none') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="partial">Parcial</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="released">Liberada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Centro de Custo</Label>
              <Select value={costCenterId} onValueChange={setCostCenterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos</SelectItem>
                  {costCenters.map((cc) => (
                    <SelectItem key={cc.id} value={cc.id}>{cc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>Fornecedor</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>{supplier.businessName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Obra/Projeto</Label>
              <Select value={workId} onValueChange={setWorkId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todos</SelectItem>
                  {mockWorks.map((work) => (
                    <SelectItem key={work.id} value={work.id}>{work.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoria de Despesa</Label>
              <Select value={categoryType} onValueChange={setCategoryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilter;
