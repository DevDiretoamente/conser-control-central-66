
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';
import { RegistroPonto } from '@/types/cartaoPonto';

interface CalendarioViewProps {
  registros: RegistroPonto[];
  mes: number;
  ano: number;
  onDayClick: (index: number) => void;
}

const getStatusColor = (status: string): string => {
  switch(status) {
    case 'normal':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'falta_injustificada':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'atestado':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'ferias':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'dispensado':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'feriado':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 'a_disposicao':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const CalendarioView: React.FC<CalendarioViewProps> = ({ 
  registros, 
  mes, 
  ano, 
  onDayClick 
}) => {
  const sortedRegistros = [...registros].sort((a, b) => 
    new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Visão Calendário - {format(new Date(ano, mes-1, 1), 'MMMM yyyy', { locale: ptBR })}
      </h2>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center font-medium text-sm p-2 bg-muted">
            {day}
          </div>
        ))}
        
        {/* Dias do mês com registros */}
        {sortedRegistros.map((registro, index) => {
          const data = new Date(registro.data);
          const dia = data.getDate();
          const diaDaSemana = data.getDay();
          
          // Adicionar células vazias para alinhar com o dia da semana correto
          const cells = [];
          if (index === 0) {
            for (let i = 0; i < diaDaSemana; i++) {
              cells.push(
                <div key={`empty-${i}`} className="border p-1 h-24 bg-muted/20"></div>
              );
            }
          }
          
          // Adicionar o dia atual
          cells.push(
            <div 
              key={registro.data} 
              className={`border p-2 h-24 overflow-hidden transition-all cursor-pointer ${getStatusColor(registro.statusDia)}`}
              onClick={() => onDayClick(index)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{dia}</span>
                {registro.bloqueado && <AlertTriangle className="h-4 w-4" />}
              </div>
              
              {registro.statusDia === 'normal' && (
                <div className="text-xs space-y-1">
                  {registro.horaEntradaManha && (
                    <div className="flex items-center gap-1">
                      <span>Entrada:</span>
                      <span className="font-medium">{registro.horaEntradaManha}</span>
                    </div>
                  )}
                  {registro.horaSaidaTarde && (
                    <div className="flex items-center gap-1">
                      <span>Saída:</span>
                      <span className="font-medium">{registro.horaSaidaTarde}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
          
          return cells;
        })}
      </div>
    </div>
  );
};

export default CalendarioView;
