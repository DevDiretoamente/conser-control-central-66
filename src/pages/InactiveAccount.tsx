
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Logo from '@/components/Logo';

const InactiveAccount: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="w-48 mx-auto mb-6">
          <Logo size="lg" />
        </div>
        
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Conta Inativa</h1>
          <p className="text-gray-600">
            Sua conta foi desativada. Por favor, entre em contato com um administrador para reativar sua conta.
          </p>
        </div>
        
        <div className="pt-4">
          <Button onClick={handleLogout} className="w-full">
            Voltar para o Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InactiveAccount;
