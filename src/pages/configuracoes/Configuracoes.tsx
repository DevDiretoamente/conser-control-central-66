
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, 
  Users, 
  UserCog, 
  Briefcase, 
  BadgeCheck, 
  Mail, 
  Settings, 
  BookMarked,
  Building,
  FileText,
  Stethoscope
} from 'lucide-react';

const ConfiguracoesPage = () => {
  const configItems = [
    {
      title: 'Funcionários',
      description: 'Configurações de funções, cargos e setores',
      icon: <Users className="h-5 w-5" />,
      children: [
        {
          title: 'Funções',
          description: 'Cadastro de funções e exigências',
          href: '#',
          icon: <Briefcase className="h-4 w-4" />
        },
        {
          title: 'Setores',
          description: 'Organização de funcionários em setores',
          href: '#',
          icon: <Building className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Documentos',
      description: 'Gerenciamento de documentação',
      icon: <FileText className="h-5 w-5" />,
      children: [
        {
          title: 'Documentos Ocupacionais',
          description: 'PCMSO, PGR e outros documentos',
          href: '/configuracoes/documentos-ocupacionais',
          icon: <BookMarked className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Saúde Ocupacional',
      description: 'Configurações de exames e clínicas',
      icon: <Stethoscope className="h-5 w-5" />,
      children: [
        {
          title: 'Clínicas Médicas',
          description: 'Cadastro de clínicas parceiras',
          href: '/configuracoes/clinicas',
          icon: <Building2 className="h-4 w-4" />
        },
        {
          title: 'Tipos de Exames',
          description: 'Cadastro de exames médicos',
          href: '#',
          icon: <BadgeCheck className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Sistema',
      description: 'Configurações do sistema',
      icon: <Settings className="h-5 w-5" />,
      children: [
        {
          title: 'Usuários',
          description: 'Gerenciamento de usuários e permissões',
          href: '#',
          icon: <UserCog className="h-4 w-4" />
        },
        {
          title: 'E-mails',
          description: 'Templates de e-mails e notificações',
          href: '#',
          icon: <Mail className="h-4 w-4" />
        }
      ]
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Configurações do Sistema</h1>
      
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="space-y-6 pr-4">
          {configItems.map((section, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-2">
                {section.icon}
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {section.children.map((item, j) => (
                  <Card key={j} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild className="w-full mt-4" variant="outline">
                        <Link to={item.href}>Acessar</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConfiguracoesPage;
