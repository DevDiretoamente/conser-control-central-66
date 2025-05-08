
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';
import SetoresTab from './SetoresTab';

const SetoresPage = () => {
  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Setores</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Setores</h1>
      
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="pr-4">
          <SetoresTab />
        </div>
      </ScrollArea>
    </div>
  );
};

export default SetoresPage;
