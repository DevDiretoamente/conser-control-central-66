
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RobustLogo from '@/components/RobustLogo';

const SimpleLanding: React.FC = () => {
  const navigate = useNavigate();

  console.log('SimpleLanding - Rendered');

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <RobustLogo size="md" />
          <Button onClick={() => navigate('/login')}>
            Fazer Login
          </Button>
        </header>

        {/* Main Content */}
        <main className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Sistema de Gestão Empresarial
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Solução completa para gestão de funcionários, obras e recursos.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="px-8 py-3"
          >
            Acessar Sistema
          </Button>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-500">
          <p>© 2024 CONSERVIAS - Sistema de Gestão</p>
        </footer>
      </div>
    </div>
  );
};

export default SimpleLanding;
