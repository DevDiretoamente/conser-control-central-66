import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Settings, Crown } from 'lucide-react';
import Logo from '@/components/Logo';

const PublicLanding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-64 mx-auto mb-8">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Gestão Empresarial
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Plataforma completa para gestão de funcionários, RH, obras e muito mais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Gestão de Funcionários</CardTitle>
                <CardDescription>
                  Controle completo de cadastros, documentos e informações dos colaboradores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Controle de Acesso</CardTitle>
                <CardDescription>
                  Sistema robusto de autenticação e controle de permissões por perfil
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Personalize o sistema conforme as necessidades da sua empresa
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/secure-login')}
                className="px-8"
              >
                <Shield className="mr-2 h-5 w-5" />
                Acessar Sistema
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/master-admin-setup')}
                className="px-8"
              >
                <Crown className="mr-2 h-5 w-5" />
                Setup Inicial (Master Admin)
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Primeira vez? Use "Setup Inicial" para criar o administrador master do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;
