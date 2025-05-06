
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FuncionarioListItem, { Funcionario } from '@/components/funcionarios/FuncionarioListItem';
import FuncionarioFilter, { FuncionarioFilterValues } from '@/components/funcionarios/FuncionarioFilter';
import { Users, PlusCircle, FileOutput, FileText, UserPlus, Edit, Trash } from 'lucide-react';
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
import { toast } from 'sonner';

const mockFuncionarios: Funcionario[] = [
  {
    id: '1',
    nome: 'João da Silva',
    cargo: 'Motorista',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-8888',
    email: 'joao.silva@conservias.com',
    dataAdmissao: '10/01/2022',
    statusAso: 'valido',
    departamento: 'Operacional',
    dependentes: 2
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    cargo: 'Engenheira Civil',
    cpf: '987.654.321-00',
    telefone: '(11) 98888-7777',
    email: 'maria.oliveira@conservias.com',
    dataAdmissao: '15/03/2021',
    statusAso: 'vence-em-breve',
    departamento: 'Engenharia'
  },
  {
    id: '3',
    nome: 'Pedro Santos',
    cargo: 'Operador de Máquinas',
    cpf: '456.789.123-00',
    telefone: '(11) 97777-6666',
    dataAdmissao: '05/06/2022',
    statusAso: 'vencido',
    departamento: 'Operacional',
    dependentes: 1
  },
  {
    id: '4',
    nome: 'Ana Carolina Ferreira',
    cargo: 'Auxiliar Administrativo',
    cpf: '789.123.456-00',
    telefone: '(11) 96666-5555',
    email: 'ana.ferreira@conservias.com',
    dataAdmissao: '20/04/2023',
    statusAso: 'valido',
    departamento: 'Administrativo'
  },
  {
    id: '5',
    nome: 'Carlos Eduardo Mendes',
    cargo: 'Motorista',
    cpf: '321.654.987-00',
    telefone: '(11) 95555-4444',
    dataAdmissao: '12/08/2022',
    statusAso: 'valido',
    departamento: 'Operacional',
    dependentes: 3
  }
];

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

const ListaFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(mockFuncionarios);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>(mockFuncionarios);
  
  const [filterValues, setFilterValues] = useState<FuncionarioFilterValues>({
    search: '',
    cargo: '',
    departamento: '',
    statusAso: 'todos'
  });
  
  const [funcionarioToDelete, setFuncionarioToDelete] = useState<string | null>(null);
  
  const handleFilterChange = (values: FuncionarioFilterValues) => {
    setFilterValues(values);
    
    // Filter funcionarios based on criteria
    const filtered = funcionarios.filter((funcionario) => {
      // Search by name or CPF
      if (values.search && !funcionario.nome.toLowerCase().includes(values.search.toLowerCase()) && 
          !funcionario.cpf.includes(values.search)) {
        return false;
      }
      
      // Filter by cargo
      if (values.cargo && availableCargos.find(c => c.id === values.cargo)?.nome !== funcionario.cargo) {
        return false;
      }
      
      // Filter by departamento
      if (values.departamento && availableDepartamentos.find(d => d.id === values.departamento)?.nome !== funcionario.departamento) {
        return false;
      }
      
      // Filter by ASO status
      if (values.statusAso && values.statusAso !== 'todos' && funcionario.statusAso !== values.statusAso) {
        return false;
      }
      
      return true;
    });
    
    setFilteredFuncionarios(filtered);
  };
  
  const handleDeleteFuncionario = (id: string) => {
    setFuncionarioToDelete(id);
  };
  
  const confirmDelete = () => {
    if (funcionarioToDelete) {
      // Filter out the deleted funcionario
      const updatedFuncionarios = funcionarios.filter(f => f.id !== funcionarioToDelete);
      setFuncionarios(updatedFuncionarios);
      setFilteredFuncionarios(updatedFuncionarios);
      toast.success('Funcionário excluído com sucesso');
      setFuncionarioToDelete(null);
    }
  };
  
  const handleEdit = (id: string) => {
    // Navigate to edit page in a real app
    console.log('Editar funcionário', id);
    toast.info('Função de edição será implementada em breve');
  };
  
  const handleViewDocuments = (id: string) => {
    console.log('Ver documentos do funcionário', id);
    toast.info('Visualização de documentos será implementada em breve');
  };
  
  const handleViewDependentes = (id: string) => {
    console.log('Ver dependentes do funcionário', id);
    toast.info('Visualização de dependentes será implementada em breve');
  };

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
            <Link to="/funcionarios/novo">
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
            <p>Tente ajustar os filtros ou cadastre um novo funcionário.</p>
            <Button className="mt-4" asChild>
              <Link to="/funcionarios/novo">
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
