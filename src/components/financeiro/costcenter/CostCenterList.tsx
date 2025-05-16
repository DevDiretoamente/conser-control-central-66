
import React from 'react';
import { CostCenter } from '@/types/financeiro';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/format';

interface CostCenterListProps {
  costCenters: CostCenter[];
  selectedCostCenterId?: string;
  onSelectCostCenter: (costCenter: CostCenter) => void;
}

const CostCenterList: React.FC<CostCenterListProps> = ({ 
  costCenters, 
  selectedCostCenterId, 
  onSelectCostCenter 
}) => {
  if (costCenters.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum centro de custo encontrado
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="space-y-1">
        {costCenters.map((costCenter) => (
          <Button
            key={costCenter.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left px-2 py-3 h-auto",
              selectedCostCenterId === costCenter.id && "bg-primary/10"
            )}
            onClick={() => onSelectCostCenter(costCenter)}
          >
            <div className="flex items-center w-full">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <FolderIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{costCenter.name}</div>
                <div className="text-xs text-muted-foreground">
                  {costCenter.description}
                </div>
                {costCenter.budget && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      Orçamento: {formatCurrency(costCenter.budget)}
                    </span>
                    <span className={cn(
                      "text-xs font-medium",
                      costCenter.spent && costCenter.spent > costCenter.budget 
                        ? "text-destructive" 
                        : "text-primary"
                    )}>
                      {formatCurrency(costCenter.spent || 0)}
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CostCenterList;
