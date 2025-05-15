
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserGroup, User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, UserCheck, UserX } from 'lucide-react';

interface GroupMembersTabProps {
  group: UserGroup;
}

const GroupMembersTab: React.FC<GroupMembersTabProps> = ({ group }) => {
  const { users, updateUserGroups } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Initialize selected users based on those who are already in the group
  useEffect(() => {
    const groupMembers = users.filter(user => user.groupIds?.includes(group.id));
    setSelectedUserIds(groupMembers.map(user => user.id));
  }, [group, users]);
  
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        user.role.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
  const handleUserSelection = (userId: string, isSelected: boolean) => {
    setSelectedUserIds(prev => {
      const newSelection = isSelected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId);
      
      // Check if there are changes compared to initial state
      const groupMembers = users.filter(user => user.groupIds?.includes(group.id));
      const initialIds = groupMembers.map(user => user.id);
      const hasChanged = newSelection.length !== initialIds.length ||
        newSelection.some(id => !initialIds.includes(id)) ||
        initialIds.some(id => !newSelection.includes(id));
      
      setHasChanges(hasChanged);
      
      return newSelection;
    });
  };
  
  const handleSelectAll = () => {
    setSelectedUserIds(users.map(user => user.id));
    setHasChanges(true);
  };
  
  const handleDeselectAll = () => {
    setSelectedUserIds([]);
    setHasChanges(true);
  };
  
  const handleSaveChanges = () => {
    // For each selected user, add this group to their groupIds
    users.forEach(user => {
      const isSelected = selectedUserIds.includes(user.id);
      const isCurrentlyInGroup = user.groupIds?.includes(group.id) || false;
      
      if (isSelected !== isCurrentlyInGroup) {
        let newGroupIds: string[] = user.groupIds || [];
        
        if (isSelected) {
          // Add to group
          newGroupIds = [...newGroupIds, group.id];
        } else {
          // Remove from group
          newGroupIds = newGroupIds.filter(id => id !== group.id);
        }
        
        updateUserGroups(user.id, newGroupIds);
      }
    });
    
    setHasChanges(false);
  };
  
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Membros do Grupo</h3>
        <Button 
          onClick={handleSaveChanges} 
          disabled={!hasChanges}
        >
          Salvar Alterações
        </Button>
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          <UserCheck className="mr-2 h-4 w-4" />
          Selecionar Todos
        </Button>
        <Button variant="outline" size="sm" onClick={handleDeselectAll}>
          <UserX className="mr-2 h-4 w-4" />
          Limpar Todos
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(70vh-200px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={filteredUsers.length > 0 && filteredUsers.every(user => selectedUserIds.includes(user.id))} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUserIds(prev => {
                        const userIdsToAdd = filteredUsers
                          .filter(user => !prev.includes(user.id))
                          .map(user => user.id);
                        return [...prev, ...userIdsToAdd];
                      });
                    } else {
                      setSelectedUserIds(prev => prev.filter(id => 
                        !filteredUsers.some(user => user.id === id)
                      ));
                    }
                    setHasChanges(true);
                  }} 
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={(checked) => handleUserSelection(user.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? 'Administrador' : 
                   user.role === 'manager' ? 'Gerente' : 'Operador'}
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <span className="text-sm text-green-600 bg-green-50 py-1 px-2 rounded-full">
                      Ativo
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 bg-red-50 py-1 px-2 rounded-full">
                      Inativo
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {hasChanges && (
        <div className="flex justify-between items-center bg-amber-50 p-3 rounded-md border border-amber-200">
          <div className="flex items-center text-amber-700">
            <UserCheck className="h-4 w-4 mr-2" />
            <span>Alterações não salvas na associação de usuários</span>
          </div>
          <Button onClick={handleSaveChanges} size="sm">Salvar Alterações</Button>
        </div>
      )}
    </div>
  );
};

export default GroupMembersTab;
