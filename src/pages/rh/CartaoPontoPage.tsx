
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import CartaoPontoFilter from '@/components/cartaoponto/CartaoPontoFilter';
import CartaoPontoTable from '@/components/cartaoponto/CartaoPontoTable';
import CartaoPontoDialog from '@/components/cartaoponto/CartaoPontoDialog';
import CartaoPontoCalendar from '@/components/cartaoponto/CartaoPontoCalendar';
import CartaoPontoSummary from '@/components/cartaoponto/CartaoPontoSummary';
import BeneficiosTab from '@/components/cartaoponto/BeneficiosTab';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  CartaoPonto, 
  CartaoPontoFilterOptions,
  CartaoPontoStatus 
} from '@/types/cartaoPonto';
import { CartaoPontoFormValues } from '@/components/cartaoponto/CartaoPontoDialog';
import { cartaoPontoService } from '@/services/cartaoPontoService';
import { Calendar, Plus, ChevronLeft, ChevronRight, Table as TableIcon, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock employee data for demo purposes
const mockFuncionarios = [
  { id: '101', nome: 'João Silva' },
  { id: '102', nome: 'Maria Oliveira' },
  { id: '103', nome: 'Pedro Santos' },
  { id: '104', nome: 'Ana Costa' },
];

const CartaoPontoPage: React.FC = () => {
  const { hasSpecificPermission } = useAuth();
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState<CartaoPonto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'beneficios'>('calendar');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState('');
  const [summary, setSummary] = useState({
    totalHorasMes: 0,
    totalHorasExtras: 0,
    totalHorasExtras50: 0,
    totalHorasExtras80: 0,
    totalHorasExtras110: 0,
    diasTrabalhados: 0,
    diasFaltantes: 0,
    registrosIncompletos: 0,
    valorCestaBasica: 0,
    valorLanche: 0,
    elegibleValeAlimentacao: false,
  });
  
  const canCreate = hasSpecificPermission('cartaoponto', 'create');
  const canEdit = hasSpecificPermission('cartaoponto', 'write');
  const canDelete = hasSpecificPermission('cartaoponto', 'delete');
  const canManage = hasSpecificPermission('cartaoponto', 'manage');
  const canManageBeneficios = hasSpecificPermission('cartaoponto', 'manage') || hasSpecificPermission('admin', 'write');

  useEffect(() => {
    loadRegistros();
  }, [currentDate, selectedFuncionario]);

  const loadRegistros = async () => {
    setLoading(true);
    try {
      // Prepare filters based on current date (month) and selected funcionario
      const filters: CartaoPontoFilterOptions = {
        dataInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
        dataFim: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
      };
      
      if (selectedFuncionario) {
        filters.funcionarioId = selectedFuncionario;
      }
      
      const data = await cartaoPontoService.filter(filters);
      setRegistros(data);
      
      if (selectedFuncionario) {
        const summarData = await cartaoPontoService.getSummary(
          selectedFuncionario,
          currentDate.getMonth() + 1,
          currentDate.getFullYear()
        );
        setSummary(summarData);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os registros de ponto.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handleFilter = async (filters: CartaoPontoFilterOptions) => {
    setLoading(true);
    try {
      const data = await cartaoPontoService.filter(filters);
      setRegistros(data);
    } catch (error) {
      console.error('Erro ao filtrar registros:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível filtrar os registros.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CartaoPontoFormValues) => {
    if (!data.funcionarioId) {
      toast({
        title: 'Erro',
        description: 'ID do funcionário é obrigatório.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await cartaoPontoService.create({
        ...data,
        funcionarioId: data.funcionarioId, // Ensure this is set
        data: data.data || new Date().toISOString().split('T')[0], // Ensure date is set
        status: data.status as CartaoPontoStatus,
      });
      
      toast({
        title: 'Sucesso',
        description: 'Registro criado com sucesso.',
      });
      
      loadRegistros();
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o registro.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (id: string, data: CartaoPontoFormValues) => {
    try {
      await cartaoPontoService.update(id, {
        ...data,
        status: data.status as CartaoPontoStatus,
      });
      
      toast({
        title: 'Sucesso',
        description: 'Registro atualizado com sucesso.',
      });
      
      loadRegistros();
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o registro.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;
    
    try {
      await cartaoPontoService.delete(id);
      
      toast({
        title: 'Sucesso',
        description: 'Registro excluído com sucesso.',
      });
      
      loadRegistros();
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o registro.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected', observacao?: string) => {
    try {
      await cartaoPontoService.updateStatus(id, status, observacao);
      
      toast({
        title: 'Sucesso',
        description: `Registro ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`,
      });
      
      loadRegistros();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do registro.',
        variant: 'destructive',
      });
    }
  };

  const handleDateSelect = (dateStr: string) => {
    const selected = registros.find(r => r.data === dateStr);
    
    if (selected) {
      navigate(`/rh/cartao-ponto/${selected.id}`);
    } else if (canCreate && selectedFuncionario) {
      const funcionario = mockFuncionarios.find(f => f.id === selectedFuncionario);
      
      if (funcionario) {
        setIsDialogOpen(true);
        // Prepare default values with the selected date and employee
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cartão Ponto</h1>
          <p className="text-muted-foreground">
            Gerenciamento de registros de ponto dos funcionários
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {canCreate && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              disabled={!selectedFuncionario}
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Registro
            </Button>
          )}
        </div>
      </div>
      
      {/* Não exibir seletor de funcionário na aba de benefícios */}
      {viewMode !== 'beneficios' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Funcionário:</span>
          <Select
            value={selectedFuncionario}
            onValueChange={setSelectedFuncionario}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {mockFuncionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Summary cards - only if funcionario is selected and not in beneficios tab */}
      {selectedFuncionario && viewMode !== 'beneficios' && (
        <CartaoPontoSummary 
          summary={summary} 
          month={format(currentDate, 'MMMM', { locale: ptBR })}
        />
      )}
      
      {/* View tabs */}
      <Tabs 
        defaultValue="calendar" 
        value={viewMode}
        onValueChange={value => setViewMode(value as 'calendar' | 'list' | 'beneficios')} 
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" /> Calendário
            </TabsTrigger>
            <TabsTrigger value="list">
              <TableIcon className="mr-2 h-4 w-4" /> Lista
            </TabsTrigger>
            {canManageBeneficios && (
              <TabsTrigger value="beneficios">
                <Settings className="mr-2 h-4 w-4" /> Benefícios
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Don't show month selector in beneficios tab */}
          {viewMode !== 'beneficios' && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="calendar">
          <CartaoPontoCalendar 
            registros={registros} 
            date={currentDate}
            onDateSelect={handleDateSelect}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-4">
            <CartaoPontoTable 
              registros={registros}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              canEdit={canEdit}
              canDelete={canDelete}
              canApprove={canManage}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="beneficios">
          <BeneficiosTab />
        </TabsContent>
      </Tabs>

      {/* Create dialog */}
      {canCreate && selectedFuncionario && (
        <CartaoPontoDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleCreate}
          funcionarioId={selectedFuncionario}
          funcionarioNome={mockFuncionarios.find(f => f.id === selectedFuncionario)?.nome}
        />
      )}
    </div>
  );
};

export default CartaoPontoPage;
