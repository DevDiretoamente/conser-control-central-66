
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Supplier } from '@/types/financeiro';
import { toast } from 'sonner';
import SupplierForm from './SupplierForm';
import SupplierList from './SupplierList';
import SupplierFilter from './SupplierFilter';
import SupplierDetails from './SupplierDetails';
import { validateDocument } from '@/utils/validators';

// Mock data for initial development
const mockSuppliers: Supplier[] = [
  {
    id: 'sup1',
    name: 'Fornecedor A',
    type: 'legal',
    document: '12.345.678/0001-90',
    email: 'fornecedor.a@example.com',
    phone: '(11) 1234-5678',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 'sup2',
    name: 'Fornecedor B',
    type: 'legal',
    document: '98.765.432/0001-10',
    email: 'fornecedor.b@example.com',
    phone: '(11) 8765-4321',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
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
    let filtered = [...suppliers];
    
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(lowercaseTerm) ||
        supplier.document.includes(term) ||
        supplier.email.toLowerCase().includes(lowercaseTerm)
      );
    }
    
    if (type !== 'all') {
      filtered = filtered.filter(supplier => supplier.type === type);
    }
    
    setFilteredSuppliers(filtered);
  };

  const handleCreateSupplier = (data: any) => {
    setIsLoading(true);
    
    // Check if document already exists
    const documentExists = suppliers.some(
      sup => sup.document.replace(/\D/g, '') === data.document.replace(/\D/g, '')
    );
    
    if (documentExists) {
      toast.error('Já existe um fornecedor com este documento.');
      setIsLoading(false);
      return;
    }
    
    // Validate document
    if (!validateDocument(data.document)) {
      toast.error('O documento informado é inválido.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newSupplier: Supplier = {
          id: `sup${suppliers.length + 1}`,
          name: data.name,
          type: data.type,
          document: data.document,
          email: data.email,
          phone: data.phone,
          address: data.address || '',
          bankInfo: data.bankInfo || '',
          notes: data.notes || '',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedSuppliers = [...suppliers, newSupplier];
        setSuppliers(updatedSuppliers);
        setFilteredSuppliers(updatedSuppliers);
        setIsFormOpen(false);
        toast.success('Fornecedor criado com sucesso!');
      } catch (error) {
        console.error('Error creating supplier:', error);
        toast.error('Erro ao criar fornecedor.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleUpdateSupplier = (data: any) => {
    if (!selectedSupplier) return;
    
    setIsLoading(true);
    
    // Check if document already exists with another supplier
    const documentExists = suppliers.some(
      sup => sup.id !== selectedSupplier.id && 
      sup.document.replace(/\D/g, '') === data.document.replace(/\D/g, '')
    );
    
    if (documentExists) {
      toast.error('Já existe um fornecedor com este documento.');
      setIsLoading(false);
      return;
    }
    
    // Validate document
    if (!validateDocument(data.document)) {
      toast.error('O documento informado é inválido.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const updatedSupplier: Supplier = {
          ...selectedSupplier,
          name: data.name,
          type: data.type,
          document: data.document,
          email: data.email,
          phone: data.phone,
          address: data.address || selectedSupplier.address,
          bankInfo: data.bankInfo || selectedSupplier.bankInfo,
          notes: data.notes || selectedSupplier.notes,
          updatedAt: new Date().toISOString()
        };

        const updatedSuppliers = suppliers.map(supplier => 
          supplier.id === selectedSupplier.id ? updatedSupplier : supplier
        );
        
        setSuppliers(updatedSuppliers);
        setFilteredSuppliers(updatedSuppliers);
        setIsFormOpen(false);
        setSelectedSupplier(undefined);
        toast.success('Fornecedor atualizado com sucesso!');
      } catch (error) {
        console.error('Error updating supplier:', error);
        toast.error('Erro ao atualizar fornecedor.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    try {
      const updatedSuppliers = suppliers.filter(item => item.id !== supplier.id);
      setSuppliers(updatedSuppliers);
      setFilteredSuppliers(updatedSuppliers);
      toast.success('Fornecedor excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Erro ao excluir fornecedor.');
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
    if (isDetailsOpen) setIsDetailsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-lg font-medium">Fornecedores</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie todos os fornecedores da sua empresa
          </p>
        </div>
        <Button onClick={() => {
          setSelectedSupplier(undefined);
          setIsFormOpen(true);
        }} className="shrink-0">
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <SupplierFilter 
        onSearch={handleSearch}
        onTypeFilter={handleTypeFilter}
      />

      {filteredSuppliers.length === 0 ? (
        <Alert>
          <AlertDescription>
            Nenhum fornecedor encontrado. Altere os filtros ou adicione um novo fornecedor.
          </AlertDescription>
        </Alert>
      ) : (
        <SupplierList
          suppliers={filteredSuppliers}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
          onViewDetails={(supplier) => {
            setSelectedSupplier(supplier);
            setIsDetailsOpen(true);
          }}
        />
      )}

      {/* Supplier Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <SupplierForm
            supplier={selectedSupplier}
            onSubmit={selectedSupplier ? handleUpdateSupplier : handleCreateSupplier}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          {selectedSupplier && (
            <SupplierDetails
              supplier={selectedSupplier}
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

export default SupplierManagement;
