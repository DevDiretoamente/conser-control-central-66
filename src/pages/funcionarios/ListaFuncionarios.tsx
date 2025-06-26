
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FuncionarioListItem, { Funcionario as FuncionarioListItemType } from '@/components/funcionarios/FuncionarioListItem';
import FuncionarioFilter, { FuncionarioFilterValues } from '@/components/funcionarios/FuncionarioFilter';
import { Users, PlusCircle, FileOutput, UserPlus, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Funcionario } from '@/types/funcionario';
import { funcionariosService } from '@/services/funcionariosService';
import PageLoader from '@/components/common/PageLoader';

const availableCargos = [
  { id: 'motorista', nome: 'Motorista' },
  { id: 'engenheiro', nome: 'Engenheiro Civil' },
  { id: 'operador', nome: 'Operador de Máquinas' },
  { id: 'auxiliar', nome: 'Auxiliar Administrativo' }
];

const availableDepartamentos = [
  { id: 'operacional', nome: 'Operacional' },
  { id: 'engenharia', nome: 'Engenharia' },
  { id: 'administrativo', nome: 'Administrativo' }
];

// Função para converter um Funcionario para o formato usado pelo FuncionarioListItem
const mapFuncionarioToListItem = (funcionario: Funcionario): FuncionarioListItemType => {
  return {
    id: funcionario.id || '',
    nome: funcionario.dadosPessoais.nome,
    cargo: funcionario.dadosProfissionais.cargo,
    cpf: funcionario.dadosPessoais.cpf,
    telefone: funcionario.contato.telefone,
    email: funcionario.contato.email || '',
    dataAdmissao: funcionario.dadosProfissionais.dataAdmissao ? 
      new Date(funcionario.dadosProfissionais.dataAdmissao).toLocaleDateString('pt-BR') :
      '',
    statusAso: 'valido', // Temporário, deveria vir dos exames
    departamento: 'Operacional', // Temporário, deveria vir do cargo/função
    dependentes: funcionario.dependentes?.length || 0
  };
};

const ListaFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<FuncionarioListItemType[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<FuncionarioListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [filterValues, setFilterValues] = useState<FuncionarioFilterValues>({
    search: '',
    cargo: 'todos',
    departamento: 'todos',
    statusAso: 'todos'
  });
  
  const [funcionarioToDelete, setFuncionarioToDelete] = useState<string | null>(null);

  console.log('ListaFuncionarios - Component mounted');

  useEffect(() => {
    console.log('ListaFuncionarios - useEffect triggered, calling loadFuncionarios');
    loadFuncionarios();
  }, []);
  
  const loadFuncionarios = async () => {
    try {
      console.log('ListaFuncionarios - Starting to load funcionarios...');
      setLoading(true);
      setError(null);
      
      // Implementar timeout para evitar loading infinito
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Carregamento demorou mais de 10 segundos')), 10000);
      });
      
      const loadPromise = funcionariosService.getAll();
      
      const data = await Promise.race([loadPromise, timeoutPromise]) as Funcionario[];
      
      console.log('ListaFuncionarios - Raw data received:', data);
      console.log('ListaFuncionarios - Data length:', data?.length || 0);
      
      if (!data) {
        console.warn('ListaFuncionarios - No data received from service');
        setFuncionarios([]);
        setFilteredFuncionarios([]);
        return;
      }
      
      const mappedFuncionarios = data.map(mapFuncionarioToListItem);
      console.log('ListaFuncionarios - Mapped funcionarios:', mappedFuncionarios);
      
      setFuncionarios(mappedFuncionarios);
      setFilteredFuncionarios(mappedFuncionarios);
      
      console.log('ListaFuncionarios - Successfully loaded funcionarios');
    } catch (error: any) {
      console.error('ListaFuncionarios - Error loading funcionarios:', error);
      setError(error.message || 'Erro ao carregar funcionários');
      toast.error('Erro ao carregar lista de funcionários');
      
      // Mesmo com erro, parar o loading
      setFuncionarios([]);
      setFilteredFuncionarios([]);
    } finally {
      console.log('ListaFuncionarios - Finished loading attempt');
      setLoading(false);
    }
  };
  
  const handleFilterChange = (values: FuncionarioFilterValues) => {
    console.log('ListaFuncionarios - Filter changed:', values);
    setFilterValues(values);
    
    // Filter funcionarios based on criteria
    const filtered = funcionarios.filter((funcionario) => {
      // Search by name or CPF
      if (values.search && !funcionario.nome.toLowerCase().includes(values.search.toLowerCase()) && 
          !funcionario.cpf.includes(values.search)) {
        return false;
      }
      
      // Filter by cargo
      if (values.cargo && values.cargo !== 'todos' && availableCargos.find(c => c.id === values.cargo)?.nome !== funcionario.cargo) {
        return false;
      }
      
      // Filter by departamento
      if (values.departamento && values.departamento !== 'todos' && availableDepartamentos.find(d => d.id === values.departamento)?.nome !== funcionario.departamento) {
        return false;
      }
      
      // Filter by ASO status
      if (values.statusAso && values.statusAso !== 'todos' && funcionario.statusAso !== values.statusAso) {
        return false;
      }
      
      return true;
    });
    
    console.log('ListaFuncionarios - Filtered results:', filtered.length);
    setFilteredFuncionarios(filtered);
  };
  
  const handleDeleteFuncionario = (id: string) => {
    setFuncionarioToDelete(id);
  };
  
  const confirmDelete = async () => {
    if (funcionarioToDelete) {
      try {
        await funcionariosService.delete(funcionarioToDelete);
        toast.success('Funcionário excluído com sucesso');
        loadFuncionarios();
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        toast.error('Erro ao excluir funcionário');
      } finally {
        setFuncionarioToDelete(null);
      }
    }
  };
  
  const handleEdit = (id: string) => {
    navigate(`/app/funcionarios/${id}/editar`);
  };
  
  const handleViewDetails = (id: string) => {
    navigate(`/app/funcionarios/${id}`);
  };
  
  const handleViewDocuments = (id: string) => {
    navigate(`/app/funcionarios/${id}?tab=documentos`);
  };
  
  const handleViewDependentes = (id: string) => {
    navigate(`/app/funcionarios/${id}?tab=dependentes`);
  };

  const handleRetry = () => {
    console.log('ListaFuncionarios - Retry button clicked');
    loadFuncionarios();
  };

  console.log('ListaFuncionarios - Render state:', { 
    loading, 
    error: !!error, 
    funcionariosCount: funcionarios.length,
    filteredCount: filteredFuncionarios.length 
  });

  // Show loading state
  if (loading) {
    return <PageLoader message="Carregando funcionários..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lista de Funcionários</h1>
            <p className="text-muted-foreground">
              Gerencie todos os funcionários da empresa
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>Erro ao carregar funcionários:</strong></p>
              <p>{error}</p>
              <Button onClick={handleRetry} className="mt-2">
                Tentar Novamente
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lista de Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie todos os funcionários da empresa
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="#">
              <FileOutput className="mr-2 h-4 w-4" />
              Exportar
            </Link>
          </Button>
          <Button asChild>
            <Link to="/app/funcionarios/novo">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Funcionário
            </Link>
          </Button>
        </div>
      </div>

      <FuncionarioFilter
        values={filterValues}
        onChange={handleFilterChange}
        availableCargos={availableCargos}
        availableDepartamentos={availableDepartamentos}
      />

      {filteredFuncionarios.length > 0 ? (
        <div className="space-y-4">
          {filteredFuncionarios.map((funcionario) => (
            <FuncionarioListItem
              key={funcionario.id}
              funcionario={funcionario}
              onDelete={handleDeleteFuncionario}
              onEdit={handleEdit}
              onView={handleViewDetails}
              onViewDocuments={handleViewDocuments}
              onViewDependentes={handleViewDependentes}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Users className="h-12 w-12 mb-4" />
            <h3 className="mb-1 text-lg font-medium">Nenhum funcionário encontrado</h3>
            <p>
              {funcionarios.length === 0 
                ? "Nenhum funcionário cadastrado no sistema."
                : "Tente ajustar os filtros para encontrar o funcionário desejado."
              }
            </p>
            <Button className="mt-4" asChild>
              <Link to="/app/funcionarios/novo">
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Funcionário
              </Link>
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!funcionarioToDelete} onOpenChange={() => setFuncionarioToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário e todos os dados relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListaFuncionarios;
