
import React from 'react';
import RealUserManagement from '@/components/usuarios/RealUserManagement';

const Usuarios = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários que têm acesso ao sistema
          </p>
        </div>
      </div>
      
      <RealUserManagement />
    </div>
  );
};

export default Usuarios;
