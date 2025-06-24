
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserGroup } from '@/types/auth';
import { Plus, Search, Pencil, Trash2, Users, Shield } from 'lucide-react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import GroupList from './GroupList';
import GroupForm from './GroupForm';
import { toast } from 'sonner';

// Mock groups data for demonstration
const mockGroups: UserGroup[] = [
  {
    id: '1',
    name: 'Administradores',
    description: 'Acesso completo ao sistema',
    permissions: [
      { area: 'usuarios', level: 'manage' },
      { area: 'rh', level: 'manage' },
      { area: 'financeiro', level: 'manage' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Gerentes RH',
    description: 'Gerenciamento de recursos humanos',
    permissions: [
      { area: 'rh', level: 'manage' },
      { area: 'funcionarios', level: 'write' }
    ],
    createdAt: new Date().toISOString()
  }
];

const GroupManagement: React.FC = () => {
  const { hasPermission } = useSecureAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [groups, setGroups] = useState<UserGroup[]>(mockGroups);
  const [filteredGroups, setFilteredGroups] = useState<UserGroup[]>(mockGroups);

  // Check if current user can manage groups (admin only)
  const canManageGroups = hasPermission('usuarios', 'manage');

  const handleFilterChange = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredGroups(groups);
      return;
    }
    
    const results = groups.filter(group => 
      group.name.toLowerCase().includes(term.toLowerCase()) || 
      group.description.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredGroups(results);
  };

  const handleAddGroup = () => {
    if (!canManageGroups) {
      toast.error('Você não tem permissão para gerenciar grupos');
      return;
    }
    setIsAddDialogOpen(true);
  };

  const handleGroupSelect = (group: UserGroup) => {
    setSelectedGroup(group);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {canManageGroups && (
          <Button onClick={handleAddGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Grupo
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Grupos de Usuários</CardTitle>
              <CardDescription>
                Gerencie grupos de permissões para usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GroupList 
                groups={filteredGroups} 
                selectedGroupId={selectedGroup?.id}
                onSelectGroup={handleGroupSelect}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <GroupForm 
              group={selectedGroup} 
              isOpen={true}
              onClose={() => setSelectedGroup(null)}
            />
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-60">
                <p className="text-muted-foreground mb-4">
                  Selecione um grupo para ver detalhes ou crie um novo grupo
                </p>
                {canManageGroups && (
                  <Button onClick={handleAddGroup} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Grupo
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* New Group Dialog */}
      {isAddDialogOpen && (
        <GroupForm 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default GroupManagement;
