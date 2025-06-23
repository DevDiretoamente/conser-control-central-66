
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, AlertTriangle, Shield, UserCheck, UserX, Copy, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator';
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const RealUserManagement: React.FC = () => {
  const { profile, createUser, updateUserProfile, getAllUsers } = useSecureAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operator' as 'admin' | 'manager' | 'operator'
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const password = generateSecurePassword();
    setGeneratedPassword(password);
    setNewUser({...newUser, password});
    setShowPassword(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (!newUser.email.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    if (newUser.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast.error('Este email já está em uso');
      return;
    }
    
    try {
      await createUser(newUser);
      
      // Show success message with login credentials
      toast.success(`Usuário criado com sucesso! Email: ${newUser.email}`, {
        duration: 5000
      });
      
      setNewUser({ name: '', email: '', password: '', role: 'operator' });
      setGeneratedPassword('');
      setShowPassword(false);
      setIsAddDialogOpen(false);
      await loadUsers();
    } catch (error) {
      // Error handling is done in createUser
    }
  };

  const handleToggleActive = async (user: UserProfile) => {
    if (!isAdmin) {
      toast.error('Apenas administradores podem ativar/desativar usuários');
      return;
    }

    try {
      await updateUserProfile(user.id, { is_active: !user.is_active });
      await loadUsers();
    } catch (error) {
      // Error handling is done in updateUserProfile
    }
  };

  const handleRoleChange = async (user: UserProfile, newRole: 'admin' | 'manager' | 'operator') => {
    if (!isAdmin) {
      toast.error('Apenas administradores podem alterar roles');
      return;
    }

    try {
      await updateUserProfile(user.id, { role: newRole });
      await loadUsers();
    } catch (error) {
      // Error handling is done in updateUserProfile
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'operator': return 'Operador';
      default: return role;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Carregando usuários...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium">Usuários do Sistema</h3>
          <p className="text-sm text-muted-foreground">
            {isAdmin 
              ? "Gerencie os usuários que têm acesso ao sistema. Novos usuários criados aqui receberão credenciais para primeiro acesso." 
              : "Visualize os usuários que têm acesso ao sistema"}
          </p>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      {isAdmin && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Após criar um usuário, compartilhe as credenciais de acesso com segurança. 
            O sistema não permite cadastro público - apenas administradores podem criar novos usuários.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-400px)] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.email}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(user.email, 'Email')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Select
                          value={user.role}
                          onValueChange={(value: 'admin' | 'manager' | 'operator') => 
                            handleRoleChange(user, value)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="manager">Gerente</SelectItem>
                            <SelectItem value="operator">Operador</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getRoleLabel(user.role)
                      )}
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.is_active}
                            onCheckedChange={() => handleToggleActive(user)}
                          />
                          <span className={user.is_active ? "text-green-600" : "text-red-600"}>
                            {user.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {user.is_active ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-red-600" />
                          )}
                          <span className={user.is_active ? "text-green-600" : "text-red-600"}>
                            {user.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setSelectedUser(user);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 6 : 5} className="h-24 text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo usuário para acessar o sistema. As credenciais de acesso serão exibidas após a criação.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo*</Label>
                <Input
                  id="name"
                  value={newUser.name}
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
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha*</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePassword}
                  >
                    Gerar Senha Segura
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {newUser.password && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(newUser.password, 'Senha')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função*</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'admin' | 'manager' | 'operator') => 
                    setNewUser({...newUser, role: value})
                  }
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
              
              {newUser.email && newUser.password && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Credenciais de acesso:</strong><br />
                    Email: {newUser.email}<br />
                    Senha: {newUser.password}<br />
                    <em>Anote essas informações para compartilhar com o usuário.</em>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>Criar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RealUserManagement;
