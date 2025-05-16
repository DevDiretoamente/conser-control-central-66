
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CostCenter } from '@/types/financeiro';
import { Plus, Search } from 'lucide-react';
import CostCenterList from './CostCenterList';
import CostCenterForm from './CostCenterForm';
import { toast } from 'sonner';

// Mock data for development - will be replaced with API calls
const mockCostCenters: CostCenter[] = [
  {
    id: '1',
    name: 'Obra João 23',
    description: 'Pavimentação da Rua João XXIII',
    budget: 120000,
    spent: 85000,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1'
  },
  {
    id: '2',
    name: 'Obra Rio Branco',
    description: 'Reparo na Av. Rio Branco',
    budget: 50000,
    spent: 48000,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1'
  },
  {
    id: '3',
    name: 'Manutenção da Frota',
    description: 'Centro de custo para manutenção de veículos',
    budget: 30000,
    spent: 18500,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1'
  },
  {
    id: '4',
    name: 'Obras Finalizadas',
    description: 'Centro de custo para obras concluídas em 2023',
    budget: 0,
    spent: 0,
    status: 'archived',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1'
  }
];

const CostCenterManagement: React.FC = () => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>(mockCostCenters);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [filteredCostCenters, setFilteredCostCenters] = useState<CostCenter[]>(costCenters);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search functionality
  const handleFilterChange = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredCostCenters(costCenters);
      return;
    }
    
    const results = costCenters.filter(center => 
      center.name.toLowerCase().includes(term.toLowerCase()) || 
      center.description?.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredCostCenters(results);
  };

  // Handle cost center creation
  const handleCreateCostCenter = (data: Partial<CostCenter>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCostCenter: CostCenter = {
        id: `new-${Date.now()}`,
        name: data.name!,
        description: data.description || '',
        parentId: data.parentId,
        obraId: data.obraId,
        budget: data.budget,
        spent: 0,
        status: data.status as CostCenterStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user-id'
      };
      
      const updatedCostCenters = [...costCenters, newCostCenter];
      setCostCenters(updatedCostCenters);
      setFilteredCostCenters(updatedCostCenters);
      setIsAddFormOpen(false);
      setIsLoading(false);
      toast.success('Centro de custo criado com sucesso!');
    }, 1000);
  };

  // Handle cost center update
  const handleUpdateCostCenter = (data: Partial<CostCenter>) => {
    if (!selectedCostCenter) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedCostCenters = costCenters.map(center => 
        center.id === selectedCostCenter.id 
          ? { 
              ...center, 
              name: data.name!, 
              description: data.description || '',
              parentId: data.parentId,
              obraId: data.obraId,
              budget: data.budget,
              status: data.status as CostCenterStatus,
              updatedAt: new Date().toISOString() 
            }
          : center
      );
      
      setCostCenters(updatedCostCenters);
      setFilteredCostCenters(updatedCostCenters);
      setSelectedCostCenter(null);
      setIsLoading(false);
      toast.success('Centro de custo atualizado com sucesso!');
    }, 1000);
  };

  // Handle form submission (create or update)
  const handleFormSubmit = (data: any) => {
    if (selectedCostCenter) {
      handleUpdateCostCenter(data);
    } else {
      handleCreateCostCenter(data);
    }
  };

  // Handle cost center selection
  const handleCostCenterSelect = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setIsAddFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar centros de custo..."
            value={searchTerm}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button onClick={() => {
          setSelectedCostCenter(null);
          setIsAddFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Centro de Custo
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Centros de Custo</CardTitle>
              <CardDescription>
                Gerencie seus centros de custo para controle financeiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CostCenterList 
                costCenters={filteredCostCenters}
                selectedCostCenterId={selectedCostCenter?.id}
                onSelectCostCenter={handleCostCenterSelect}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {isAddFormOpen || selectedCostCenter ? (
            <CostCenterForm
              costCenter={selectedCostCenter || undefined}
              parentCostCenters={costCenters.filter(c => 
                c.id !== selectedCostCenter?.id && c.status === 'active'
              )}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setSelectedCostCenter(null);
                setIsAddFormOpen(false);
              }}
              isLoading={isLoading}
            />
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-60">
                <p className="text-muted-foreground mb-4">
                  Selecione um centro de custo para ver detalhes ou crie um novo
                </p>
                <Button onClick={() => setIsAddFormOpen(true)} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Centro de Custo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostCenterManagement;
