
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CartaoPontoForm } from '@/components/rh/CartaoPontoForm';
import { CartaoPontoRelatorio } from '@/components/rh/CartaoPontoRelatorio';
import CartaoPontoImpressao from '@/components/rh/CartaoPontoImpressao';
import { Button } from '@/components/ui/button';
import { getCartaoPonto } from '@/services/cartaoPontoService';
import { CartaoPonto as CartaoPontoType } from '@/types/cartaoPonto';
import { useToast } from '@/hooks/use-toast';
import { 
  HelpCircle, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const CartaoPontoPage: React.FC = () => {
  const { users, user, hasSpecificPermission } = useAuth();
  const [funcionarioId, setFuncionarioId] = useState<string>('');
  const [cartaoPonto, setCartaoPonto] = useState<CartaoPontoType | null>(null);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<string>('lancamento');
  const { toast } = useToast();
  
  const temPermissaoGerenciar = hasSpecificPermission('cartaoponto', 'manage');
  const temPermissaoEditar = hasSpecificPermission('cartaoponto', 'write');
  const temPermissaoCriar = hasSpecificPermission('cartaoponto', 'create');
  const temPermissaoVisualizar = hasSpecificPermission('cartaoponto', 'read');
  
  const podeVerRelatorios = temPermissaoGerenciar || temPermissaoVisualizar;
  
  // Filter ONLY active users with operator role (employees)
  const funcionariosAtivos = users.filter(u => u.isActive && u.role === 'operator');

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
  }, [funcionarioId, mes, ano]);
  
  // Definir funcionário padrão (próprio usuário ou primeiro da lista)
  useEffect(() => {
    if (funcionariosAtivos.length > 0 && !funcionarioId) {
      // Se o usuário atual é um funcionário, selecione-o
      const currentUser = funcionariosAtivos.find(f => f.id === user?.id);
      if (currentUser) {
        setFuncionarioId(currentUser.id);
      } else if (funcionariosAtivos.length > 0) {
        setFuncionarioId(funcionariosAtivos[0].id);
      }
    }
  }, [funcionariosAtivos, funcionarioId, user]);
  
  // Nomes dos meses para navegação
  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Navegação de mês
  const mesAnterior = () => {
    if (mes === 1) {
      setMes(12);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  };
  
  const proximoMes = () => {
    if (mes === 12) {
      setMes(1);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cartão Ponto</h1>
        
        {/* Navegação de mês/ano */}
        <div className="flex items-center space-x-4 bg-card shadow-sm rounded-lg border p-2">
          <Button
            variant="ghost" 
            size="icon"
            onClick={mesAnterior}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium">
              {mesesNomes[mes-1]} {ano}
            </span>
          </div>
          
          <Button
            variant="ghost" 
            size="icon"
            onClick={proximoMes}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Seleção de funcionário */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Selecione um Funcionário</CardTitle>
            {cartaoPonto?.fechado && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Período Fechado
                </span>
              </div>
            )}
            {cartaoPonto?.validado && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Validado
                </span>
              </div>
            )}
          </div>
          <CardDescription>
            Escolha um funcionário para visualizar ou registrar o cartão ponto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={funcionarioId} 
            onValueChange={setFuncionarioId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {funcionariosAtivos.length > 0 ? (
                funcionariosAtivos.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.id}>
                    {funcionario.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no_employees" disabled>
                  Nenhum funcionário disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {/* Conteúdo principal */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="lancamento">Lançamento de Horas</TabsTrigger>
              {podeVerRelatorios && <TabsTrigger value="relatorio">Relatório</TabsTrigger>}
              <TabsTrigger value="impressao">Impressão</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lancamento">
              <CartaoPontoForm
                funcionarios={funcionariosAtivos}
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
                  funcionarios={funcionariosAtivos}
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
                funcionarios={funcionariosAtivos}
                funcionarioSelecionadoId={funcionarioId}
                onChangeFuncionario={setFuncionarioId}
                mes={mes}
                ano={ano}
                onChangeMes={setMes}
                onChangeAno={setAno}
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
        
        <CardFooter className="flex justify-between border-t pt-6">
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
