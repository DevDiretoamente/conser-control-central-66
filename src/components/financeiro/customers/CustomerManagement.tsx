
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Customer } from '@/types/financeiro';
import { toast } from 'sonner';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import CustomerFilter from './CustomerFilter';
import CustomerDetails from './CustomerDetails';
import { validateDocument } from '@/utils/validators';

// Mock data for initial development
const mockCustomers: Customer[] = [
  {
    id: 'cus1',
    name: 'Cliente A',
    type: 'legal',
    document: '12.345.678/0001-90',
    email: 'cliente.a@example.com',
    phone: '(11) 1234-5678',
    city: 'São Paulo',
    state: 'SP',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 'cus2',
    name: 'Cliente B',
    type: 'physical',
    document: '123.456.789-01',
    email: 'cliente.b@example.com',
    phone: '(11) 8765-4321',
    city: 'Rio de Janeiro',
    state: 'RJ',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'physical' | 'legal'>('all');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, filterType);
  };

  const handleTypeFilter = (type: 'all' | 'physical' | 'legal') => {
    setFilterType(type);
    applyFilters(searchTerm, type);
  };

  const applyFilters = (term: string, type: 'all' | 'physical' | 'legal') => {
    let filtered = [...customers];
    
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(lowercaseTerm) ||
        customer.document.includes(term) ||
        customer.email?.toLowerCase().includes(lowercaseTerm) ||
        customer.city?.toLowerCase().includes(lowercaseTerm) ||
        customer.state?.toLowerCase().includes(lowercaseTerm) ||
        (customer.contactPerson && customer.contactPerson.toLowerCase().includes(lowercaseTerm)) ||
        (customer.website && customer.website.toLowerCase().includes(lowercaseTerm))
      );
    }
    
    if (type !== 'all') {
      filtered = filtered.filter(customer => customer.type === type);
    }
    
    setFilteredCustomers(filtered);
  };

  const validateCustomerData = (data: any, isUpdate = false, customerId?: string) => {
    // Check if document is valid
    if (!validateDocument(data.document)) {
      toast.error('O documento informado é inválido. Verifique se digitou corretamente.');
      return false;
    }
    
    // Check if document already exists
    const cleanDocument = data.document.replace(/\D/g, '');
    const documentExists = customers.some(
      cust => (isUpdate ? cust.id !== customerId : true) && 
      cust.document.replace(/\D/g, '') === cleanDocument
    );
    
    if (documentExists) {
      toast.error('Já existe um cliente cadastrado com este documento. Verifique se não está tentando cadastrar um cliente duplicado.');
      return false;
    }
    
    return true;
  };

  const handleCreateCustomer = (data: any) => {
    setIsLoading(true);
    
    if (!validateCustomerData(data)) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newCustomer: Customer = {
          id: `cus${customers.length + 1}`,
          name: data.name,
          type: data.type,
          document: data.document,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          contactPerson: data.contactPerson || '',
          contactPhone: data.contactPhone || '',
          website: data.website || '',
          landlinePhone: data.landlinePhone || '',
          mobilePhone: data.mobilePhone || '',
          alternativeEmail: data.alternativeEmail || '',
          notes: data.notes || '',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedCustomers = [...customers, newCustomer];
        setCustomers(updatedCustomers);
        setFilteredCustomers(updatedCustomers);
        setIsFormOpen(false);
        toast.success('Cliente criado com sucesso!');
      } catch (error) {
        console.error('Error creating customer:', error);
        toast.error('Erro ao criar cliente.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleUpdateCustomer = (data: any) => {
    if (!selectedCustomer) return;
    
    setIsLoading(true);
    
    if (!validateCustomerData(data, true, selectedCustomer.id)) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const updatedCustomer: Customer = {
          ...selectedCustomer,
          name: data.name,
          type: data.type,
          document: data.document,
          email: data.email || selectedCustomer.email,
          phone: data.phone || selectedCustomer.phone,
          address: data.address || selectedCustomer.address,
          city: data.city || selectedCustomer.city,
          state: data.state || selectedCustomer.state,
          zipCode: data.zipCode || selectedCustomer.zipCode,
          contactPerson: data.contactPerson || selectedCustomer.contactPerson,
          contactPhone: data.contactPhone || selectedCustomer.contactPhone,
          website: data.website || selectedCustomer.website,
          landlinePhone: data.landlinePhone || selectedCustomer.landlinePhone,
          mobilePhone: data.mobilePhone || selectedCustomer.mobilePhone,
          alternativeEmail: data.alternativeEmail || selectedCustomer.alternativeEmail,
          notes: data.notes || selectedCustomer.notes,
          updatedAt: new Date().toISOString()
        };

        const updatedCustomers = customers.map(customer => 
          customer.id === selectedCustomer.id ? updatedCustomer : customer
        );
        
        setCustomers(updatedCustomers);
        setFilteredCustomers(updatedCustomers);
        setIsFormOpen(false);
        setSelectedCustomer(undefined);
        toast.success('Cliente atualizado com sucesso!');
      } catch (error) {
        console.error('Error updating customer:', error);
        toast.error('Erro ao atualizar cliente.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    try {
      const updatedCustomers = customers.filter(item => item.id !== customer.id);
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      toast.success('Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Erro ao excluir cliente.');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
    if (isDetailsOpen) setIsDetailsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-lg font-medium">Clientes</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie todos os clientes da sua empresa
          </p>
        </div>
        <Button onClick={() => {
          setSelectedCustomer(undefined);
          setIsFormOpen(true);
        }} className="shrink-0">
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <CustomerFilter 
        onSearch={handleSearch}
        onTypeFilter={handleTypeFilter}
      />

      {filteredCustomers.length === 0 ? (
        <Alert>
          <AlertDescription>
            Nenhum cliente encontrado. Altere os filtros ou adicione um novo cliente.
          </AlertDescription>
        </Alert>
      ) : (
        <CustomerList
          customers={filteredCustomers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onViewDetails={(customer) => {
            setSelectedCustomer(customer);
            setIsDetailsOpen(true);
          }}
        />
      )}

      {/* Customer Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          {selectedCustomer && (
            <CustomerDetails
              customer={selectedCustomer}
              onEdit={() => {
                setIsDetailsOpen(false);
                setTimeout(() => {
                  setIsFormOpen(true);
                }, 100);
              }}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
