
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FuncionarioForm from '@/components/funcionarios/FuncionarioForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Funcionario } from '@/types/funcionario';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const NovoFuncionario: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSuccess = (data: Funcionario) => {
    console.log('Funcionário cadastrado:', data);
    
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

      <FuncionarioForm onSuccess={handleSuccess} />
    </div>
  );
};

export default NovoFuncionario;
