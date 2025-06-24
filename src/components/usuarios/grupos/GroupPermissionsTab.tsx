
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PermissionArea, PermissionLevel } from '@/types/auth';
import { useSecureAuth } from '@/contexts/SecureAuthContext';

interface GroupPermissionsTabProps {
  groupId: string;
  initialPermissions: { area: string; level: string }[];
  onPermissionsChange: (permissions: { area: string; level: string }[]) => void;
}

const permissionAreas: { id: PermissionArea; label: string }[] = [
  { id: 'rh', label: 'Recursos Humanos' },
  { id: 'obras', label: 'Obras' },
  { id: 'frota', label: 'Frota' },
  { id: 'patrimonio', label: 'Patrimônio' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'configuracoes', label: 'Configurações' },
  { id: 'funcionarios', label: 'Funcionários' },
  { id: 'exames', label: 'Exames' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'usuarios', label: 'Usuários' },
  { id: 'funcoes', label: 'Funções' },
  { id: 'setores', label: 'Setores' },
  { id: 'clinicas', label: 'Clínicas' },
];

const permissionLevels: { id: PermissionLevel; label: string }[] = [
  { id: 'read', label: 'Visualizar' },
  { id: 'create', label: 'Criar' },
  { id: 'write', label: 'Editar' },
  { id: 'delete', label: 'Excluir' },
  { id: 'manage', label: 'Gerenciar' },
];

const GroupPermissionsTab: React.FC<GroupPermissionsTabProps> = ({ 
  groupId, 
  initialPermissions, 
  onPermissionsChange 
}) => {
  const [permissions, setPermissions] = useState(initialPermissions);

  useEffect(() => {
    setPermissions(initialPermissions);
  }, [initialPermissions]);

  const handlePermissionChange = (area: string, level: string, checked: boolean) => {
    const permission = { area, level };
    let newPermissions = [...permissions];

    if (checked) {
      newPermissions = [...newPermissions, permission];
    } else {
      newPermissions = newPermissions.filter(
        (p) => !(p.area === area && p.level === level)
      );
    }

    setPermissions(newPermissions);
    onPermissionsChange(newPermissions);
  };

  const hasPermission = (area: string, level: string): boolean => {
    return permissions.some((p) => p.area === area && p.level === level);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <ScrollArea className="h-[50vh] w-full">
          <div className="grid gap-4">
            {permissionAreas.map((area) => (
              <div key={area.id} className="space-y-2">
                <h4 className="text-sm font-medium">{area.label}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {permissionLevels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${area.id}-${level.id}`}
                        checked={hasPermission(area.id, level.id)}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(area.id, level.id, checked === true)
                        }
                      />
                      <Label htmlFor={`${area.id}-${level.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GroupPermissionsTab;
