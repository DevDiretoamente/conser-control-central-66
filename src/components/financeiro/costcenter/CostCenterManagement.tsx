
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CostCenter, CostCenterStatus } from '@/types/financeiro';
import { Plus, Search } from 'lucide-react';
import CostCenterList from './CostCenterList';
import CostCenterForm from './CostCenterForm';
import { CostCenterService } from '@/services/costCenterService';
import { toast } from 'sonner';

const CostCenterManagement: React.FC = () => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [filteredCostCenters, setFilteredCostCenters] = useState<CostCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cost centers on component mount
  useEffect(() => {
    loadCostCenters();
  }, []);

  const loadCostCenters = () => {
    const centers = CostCenterService.getAll();
    setCostCenters(centers);
    setFilteredCostCenters(centers);
  };

  // Handle search functionality
  const handleFilterChange = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredCostCenters(costCenters);
      return;
    }
    
    const results = CostCenterService.search(term);
    setFilteredCostCenters(results);
  };

  // Handle cost center creation
  const handleCreateCostCenter = (data: Partial<CostCenter>) => {
    setIsLoading(true);
    
    try {
      const newCostCenter = CostCenterService.create({
        name: data.name!,
        description: data.description || '',
        parentId: data.parentId,
        obraId: data.obraId,
        status: data.status as CostCenterStatus,
        createdBy: 'current-user-id'
      });
      
      loadCostCenters();
      setIsAddFormOpen(false);
      toast.success('Centro de custo criado com sucesso!');
    } catch (error) {
      console.error('Error creating cost center:', error);
      toast.error('Erro ao criar centro de custo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cost center update
  const handleUpdateCostCenter = (data: Partial<CostCenter>) => {
    if (!selectedCostCenter) return;
    
    setIsLoading(true);
    
    try {
      CostCenterService.update(selectedCostCenter.id, {
        name: data.name,
        description: data.description,
        parentId: data.parentId,
        obraId: data.obraId,
        status: data.status as CostCenterStatus,
      });
      
      loadCostCenters();
      setSelectedCostCenter(null);
      toast.success('Centro de custo atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating cost center:', error);
      toast.error('Erro ao atualizar centro de custo.');
    } finally {
      setIsLoading(false);
    }
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
