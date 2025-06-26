
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Crown } from 'lucide-react';
import Logo from '@/components/Logo';

const PublicLanding: React.FC = () => {
  const navigate = useNavigate();

  console.log('PublicLanding: Rendered');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Simplificado */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="w-40">
            <Logo />
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/secure-login')} variant="default">
              <Shield className="mr-2 h-4 w-4" />
              Fazer Login
            </Button>
            <Button onClick={() => navigate('/master-admin-setup')} variant="outline">
              <Crown className="mr-2 h-4 w-4" />
              Configurar Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal Simplificado */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Sistema de Gestão
            <span className="text-primary block">Empresarial</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Solução completa para gestão de funcionários, obras, frota e recursos humanos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/secure-login')}
              className="px-8 py-3 text-lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Acessar Sistema
            </Button>
          </div>
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
