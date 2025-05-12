
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DiaNavegacaoProps {
  currentDayIndex: number;
  totalDays: number;
  formattedDate: string;
  dayOfWeekName: string;
  onPrevious: () => void;
  onNext: () => void;
}

const DiaNavegacao: React.FC<DiaNavegacaoProps> = ({
  currentDayIndex,
  totalDays,
  formattedDate,
  dayOfWeekName,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex items-center justify-between bg-card shadow-sm rounded-lg border p-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPrevious} 
        disabled={currentDayIndex === 0}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>
      
      <div className="text-center">
        <div className="text-xl font-semibold">
          {formattedDate}
        </div>
        <div className="text-sm text-muted-foreground">
          {dayOfWeekName} - Dia {currentDayIndex + 1} de {totalDays}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onNext} 
        disabled={currentDayIndex === totalDays - 1}
        className="flex items-center gap-1"
      >
        <span className="hidden sm:inline">Próximo</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DiaNavegacao;
