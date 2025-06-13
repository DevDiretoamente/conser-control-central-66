// src/components/financeiro/customers/CustomerManagement.tsx

import React, { useState, useEffect } from 'react';
import CustomerFilter from './CustomerFilter';
import CustomerTable from './CustomerTable';
import { Customer } from '@/models/customer';

type FilterState = {
  search: string;
  type: 'all' | 'physical' | 'legal';
};

const CustomerManagement: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({ search: '', type: 'all' });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Sempre que os filtros mudarem, recarrega a lista
  useEffect(() => {
    fetchCustomers(filters);
  }, [filters]);

  const fetchCustomers = async (filters: FilterState) => {
    // Exemplo de fetch com filtros
    // const { data } = await api.get<Customer[]>('/customers', { params: filters });
    // setCustomers(data);
  };

  // Handler para campo de busca
  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  // Handler para filtro de tipo (all / physical / legal)
  const handleTypeFilter = (type: FilterState['type']) => {
    setFilters(prev => ({ ...prev, type }));
  };

  // Agora recebe o objeto Customer inteiro
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    // faça algo com o cliente selecionado...
  };

  return (
    <div>
      <CustomerFilter
        onSearch={handleSearch}
        onTypeFilter={handleTypeFilter}
      />

      <CustomerTable
        customers={customers}
        onSelectCustomer={handleSelectCustomer}
      />

      {selectedCustomer && (
        <div className="mt-4">
          <h2>Cliente selecionado:</h2>
          <p>{selectedCustomer.name}</p>
          {/* etc */}
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

