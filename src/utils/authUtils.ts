
// Função para limpar estado de autenticação
export const cleanupAuthState = () => {
  try {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn('Error cleaning auth state:', error);
  }
};

export const hasRole = (profile: any, role: string): boolean => {
  if (!profile) {
    console.log('hasRole: No profile available');
    return false;
  }
  
  if (profile.role === 'admin') {
    console.log('hasRole: Admin user, always has access');
    return true;
  }
  
  const hasRoleResult = profile.role === role;
  console.log('hasRole check:', { userRole: profile.role, requiredRole: role, result: hasRoleResult });
  return hasRoleResult;
};

export const hasPermission = (profile: any, resource: string, action: string): boolean => {
  if (!profile || !profile.is_active) {
    console.log('hasPermission: No profile or inactive user');
    return false;
  }
  
  if (profile.role === 'admin') {
    console.log('hasPermission: Admin user, allowing access to', resource);
    return true;
  }
  
  const permissions = {
    manager: {
      funcionarios: ['read', 'create', 'update'],
      obras: ['read'], frota: ['read'], patrimonio: ['read'], financeiro: ['read'],
      exames: ['read', 'create', 'update'], cartaoponto: ['read', 'create', 'update'],
      rh: ['read', 'create', 'update'], configuracoes: ['read'],
      funcoes: ['read'], setores: ['read'], clinicas: ['read'], emails: ['read'],
      beneficios: ['read'], usuarios: ['read']
    },
    operator: {
      funcionarios: ['read'], obras: ['read'], frota: ['read'], patrimonio: ['read'],
      financeiro: ['read'], exames: ['read'], cartaoponto: ['read'], rh: ['read'],
      configuracoes: ['read'], funcoes: ['read'], setores: ['read'], clinicas: ['read'],
      emails: ['read'], beneficios: ['read'], usuarios: ['read']
    }
  };

  const rolePermissions = permissions[profile.role as keyof typeof permissions];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions];
  const hasPermissionResult = resourcePermissions ? resourcePermissions.includes(action) : false;
  
  console.log('hasPermission check:', { 
    userRole: profile.role, 
    resource, 
    action, 
    resourcePermissions, 
    result: hasPermissionResult 
  });
  
  return hasPermissionResult;
};
