
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import FuncionarioForm from '@/components/funcionarios/FuncionarioForm';
import { Funcionario } from '@/types/funcionario';
import DocumentosImpressaoTab from '@/components/funcionarios/DocumentosImpressaoTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { funcionariosService } from '@/services/funcionariosService';

const EditarFuncionario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [funcionario, setFuncionario] = useState<Funcionario | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario');

  useEffect(() => {
    if (id) {
      loadFuncionario(id);
    }
  }, [id]);

  const loadFuncionario = async (funcionarioId: string) => {
    setLoading(true);
    try {
      const data = await funcionariosService.getById(funcionarioId);
      setFuncionario(data);
    } catch (error) {
      console.error('Error loading funcionário:', error);
      toast.error('Erro ao carregar dados do funcionário');
      navigate('/funcionarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (data: Funcionario) => {
    if (!id) return;
    
    setFormLoading(true);
    try {
      const updatedFuncionario = await funcionariosService.update(id, data);
      setFuncionario(updatedFuncionario);
      
      const dependentesCount = data.dependentes?.length || 0;
      const documentosCount = Object.values(data.documentos).filter(Boolean).length;
      
      let successMessage = 'Funcionário atualizado com sucesso!';
      if (dependentesCount > 0) {
        successMessage += ` ${dependentesCount} dependente${dependentesCount > 1 ? 's' : ''} atualizado${dependentesCount > 1 ? 's' : ''}.`;
      }
      if (documentosCount > 0) {
        successMessage += ` ${documentosCount} documento${documentosCount > 1 ? 's' : ''} anexado${documentosCount > 1 ? 's' : ''}.`;
      }
      
      toast.success(successMessage);
      
      // Navigate to employee details
      navigate(`/funcionarios/${id}`);
    } catch (error) {
      console.error('Error updating funcionário:', error);
      toast.error('Erro ao atualizar funcionário');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!funcionario) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Funcionário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/funcionarios" asChild>
              <Link to="/funcionarios">Funcionários</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/funcionarios/${id}`} asChild>
              <Link to={`/funcionarios/${id}`}>{funcionario.dadosPessoais.nome}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Editar</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(`/funcionarios/${id}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Editar Funcionário</h1>
        <p className="text-muted-foreground">
          Atualize os dados do funcionário, incluindo seus dependentes, função, uniformes e documentos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="formulario">Dados do Funcionário</TabsTrigger>
          <TabsTrigger value="documentos">Documentos e Impressões</TabsTrigger>
        </TabsList>

        <TabsContent value="formulario" className="overflow-visible">
          <FuncionarioForm 
            defaultValues={funcionario} 
            onSuccess={handleSuccess} 
            funcionarioId={id}
            isSubmitting={formLoading}
          />
        </TabsContent>
        
        <TabsContent value="documentos" className="overflow-visible">
          <DocumentosImpressaoTab 
            funcionario={funcionario}
            onUpdate={async (updatedFuncionario) => {
              if (id) {
                try {
                  await funcionariosService.update(id, updatedFuncionario);
                  setFuncionario(updatedFuncionario);
                  toast.success("Documentos atualizados com sucesso!");
                } catch (error) {
                  console.error('Error updating funcionário documents:', error);
                  toast.error('Erro ao atualizar documentos');
                }
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditarFuncionario;
