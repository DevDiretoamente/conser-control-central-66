import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CartaoPontoForm } from '@/components/rh/CartaoPontoForm';
import { CartaoPontoRelatorio } from '@/components/rh/CartaoPontoRelatorio';
import CartaoPontoImpressao from '@/components/rh/CartaoPontoImpressao';
import { Button } from '@/components/ui/button';
import { getCartaoPonto } from '@/services/cartaoPontoService';
import { CartaoPonto as CartaoPontoType } from '@/types/cartaoPonto';
import { useToast } from '@/components/ui/use-toast';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

const CartaoPontoPage: React.FC = () => {
  const { users, user, hasSpecificPermission } = useAuth();
  const [funcionarioId, setFuncionarioId] = useState<string>('');
  const [cartaoPonto, setCartaoPonto] = useState<CartaoPontoType | null>(null);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<string>('lancamento');
  const { toast } = useToast();
  
  const temPermissaoGerenciar = hasSpecificPermission('rh', 'manage');
  const temPermissaoEditar = hasSpecificPermission('rh', 'write');
  const temPermissaoCriar = hasSpecificPermission('rh', 'create');
  const temPermissaoVisualizar = hasSpecificPermission('rh', 'read');
  
  const podeVerRelatorios = temPermissaoGerenciar || temPermissaoVisualizar;
  
  // Carregar funcionários ativos
  const funcionarios = users.filter(u => u.isActive);

  // Carregar cartão ponto quando mudar funcionário, mês ou ano
  useEffect(() => {
    if (funcionarioId) {
      try {
        const cartao = getCartaoPonto(funcionarioId, mes, ano);
        setCartaoPonto(cartao);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar cartão ponto",
          description: "Não foi possível carregar os dados do cartão ponto.",
        });
      }
    }
  }, [funcionarioId, mes, ano, toast]);
  
  // Definir funcionário padrão (próprio usuário ou primeiro da lista)
  useEffect(() => {
    if (user && !funcionarioId) {
      // Se o usuário atual for um funcionário, selecionar ele mesmo
      if (funcionarios.find(f => f.id === user.id)) {
        setFuncionarioId(user.id);
      } 
      // Senão, selecionar o primeiro funcionário da lista
      else if (funcionarios.length > 0) {
        setFuncionarioId(funcionarios[0].id);
      }
    }
  }, [user, funcionarios, funcionarioId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cartão Ponto</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Cartão Ponto</CardTitle>
          <CardDescription>
            Registre e visualize os horários de trabalho dos funcionários
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="lancamento">Lançamento de Horas</TabsTrigger>
              {podeVerRelatorios && <TabsTrigger value="relatorio">Relatório</TabsTrigger>}
              <TabsTrigger value="impressao">Impressão</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lancamento">
              <CartaoPontoForm
                funcionarios={funcionarios}
                funcionarioSelecionadoId={funcionarioId}
                onChangeFuncionario={setFuncionarioId}
                cartaoPonto={cartaoPonto}
                onChangeCartaoPonto={setCartaoPonto}
                mes={mes}
                ano={ano}
                onChangeMes={setMes}
                onChangeAno={setAno}
                podeEditar={temPermissaoEditar || temPermissaoCriar}
                podeVerResumo={temPermissaoGerenciar}
              />
            </TabsContent>
            
            {podeVerRelatorios && (
              <TabsContent value="relatorio">
                <CartaoPontoRelatorio
                  funcionarios={funcionarios}
                  funcionarioSelecionadoId={funcionarioId}
                  onChangeFuncionario={setFuncionarioId}
                  cartaoPonto={cartaoPonto}
                  mes={mes}
                  ano={ano}
                  onChangeMes={setMes}
                  onChangeAno={setAno}
                />
              </TabsContent>
            )}
            
            <TabsContent value="impressao">
              <CartaoPontoImpressao
                funcionarios={funcionarios}
                funcionarioSelecionadoId={funcionarioId}
                onChangeFuncionario={setFuncionarioId}
                mes={mes}
                ano={ano}
                onChangeMes={setMes}
                onChangeAno={setAno}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('lancamento')}
          >
            Voltar
          </Button>
          
          {cartaoPonto && temPermissaoGerenciar && (
            <div className="flex gap-2 items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      disabled={cartaoPonto.fechado}
                      onClick={() => {/* Implementar fechamento */}}
                      className="flex items-center"
                    >
                      {cartaoPonto.fechado ? "Fechado" : "Fechar Período"}
                      <HelpCircle className="ml-1 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <p><strong>Fechar Período</strong>: Ao fechar o período, o cartão de ponto não poderá mais ser editado. Esta ação indica que todos os registros foram conferidos e estão corretos para o mês atual.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="default" 
                      disabled={cartaoPonto.validado || !cartaoPonto.fechado}
                      onClick={() => {/* Implementar validação */}}
                      className="flex items-center"
                    >
                      {cartaoPonto.validado ? "Validado" : "Validar"}
                      <HelpCircle className="ml-1 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4">
                    <p><strong>Validar</strong>: A validação é a etapa final do processo, realizada pelo RH ou gestor, confirmando que os dados foram revisados e aprovados. Somente cartões com período fechado podem ser validados.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CartaoPontoPage;
