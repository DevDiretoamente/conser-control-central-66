
import React from 'react';
import { User } from 'lucide-react';

interface FuncionarioHeaderProps {
  funcionarioDetalhes: {
    name: string;
    setor: string;
    funcao: string;
  } | null;
}

const FuncionarioHeader: React.FC<FuncionarioHeaderProps> = ({ funcionarioDetalhes }) => {
  if (!funcionarioDetalhes) {
    return (
      <div className="rounded-lg bg-muted/30 p-4 mb-4 text-center">
        <p className="text-muted-foreground">Selecione um funcionário para visualizar os detalhes</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-6 mb-4">
      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
        <User className="h-8 w-8 text-primary" />
      </div>
      <div className="md:flex-1 text-center md:text-left">
        <h3 className="text-xl font-bold text-primary">{funcionarioDetalhes.name}</h3>
        <div className="flex flex-col md:flex-row md:gap-6 mt-2">
          <div className="flex items-center">
            <span className="font-medium text-muted-foreground mr-2">Setor:</span> 
            <span className="font-semibold">{funcionarioDetalhes.setor || 'Não informado'}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-muted-foreground mr-2">Função:</span> 
            <span className="font-semibold">{funcionarioDetalhes.funcao || 'Não informada'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioHeader;
