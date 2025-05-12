
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FuncionarioForm from '@/components/funcionarios/FuncionarioForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Funcionario } from '@/types/funcionario';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { funcionariosService } from '@/services/funcionariosService';

const NovoFuncionario: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSuccess = async (data: Funcionario) => {
    setIsSaving(true);
    try {
      // Salvar funcionário usando o serviço
      const savedFuncionario = await funcionariosService.create(data as Omit<Funcionario, 'id'>);
      console.log('Funcionário cadastrado:', savedFuncionario);
      
      const dependentesCount = data.dependentes?.length || 0;
      const documentosCount = Object.values(data.documentos).filter(Boolean).length;
      
      let successMessage = 'Funcionário cadastrado com sucesso!';
      if (dependentesCount > 0) {
        successMessage += ` ${dependentesCount} dependente${dependentesCount > 1 ? 's' : ''} adicionado${dependentesCount > 1 ? 's' : ''}.`;
      }
      if (documentosCount > 0) {
        successMessage += ` ${documentosCount} documento${documentosCount > 1 ? 's' : ''} anexado${documentosCount > 1 ? 's' : ''}.`;
      }
      
      toast.success(successMessage);
      
      // Navigate back to funcionarios list
      navigate('/funcionarios');
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast.error('Erro ao cadastrar funcionário. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/funcionarios">Funcionários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Novo Funcionário</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/funcionarios')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Novo Funcionário</h1>
        <p className="text-muted-foreground">
          Preencha os dados do novo funcionário, incluindo seus dependentes, função, uniformes e documentos
        </p>
      </div>

      <FuncionarioForm onSuccess={handleSuccess} isSubmitting={isSaving} />
    </div>
  );
};

export default NovoFuncionario;
