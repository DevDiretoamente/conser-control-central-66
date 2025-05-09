
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MoreVertical, 
  UserPlus, 
  Edit, 
  Trash, 
  Shield,
  UserCog,
  History,
  Users,
  RefreshCw,
  Clock,
  Calendar
} from 'lucide-react';
import { User, UserRole, UserFilterOptions } from '@/types/auth';
import { formatDistanceToNow, formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import UserPermissionsDialog from '@/components/usuarios/UserPermissionsDialog';
import UserActivationToggle from '@/components/usuarios/UserActivationToggle';
import UserFilterToolbar from '@/components/usuarios/UserFilterToolbar';
import UserActivationHistory from '@/components/usuarios/UserActivationHistory';
import UserPermissionsSummary from '@/components/usuarios/UserPermissionsSummary';

const userFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'operator'] as const),
  isActive: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const Usuarios: React.FC = () => {
  const { users, createUser, updateUser, deleteUser } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<UserFilterOptions>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  
  const createForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'operator',
      isActive: true,
    },
  });

  const editForm = useForm<Partial<UserFormValues>>({
    resolver: zodResolver(userFormSchema.partial()),
    defaultValues: {
      name: '',
      email: '',
      role: undefined,
      isActive: true,
    },
  });

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...users];
    
    // Filter by search term
    if (filterOptions.searchTerm) {
      const searchLower = filterOptions.searchTerm.toLowerCase();
      result = result.filter(
        user => user.name.toLowerCase().includes(searchLower) || 
                user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by role
    if (filterOptions.role) {
      result = result.filter(user => user.role === filterOptions.role);
    }
    
    // Filter by active status
    if (filterOptions.isActive !== undefined) {
      result = result.filter(user => user.isActive === filterOptions.isActive);
    }
    
    // Sort users
    if (filterOptions.sortField) {
      const direction = filterOptions.sortDirection === 'desc' ? -1 : 1;
      
      result.sort((a, b) => {
        if (filterOptions.sortField === 'name') {
          return a.name.localeCompare(b.name) * direction;
        }
        
        if (filterOptions.sortField === 'createdAt') {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        }
        
        if (filterOptions.sortField === 'lastLogin') {
          const aTime = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          const bTime = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          return (aTime - bTime) * direction;
        }
        
        return 0;
      });
    }
    
    setFilteredUsers(result);
  }, [users, filterOptions]);

  const handleCreateSubmit = (data: UserFormValues) => {
    createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      avatar: '',
      isActive: true,
    });
    createForm.reset();
    setIsCreateDialogOpen(false);
  };

  const handleEditSubmit = (data: Partial<UserFormValues>) => {
    if (selectedUser) {
      const updatedData: Partial<User> = { 
        ...data,
      };
      
      // Only include password if it was changed
      if (!data.password) {
        delete updatedData.password;
      }
      
      updateUser(selectedUser.id, updatedData);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(userId);
    }
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary">Administrador</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500">Gerente</Badge>;
      case 'operator':
        return <Badge className="bg-slate-500">Operador</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Perfil</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="admin" id="admin" />
                            <label htmlFor="admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Administrador
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="manager" id="manager" />
                            <label htmlFor="manager" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Gerente
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="operator" id="operator" />
                            <label htmlFor="operator" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Operador
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="w-full">Criar Usuário</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <UserFilterToolbar onFilterChange={setFilterOptions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="relative">
                Todos
                <Badge className="ml-2 text-xs" variant="secondary">{users.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="relative">
                Ativos
                <Badge className="ml-2 text-xs" variant="secondary">
                  {users.filter(u => u.isActive).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inactive" className="relative">
                Inativos
                <Badge className="ml-2 text-xs" variant="secondary">
                  {users.filter(u => !u.isActive).length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <UserTable 
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onManagePermissions={handleManagePermissions}
                getRoleBadge={getRoleBadge}
                formatDate={formatDate}
              />
            </TabsContent>

            <TabsContent value="active">
              <UserTable 
                users={filteredUsers.filter(u => u.isActive)}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onManagePermissions={handleManagePermissions}
                getRoleBadge={getRoleBadge}
                formatDate={formatDate}
              />
            </TabsContent>

            <TabsContent value="inactive">
              <UserTable 
                users={filteredUsers.filter(u => !u.isActive)}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onManagePermissions={handleManagePermissions}
                getRoleBadge={getRoleBadge}
                formatDate={formatDate}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <UserActivationHistory />
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha (deixe em branco para não alterar)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Perfil</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="edit-admin" />
                          <label htmlFor="edit-admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Administrador
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manager" id="edit-manager" />
                          <label htmlFor="edit-manager" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Gerente
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="operator" id="edit-operator" />
                          <label htmlFor="edit-operator" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Operador
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === 'true')}
                        value={field.value ? 'true' : 'false'}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="edit-active" />
                          <label htmlFor="edit-active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Ativo
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="edit-inactive" />
                          <label htmlFor="edit-inactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Inativo
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {selectedUser && (
        <UserPermissionsDialog 
          user={selectedUser}
          isOpen={isPermissionsDialogOpen}
          onOpenChange={setIsPermissionsDialogOpen}
        />
      )}
    </div>
  );
};

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onManagePermissions: (user: User) => void;
  getRoleBadge: (role: UserRole) => React.ReactNode;
  formatDate: (date?: string) => string;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  onManagePermissions,
  getRoleBadge,
  formatDate
}) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Criado em</TableHead>
              <TableHead className="hidden lg:table-cell">Último login</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <React.Fragment key={user.id}>
                  <TableRow 
                    className="cursor-pointer" 
                    onClick={() => toggleExpand(user.id)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <UserActivationToggle user={user} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(user); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onManagePermissions(user); }}>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Permissões</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); onDelete(user.id); }} 
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedUser === user.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div className="bg-slate-50 p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium mb-2">Detalhes do Usuário</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">ID:</span>
                                  <span>{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Criado:</span>
                                  <span>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                                {user.lastLogin && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Último login:</span>
                                    <span>{new Date(user.lastLogin).toLocaleDateString('pt-BR')} às {new Date(user.lastLogin).toLocaleTimeString('pt-BR')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium mb-2">Permissões</h3>
                              <UserPermissionsSummary user={user} />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={(e) => { e.stopPropagation(); onManagePermissions(user); }}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Gerenciar Permissões
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Usuarios;
