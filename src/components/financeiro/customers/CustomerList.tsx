
// src/components/financeiro/customers/CustomerManagement.tsx

import React, { useState, useEffect } from 'react';
import CustomerFilter from './CustomerFilter';
import CustomerList from './CustomerList';
import { Customer } from '@/types/financeiro';

type FilterState = {
  search: string;
  type: 'all' | 'physical' | 'legal';
};

const CustomerManagement: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({ search: '', type: 'all' });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // TODO: buscar lista de clientes passando `filters` como parâmetros
  }, [filters]);

  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
  };

  const handleTypeFilter = (type: FilterState['type']) => {
    setFilters(prev => ({ ...prev, type }));
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    // TODO: abrir modal ou rota de detalhe
  };

  const handleEdit = (customer: Customer) => {
    // TODO: navegar para form de edição, ex: router.push(`/customers/edit/${customer.id}`)
  };

  const handleDelete = (customer: Customer) => {
    // TODO: chamar API de deleção e recarregar lista
  };

  return (
    <div>
      <CustomerFilter
        onSearch={handleSearch}
        onTypeFilter={handleTypeFilter}
      />

      <CustomerList
        customers={customers}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {selectedCustomer && (
        <div className="mt-4 p-4 border rounded">
          <h3>Detalhes do Cliente:</h3>
          <p><strong>Nome:</strong> {selectedCustomer.name}</p>
          <p><strong>Documento:</strong> {selectedCustomer.document}</p>
          {/* etc */}
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
