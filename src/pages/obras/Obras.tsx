
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Building, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const ObrasPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Obras</h1>
          <p className="text-muted-foreground">
            Gerencie licitações, contratos e obras em andamento
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Obra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Manutenção Rodovia SP-270</CardTitle>
                <CardDescription>Contrato #2023-045</CardDescription>
              </div>
              <Badge className="bg-green-500">Em andamento</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">DER-SP</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">R$ 1.200.000,00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Início</p>
                  <p className="font-medium">10/01/2023</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Término Previsto</p>
                  <p className="font-medium">15/12/2023</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Pavimentação Av. Principal</CardTitle>
                <CardDescription>Contrato #2023-038</CardDescription>
              </div>
              <Badge className="bg-green-500">Em andamento</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">Prefeitura Municipal</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">R$ 800.000,00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Início</p>
                  <p className="font-medium">05/05/2023</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Término Previsto</p>
                  <p className="font-medium">30/01/2024</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Manutenção de Pontes</CardTitle>
                <CardDescription>Licitação #2023-067</CardDescription>
              </div>
              <Badge className="bg-yellow-500">Licitação</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Órgão</p>
                  <p className="font-medium">DNIT</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Estimado</p>
                  <p className="font-medium">R$ 2.500.000,00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data do Edital</p>
                  <p className="font-medium">15/06/2023</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entrega da Proposta</p>
                  <p className="font-medium">30/07/2023</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center justify-center p-8 rounded-full bg-muted">
          <Building className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Em breve mais funcionalidades</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Estamos trabalhando para adicionar mais funcionalidades ao módulo de Obras.
        </p>
      </div>
    </div>
  );
};

export default ObrasPage;
