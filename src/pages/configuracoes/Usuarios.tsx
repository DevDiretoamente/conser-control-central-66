
import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import GerenciamentoUsuarios from '@/components/usuarios/GerenciamentoUsuarios';
import GroupManagement from '@/components/usuarios/grupos/GroupManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UsuariosPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<string>("usuarios");

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
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="grupos">Grupos de Permissão</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usuarios">
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
        </TabsContent>
        
        <TabsContent value="grupos">
          {isAdmin ? (
            <GroupManagement />
          ) : (
            <div className="mb-6">
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Shield className="h-5 w-5" />
                    <p className="font-medium">Apenas administradores podem gerenciar grupos de permissão</p>
                  </div>
                  <p className="mt-2 text-amber-600 text-sm">
                    O gerenciamento de grupos de permissão é restrito a administradores do sistema.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsuariosPage;
