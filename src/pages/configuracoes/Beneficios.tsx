
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';
import BeneficiosTab from './BeneficiosTab';

const BeneficiosPage = () => {
  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Benefícios</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Benefícios</h1>
      
      <div className="h-[calc(100vh-180px)] overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="pr-4 pb-6">
            <BeneficiosTab />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BeneficiosPage;
