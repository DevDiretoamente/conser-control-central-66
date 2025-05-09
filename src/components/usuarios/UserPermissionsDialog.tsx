
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { 
  User, 
  PermissionArea, 
  PermissionLevel, 
  Permission
} from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface UserPermissionsDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define permission groups and their areas
const permissionGroups = [
  {
    name: 'Módulos',
    areas: [
      { id: 'rh', label: 'Recursos Humanos' },
      { id: 'obras', label: 'Obras' },
      { id: 'frota', label: 'Frota' },
      { id: 'patrimonio', label: 'Patrimônio' },
      { id: 'financeiro', label: 'Financeiro' },
      { id: 'configuracoes', label: 'Configurações' },
    ]
  },
  {
    name: 'Recursos',
    areas: [
      { id: 'funcionarios', label: 'Funcionários' },
      { id: 'exames', label: 'Exames' },
      { id: 'documentos', label: 'Documentos' },
      { id: 'usuarios', label: 'Usuários' },
      { id: 'funcoes', label: 'Funções' },
      { id: 'setores', label: 'Setores' },
      { id: 'clinicas', label: 'Clínicas' },
    ]
  }
];

const permissionLevels: { id: PermissionLevel, label: string }[] = [
  { id: 'read', label: 'Visualizar' },
  { id: 'write', label: 'Editar' },
  { id: 'delete', label: 'Excluir' },
  { id: 'manage', label: 'Gerenciar' }
];

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({ 
  user, 
  isOpen, 
  onOpenChange 
}) => {
  const { updateUserPermissions } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>(user.permissions || []);
  const [savedPermissions, setSavedPermissions] = useState<Permission[]>(user.permissions || []);
  
  // Reset permissions when user changes
  useEffect(() => {
    setPermissions(user.permissions || []);
    setSavedPermissions(user.permissions || []);
  }, [user]);

  const hasPermission = (area: PermissionArea, level: PermissionLevel): boolean => {
    return permissions.some(p => p.area === area && p.level === level);
  };
  
  const getHighestPermissionLevel = (area: PermissionArea): PermissionLevel | null => {
    const areaPermissions = permissions.filter(p => p.area === area);
    if (areaPermissions.length === 0) return null;
    
    if (areaPermissions.some(p => p.level === 'manage')) return 'manage';
    if (areaPermissions.some(p => p.level === 'delete')) return 'delete';
    if (areaPermissions.some(p => p.level === 'write')) return 'write';
    if (areaPermissions.some(p => p.level === 'read')) return 'read';
    
    return null;
  };
  
  const togglePermission = (area: PermissionArea, level: PermissionLevel) => {
    setPermissions(prevPermissions => {
      const hasThisPermission = hasPermission(area, level);
      
      if (hasThisPermission) {
        // Remove this permission and any higher permissions
        return prevPermissions.filter(p => !(p.area === area && (
          p.level === level || 
          (level === 'read' && ['write', 'delete', 'manage'].includes(p.level)) ||
          (level === 'write' && ['delete', 'manage'].includes(p.level)) ||
          (level === 'delete' && p.level === 'manage')
        )));
      } else {
        // Add this permission and remove any lower permissions to avoid redundancy
        const newPermissions = prevPermissions.filter(p => !(p.area === area && (
          (level === 'write' && p.level === 'read') ||
          (level === 'delete' && ['read', 'write'].includes(p.level)) ||
          (level === 'manage' && ['read', 'write', 'delete'].includes(p.level))
        )));
        
        return [...newPermissions, { area, level }];
      }
    });
  };

  const handleSave = () => {
    updateUserPermissions(user.id, permissions);
    setSavedPermissions([...permissions]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setPermissions(savedPermissions);
    onOpenChange(false);
  };

  const handleSelectAll = (group: string) => {
    setPermissions(prevPermissions => {
      const groupAreas = permissionGroups.find(g => g.name === group)?.areas || [];
      const newPermissions = [...prevPermissions];
      
      groupAreas.forEach(area => {
        if (!hasPermission(area.id as PermissionArea, 'manage')) {
          newPermissions.push({ area: area.id as PermissionArea, level: 'manage' });
        }
      });
      
      return newPermissions;
    });
  };

  const handleClearAll = (group: string) => {
    setPermissions(prevPermissions => {
      const groupAreas = permissionGroups.find(g => g.name === group)?.areas || [];
      return prevPermissions.filter(p => !groupAreas.some(area => area.id === p.area));
    });
  };
  
  const totalPermissionCount = permissions.length;
  const hasChanges = JSON.stringify(permissions) !== JSON.stringify(savedPermissions);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Gerenciar Permissões - {user.name}</span>
            <Badge className="ml-2">{user.role === 'admin' ? 'Administrador' : 
              user.role === 'manager' ? 'Gerente' : 'Operador'}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="modules" className="h-full flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="modules">Por Módulo</TabsTrigger>
              <TabsTrigger value="matrix">Matriz de Permissões</TabsTrigger>
              <TabsTrigger value="summary">Resumo</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1">
              <TabsContent value="modules" className="mt-0 h-full">
                <div className="space-y-6">
                  {permissionGroups.map((group) => (
                    <Card key={group.name}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSelectAll(group.name)}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Selecionar Todos
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleClearAll(group.name)}
                            >
                              <ShieldX className="mr-2 h-4 w-4" />
                              Limpar Todos
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {group.areas.map((area) => (
                            <div key={area.id} className="border rounded-lg p-4">
                              <div className="font-medium mb-2">{area.label}</div>
                              <div className="grid grid-cols-2 gap-4">
                                {permissionLevels.map((level) => (
                                  <div key={`${area.id}-${level.id}`} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${area.id}-${level.id}`}
                                      checked={hasPermission(area.id as PermissionArea, level.id)}
                                      onCheckedChange={() => togglePermission(area.id as PermissionArea, level.id)}
                                    />
                                    <label
                                      htmlFor={`${area.id}-${level.id}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {level.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="matrix" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border bg-muted text-left">Área</th>
                            {permissionLevels.map(level => (
                              <th key={level.id} className="py-2 px-4 border bg-muted text-center">
                                {level.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {permissionGroups.flatMap(group => 
                            group.areas.map(area => (
                              <tr key={area.id}>
                                <td className="py-2 px-4 border">{area.label}</td>
                                {permissionLevels.map(level => (
                                  <td key={`${area.id}-${level.id}`} className="py-2 px-4 border text-center">
                                    <Checkbox
                                      id={`matrix-${area.id}-${level.id}`}
                                      checked={hasPermission(area.id as PermissionArea, level.id)}
                                      onCheckedChange={() => togglePermission(area.id as PermissionArea, level.id)}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="summary" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo de Permissões</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total de Permissões Concedidas:</span>
                        <Badge>{totalPermissionCount}</Badge>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Permissões por Área:</h4>
                        <ul className="space-y-2">
                          {permissionGroups.flatMap(group => 
                            group.areas.map(area => {
                              const level = getHighestPermissionLevel(area.id as PermissionArea);
                              if (!level) return null;
                              
                              const levelDisplay = permissionLevels.find(l => l.id === level)?.label || level;
                              
                              return (
                                <li key={area.id} className="flex justify-between">
                                  <span>{area.label}</span>
                                  <Badge variant={
                                    level === 'manage' ? 'default' :
                                    level === 'delete' ? 'destructive' :
                                    level === 'write' ? 'secondary' :
                                    'outline'
                                  }>
                                    {levelDisplay}
                                  </Badge>
                                </li>
                              );
                            })
                          ).filter(Boolean)}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              disabled={!hasChanges} 
              onClick={handleSave}
            >
              Salvar Permissões
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
