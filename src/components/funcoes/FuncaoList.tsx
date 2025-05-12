
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, HardHat, FileText, Shirt, Pencil, Trash2, Eye, Search, AlertCircle } from 'lucide-react';
import { Funcao, ExamesPorTipo } from '@/types/funcionario';
import { mockSetores } from '@/data/funcionarioMockData';

interface FuncaoListProps {
  funcoes: Funcao[];
  loading: boolean;
  searchTerm: string;
  onEdit: (funcao: Funcao) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onResetSearch: () => void;
}

export const FuncaoList: React.FC<FuncaoListProps> = ({
  funcoes,
  loading,
  searchTerm,
  onEdit,
  onDelete,
  onToggleActive,
  onResetSearch
}) => {
  // Helper function to get setor name from ID
  const getSetorNome = (setorId: string) => {
    const setor = mockSetores.find(s => s.id === setorId);
    return setor ? setor.nome : 'Setor não encontrado';
  };

  // Helper to get total exam count across all types
  const getTotalExamCount = (examesNecessarios: ExamesPorTipo): number => {
    const uniqueExamIds = new Set<string>();
    
    Object.values(examesNecessarios).forEach(exams => {
      exams.forEach(exam => uniqueExamIds.add(exam.id));
    });
    
    return uniqueExamIds.size;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Carregando funções...</p>
      </div>
    );
  }

  if (funcoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        {searchTerm ? (
          <>
            <Search className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhuma função encontrada com o termo "{searchTerm}"</p>
            <Button variant="link" onClick={onResetSearch}>Limpar busca</Button>
          </>
        ) : (
          <>
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhuma função cadastrada</p>
          </>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead className="hidden md:table-cell">Descrição</TableHead>
            <TableHead>Requisitos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funcoes.map((funcao) => (
            <TableRow key={funcao.id}>
              <TableCell className="font-medium">{funcao.nome}</TableCell>
              <TableCell>{getSetorNome(funcao.setorId)}</TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">
                {funcao.descricao}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <HardHat className="h-3 w-3" />
                    {funcao.epis.length}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {getTotalExamCount(funcao.examesNecessarios)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shirt className="h-3 w-3" />
                    {funcao.uniformes.length}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={funcao.ativo} 
                    onCheckedChange={() => onToggleActive(funcao.id)}
                    aria-label={`Função ${funcao.ativo ? 'ativa' : 'inativa'}`}
                  />
                  <Label className="text-sm">{funcao.ativo ? 'Ativa' : 'Inativa'}</Label>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" title="Ver detalhes" onClick={() => onEdit(funcao)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Editar" onClick={() => onEdit(funcao)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    title="Excluir"
                    onClick={() => onDelete(funcao.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default FuncaoList;
