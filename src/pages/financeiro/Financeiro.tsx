
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const FinanceiroPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">
            Gestão de contas a pagar e receber
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center justify-center p-8 rounded-full bg-muted">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Módulo em Desenvolvimento</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          O módulo Financeiro está em desenvolvimento e será disponibilizado em breve.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => toast.info("Funcionalidade em desenvolvimento")}
        >
          Solicitar Notificação
        </Button>
      </div>
    </div>
  );
};

export default FinanceiroPage;
