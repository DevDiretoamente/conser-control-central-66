
import React from 'react';
import { Settings, Building, Users, Truck, Briefcase, FileText, HardHat, Stethoscope, Boxes } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { useForm } from 'react-hook-form';
import DocumentosTab from './DocumentosTab';
import SetoresTab from './SetoresTab';
import EPIsTab from './EPIsTab';
import ExamesMedicosTab from './ExamesMedicosTab';
import FuncoesTab from './FuncoesTab';

const ConfiguracoesPage: React.FC = () => {
  const generalForm = useForm();
  const rhForm = useForm();
  const obrasForm = useForm();
  const frotaForm = useForm();
  const patrimonioForm = useForm();
  const financeiroForm = useForm();

  const saveSettings = (module: string) => {
    toast.success(`Configurações de ${module} salvas com sucesso!`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-12 gap-2">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="rh" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">RH</span>
          </TabsTrigger>
          <TabsTrigger value="obras" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden md:inline">Obras</span>
          </TabsTrigger>
          <TabsTrigger value="frota" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden md:inline">Frota</span>
          </TabsTrigger>
          <TabsTrigger value="patrimonio" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden md:inline">Patrimônio</span>
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Financeiro</span>
          </TabsTrigger>
          <TabsTrigger value="setores" className="flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            <span className="hidden md:inline">Setores</span>
          </TabsTrigger>
          <TabsTrigger value="funcoes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Funções</span>
          </TabsTrigger>
          <TabsTrigger value="epis" className="flex items-center gap-2">
            <HardHat className="h-4 w-4" />
            <span className="hidden md:inline">EPIs</span>
          </TabsTrigger>
          <TabsTrigger value="exames" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden md:inline">Exames</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Documentos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Personalize as configurações gerais do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...generalForm}>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <Input defaultValue="CONSERVIAS TRANSPORTES E PAVIMENTAÇÃO LTDA" />
                    <FormDescription>
                      Nome que será exibido nos relatórios e documentos.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Email para Notificações</FormLabel>
                    <Input type="email" defaultValue="admin@conservias.com" />
                    <FormDescription>
                      Email principal para receber notificações do sistema.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <Menubar>
                      <MenubarMenu>
                        <MenubarTrigger className="w-full justify-start">Padrão</MenubarTrigger>
                        <MenubarContent>
                          <MenubarItem>Padrão</MenubarItem>
                          <MenubarItem>Escuro</MenubarItem>
                          <MenubarItem>Claro</MenubarItem>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                    <FormDescription>
                      Escolha o tema visual do sistema.
                    </FormDescription>
                  </FormItem>
                </div>
                
                <Button onClick={() => saveSettings('Geral')} className="mt-4">Salvar Configurações</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rh">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Recursos Humanos</CardTitle>
              <CardDescription>
                Personalize as configurações do módulo de RH.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...rhForm}>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Valor do Vale Refeição</FormLabel>
                    <Input type="number" defaultValue="450" />
                    <FormDescription>
                      Valor mensal do vale refeição em reais.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Valor do Lanche</FormLabel>
                    <Input type="number" defaultValue="5" />
                    <FormDescription>
                      Valor do lanche diário em reais.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Dias de Antecedência para Alerta de ASO</FormLabel>
                    <Input type="number" defaultValue="30" />
                    <FormDescription>
                      Quantos dias antes do vencimento o sistema deve alertar sobre ASOs.
                    </FormDescription>
                  </FormItem>
                </div>
                
                <Button onClick={() => saveSettings('RH')} className="mt-4">Salvar Configurações</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="obras">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Obras</CardTitle>
              <CardDescription>
                Personalize as configurações do módulo de Obras.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...obrasForm}>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Dias de Antecedência para Alerta de Término de Obra</FormLabel>
                    <Input type="number" defaultValue="15" />
                    <FormDescription>
                      Quantos dias antes do prazo final o sistema deve alertar sobre obras a vencer.
                    </FormDescription>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Percentual Mínimo de Progresso Esperado</FormLabel>
                    <Input type="number" defaultValue="90" />
                    <FormDescription>
                      Percentual mínimo esperado ao se aproximar da data de conclusão.
                    </FormDescription>
                  </FormItem>
                </div>
                
                <Button onClick={() => saveSettings('Obras')} className="mt-4">Salvar Configurações</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frota">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Frota</CardTitle>
              <CardDescription>
                Personalize as configurações do módulo de Frota.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...frotaForm}>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Quilometragem para Revisão de Veículos Leves</FormLabel>
                    <Input type="number" defaultValue="10000" />
                    <FormDescription>
                      Quilometragem padrão para agendar revisões de veículos leves.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Quilometragem para Revisão de Veículos Pesados</FormLabel>
                    <Input type="number" defaultValue="15000" />
                    <FormDescription>
                      Quilometragem padrão para agendar revisões de veículos pesados.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Dias de Antecedência para Alerta de Documentos</FormLabel>
                    <Input type="number" defaultValue="30" />
                    <FormDescription>
                      Quantos dias antes do vencimento o sistema deve alertar sobre documentos de veículos.
                    </FormDescription>
                  </FormItem>
                </div>
                
                <Button onClick={() => saveSettings('Frota')} className="mt-4">Salvar Configurações</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patrimonio">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Patrimônio</CardTitle>
              <CardDescription>
                Personalize as configurações do módulo de Patrimônio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...patrimonioForm}>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Prefixo para Número de Plaqueta</FormLabel>
                    <Input defaultValue="CONSERV-" />
                    <FormDescription>
                      Prefixo usado para identificação de bens patrimoniais.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Responsável pela Gestão Patrimonial</FormLabel>
                    <Input defaultValue="Administrador" />
                    <FormDescription>
                      Responsável principal pela gestão de patrimônio.
                    </FormDescription>
                  </FormItem>
                </div>
                
                <Button onClick={() => saveSettings('Patrimônio')} className="mt-4">Salvar Configurações</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>
                Personalize as configurações do módulo Financeiro.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...financeiroForm}>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Dias de Antecedência para Alerta de Contas a Pagar</FormLabel>
                    <Input type="number" defaultValue="5" />
                    <FormDescription>
                      Quantos dias antes do vencimento o sistema deve alertar sobre contas a pagar.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Dias para Considerar Pagamento em Atraso</FormLabel>
                    <Input type="number" defaultValue="1" />
                    <FormDescription>
                      Após quantos dias do vencimento um pagamento é considerado em atraso.
                    </FormDescription>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Email para Relatórios Financeiros</FormLabel>
                    <Input type="email" defaultValue="financeiro@conservias.com" />
                    <FormDescription>
                      Email para envio de relatórios financeiros periódicos.
                    </FormDescription>
                  </FormItem>
                </div>
                
                <Button onClick={() => saveSettings('Financeiro')} className="mt-4">Salvar Configurações</Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setores">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Setores</CardTitle>
              <CardDescription>
                Cadastre e gerencie os setores da empresa para organização das funções.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SetoresTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funcoes">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Funções</CardTitle>
              <CardDescription>
                Cadastre e gerencie as funções da empresa, atribuindo EPIs e exames necessários conforme PGR/PCMSO.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FuncoesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="epis">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de EPIs</CardTitle>
              <CardDescription>
                Cadastre e gerencie os Equipamentos de Proteção Individual, com seus respectivos CAs e instruções.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EPIsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exames">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Exames Médicos</CardTitle>
              <CardDescription>
                Cadastre e gerencie os exames médicos conforme PCMSO, com suas instruções e periodicidade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExamesMedicosTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Modelos de Documentos</CardTitle>
              <CardDescription>
                Gerencie os modelos de documentos para impressão como declarações, termos e outros documentos para funcionários.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentosTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesPage;
