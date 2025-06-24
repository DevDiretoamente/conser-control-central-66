import React, { useState, useEffect } from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useNavigate } from 'react-router-dom';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CartaoPontoFilter from '@/components/cartaoponto/CartaoPontoFilter';
import CartaoPontoTable from '@/components/cartaoponto/CartaoPontoTable';
import CartaoPontoDialog from '@/components/cartaoponto/CartaoPontoDialog';
import CartaoPontoCalendar from '@/components/cartaoponto/CartaoPontoCalendar';
import CartaoPontoSummary from '@/components/cartaoponto/CartaoPontoSummary';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Calendar, Plus, ChevronLeft, ChevronRight, Table as TableIcon, UserRound } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock employee data for demo purposes
const mockFuncionarios = [
  { id: '101', nome: 'João Silva' },
  { id: '102', nome: 'Maria Oliveira' },
  { id: '103', nome: 'Pedro Santos' },
  { id: '104', nome: 'Ana Costa' },
];

const CartaoPontoPage: React.FC = () => {
  const { hasPermission } = useSecureAuth();
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState<CartaoPonto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
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
  
  const canCreate = hasPermission('cartaoponto', 'create');
  const canEdit = hasPermission('cartaoponto', 'update');
  const canDelete = hasPermission('cartaoponto', 'delete');
  const canManage = hasPermission('cartaoponto', 'manage');

  useEffect(() => {
    // Only load records when an employee is selected
    if (selectedFuncionario) {
      loadRegistros();
    } else {
      // Clear previous records if no employee is selected
      setRegistros([]);
      setSummary({
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
    }
  }, [currentDate, selectedFuncionario]);

  const loadRegistros = async () => {
    if (!selectedFuncionario) return;

    setLoading(true);
    try {
      // Prepare filters based on current date (month) and selected funcionario
      const filters: CartaoPontoFilterOptions = {
        dataInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
        dataFim: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
        funcionarioId: selectedFuncionario
      };
      
      const data = await cartaoPontoService.filter(filters);
      setRegistros(data);
      
      // Get the summary data for the selected employee
      const summarData = await cartaoPontoService.getSummary(
        selectedFuncionario,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      setSummary(summarData);
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
        funcionarioId: data.funcionarioId,
        data: data.data || new Date().toISOString().split('T')[0],
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

  const handleStatusChange = async (id: string, status: string, observacao?: string) => {
    try {
      await cartaoPontoService.updateStatus(id, status as CartaoPontoStatus, observacao);
      
      toast({
        title: 'Sucesso',
        description: `Status atualizado com sucesso.`,
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

  // Helper to render the appropriate content based on employee selection
  const renderContent = () => {
    if (!selectedFuncionario) {
      return (
        <Card className="border border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserRound className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecione um funcionário</h3>
            <p className="text-gray-500 text-center max-w-md">
              Para visualizar os registros de ponto, selecione um funcionário no campo acima.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (viewMode === 'calendar') {
      return (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <CartaoPontoCalendar 
            registros={registros} 
            date={currentDate}
            onDateSelect={handleDateSelect}
          />
        </ScrollArea>
      );
    }

    return (
      <ScrollArea className="h-[calc(100vh-280px)]">
        <CartaoPontoTable 
          registros={registros}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          canEdit={canEdit}
          canDelete={canDelete}
          canApprove={canManage}
        />
      </ScrollArea>
    );
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
      
      {/* Funcionário selection - always visible */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-full md:w-72">
          <Select
            value={selectedFuncionario}
            onValueChange={setSelectedFuncionario}
          >
            <SelectTrigger className="w-full">
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
        
        {/* View tabs - always visible */}
        <Tabs 
          defaultValue="calendar" 
          value={viewMode}
          onValueChange={value => setViewMode(value as 'calendar' | 'list')} 
          className="flex-grow"
        >
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" /> Calendário
            </TabsTrigger>
            <TabsTrigger value="list">
              <TableIcon className="mr-2 h-4 w-4" /> Lista
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Month selector - only visible when an employee is selected */}
        {selectedFuncionario && (
          <div className="flex items-center space-x-2 ml-auto">
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
      
      {/* Summary cards - only if funcionario is selected */}
      {selectedFuncionario && (
        <CartaoPontoSummary 
          summary={summary} 
          month={format(currentDate, 'MMMM', { locale: ptBR })}
        />
      )}
      
      {/* Main content area */}
      {selectedFuncionario ? (
        loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : viewMode === 'calendar' ? (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <CartaoPontoCalendar 
              registros={registros} 
              date={currentDate}
              onDateSelect={(dateStr: string) => {
                const selected = registros.find(r => r.data === dateStr);
                if (selected) {
                  navigate(`/app/rh/cartao-ponto/${selected.id}`);
                } else if (canCreate && selectedFuncionario) {
                  setIsDialogOpen(true);
                }
              }}
            />
          </ScrollArea>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <CartaoPontoTable 
              registros={registros}
              onUpdate={async (id: string, data: CartaoPontoFormValues) => {
                try {
                  await cartaoPontoService.update(id, {
                    ...data,
                    status: data.status as CartaoPontoStatus,
                  });
                  
                  toast({
                    title: 'Sucesso',
                    description: 'Registro atualizado com sucesso.',
                  });
                  
                  // Reload records after update
                  if (selectedFuncionario) {
                    const filters: CartaoPontoFilterOptions = {
                      dataInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
                      dataFim: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
                      funcionarioId: selectedFuncionario
                    };
                    const data = await cartaoPontoService.filter(filters);
                    setRegistros(data);
                  }
                } catch (error) {
                  console.error('Erro ao atualizar registro:', error);
                  toast({
                    title: 'Erro',
                    description: 'Não foi possível atualizar o registro.',
                    variant: 'destructive',
                  });
                }
              }}
              onDelete={async (id: string) => {
                if (!confirm('Tem certeza que deseja excluir este registro?')) return;
                
                try {
                  await cartaoPontoService.delete(id);
                  
                  toast({
                    title: 'Sucesso',
                    description: 'Registro excluído com sucesso.',
                  });
                  
                  // Reload records after delete
                  if (selectedFuncionario) {
                    const filters: CartaoPontoFilterOptions = {
                      dataInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
                      dataFim: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
                      funcionarioId: selectedFuncionario
                    };
                    const data = await cartaoPontoService.filter(filters);
                    setRegistros(data);
                  }
                } catch (error) {
                  console.error('Erro ao excluir registro:', error);
                  toast({
                    title: 'Erro',
                    description: 'Não foi possível excluir o registro.',
                    variant: 'destructive',
                  });
                }
              }}
              onStatusChange={async (id: string, status: string, observacao?: string) => {
                try {
                  await cartaoPontoService.updateStatus(id, status as CartaoPontoStatus, observacao);
                  
                  toast({
                    title: 'Sucesso',
                    description: `Status atualizado com sucesso.`,
                  });
                  
                  // Reload records after status change
                  if (selectedFuncionario) {
                    const filters: CartaoPontoFilterOptions = {
                      dataInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
                      dataFim: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
                      funcionarioId: selectedFuncionario
                    };
                    const data = await cartaoPontoService.filter(filters);
                    setRegistros(data);
                  }
                } catch (error) {
                  console.error('Erro ao atualizar status:', error);
                  toast({
                    title: 'Erro',
                    description: 'Não foi possível atualizar o status do registro.',
                    variant: 'destructive',
                  });
                }
              }}
              canEdit={canEdit}
              canDelete={canDelete}
              canApprove={canManage}
            />
          </ScrollArea>
        )
      ) : (
        <Card className="border border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserRound className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecione um funcionário</h3>
            <p className="text-gray-500 text-center max-w-md">
              Para visualizar os registros de ponto, selecione um funcionário no campo acima.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create dialog */}
      {canCreate && selectedFuncionario && (
        <CartaoPontoDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={async (data: CartaoPontoFormValues) => {
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
                funcionarioId: data.funcionarioId,
                data: data.data || new Date().toISOString().split('T')[0],
                status: data.status as CartaoPontoStatus,
              });
              
              toast({
                title: 'Sucesso',
                description: 'Registro criado com sucesso.',
              });
              
              // Reload records after create
              if (selectedFuncionario) {
                const filters: CartaoPontoFilterOptions = {
                  dataInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
                  dataFim: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
                  funcionarioId: selectedFuncionario
                };
                const data = await cartaoPontoService.filter(filters);
                setRegistros(data);
              }
            } catch (error) {
              console.error('Erro ao criar registro:', error);
              toast({
                title: 'Erro',
                description: 'Não foi possível criar o registro.',
                variant: 'destructive',
              });
            }
          }}
          funcionarioId={selectedFuncionario}
          funcionarioNome={mockFuncionarios.find(f => f.id === selectedFuncionario)?.nome}
        />
      )}
    </div>
  );
};

export default CartaoPontoPage;
