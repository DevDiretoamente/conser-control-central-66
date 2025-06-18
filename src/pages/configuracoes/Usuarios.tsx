
import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import RealUserManagement from '@/components/usuarios/RealUserManagement';
import GroupManagement from '@/components/usuarios/grupos/GroupManagement';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UsuariosPage: React.FC = () => {
  const { profile } = useSecureAuth();
  const isAdmin = profile?.role === 'admin';
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
          {isAdmin && <TabsTrigger value="grupos">Grupos de Permissão</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="usuarios">
          {isAdmin ? (
            <RealUserManagement />
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
                <RealUserManagement />
              </div>
            </div>
          )}
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="grupos">
            <GroupManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UsuariosPage;
