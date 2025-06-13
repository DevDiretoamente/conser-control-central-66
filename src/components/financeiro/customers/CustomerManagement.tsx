import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Customer } from '@/types/financeiro';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import CustomerFilter from './CustomerFilter';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import CustomerDetails from './CustomerDetails';
import { CustomerService } from '@/services/customerService';
import { ScrollArea } from '@/components/ui/scroll-area';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const allCustomers = CustomerService.getAll();
    setCustomers(allCustomers);
    setFilteredCustomers(allCustomers);
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...customers];

    if (filters.searchTerm) {
      filtered = CustomerService.search(filters.searchTerm);
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(customer => customer.type === filters.type);
    }

    if (filters.status !== undefined) {
      filtered = filtered.filter(customer => customer.isActive === filters.status);
    }

    setFilteredCustomers(filtered);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
    if (isDetailsOpen) setIsDetailsOpen(false);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      if (CustomerService.delete(customer.id)) {
        loadCustomers();
        toast.success('Cliente excluído com sucesso!');
      } else {
        toast.error('Erro ao excluir cliente.');
      }
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleCreateCustomer = (data: any) => {
    setIsLoading(true);
    
    try {
      CustomerService.create(data);
      loadCustomers();
      setIsFormOpen(false);
      toast.success('Cliente criado com sucesso!');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Erro ao criar cliente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = (data: any) => {
    if (!selectedCustomer) return;
    
    setIsLoading(true);
    
    try {
      CustomerService.update(selectedCustomer.id, data);
      loadCustomers();
      setIsFormOpen(false);
      setSelectedCustomer(null);
      toast.success('Cliente atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Erro ao atualizar cliente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie os clientes da empresa
          </p>
        </div>
        <Button onClick={handleNewCustomer}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <CustomerFilter onFilterChange={handleFilterChange} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerList 
            customers={filteredCustomers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onView={handleViewCustomer}
          />
        </CardContent>
      </Card>
      
      {/* Customer Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
              <CustomerForm
                customer={selectedCustomer || undefined}
                onSubmit={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
                onCancel={() => setIsFormOpen(false)}
                isLoading={isLoading}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
