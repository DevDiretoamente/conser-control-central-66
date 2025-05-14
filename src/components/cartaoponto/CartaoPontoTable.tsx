
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CartaoPonto } from '@/types/cartaoPonto';
import { Eye, Edit, Trash, Check, X, Clock } from 'lucide-react';
import CartaoPontoDialog from './CartaoPontoDialog';
import { CartaoPontoFormValues } from './CartaoPontoDialog';
import { Badge } from '@/components/ui/badge';

interface CartaoPontoTableProps {
  registros: CartaoPonto[];
  onUpdate: (id: string, data: CartaoPontoFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: 'approved' | 'rejected', observacao?: string) => Promise<void>;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

const CartaoPontoTable: React.FC<CartaoPontoTableProps> = ({
  registros,
  onUpdate,
  onDelete,
  onStatusChange,
  canEdit,
  canDelete,
  canApprove,
}) => {
  const navigate = useNavigate();
  const [editingRegistro, setEditingRegistro] = useState<CartaoPonto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (registro: CartaoPonto) => {
    setEditingRegistro(registro);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (data: CartaoPontoFormValues) => {
    if (editingRegistro) {
      await onUpdate(editingRegistro.id, data);
      setEditingRegistro(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      case 'dispensado':
        return <Badge variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">Dispensado</Badge>;
      case 'feriado':
        return <Badge variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">Feriado</Badge>;
      case 'falta_justificada':
        return <Badge variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600">Justificada</Badge>;
      case 'falta_injustificada':
        return <Badge variant="destructive">Injustificada</Badge>;
      case 'sobreaviso':
        return <Badge variant="outline" className="bg-orange-500 text-white hover:bg-orange-600">Sobreaviso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper to get overtime rate display
  const getOvertimeRateDisplay = (rate?: number) => {
    if (!rate) return '-';
    return `${rate * 100}%`;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Funcionário</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Saída</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Extras</TableHead>
              <TableHead>Taxa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>{formatDate(registro.data)}</TableCell>
                  <TableCell>{registro.funcionarioNome || '-'}</TableCell>
                  <TableCell>{registro.horaEntrada || '-'}</TableCell>
                  <TableCell>{registro.horaSaida || '-'}</TableCell>
                  <TableCell>{registro.totalHoras?.toFixed(2) || '-'}</TableCell>
                  <TableCell>{registro.horasExtras?.toFixed(2) || '-'}</TableCell>
                  <TableCell>{getOvertimeRateDisplay(registro.taxaHoraExtra)}</TableCell>
                  <TableCell>{getStatusBadge(registro.status)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => navigate(`/rh/cartao-ponto/${registro.id}`)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {canEdit && (
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(registro)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {canDelete && (
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(registro.id)}
                        title="Excluir"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {canApprove && registro.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => onStatusChange(registro.id, 'approved')}
                          title="Aprovar"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onStatusChange(registro.id, 'rejected')}
                          title="Rejeitar"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {editingRegistro && (
        <CartaoPontoDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          cartaoPonto={editingRegistro}
          onSave={handleUpdate}
          isEdit={true}
        />
      )}
    </>
  );
};

export default CartaoPontoTable;
