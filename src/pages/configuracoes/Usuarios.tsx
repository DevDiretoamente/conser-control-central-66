
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import GerenciamentoUsuarios from '@/components/usuarios/GerenciamentoUsuarios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const UsuariosPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Usuários</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
      
      {isAdmin ? (
        <GerenciamentoUsuarios />
      ) : (
        <div className="mb-6">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-amber-700">
                <Shield className="h-5 w-5" />
                <p className="font-medium">Apenas administradores podem gerenciar usuários do sistema</p>
              </div>
              <p className="mt-2 text-amber-600 text-sm">
                Você pode visualizar os usuários, mas precisa ser administrador para criar, editar ou excluir usuários.
              </p>
            </CardContent>
          </Card>
          <div className="mt-6">
            <GerenciamentoUsuarios />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
