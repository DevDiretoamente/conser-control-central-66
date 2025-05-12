
import React from 'react';

interface FuncionarioHeaderProps {
  funcionarioDetalhes: {
    name: string;
    setor: string;
    funcao: string;
  } | null;
}

const FuncionarioHeader: React.FC<FuncionarioHeaderProps> = ({ funcionarioDetalhes }) => {
  if (!funcionarioDetalhes) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center rounded-lg overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10 p-4">
      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">
          {funcionarioDetalhes.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="md:flex-1">
        <h3 className="text-xl font-medium">{funcionarioDetalhes.name}</h3>
        <div className="flex gap-x-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Setor:</span> {funcionarioDetalhes.setor}
          </div>
          <div>
            <span className="font-medium">Função:</span> {funcionarioDetalhes.funcao}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioHeader;
