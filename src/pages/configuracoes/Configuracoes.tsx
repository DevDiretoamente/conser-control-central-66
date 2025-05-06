
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

const ConfiguracoesPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configurações do sistema
        </p>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center justify-center p-8 rounded-full bg-muted">
          <Settings className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Módulo em Desenvolvimento</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          O módulo de Configurações está em desenvolvimento e será disponibilizado em breve.
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

export default ConfiguracoesPage;
