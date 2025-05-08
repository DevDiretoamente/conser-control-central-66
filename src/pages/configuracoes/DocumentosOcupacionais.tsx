
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import DocumentosOcupacionaisComponent from '@/components/documentos/DocumentosOcupacionais';
import { ScrollArea } from '@/components/ui/scroll-area';

const DocumentosOcupacionaisPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/configuracoes">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Documentos Ocupacionais</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/configuracoes')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Documentos Ocupacionais</h1>
        <p className="text-muted-foreground">
          Gerencie documentos como PCMSO, PGR e outros documentos ocupacionais
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)]">
        <DocumentosOcupacionaisComponent />
      </ScrollArea>
    </div>
  );
};

export default DocumentosOcupacionaisPage;
