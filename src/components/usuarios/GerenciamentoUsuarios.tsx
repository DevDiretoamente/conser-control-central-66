
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, AlertTriangle, Shield, Mail, UserCheck, UserX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types/auth';
import UserFilterToolbar from './UserFilterToolbar';
import UserDetails from './UserDetails';
import UserActivationToggle from './UserActivationToggle';
import UserPermissionsDialog from './UserPermissionsDialog';

const GerenciamentoUsuarios: React.FC = () => {
  const { users, createUser, updateUser, deleteUser, hasSpecificPermission, user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'operator',
    isActive: true,
    permissions: []
  });

  // Check if current user is an administrator
  const isAdmin = currentUser?.role === 'admin';
  
  // Check permissions - now restricted to admin only
  const canManageUsers = isAdmin && hasSpecificPermission('usuarios', 'manage');
  const canCreateUsers = isAdmin && hasSpecificPermission('usuarios', 'create');
  const canEditUsers = isAdmin && hasSpecificPermission('usuarios', 'write');
  const canDeleteUsers = isAdmin && hasSpecificPermission('usuarios', 'delete');

  const handleFilterChange = (filters: any) => {
    let results = [...users];
    
    // Apply search filter
    if (filters.searchTerm) {
      results = results.filter(user => 
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (filters.role) {
      results = results.filter(user => user.role === filters.role);
    }
    
    // Apply active/inactive filter
    if (filters.isActive !== undefined) {
      results = results.filter(user => user.isActive === filters.isActive);
    }
    
    // Apply sorting
    if (filters.sortField) {
      const direction = filters.sortDirection === 'asc' ? 1 : -1;
      results.sort((a, b) => {
        const fieldA = a[filters.sortField] || '';
        const fieldB = b[filters.sortField] || '';
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return fieldA.localeCompare(fieldB) * direction;
        } else {
          return ((fieldA > fieldB) ? 1 : -1) * direction;
        }
      });
    }
    
    setFilteredUsers(results);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (!newUser.email.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }
    
    // Check if email is already in use
    if (users.some(user => user.email.toLowerCase() === newUser.email?.toLowerCase())) {
      toast.error('Este email já está em uso');
      return;
    }
    
    // Generate a random password (in a real app, you'd send an invite email with a link to set password)
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const userToAdd: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      isActive: true,
      permissions: [],
      createdAt: new Date().toISOString(),
      password: tempPassword // This is just for demo, in a real app you'd use proper auth
    };
    
    createUser(userToAdd);
    setNewUser({
      name: '',
      email: '',
      role: 'operator',
      isActive: true,
      permissions: []
    });
    setIsAddDialogOpen(false);
    toast.success('Usuário adicionado com sucesso', {
      description: `A senha temporária é: ${tempPassword}`
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    // In a real app, you might want to open an edit dialog here
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      setSelectedUser(null);
      setIsDeleteDialogOpen(false);
      toast.success('Usuário excluído com sucesso');
    }
  };

  const handleOpenPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  // Admin check notification
  const showAdminOnlyWarning = () => {
    toast.warning('Apenas administradores podem gerenciar usuários', {
      description: 'Contate um administrador do sistema para esta operação.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1">
          <UserFilterToolbar onFilterChange={handleFilterChange} />
        </div>
        
        {isAdmin ? (
          canCreateUsers && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          )
        ) : (
          <Button onClick={showAdminOnlyWarning} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>
      
      {selectedUser && (
        <UserDetails user={selectedUser} className="animate-in fade-in-0 zoom-in-95 duration-300" />
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Gerencie os usuários que têm acesso ao sistema" 
              : "Visualize os usuários que têm acesso ao sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-400px)] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? 'Administrador' : 
                       user.role === 'manager' ? 'Gerente' : 'Operador'}
                    </TableCell>
                    <TableCell>
                      <UserActivationToggle 
                        user={user}
                        disabled={!canManageUsers}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {isAdmin ? (
                          <>
                            {canManageUsers && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenPermissions(user);
                                }}
                              >
                                <Shield className="h-4 w-4 text-blue-500" />
                              </Button>
                            )}
                            
                            {canEditUsers && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditUser(user);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {canDeleteUsers && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUser(user);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              showAdminOnlyWarning();
                            }}
                          >
                            <Shield className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
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
        </CardContent>
      </Card>
      
      {/* Add User Dialog - Only for admins */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo usuário para acessar o sistema.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo*</Label>
                <Input
                  id="name"
                  value={newUser.name || ''}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nome do usuário"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função*</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="operator">Operador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddUser}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog - Only for admins */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              {selectedUser && `Tem certeza que deseja excluir o usuário ${selectedUser.name}? Esta ação não pode ser desfeita.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Permissions Dialog - Only for admins */}
      {selectedUser && isAdmin && (
        <UserPermissionsDialog 
          user={selectedUser}
          isOpen={isPermissionsDialogOpen}
          onOpenChange={setIsPermissionsDialogOpen}
        />
      )}
    </div>
  );
};

export default GerenciamentoUsuarios;
