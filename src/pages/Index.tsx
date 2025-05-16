
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Truck, Building, FolderIcon, Briefcase } from 'lucide-react';

const Index = () => {
  const modules = [
    {
      title: 'Recursos Humanos',
      description: 'Gerenciamento de funcionários, exames médicos e documentos',
      icon: <Users className="h-6 w-6" />,
      link: '/funcionarios',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Financeiro',
      description: 'Gestão financeira, notas fiscais e centros de custo',
      icon: <FileText className="h-6 w-6" />,
      link: '/financeiro',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Frota',
      description: 'Controle de veículos, manutenções e documentos',
      icon: <Truck className="h-6 w-6" />,
      link: '/frota',
      color: 'bg-amber-100 text-amber-700'
    },
    {
      title: 'Obras',
      description: 'Gestão de obras, projetos e licitações',
      icon: <Building className="h-6 w-6" />,
      link: '/obras',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      title: 'Patrimônio',
      description: 'Controle de ativos, equipamentos e maquinários',
      icon: <Briefcase className="h-6 w-6" />,
      link: '/patrimonio',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Configurações',
      description: 'Configurações do sistema, usuários e permissões',
      icon: <FolderIcon className="h-6 w-6" />,
      link: '/configuracoes',
      color: 'bg-gray-100 text-gray-700'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Sistema de Gestão CONSERVIAS</h1>
        <p className="text-xl text-muted-foreground">
          Selecione um módulo para começar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-full ${module.color} flex items-center justify-center mb-3`}>
                {module.icon}
              </div>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to={module.link} className="w-full">
                <Button variant="outline" className="w-full">Acessar</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
