
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Work } from '@/types/financeiro';
import { Edit, Trash2, Calendar, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkListProps {
  works: Work[];
  onEdit: (work: Work) => void;
  onDelete: (work: Work) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'planning':
      return 'Planejamento';
    case 'in_progress':
      return 'Em Andamento';
    case 'completed':
      return 'Concluída';
    case 'cancelled':
      return 'Cancelada';
    default:
      return status;
  }
};

const WorkList: React.FC<WorkListProps> = ({ works, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {works.map((work) => (
        <Card key={work.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{work.name}</CardTitle>
              <Badge className={getStatusColor(work.status)}>
                {getStatusText(work.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {work.description}
            </p>
            
            {work.clientName && (
              <div className="flex items-center text-sm">
                <span className="font-medium">Cliente:</span>
                <span className="ml-1">{work.clientName}</span>
              </div>
            )}

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {format(new Date(work.startDate), "dd/MM/yyyy", { locale: ptBR })}
                {work.endDate && (
                  <> - {format(new Date(work.endDate), "dd/MM/yyyy", { locale: ptBR })}</>
                )}
              </span>
            </div>

            {work.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{work.location}</span>
              </div>
            )}

            {work.budget && (
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>R$ {work.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(work)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(work)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkList;
