
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  File, 
  Eye,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type Funcionario = {
  id: string;
  nome: string;
  cargo: string;
  cpf: string;
  telefone: string;
  email?: string;
  dataAdmissao: string;
  statusAso?: 'valido' | 'vencido' | 'vence-em-breve';
  fotoPerfil?: string;
  departamento?: string;
  dependentes?: number;
};

interface FuncionarioListItemProps {
  funcionario: Funcionario;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewDocuments?: (id: string) => void;
  onViewDependentes?: (id: string) => void;
}

const FuncionarioListItem: React.FC<FuncionarioListItemProps> = ({
  funcionario,
  onDelete,
  onEdit,
  onViewDocuments,
  onViewDependentes
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status?: 'valido' | 'vencido' | 'vence-em-breve') => {
    switch (status) {
      case 'valido':
        return 'bg-green-500';
      case 'vencido':
        return 'bg-red-500';
      case 'vence-em-breve':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={funcionario.fotoPerfil} alt={funcionario.nome} />
              <AvatarFallback className="bg-conserv-primary text-white">
                {getInitials(funcionario.nome)}
              </AvatarFallback>
            </Avatar>
            {funcionario.statusAso && (
              <span 
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(funcionario.statusAso)}`}
                title={funcionario.statusAso === 'valido' ? 'ASO Válido' : funcionario.statusAso === 'vencido' ? 'ASO Vencido' : 'ASO Vence em Breve'}
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{funcionario.nome}</h3>
                <p className="text-muted-foreground text-sm flex flex-col md:flex-row md:gap-2">
                  <span>{funcionario.cargo}</span>
                  {funcionario.departamento && (
                    <>
                      <span className="hidden md:inline">•</span>
                      <span>{funcionario.departamento}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2 md:mt-0">
                {funcionario.dependentes && funcionario.dependentes > 0 && (
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <Users size={14} />
                    <span>{funcionario.dependentes}</span>
                  </Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Ações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit && onEdit(funcionario.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewDocuments && onViewDocuments(funcionario.id)}>
                      <File className="mr-2 h-4 w-4" />
                      <span>Documentos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewDependentes && onViewDependentes(funcionario.id)}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Dependentes</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete && onDelete(funcionario.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
              <div>
                <span className="text-muted-foreground">CPF:</span> {funcionario.cpf}
              </div>
              <div>
                <span className="text-muted-foreground">Telefone:</span> {funcionario.telefone}
              </div>
              <div>
                <span className="text-muted-foreground">Admissão:</span> {funcionario.dataAdmissao}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FuncionarioListItem;
