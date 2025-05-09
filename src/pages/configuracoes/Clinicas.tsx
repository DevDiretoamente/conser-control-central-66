
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ClinicasPage: React.FC = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Módulo em desenvolvimento",
      description: "O módulo de gerenciamento de clínicas está em desenvolvimento."
    });
  }, []);

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
      
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="pr-4">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-medium mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-muted-foreground">
              O módulo de gerenciamento de clínicas está sendo implementado e estará disponível em breve.
            </p>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ClinicasPage;
