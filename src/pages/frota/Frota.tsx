import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, AlertTriangle, Calendar, PlusCircle, Fuel, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const FrotaPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Frota</h1>
          <p className="text-muted-foreground">
            Gerencie veículos, equipamentos e manutenções
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">8</div>
              <Truck className="h-6 w-6 text-conserv-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Manutenções Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3</div>
              <Wrench className="h-6 w-6 text-conserv-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consumo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">7,5 km/l</div>
              <Fuel className="h-6 w-6 text-conserv-info" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documentos a Vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2</div>
              <Calendar className="h-6 w-6 text-conserv-danger" />
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-medium mb-4">Veículos e Equipamentos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Caminhão Basculante</CardTitle>
                <CardDescription>Placa: XYZ-1234</CardDescription>
              </div>
              <Badge className="bg-green-500">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="border-t border-b py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Marca/Modelo</p>
                <p className="font-medium">Mercedes-Benz 2729</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ano</p>
                <p className="font-medium">2020</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">Caminhão Pesado</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combustível</p>
                <p className="font-medium">Diesel</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center">
              <AlertTriangle className="h-4 w-4 text-conserv-warning mr-2" />
              <p className="text-sm text-muted-foreground">Manutenção preventiva agendada para 10/07/2023</p>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Retroescavadeira</CardTitle>
                <CardDescription>ID: RETRO-001</CardDescription>
              </div>
              <Badge className="bg-green-500">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="border-t border-b py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Marca/Modelo</p>
                <p className="font-medium">Caterpillar 416F</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ano</p>
                <p className="font-medium">2019</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">Máquina Pesada</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combustível</p>
                <p className="font-medium">Diesel</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center">
              <AlertTriangle className="h-4 w-4 text-conserv-danger mr-2" />
              <p className="text-sm text-muted-foreground">IPVA vence em 15 dias</p>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Carro Administrativo</CardTitle>
                <CardDescription>Placa: ABC-5678</CardDescription>
              </div>
              <Badge className="bg-yellow-500">Em Manutenção</Badge>
            </div>
          </CardHeader>
          <CardContent className="border-t border-b py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Marca/Modelo</p>
                <p className="font-medium">Toyota Corolla</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ano</p>
                <p className="font-medium">2021</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">Veículo Leve</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Combustível</p>
                <p className="font-medium">Flex</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t">
              <p className="text-sm text-muted-foreground">Motivo da manutenção: Revisão programada 30.000 km</p>
              <p className="text-sm text-muted-foreground">Previsão de retorno: 12/07/2023</p>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center justify-center p-8 rounded-full bg-muted">
          <Truck className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Em breve mais funcionalidades</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Estamos trabalhando para adicionar mais funcionalidades ao módulo de Frota.
        </p>
      </div>
    </div>
  );
};

export default FrotaPage;
