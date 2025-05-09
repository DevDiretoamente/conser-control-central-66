
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole, Permission, PermissionArea, PermissionLevel, UserActivationHistoryEntry } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  hasSpecificPermission: (area: PermissionArea, level?: PermissionLevel) => boolean;
  getHighestPermissionForArea: (user: User, area: PermissionArea) => PermissionLevel | null;
  users: User[];
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateUserPermissions: (userId: string, permissions: Permission[]) => void;
  toggleUserActivation: (userId: string, active: boolean) => void;
  userActivationHistory: UserActivationHistoryEntry[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced mock users for demonstration with permissions
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@conservias.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as UserRole,
    avatar: '',
    isActive: true,
    createdAt: '2023-01-01T10:00:00Z',
    lastLogin: '2024-05-09T08:30:00Z',
    permissions: [
      { area: 'rh', level: 'manage' },
      { area: 'obras', level: 'manage' },
      { area: 'frota', level: 'manage' },
      { area: 'patrimonio', level: 'manage' },
      { area: 'financeiro', level: 'manage' },
      { area: 'configuracoes', level: 'manage' },
      { area: 'usuarios', level: 'manage' },
    ]
  },
  {
    id: '2',
    email: 'gerente@conservias.com',
    password: 'gerente123',
    name: 'Gerente de RH',
    role: 'manager' as UserRole,
    avatar: '',
    isActive: true,
    createdAt: '2023-02-15T14:30:00Z',
    lastLogin: '2024-05-08T16:45:00Z',
    permissions: [
      { area: 'rh', level: 'manage' },
      { area: 'funcionarios', level: 'write' },
      { area: 'exames', level: 'write' },
      { area: 'documentos', level: 'read' },
    ]
  },
  {
    id: '3',
    email: 'operador@conservias.com',
    password: 'operador123',
    name: 'Operador',
    role: 'operator' as UserRole,
    avatar: '',
    isActive: true,
    createdAt: '2023-03-20T09:15:00Z',
    lastLogin: '2024-05-09T10:20:00Z',
    permissions: [
      { area: 'rh', level: 'read' },
      { area: 'funcionarios', level: 'read' },
      { area: 'exames', level: 'read' },
    ]
  },
  {
    id: '4',
    email: 'inativo@conservias.com',
    password: 'inativo123',
    name: 'Usuário Inativo',
    role: 'operator' as UserRole,
    avatar: '',
    isActive: false,
    createdAt: '2023-04-10T11:25:00Z',
    lastLogin: '2023-09-15T14:20:00Z',
    permissions: [
      { area: 'rh', level: 'read' },
      { area: 'funcionarios', level: 'read' },
    ]
  },
];

