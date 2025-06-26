
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Truck, FileText, Calculator, Settings, Shield, Crown } from 'lucide-react';
import Logo from '@/components/Logo';
import { Loader2 } from 'lucide-react';

const PublicLanding: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkFirstTimeSetup } = useSecureAuth();
  const [isCheckingSetup, setIsCheckingSetup] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSetup = async () => {
      try {
        console.log('PublicLanding: Checking setup...', { isAuthenticated, isLoading });
        
        // Se já está autenticado e não está carregando, redireciona
        if (isAuthenticated && !isLoading) {
          console.log('PublicLanding: User authenticated, redirecting to app');
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 100);
          return;
        }

        // Se não está carregando e não está autenticado, verifica primeiro acesso
        if (!isLoading && !isAuthenticated) {
          setIsCheckingSetup(true);
          const firstTime = await checkFirstTimeSetup();
          console.log('PublicLanding: First time setup needed:', firstTime);
          
          if (mounted) {
            setIsFirstTime(firstTime);
            setIsCheckingSetup(false);
          }
        }
      } catch (error) {
        console.error('PublicLanding: Error checking setup:', error);
        if (mounted) {
          setIsFirstTime(true);
          setIsCheckingSetup(false);
        }
      }
    };

    // Só verificar se não está carregando
    if (!isLoading) {
      checkSetup();
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isLoading, navigate, checkFirstTimeSetup]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading || isCheckingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Users,
      title: 'Gestão de Funcionários',
      description: 'Controle completo de colaboradores, documentos e exames médicos'
    },
    {
      icon: Building2,
      title: 'Gestão de Obras',
      description: 'Acompanhamento de projetos, cronogramas e recursos'
    },
    {
      icon: Truck,
      title: 'Gestão de Frota',
      description: 'Controle de veículos, manutenções e documentação'
    },
    {
      icon: FileText,
      title: 'Recursos Humanos',
      description: 'Cartão ponto, documentos e relatórios de RH'
    },
    {
      icon: Calculator,
      title: 'Financeiro',
      description: 'Controle financeiro e contábil completo'
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Parametrizações e configurações do sistema'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="w-40">
            <Logo />
          </div>
          <div className="flex gap-4">
            {isFirstTime ? (
              <Button onClick={() => navigate('/master-admin-setup')} variant="default">
                <Crown className="mr-2 h-4 w-4" />
                Configurar Sistema
              </Button>
            ) : (
              <Button onClick={() => navigate('/secure-login')} variant="default">
                <Shield className="mr-2 h-4 w-4" />
                Acessar Sistema
              </Button>
            )}
            
            {/* Botões de emergência para debug */}
            <div className="flex gap-2 opacity-50">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/secure-login')}
              >
                Login
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/master-admin-setup')}
              >
                Setup
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Sistema de Gestão
            <span className="text-primary block">Empresarial</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Solução completa para gestão de funcionários, obras, frota e recursos humanos. 
            Controle total da sua empresa em uma única plataforma.
          </p>
          
          {isFirstTime ? (
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/master-admin-setup')}
                className="px-8 py-3 text-lg"
              >
                <Crown className="mr-2 h-5 w-5" />
                Configurar Sistema Agora
              </Button>
              <p className="text-sm text-slate-500">
                Primeira instalação - Configure o administrador principal
              </p>
            </div>
          ) : (
            <Button 
              size="lg" 
              onClick={() => navigate('/secure-login')}
              className="px-8 py-3 text-lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Acessar Sistema
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isFirstTime 
              ? "Configure o sistema agora e comece a gerenciar sua empresa de forma eficiente."
              : "Acesse o sistema e gerencie sua empresa de forma eficiente."
            }
          </p>
          {isFirstTime ? (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/master-admin-setup')}
              className="px-8 py-3 text-lg"
            >
              <Crown className="mr-2 h-5 w-5" />
              Configurar Agora
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/secure-login')}
              className="px-8 py-3 text-lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Fazer Login
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 Sistema de Gestão Empresarial. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
