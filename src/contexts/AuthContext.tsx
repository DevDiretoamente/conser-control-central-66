import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole, Permission, PermissionArea, PermissionLevel, UserActivationHistoryEntry, UserGroup } from '@/types/auth';
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
  updateUserGroups: (userId: string, groupIds: string[]) => void;
  toggleUserActivation: (userId: string, active: boolean) => void;
  userActivationHistory: UserActivationHistoryEntry[];
  
  // Group management
  groups: UserGroup[];
  createGroup: (groupData: Omit<UserGroup, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, groupData: Partial<UserGroup>) => void;
  deleteGroup: (id: string) => void;
  updateGroupPermissions: (groupId: string, permissions: Permission[]) => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// SECURITY WARNING: These are demo users only - replace with real Supabase auth
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@conservias.com',
    password: 'admin123',
    name: 'Administrador (DEMO)',
    role: 'admin' as UserRole,
    avatar: '',
    isActive: true,
    createdAt: '2023-01-01T10:00:00Z',
    lastLogin: '2024-05-09T08:30:00Z',
    groupIds: ['1'],
    permissions: [
      { area: 'rh', level: 'manage' },
      { area: 'obras', level: 'manage' },
      { area: 'frota', level: 'manage' },
      { area: 'patrimonio', level: 'manage' },
      { area: 'financeiro', level: 'manage' },
      { area: 'configuracoes', level: 'manage' },
      { area: 'usuarios', level: 'manage' },
      { area: 'cartaoponto', level: 'manage' },
    ]
  }
];

// SECURITY WARNING: These are demo groups only
const mockGroups: UserGroup[] = [
  {
    id: '1',
    name: 'Administradores (DEMO)',
    description: 'Acesso total ao sistema - APENAS PARA DEMONSTRAÇÃO',
    permissions: [
      { area: 'rh', level: 'manage' },
      { area: 'obras', level: 'manage' },
      { area: 'frota', level: 'manage' },
      { area: 'patrimonio', level: 'manage' },
      { area: 'financeiro', level: 'manage' },
      { area: 'configuracoes', level: 'manage' },
      { area: 'usuarios', level: 'manage' },
    ],
    createdAt: '2023-01-01T10:00:00Z',
  }
];

// Helper function to get the highest permission level for an area from a user
export const getHighestPermissionForArea = (user: User, area: PermissionArea): PermissionLevel | null => {
  if (!user.permissions) return null;
  
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
  const [groups, setGroups] = useState<UserGroup[]>(mockGroups);
  const [userActivationHistory, setUserActivationHistory] = useState<UserActivationHistoryEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // SECURITY WARNING: This is demo authentication only
    console.warn('🚨 SECURITY WARNING: Using demo authentication. Replace with secure Supabase auth.');
    
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
      // SECURITY WARNING: This is demo authentication with hardcoded credentials
      const foundUser = users.find(
        (user) => user.email === email && user.password === password && user.isActive
      );

      if (!foundUser) {
        throw new Error('Credenciais inválidas ou usuário inativo');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      
      const updatedUser = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString()
      };

      setUsers(users.map(u => u.id === updatedUser.id ? {...u, lastLogin: updatedUser.lastLogin} : u));
      
      localStorage.setItem('conservias-user', JSON.stringify(updatedUser));
      
      setState({
        isAuthenticated: true,
        user: updatedUser,
        isLoading: false,
        error: null,
      });

      toast({
        title: 'Login realizado com sucesso (DEMO)',
        description: `Bem-vindo, ${updatedUser.name}! ⚠️ Usando autenticação de demonstração`,
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

  // Combine user-specific permissions with permissions from their groups
  const getCombinedPermissions = (user: User): Permission[] => {
    if (!user) return [];
    
    let combinedPermissions: Permission[] = [...(user.permissions || [])];
    
    if (user.groupIds && user.groupIds.length > 0) {
      const userGroups = groups.filter(group => user.groupIds?.includes(group.id));
      
      userGroups.forEach(group => {
        group.permissions.forEach(groupPerm => {
          const existingPermIdx = combinedPermissions.findIndex(p => p.area === groupPerm.area);
          
          if (existingPermIdx >= 0) {
            const levelHierarchy: Record<PermissionLevel, number> = {
              'read': 1,
              'create': 2,
              'write': 3,
              'delete': 4,
              'manage': 5
            };
            
            const existingLevel = levelHierarchy[combinedPermissions[existingPermIdx].level];
            const groupLevel = levelHierarchy[groupPerm.level];
            
            if (groupLevel > existingLevel) {
              combinedPermissions[existingPermIdx] = { ...groupPerm };
            }
          } else {
            combinedPermissions.push({ ...groupPerm });
          }
        });
      });
    }
    
    return combinedPermissions;
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!state.isAuthenticated || !state.user) return false;
    
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
    
    if (state.user.role === 'admin') return true;
    
    const combinedPermissions = getCombinedPermissions(state.user);
    
    if (level) {
      const levelHierarchy: Record<PermissionLevel, number> = {
        'read': 1,
        'create': 2,
        'write': 3,
        'delete': 4,
        'manage': 5
      };

      const permission = combinedPermissions.find(p => p.area === area);
      if (permission) {
        const userPermissionLevel = levelHierarchy[permission.level];
        const requiredPermissionLevel = levelHierarchy[level];
        return userPermissionLevel >= requiredPermissionLevel;
      }
    } else {
      return combinedPermissions.some(p => p.area === area);
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
      title: 'Usuário criado (DEMO)',
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

  const updateUserGroups = (userId: string, groupIds: string[]) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, groupIds };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
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
      title: 'Grupos atualizados',
      description: 'A associação a grupos do usuário foi atualizada com sucesso.',
    });
  };

  const toggleUserActivation = (userId: string, active: boolean) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isActive: active };
      }
      return user;
    });
    
    setUsers(updatedUsers);

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

  const createGroup = (groupData: Omit<UserGroup, 'id' | 'createdAt'>) => {
    const newGroup: UserGroup = {
      ...groupData,
      id: (groups.length + 1).toString(),
      createdAt: new Date().toISOString(),
      permissions: groupData.permissions || [],
    };
    
    setGroups([...groups, newGroup]);
    
    toast({
      title: 'Grupo criado',
      description: `Grupo ${newGroup.name} criado com sucesso.`,
    });
  };

  const updateGroup = (id: string, groupData: Partial<UserGroup>) => {
    const updatedGroups = groups.map(group => {
      if (group.id === id) {
        return { ...group, ...groupData, updatedBy: state.user?.name };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    
    toast({
      title: 'Grupo atualizado',
      description: 'Informações do grupo atualizadas com sucesso.',
    });
  };

  const deleteGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    
    const updatedUsers = users.map(user => {
      if (user.groupIds?.includes(id)) {
        return {
          ...user,
          groupIds: user.groupIds.filter(groupId => groupId !== id)
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    toast({
      title: 'Grupo removido',
      description: 'Grupo removido com sucesso.',
      variant: 'destructive'
    });
  };

  const updateGroupPermissions = (groupId: string, permissions: Permission[]) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return { ...group, permissions };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    
    toast({
      title: 'Permissões atualizadas',
      description: 'As permissões do grupo foram atualizadas com sucesso.',
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
    updateUserGroups,
    toggleUserActivation,
    userActivationHistory,
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    updateGroupPermissions
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
