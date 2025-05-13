
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const EmailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configuracoes');
  const [sending, setSending] = useState(false);
  
  const handleSendTest = async () => {
    setSending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Email de teste enviado com sucesso!');
    } catch (error) {
      toast.error('Falha ao enviar email de teste.');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações de Email</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações de email do sistema e templates de notificações
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuracoes">Configurações SMTP</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Logs de Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Servidor SMTP</CardTitle>
              <CardDescription>
                Configure os detalhes do servidor SMTP para envio de emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input id="smtp-host" placeholder="smtp.exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input id="smtp-port" placeholder="587" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-email">Email</Label>
                  <Input id="smtp-email" placeholder="noreply@suaempresa.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Senha</Label>
                  <Input id="smtp-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-encryption">Criptografia</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger id="smtp-encryption">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-background">
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="none">Nenhuma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Nome do remetente</Label>
                  <Input id="sender-name" placeholder="Conserv Sistema" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="smtp-active" />
                <Label htmlFor="smtp-active">Ativar envio de emails</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button disabled={sending} onClick={handleSendTest}>
                  {sending ? "Enviando..." : "Enviar email de teste"}
                </Button>
                <Button>Salvar configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Email</CardTitle>
              <CardDescription>
                Personalize os templates de email enviados pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-select">Selecionar template</Label>
                <Select defaultValue="exame_proximo">
                  <SelectTrigger id="template-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-background">
                    <SelectItem value="exame_proximo">Próximo exame</SelectItem>
                    <SelectItem value="exame_vencido">Exame vencido</SelectItem>
                    <SelectItem value="epi_entregue">EPI entregue</SelectItem>
                    <SelectItem value="boas_vindas">Boas-vindas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-subject">Assunto</Label>
                <Input id="template-subject" defaultValue="Seu exame está próximo do vencimento" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-content">Conteúdo</Label>
                <Textarea 
                  id="template-content" 
                  rows={10}
                  defaultValue="Olá {{nome}},\n\nSeu exame {{tipo_exame}} está próximo do vencimento ({{data_vencimento}}).\n\nPor favor, entre em contato com o RH para agendar um novo exame.\n\nAtenciosamente,\nEquipe de RH"
                />
              </div>
              
              <div className="pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Variáveis disponíveis:</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => {}} className="h-7">{{nome}}</Button>
                  <Button variant="outline" size="sm" onClick={() => {}} className="h-7">{{tipo_exame}}</Button>
                  <Button variant="outline" size="sm" onClick={() => {}} className="h-7">{{data_vencimento}}</Button>
                  <Button variant="outline" size="sm" onClick={() => {}} className="h-7">{{data_realizacao}}</Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Restaurar padrão</Button>
                <Button>Salvar template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Email</CardTitle>
              <CardDescription>
                Histórico de emails enviados pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Data</th>
                      <th className="p-2 text-left font-medium">Destinatário</th>
                      <th className="p-2 text-left font-medium">Assunto</th>
                      <th className="p-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">13/05/2025 10:45</td>
                      <td className="p-2">joao.silva@email.com</td>
                      <td className="p-2">Seu exame está próximo do vencimento</td>
                      <td className="p-2"><span className="text-green-600">Enviado</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">12/05/2025 16:30</td>
                      <td className="p-2">maria.santos@email.com</td>
                      <td className="p-2">Novo EPI disponível para retirada</td>
                      <td className="p-2"><span className="text-green-600">Enviado</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">11/05/2025 09:15</td>
                      <td className="p-2">carlos.oliveira@email.com</td>
                      <td className="p-2">Exame vencido - Ação necessária</td>
                      <td className="p-2"><span className="text-red-600">Falha</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailsPage;
