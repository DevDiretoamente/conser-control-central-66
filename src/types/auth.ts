
export type UserRole = 'admin' | 'manager' | 'operator';

// Defining specific permission areas
export type PermissionArea = 
  // Módulos
  | 'rh' 
  | 'obras' 
  | 'frota' 
  | 'patrimonio' 
  | 'financeiro' 
  | 'configuracoes'
  | 'admin' // Added "admin" as a valid permission area
  // Resources
  | 'funcionarios'
  | 'exames'
  | 'documentos'
  | 'usuarios'
  | 'funcoes'
  | 'setores'
  | 'clinicas'
  | 'emails'
  | 'cartaoponto'; 

// Define permission levels
export type PermissionLevel = 'read' | 'create' | 'write' | 'delete' | 'manage';

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
  sortField?: 'name' | 'email' | 'role' | 'createdAt' | 'lastLogin' | 'isActive';
  sortDirection?: 'asc' | 'desc';
}

export interface UserActivationHistoryEntry {
  userId: string;
  timestamp: string;
  action: 'activated' | 'deactivated';
  performedBy: string;
}
