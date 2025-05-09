
export type UserRole = 'admin' | 'manager' | 'operator';

// Defining specific permission areas
export type PermissionArea = 
  // Modules
  | 'rh' 
  | 'obras' 
  | 'frota' 
  | 'patrimonio' 
  | 'financeiro' 
  | 'configuracoes'
  // Resources
  | 'funcionarios'
  | 'exames'
  | 'documentos'
  | 'usuarios'
  | 'funcoes'
  | 'setores'
  | 'clinicas';

// Define permission levels
export type PermissionLevel = 'read' | 'write' | 'delete' | 'manage';

// Permission definition
export interface Permission {
  area: PermissionArea;
  level: PermissionLevel;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions?: Permission[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  password?: string; // Adding password as optional field for auth purposes
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Sorting and filtering options for users
export interface UserSortOption {
  field: 'name' | 'email' | 'role' | 'createdAt' | 'lastLogin' | 'isActive';
  direction: 'asc' | 'desc';
}

export interface UserFilterOptions {
  role?: UserRole;
  isActive?: boolean;
  searchTerm?: string;
}

export interface UserActivationHistoryEntry {
  userId: string;
  timestamp: string;
  action: 'activated' | 'deactivated';
  performedBy: string;
}