// Helper function to get the highest permission level for an area from a user
export const getHighestPermissionForArea = (user: User, area: PermissionArea): PermissionLevel | null => {
  if (!user.permissions) return null;
  
  // First, check if user has admin role (has all permissions)
  if (user.role === 'admin') return 'manage';
  
  const areaPermissions = user.permissions.filter(p => p.area === area);
  if (areaPermissions.length === 0) return null;
  
  if (areaPermissions.some(p => p.level === 'manage')) return 'manage';
  if (areaPermissions.some(p => p.level === 'delete')) return 'delete';
  if (areaPermissions.some(p => p.level === 'write')) return 'write';
  if (areaPermissions.some(p => p.level === 'create')) return 'create';
  if (areaPermissions.some(p => p.level === 'read')) return 'read';
  
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [userActivationHistory, setUserActivationHistory] = useState<UserActivationHistoryEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored authentication on initial load
    const storedUser = localStorage.getItem('conservias-user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem('conservias-user');
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    } else {
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      // In a real app, this would be an API call
      const foundUser = users.find(
        (user) => user.email === email && user.password === password && user.isActive
      );

      if (!foundUser) {
        throw new Error('Credenciais inválidas ou usuário inativo');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Update last login time
      const updatedUser = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString()
      };

      // Update users list with new login time
      setUsers(users.map(u => u.id === updatedUser.id ? {...u, lastLogin: updatedUser.lastLogin} : u));
      
      // Store user in localStorage
      localStorage.setItem('conservias-user', JSON.stringify(updatedUser));
      
      setState({
        isAuthenticated: true,
        user: updatedUser,
        isLoading: false,
        error: null,
      });

      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${updatedUser.name}!`,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao realizar login',
      });
      
      toast({
        variant: 'destructive',
        title: 'Erro de autenticação',
        description: error instanceof Error ? error.message : 'Erro ao realizar login',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('conservias-user');
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
    
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!state.isAuthenticated || !state.user) return false;
    
    // Role hierarchy: admin > manager > operator
    const roleHierarchy: Record<UserRole, number> = {
      'admin': 3,
      'manager': 2,
      'operator': 1
    };
    
    const userRoleLevel = roleHierarchy[state.user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];
    
    return userRoleLevel >= requiredRoleLevel;
  };

  const hasSpecificPermission = (area: PermissionArea, level?: PermissionLevel): boolean => {
    if (!state.isAuthenticated || !state.user) return false;
    
    // Admin role has all permissions
    if (state.user.role === 'admin') return true;
    
    // Check specific permissions
    if (state.user.permissions) {
      // For specific area and level
      if (level) {
        const levelHierarchy: Record<PermissionLevel, number> = {
          'read': 1,
          'create': 2,
          'write': 3,
          'delete': 4,
          'manage': 5
        };

        const permission = state.user.permissions.find(p => p.area === area);
        if (permission) {
          const userPermissionLevel = levelHierarchy[permission.level];
          const requiredPermissionLevel = levelHierarchy[level];
          return userPermissionLevel >= requiredPermissionLevel;
        }
      } 
      // Just check if user has any permission for the area
      else {
        return state.user.permissions.some(p => p.area === area);
      }
    }
    
    return false;
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    
    toast({
      title: 'Usuário criado',
      description: `Usuário ${newUser.name} criado com sucesso.`,
    });
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, ...userData };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // If the logged in user was updated, update the logged in state
    if (state.user && state.user.id === id) {
      const updatedUser = updatedUsers.find(u => u.id === id);
      if (updatedUser) {
        setState({
          ...state,
          user: updatedUser,
        });
        localStorage.setItem('conservias-user', JSON.stringify(updatedUser));
      }
    }
    
    toast({
      title: 'Usuário atualizado',
      description: 'Informações do usuário atualizadas com sucesso.',
    });
  };

  const deleteUser = (id: string) => {
    // In a real app, you might want to soft-delete instead
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: 'Usuário removido',
      description: 'Usuário removido com sucesso.',
      variant: 'destructive'
    });
  };

  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, permissions };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // If the logged in user was updated, update the logged in state
    if (state.user && state.user.id === userId) {
      const updatedUser = updatedUsers.find(u => u.id === userId);
      if (updatedUser) {
        setState({
          ...state,
          user: updatedUser,
        });
        localStorage.setItem('conservias-user', JSON.stringify(updatedUser));
      }
    }
    
    toast({
      title: 'Permissões atualizadas',
      description: 'As permissões do usuário foram atualizadas com sucesso.',
    });
  };

  const toggleUserActivation = (userId: string, active: boolean) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Update user active status
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isActive: active };
      }
      return user;
    });
    
    setUsers(updatedUsers);

    // Add to activation history
    const historyEntry: UserActivationHistoryEntry = {
      userId,
      timestamp: new Date().toISOString(),
      action: active ? 'activated' : 'deactivated',
      performedBy: state.user?.name || 'Sistema',
    };

    setUserActivationHistory([...userActivationHistory, historyEntry]);
    
    toast({
      title: active ? 'Usuário ativado' : 'Usuário desativado',
      description: `O usuário ${user.name} foi ${active ? 'ativado' : 'desativado'} com sucesso.`,
      variant: active ? 'default' : 'destructive',
    });
  };

  const value = {
    ...state,
    login,
    logout,
    hasPermission,
    hasSpecificPermission,
    getHighestPermissionForArea: (user: User, area: PermissionArea) => getHighestPermissionForArea(user, area),
    users,
    createUser,
    updateUser,
    deleteUser,
    updateUserPermissions,
    toggleUserActivation,
    userActivationHistory
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
