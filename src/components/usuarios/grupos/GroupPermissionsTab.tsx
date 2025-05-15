
import React, { useState, useEffect } from 'react';
import { 
  UserGroup, 
  Permission, 
  PermissionArea, 
  PermissionLevel 
} from '@/types/auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldX, Info, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GroupPermissionsTabProps {
  group: UserGroup;
}

// Define permission groups and their areas (same as in UserPermissionsDialog)
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
      { id: 'cartaoponto', label: 'Cartão Ponto' },
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

const GroupPermissionsTab: React.FC<GroupPermissionsTabProps> = ({ group }) => {
  const { updateGroupPermissions } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>(group.permissions || []);
  const [savedPermissions, setSavedPermissions] = useState<Permission[]>(group.permissions || []);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reset permissions when group changes
  useEffect(() => {
    setPermissions(group.permissions || []);
    setSavedPermissions(group.permissions || []);
  }, [group]);

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
    updateGroupPermissions(group.id, permissions);
    setSavedPermissions([...permissions]);
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
  const getFilteredAreas = (groupData: typeof permissionGroups[0]) => {
    if (!searchTerm) return groupData.areas;
    
    return groupData.areas.filter(area => 
      area.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Permissões de Grupo</h3>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges}
        >
          Salvar Alterações
        </Button>
      </div>
      
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
      
      <ScrollArea className="h-[calc(70vh-200px)]">
        <Tabs defaultValue="modules">
          <TabsList className="w-full">
            <TabsTrigger value="modules" className="flex-1">Por Módulo</TabsTrigger>
            <TabsTrigger value="summary" className="flex-1">Resumo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-6 pt-4">
            {permissionGroups.map((groupData) => (
              <Card key={groupData.name} className={getFilteredAreas(groupData).length === 0 ? 'hidden' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{groupData.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectAll(groupData.name)}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Selecionar Todos
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleClearAll(groupData.name)}
                      >
                        <ShieldX className="mr-2 h-4 w-4" />
                        Limpar Todos
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFilteredAreas(groupData).map((area) => (
                      <div 
                        key={area.id} 
                        className="border rounded-lg p-4 transition-all hover:shadow-md"
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
          </TabsContent>
          
          <TabsContent value="summary" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Permissões do Grupo</CardTitle>
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
                      {permissionGroups.map(groupData => (
                        <div key={groupData.name} className="mb-4">
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">{groupData.name}</h5>
                          <ul className="space-y-2">
                            {groupData.areas.map(area => {
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
        </Tabs>
      </ScrollArea>
      
      {hasChanges && (
        <div className="flex justify-between items-center bg-amber-50 p-3 rounded-md border border-amber-200">
          <div className="flex items-center text-amber-700">
            <Info className="h-4 w-4 mr-2" />
            <span>Há alterações não salvas nas permissões</span>
          </div>
          <Button onClick={handleSave} size="sm">Salvar Alterações</Button>
        </div>
      )}
    </div>
  );
};

export default GroupPermissionsTab;
