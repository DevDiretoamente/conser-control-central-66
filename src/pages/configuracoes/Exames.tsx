
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';
import ExamesMedicosTab from './ExamesMedicosTab';

const ExamesPage = () => {
  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Exames Médicos</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Exames Médicos</h1>
      
      <div className="h-[calc(100vh-180px)] overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="pr-4 pb-6">
            <ExamesMedicosTab />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ExamesPage;
