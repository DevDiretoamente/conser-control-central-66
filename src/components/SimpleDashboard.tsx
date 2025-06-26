
import React from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Button } from '@/components/ui/button';
import RobustLogo from '@/components/RobustLogo';

const SimpleDashboard: React.FC = () => {
  const { user, signOut } = useSimpleAuth();

  console.log('SimpleDashboard - Rendered for user:', user?.email);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <RobustLogo size="sm" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Olá, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Bem-vindo ao sistema de gestão empresarial!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Funcionários</h3>
              <p className="text-blue-700">Gestão de pessoal</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Obras</h3>
              <p className="text-green-700">Controle de projetos</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Frota</h3>
              <p className="text-purple-700">Gestão de veículos</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimpleDashboard;
