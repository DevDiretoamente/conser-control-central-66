import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Plus, User, UserX } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GroupMembersTabProps {
  groupId: string;
  members: UserProfile[];
  onAddMember: (userId: string) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
}

const GroupMembersTab: React.FC<GroupMembersTabProps> = ({
  groupId,
  members,
  onAddMember,
  onRemoveMember,
}) => {
  const { getAllUsers } = useSecureAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  React.useEffect(() => {
    loadAvailableUsers();
  }, [members]);

  const loadAvailableUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      // Filter out users who are already members of the group
      const nonMembers = allUsers.filter(user => !members.find(member => member.id === user.id));
      setAvailableUsers(nonMembers);
    } catch (error) {
      console.error('Error loading available users:', error);
      toast.error('Erro ao carregar usuários disponíveis');
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast.error('Selecione um usuário para adicionar');
      return;
    }

    setIsAdding(true);
    try {
      await onAddMember(selectedUser);
      toast.success('Usuário adicionado ao grupo com sucesso');
      setSelectedUser(null);
      loadAvailableUsers(); // Refresh available users
    } catch (error) {
      console.error('Error adding member to group:', error);
      toast.error('Erro ao adicionar usuário ao grupo');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await onRemoveMember(userId);
      toast.success('Usuário removido do grupo com sucesso');
      loadAvailableUsers(); // Refresh available users
    } catch (error) {
      console.error('Error removing member from group:', error);
      toast.error('Erro ao remover usuário do grupo');
    }
  };

  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Membros do Grupo</CardTitle>
          <CardDescription>
            Gerencie os membros deste grupo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full">
            <div className="divide-y divide-border">
              {members.length > 0 ? (
                members.map(member => (
                  <div key={member.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Nenhum membro neste grupo.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Membro</CardTitle>
          <CardDescription>
            Adicione um usuário existente ao grupo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="search">Buscar Usuário</Label>
            <Input
              id="search"
              placeholder="Nome ou email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[200px] w-full">
            <div className="divide-y divide-border">
              {filteredAvailableUsers.length > 0 ? (
                filteredAvailableUsers.map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between py-2 ${selectedUser === user.id ? 'bg-secondary' : 'hover:bg-muted/50 cursor-pointer'
                      }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Nenhum usuário disponível para adicionar.
                </div>
              )}
            </div>
          </ScrollArea>
          <Button onClick={handleAddMember} disabled={!selectedUser || isAdding}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar ao Grupo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupMembersTab;
