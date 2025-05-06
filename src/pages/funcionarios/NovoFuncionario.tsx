
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FuncionarioForm from '@/components/funcionarios/FuncionarioForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const NovoFuncionario: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (data: any) => {
    toast.success('Funcionário cadastrado com sucesso!');
    // Navigate back to funcionarios list, not to dashboard
    navigate('/funcionarios');
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/funcionarios')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Novo Funcionário</h1>
        <p className="text-muted-foreground">
          Preencha os dados do novo funcionário
        </p>
      </div>

      <FuncionarioForm onSuccess={handleSuccess} />
    </div>
  );
};

export default NovoFuncionario;
