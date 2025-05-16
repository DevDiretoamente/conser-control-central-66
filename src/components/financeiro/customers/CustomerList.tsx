
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Customer } from '@/types/financeiro';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ 
  customers, 
  onEdit, 
  onDelete,
  onViewDetails
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cidade/UF</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                <Badge variant={customer.type === 'physical' ? 'outline' : 'default'}>
                  {customer.type === 'physical' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Badge>
              </TableCell>
              <TableCell>{customer.document}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {customer.city ? `${customer.city}${customer.state ? `/${customer.state}` : ''}` : '-'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(customer)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerList;
