
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@conservias.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as UserRole,
    avatar: '',
  },
  {
    id: '2',
    email: 'gerente@conservias.com',
    password: 'gerente123',
    name: 'Gerente de RH',
    role: 'manager' as UserRole,
    avatar: '',
  },
  {
    id: '3',
    email: 'operador@conservias.com',
    password: 'operador123',
    name: 'Operador',
    role: 'operator' as UserRole,
    avatar: '',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
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
      const foundUser = mockUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (!foundUser) {
        throw new Error('Credenciais inválidas');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem('conservias-user', JSON.stringify(userWithoutPassword));
      
      setState({
        isAuthenticated: true,
        user: userWithoutPassword,
        isLoading: false,
        error: null,
      });

      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${userWithoutPassword.name}!`,
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

  const value = {
    ...state,
    login,
    logout,
    hasPermission,
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
