
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Work } from '@/types/financeiro';
import { toast } from 'sonner';
import WorkForm from './WorkForm';
import WorkList from './WorkList';
import WorkFilter from './WorkFilter';

// Mock data for initial development
const mockWorks: Work[] = [
  {
    id: 'work1',
    name: 'Obra Residencial - Casa São Paulo',
    description: 'Construção de casa residencial de 200m²',
    clientId: 'cus1',
    clientName: 'Cliente A',
    status: 'in_progress',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    budget: 350000,
    location: 'São Paulo, SP',
    notes: 'Obra em andamento, previsão de conclusão em junho',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'user1'
  },
  {
    id: 'work2',
    name: 'Reforma Comercial - Loja Centro',
    description: 'Reforma completa de loja comercial',
    clientId: 'cus2',
    clientName: 'Cliente B',
    status: 'planning',
    startDate: '2024-03-01',
    budget: 120000,
    location: 'Rio de Janeiro, RJ',
    notes: 'Aguardando aprovação final do projeto',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
    createdBy: 'user1'
  }
];

const WorkManagement: React.FC = () => {
  const [works, setWorks] = useState<Work[]>(mockWorks);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>(mockWorks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'in_progress' | 'completed' | 'cancelled'>('all');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, filterStatus);
  };

  const handleStatusFilter = (status: 'all' | 'planning' | 'in_progress' | 'completed' | 'cancelled') => {
    setFilterStatus(status);
    applyFilters(searchTerm, status);
  };

  const applyFilters = (term: string, status: 'all' | 'planning' | 'in_progress' | 'completed' | 'cancelled') => {
    let filtered = [...works];
    
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      filtered = filtered.filter(work => 
        work.name.toLowerCase().includes(lowercaseTerm) ||
        work.description.toLowerCase().includes(lowercaseTerm) ||
        work.clientName?.toLowerCase().includes(lowercaseTerm) ||
        work.location?.toLowerCase().includes(lowercaseTerm)
      );
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(work => work.status === status);
    }
    
    setFilteredWorks(filtered);
  };

  const handleCreateWork = (data: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const newWork: Work = {
          id: `work${works.length + 1}`,
          name: data.name,
          description: data.description,
          clientId: data.clientId,
          clientName: data.clientName,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          budget: data.budget,
          location: data.location,
          notes: data.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'user1'
        };

        const updatedWorks = [...works, newWork];
        setWorks(updatedWorks);
        setFilteredWorks(updatedWorks);
        setIsFormOpen(false);
        toast.success('Obra criada com sucesso!');
      } catch (error) {
        console.error('Error creating work:', error);
        toast.error('Erro ao criar obra.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleUpdateWork = (data: any) => {
    if (!selectedWork) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const updatedWork: Work = {
          ...selectedWork,
          name: data.name,
          description: data.description,
          clientId: data.clientId,
          clientName: data.clientName,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          budget: data.budget,
          location: data.location,
          notes: data.notes,
          updatedAt: new Date().toISOString()
        };

        const updatedWorks = works.map(work => 
          work.id === selectedWork.id ? updatedWork : work
        );
        
        setWorks(updatedWorks);
        setFilteredWorks(updatedWorks);
        setIsFormOpen(false);
        setSelectedWork(undefined);
        toast.success('Obra atualizada com sucesso!');
      } catch (error) {
        console.error('Error updating work:', error);
        toast.error('Erro ao atualizar obra.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDeleteWork = (work: Work) => {
    try {
      const updatedWorks = works.filter(item => item.id !== work.id);
      setWorks(updatedWorks);
      setFilteredWorks(updatedWorks);
      toast.success('Obra excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting work:', error);
      toast.error('Erro ao excluir obra.');
    }
  };

  const handleEditWork = (work: Work) => {
    setSelectedWork(work);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-lg font-medium">Obras/Projetos</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie todas as obras e projetos da sua empresa
          </p>
        </div>
        <Button onClick={() => {
          setSelectedWork(undefined);
          setIsFormOpen(true);
        }} className="shrink-0">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      <WorkFilter 
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
      />

      {filteredWorks.length === 0 ? (
        <Alert>
          <AlertDescription>
            Nenhuma obra encontrada. Altere os filtros ou adicione uma nova obra.
          </AlertDescription>
        </Alert>
      ) : (
        <WorkList
          works={filteredWorks}
          onEdit={handleEditWork}
          onDelete={handleDeleteWork}
        />
      )}

      {/* Work Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <WorkForm
            work={selectedWork}
            onSubmit={selectedWork ? handleUpdateWork : handleCreateWork}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkManagement;
