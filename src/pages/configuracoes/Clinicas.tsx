
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import GerenciamentoClinicas from '@/components/clinicas/GerenciamentoClinicas';

const ClinicasPage: React.FC = () => {
  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Clínicas</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Clínicas</h1>
      
      <GerenciamentoClinicas />
    </div>
  );
};

export default ClinicasPage;
