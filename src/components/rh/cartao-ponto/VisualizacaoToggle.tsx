
import React from 'react';

interface VisualizacaoToggleProps {
  visualizacao: 'calendario' | 'individual';
  setVisualizacao: (view: 'calendario' | 'individual') => void;
}

const VisualizacaoToggle: React.FC<VisualizacaoToggleProps> = ({ visualizacao, setVisualizacao }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="inline-flex rounded-lg border p-1 shadow-sm">
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${visualizacao === 'individual' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
          onClick={() => setVisualizacao('individual')}
        >
          Individual
        </button>
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${visualizacao === 'calendario' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
          onClick={() => setVisualizacao('calendario')}
        >
          Calendário
        </button>
      </div>
    </div>
  );
};

export default VisualizacaoToggle;
