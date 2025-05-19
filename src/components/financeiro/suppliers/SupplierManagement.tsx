
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
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for initial development
const mockSuppliers: Supplier[] = [
  {
    id: 'sup1',
    name: 'Fornecedor A',
    businessName: 'Fornecedor A Razão Social LTDA',
    tradeName: 'Fornecedor A Nome Fantasia',
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
    businessName: 'Fornecedor B Razão Social LTDA',
    tradeName: 'Fornecedor B Nome Fantasia',
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
        (supplier.email && supplier.email.toLowerCase().includes(lowercaseTerm)) ||
        (supplier.businessName && supplier.businessName.toLowerCase().includes(lowercaseTerm)) ||
        (supplier.tradeName && supplier.tradeName.toLowerCase().includes(lowercaseTerm)) ||
        (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(lowercaseTerm)) ||
        (supplier.website && supplier.website.toLowerCase().includes(lowercaseTerm))
      );
    }
    
    if (type !== 'all') {
      filtered = filtered.filter(supplier => supplier.type === type);
    }
    
    setFilteredSuppliers(filtered);
  };

  const validateSupplierData = (data: any, isUpdate = false, supplierId?: string) => {
    // Check if document is valid
    if (!validateDocument(data.document)) {
      toast.error('O documento informado é inválido. Verifique se digitou corretamente.');
      return false;
    }
    
    // Check if document already exists
    const cleanDocument = data.document.replace(/\D/g, '');
    const documentExists = suppliers.some(
      sup => (isUpdate ? sup.id !== supplierId : true) && 
      sup.document.replace(/\D/g, '') === cleanDocument
    );
    
    if (documentExists) {
      toast.error('Já existe um fornecedor cadastrado com este documento. Verifique se não está tentando cadastrar um fornecedor duplicado.');
      return false;
    }
    
    return true;
  };

  const handleCreateSupplier = (data: any) => {
    setIsLoading(true);
    
    if (!validateSupplierData(data)) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const newSupplier: Supplier = {
          id: `sup${suppliers.length + 1}`,
          name: data.businessName, // Set name field to businessName for compatibility
          businessName: data.businessName,
          tradeName: data.tradeName || '',
          type: data.type,
          document: data.document,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          bankInfo: data.bankInfo || '',
          website: data.website || '',
          contactPerson: data.contactPerson || '',
          landlinePhone: data.landlinePhone || '',
          mobilePhone: data.mobilePhone || '',
          alternativeEmail: data.alternativeEmail || '',
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
    
    if (!validateSupplierData(data, true, selectedSupplier.id)) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        const updatedSupplier: Supplier = {
          ...selectedSupplier,
          name: data.businessName, // Set name field to businessName for compatibility
          businessName: data.businessName,
          tradeName: data.tradeName || '',
          type: data.type,
          document: data.document,
          email: data.email || selectedSupplier.email,
          phone: data.phone || selectedSupplier.phone,
          address: data.address || selectedSupplier.address,
          bankInfo: data.bankInfo || selectedSupplier.bankInfo,
          website: data.website || selectedSupplier.website,
          contactPerson: data.contactPerson || selectedSupplier.contactPerson,
          landlinePhone: data.landlinePhone || selectedSupplier.landlinePhone,
          mobilePhone: data.mobilePhone || selectedSupplier.mobilePhone,
          alternativeEmail: data.alternativeEmail || selectedSupplier.alternativeEmail,
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
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
              <SupplierForm
                supplier={selectedSupplier}
                onSubmit={selectedSupplier ? handleUpdateSupplier : handleCreateSupplier}
                onCancel={() => setIsFormOpen(false)}
                isLoading={isLoading}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Supplier Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManagement;
