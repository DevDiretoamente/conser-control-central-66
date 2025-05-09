
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
import { Shield, ShieldCheck, ShieldX, Info, Search } from 'lucide-react';
import { 
  User, 
  PermissionArea, 
  PermissionLevel, 
  Permission
} from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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

const permissionLevels: { id: PermissionLevel, label: string, description: string }[] = [
  { id: 'read', label: 'Visualizar', description: 'Permite visualizar informações' },
  { id: 'create', label: 'Incluir', description: 'Permite adicionar novas informações' },
  { id: 'write', label: 'Editar', description: 'Permite editar informações existentes' },
  { id: 'delete', label: 'Excluir', description: 'Permite remover informações' },
  { id: 'manage', label: 'Gerenciar', description: 'Controle completo sobre esta área' }
];

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({ 
  user, 
  isOpen, 
  onOpenChange 
}) => {
  const { updateUserPermissions } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>(user.permissions || []);
  const [savedPermissions, setSavedPermissions] = useState<Permission[]>(user.permissions || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreaTooltip, setSelectedAreaTooltip] = useState<string | null>(null);
  
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
    if (areaPermissions.some(p => p.level === 'create')) return 'create';
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
          (level === 'read' && ['create', 'write', 'delete', 'manage'].includes(p.level)) ||
          (level === 'create' && ['write', 'delete', 'manage'].includes(p.level)) ||
          (level === 'write' && ['delete', 'manage'].includes(p.level)) ||
          (level === 'delete' && p.level === 'manage')
        )));
      } else {
        // Add this permission and remove any lower permissions to avoid redundancy
        const newPermissions = prevPermissions.filter(p => !(p.area === area && (
          (level === 'create' && p.level === 'read') ||
          (level === 'write' && ['read', 'create'].includes(p.level)) ||
          (level === 'delete' && ['read', 'create', 'write'].includes(p.level)) ||
          (level === 'manage' && ['read', 'create', 'write', 'delete'].includes(p.level))
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
  
  // Filter areas based on search term
  const getFilteredAreas = (group: typeof permissionGroups[0]) => {
    if (!searchTerm) return group.areas;
    
    return group.areas.filter(area => 
      area.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleMouseEnterArea = (areaId: string) => {
    setSelectedAreaTooltip(areaId);
  };

  const handleMouseLeaveArea = () => {
    setSelectedAreaTooltip(null);
  };
  
  const totalPermissionCount = permissions.length;
  const hasChanges = JSON.stringify(permissions) !== JSON.stringify(savedPermissions);

  // Get the description for an area based on its highest permission level
  const getAreaPermissionDescription = (area: PermissionArea) => {
    const highestLevel = getHighestPermissionLevel(area);
    if (!highestLevel) return 'Sem acesso';
    
    const levelInfo = permissionLevels.find(l => l.id === highestLevel);
    return levelInfo ? levelInfo.description : 'Permissão desconhecida';
  };

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
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar área..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <TabsContent value="modules" className="mt-0 h-full">
                <div className="space-y-6">
                  {permissionGroups.map((group) => (
                    <Card key={group.name} className={getFilteredAreas(group).length === 0 ? 'hidden' : ''}>
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
                          {getFilteredAreas(group).map((area) => (
                            <div 
                              key={area.id} 
                              className="border rounded-lg p-4 transition-all hover:shadow-md"
                              onMouseEnter={() => handleMouseEnterArea(area.id)}
                              onMouseLeave={handleMouseLeaveArea}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="font-medium">{area.label}</div>
                                {getHighestPermissionLevel(area.id as PermissionArea) && (
                                  <Badge variant={
                                    getHighestPermissionLevel(area.id as PermissionArea) === 'manage' ? 'default' :
                                    getHighestPermissionLevel(area.id as PermissionArea) === 'delete' ? 'destructive' :
                                    getHighestPermissionLevel(area.id as PermissionArea) === 'write' ? 'secondary' :
                                    getHighestPermissionLevel(area.id as PermissionArea) === 'create' ? 'outline' :
                                    'outline'
                                  }>
                                    {permissionLevels.find(l => l.id === getHighestPermissionLevel(area.id as PermissionArea))?.label || 'Desconhecido'}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mb-3">
                                {getAreaPermissionDescription(area.id as PermissionArea)}
                              </div>
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
                            getFilteredAreas(group).map(area => (
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
                        <h4 className="font-medium mb-4">Permissões por Área:</h4>
                        <div className="space-y-2">
                          {permissionGroups.map(group => (
                            <div key={group.name} className="mb-4">
                              <h5 className="text-sm font-medium text-muted-foreground mb-2">{group.name}</h5>
                              <ul className="space-y-2">
                                {group.areas.map(area => {
                                  const level = getHighestPermissionLevel(area.id as PermissionArea);
                                  if (!level && !searchTerm) return null;
                                  if (searchTerm && !area.label.toLowerCase().includes(searchTerm.toLowerCase())) return null;
                                  
                                  const levelDisplay = permissionLevels.find(l => l.id === level)?.label || 'Sem acesso';
                                  
                                  return (
                                    <li key={area.id} className="flex justify-between items-center py-1 border-b last:border-0">
                                      <span>{area.label}</span>
                                      {level ? (
                                        <Badge variant={
                                          level === 'manage' ? 'default' :
                                          level === 'delete' ? 'destructive' :
                                          level === 'write' ? 'secondary' :
                                          level === 'create' ? 'outline' :
                                          'outline'
                                        }>
                                          {levelDisplay}
                                        </Badge>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">Sem acesso</span>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {hasChanges ? 
                <span className="flex items-center text-amber-500">
                  <Info className="h-4 w-4 mr-1" />
                  Há mudanças não salvas
                </span> : 
                <span>Nenhuma alteração pendente</span>
              }
            </div>
            <div className="flex gap-2">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
