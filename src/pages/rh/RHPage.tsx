
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Stethoscope, FileText, BadgeCheck, Clock, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RHPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasSpecificPermission } = useAuth();

  const mostraTelas = {
    funcionarios: hasSpecificPermission('funcionarios', 'read'),
    exames: hasSpecificPermission('exames', 'read'),
    documentos: hasSpecificPermission('documentos', 'read'),
    certificacoes: hasSpecificPermission('documentos', 'read'),
    cartaoPonto: hasSpecificPermission('cartaoponto', 'read'),
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Recursos Humanos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cartão de Funcionários */}
        {mostraTelas.funcionarios && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Funcionários
              </CardTitle>
              <CardDescription>
                Gerenciamento de funcionários e dependentes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">
                Cadastro completo, documentos, dependentes e histórico profissional.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/funcionarios')}>
                Acessar Funcionários
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Cartão de Cartão Ponto */}
        {mostraTelas.cartaoPonto && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                Cartão Ponto
              </CardTitle>
              <CardDescription>
                Controle de jornada dos funcionários
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">
                Registros de ponto, horas trabalhadas e controle de jornada.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/rh/cartao-ponto')}>
                Acessar Cartão Ponto
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Cartão de Exames */}
        {mostraTelas.exames && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-green-600 dark:text-green-400" />
                Exames Médicos
              </CardTitle>
              <CardDescription>
                Controle de exames médicos ocupacionais
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">
                Agende, acompanhe e visualize os exames de todos os funcionários.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/funcionarios/exames')}>
                Acessar Exames
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Cartão de Documentos RH */}
        {mostraTelas.documentos && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                Documentos RH
              </CardTitle>
              <CardDescription>
                Gestão de documentos e contratos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">
                Centralize contratos, termos e documentos importantes dos funcionários.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/rh/documentos')}>
                Acessar Documentos
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Cartão de Certificações */}
        {mostraTelas.certificacoes && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-red-600 dark:text-red-400" />
                Certificações
              </CardTitle>
              <CardDescription>
                Controle de treinamentos e certificações
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm text-muted-foreground">
                Acompanhe certificações, treinamentos e qualificações dos funcionários.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/rh/certificacoes')}>
                Acessar Certificações
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Cartão de Relatórios */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Relatórios
            </CardTitle>
            <CardDescription>
              Relatórios para contabilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-2 text-sm text-muted-foreground">
              Gere relatórios de horas trabalhadas, vale refeição e outros.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/rh/relatorios')}>
              Acessar Relatórios
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RHPage;
