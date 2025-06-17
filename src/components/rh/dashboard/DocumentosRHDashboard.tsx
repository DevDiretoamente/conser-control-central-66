
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Settings } from 'lucide-react';
import DocumentosRHMetrics from './DocumentosRHMetrics';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';

const DocumentosRHDashboard: React.FC = () => {
  const handleRefreshData = async () => {
    try {
      toast.info('Atualizando dados...');
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Regenerar notificações automáticas
      // notificationService.generateAutomaticNotifications([], [], []);
      
      toast.success('Dados atualizados com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados');
    }
  };

  const handleExportDashboard = () => {
    toast.info('Funcionalidade de exportação em desenvolvimento');
  };

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard - Documentos RH</h2>
          <p className="text-muted-foreground">
            Visão geral dos documentos e certificações dos funcionários
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportDashboard}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <DocumentosRHMetrics />

      {/* Alertas e Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Gerar Relatório Mensal
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Verificar Conformidade
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Atualizar Status Vencidos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enviar Lembretes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Última Atualização:</span>
              <span>{new Date().toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Usuário Logado:</span>
              <span>Usuário Admin</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Versão do Sistema:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Próxima Manutenção:</span>
              <span>Domingo, 02:00</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentosRHDashboard;
