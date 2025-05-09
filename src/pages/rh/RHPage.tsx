
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Clock, FileText, ClipboardList } from 'lucide-react';

const RHPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recursos Humanos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Gerencie o cadastro de funcionários, dependentes e documentos.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/funcionarios">Acessar</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Cartão Ponto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Registre e acompanhe o registro de horas trabalhadas.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/rh/cartao-ponto">Acessar</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Exames Médicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Gerencie exames médicos ocupacionais dos funcionários.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/funcionarios/exames">Acessar</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Funções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Gerencie funções, cargos e departamentos da empresa.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/funcoes">Acessar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RHPage;
