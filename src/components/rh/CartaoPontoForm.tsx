
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  CartaoPonto, 
  RegistroPonto, 
  StatusDia,
  formatarMinutosParaHora,
  calcularResumoHoras
} from '@/types/cartaoPonto';
import { salvarRegistroPonto } from '@/services/cartaoPontoService';
import { User } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface CartaoPontoFormProps {
  funcionarios: User[];
  funcionarioSelecionadoId: string;
  onChangeFuncionario: (id: string) => void;
  cartaoPonto: CartaoPonto | null;
  onChangeCartaoPonto: (cartao: CartaoPonto) => void;
  mes: number;
  ano: number;
  onChangeMes: (mes: number) => void;
  onChangeAno: (ano: number) => void;
  podeEditar: boolean;
  podeVerResumo: boolean;
}

export const CartaoPontoForm: React.FC<CartaoPontoFormProps> = ({
  funcionarios,
  funcionarioSelecionadoId,
  onChangeFuncionario,
  cartaoPonto,
  onChangeCartaoPonto,
  mes,
  ano,
  onChangeMes,
  onChangeAno,
  podeEditar,
  podeVerResumo
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [editandoRegistroId, setEditandoRegistroId] = useState<string | null>(null);
  const [registroTemp, setRegistroTemp] = useState<Partial<RegistroPonto>>({});
  
  const funcionarioSelecionado = funcionarios.find(f => f.id === funcionarioSelecionadoId);
  
  const meses = [
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' }
  ];
  
  // Gerar anos para seleção (do ano atual - 2 até ano atual + 1)
  const anoAtual = new Date().getFullYear();
  const anos = [anoAtual - 2, anoAtual - 1, anoAtual, anoAtual + 1];
  
  // Lista de status para seleção
  const statusOptions: { valor: StatusDia, nome: string }[] = [
    { valor: 'normal', nome: 'Normal' },
    { valor: 'falta_injustificada', nome: 'Falta Injustificada' },
    { valor: 'falta_justificada', nome: 'Falta Justificada' },
    { valor: 'atestado', nome: 'Atestado' },
    { valor: 'ferias', nome: 'Férias' },
    { valor: 'dispensado', nome: 'Dispensado' },
    { valor: 'feriado', nome: 'Feriado' },
    { valor: 'folga', nome: 'Folga' }
  ];
  
  const iniciarEdicao = (registro: RegistroPonto) => {
    // Verificar se o registro está bloqueado
    if (registro.bloqueado) {
      toast({
        variant: "destructive",
        title: "Registro bloqueado",
        description: "Este registro tem mais de 24 horas e não pode ser editado.",
      });
      return;
    }
    
    setEditandoRegistroId(registro.id);
    setRegistroTemp({
      horaEntradaManha: registro.horaEntradaManha || '',
      entradaExtra: registro.entradaExtra || '',
      horaSaidaAlmoco: registro.horaSaidaAlmoco || '',
      horaRetornoAlmoco: registro.horaRetornoAlmoco || '',
      horaSaidaTarde: registro.horaSaidaTarde || '',
      horaSaidaExtra: registro.horaSaidaExtra || '',
      statusDia: registro.statusDia,
      observacoes: registro.observacoes || ''
    });
  };
  
  const cancelarEdicao = () => {
    setEditandoRegistroId(null);
    setRegistroTemp({});
  };
  
  const salvarEdicao = async (registro: RegistroPonto) => {
    if (!user) return;
    
    try {
      // Validação básica de horários
      const { entradaExtra, horaEntradaManha, horaSaidaAlmoco, horaRetornoAlmoco, horaSaidaTarde, horaSaidaExtra } = registroTemp;
      
      if (registroTemp.statusDia === 'normal') {
        // Se for dia normal, validar entrada e saída
        if (!horaEntradaManha || !horaSaidaTarde) {
          toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Entrada e saída são obrigatórios para dias normais.",
          });
          return;
        }
      }
      
      const registroAtualizado = await salvarRegistroPonto(
        cartaoPonto?.id || '', 
        registro.id || '', 
        registroTemp,
        user
      );
      
      if (registroAtualizado && cartaoPonto) {
        // Atualizar o registro na lista
        const registrosAtualizados = cartaoPonto.registros.map(r => 
          r.id === registroAtualizado.id ? registroAtualizado : r
        );
        
        const cartaoAtualizado = {
          ...cartaoPonto,
          registros: registrosAtualizados
        };
        
        onChangeCartaoPonto(cartaoAtualizado);
        
        toast({
          title: "Registro salvo",
          description: `Registro do dia ${new Date(registro.data).getDate()} salvo com sucesso.`,
        });
      }
      
      cancelarEdicao();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o registro.",
      });
    }
  };
  
  // Função para formatar a data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.getDate().toString().padStart(2, '0');
  };
  
  // Função para determinar o dia da semana
  const diaDaSemana = (dataString: string) => {
    const data = new Date(dataString);
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias[data.getDay()];
  };
  
  // Status colorido
  const renderStatusBadge = (status: StatusDia) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
    
    switch(status) {
      case 'normal':
        variant = 'default';
        break;
      case 'falta_injustificada':
        variant = 'destructive';
        break;
      case 'falta_justificada':
      case 'atestado':
        variant = 'secondary';
        break;
      case 'ferias':
      case 'folga':
      case 'dispensado':
      case 'feriado':
        variant = 'outline';
        break;
    }
    
    const label = statusOptions.find(opt => opt.valor === status)?.nome || status;
    
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <Select 
            value={funcionarioSelecionadoId} 
            onValueChange={(value) => onChangeFuncionario(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {funcionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id}>
                  {funcionario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/3">
          <Select 
            value={mes.toString()} 
            onValueChange={(value) => onChangeMes(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {meses.map((mes) => (
                <SelectItem key={mes.valor} value={mes.valor.toString()}>
                  {mes.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/3">
          <Select 
            value={ano.toString()} 
            onValueChange={(value) => onChangeAno(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {anos.map((ano) => (
                <SelectItem key={ano} value={ano.toString()}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {funcionarioSelecionado && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Cartão Ponto: {funcionarioSelecionado.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {meses.find(m => m.valor === mes)?.nome} / {ano}
          </p>
        </div>
      )}
      
      {!podeEditar && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Modo de visualização</AlertTitle>
          <AlertDescription>
            Você não tem permissão para editar os registros de ponto.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.fechado && (
        <Alert className="mb-4" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Período fechado</AlertTitle>
          <AlertDescription>
            Este cartão ponto já foi fechado e não pode mais ser editado.
          </AlertDescription>
        </Alert>
      )}
      
      {cartaoPonto?.validado && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Período validado</AlertTitle>
          <AlertDescription>
            Este cartão ponto foi validado por {cartaoPonto.validadoPor} 
            em {new Date(cartaoPonto.dataValidacao || '').toLocaleString()}.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Dia</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Entrada Extra</TableHead>
              <TableHead className="text-center">Entrada</TableHead>
              <TableHead className="text-center">Saída Almoço</TableHead>
              <TableHead className="text-center">Retorno Almoço</TableHead>
              <TableHead className="text-center">Saída</TableHead>
              <TableHead className="text-center">Saída Extra</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartaoPonto?.registros
              .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
              .map((registro) => (
                <TableRow 
                  key={registro.id}
                  className={
                    registro.bloqueado 
                      ? 'bg-muted/40'
                      : registro.statusDia === 'folga' || registro.statusDia === 'feriado'
                      ? 'bg-muted/20'
                      : ''
                  }
                >
                  {editandoRegistroId === registro.id ? (
                    // Modo de edição
                    <>
                      <TableCell className="font-medium">
                        {formatarData(registro.data)}<br/>
                        <span className="text-xs text-muted-foreground">
                          {diaDaSemana(registro.data)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={registroTemp.statusDia || registro.statusDia} 
                          onValueChange={(value: StatusDia) => setRegistroTemp({...registroTemp, statusDia: value})}
                          disabled={!podeEditar || cartaoPonto?.fechado}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.valor} value={status.valor}>
                                {status.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="time"
                          value={registroTemp.entradaExtra || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, entradaExtra: e.target.value})}
                          disabled={!podeEditar || registroTemp.statusDia !== 'normal' || cartaoPonto?.fechado}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="time"
                          value={registroTemp.horaEntradaManha || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaEntradaManha: e.target.value})}
                          disabled={!podeEditar || registroTemp.statusDia !== 'normal' || cartaoPonto?.fechado}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="time"
                          value={registroTemp.horaSaidaAlmoco || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaAlmoco: e.target.value})}
                          disabled={!podeEditar || registroTemp.statusDia !== 'normal' || cartaoPonto?.fechado}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="time"
                          value={registroTemp.horaRetornoAlmoco || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaRetornoAlmoco: e.target.value})}
                          disabled={!podeEditar || registroTemp.statusDia !== 'normal' || cartaoPonto?.fechado}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="time"
                          value={registroTemp.horaSaidaTarde || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaTarde: e.target.value})}
                          disabled={!podeEditar || registroTemp.statusDia !== 'normal' || cartaoPonto?.fechado}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="time"
                          value={registroTemp.horaSaidaExtra || ''}
                          onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaExtra: e.target.value})}
                          disabled={!podeEditar || registroTemp.statusDia !== 'normal' || cartaoPonto?.fechado}
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={cancelarEdicao}>
                            Cancelar
                          </Button>
                          <Button size="sm" onClick={() => salvarEdicao(registro)}>
                            Salvar
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    // Modo de visualização
                    <>
                      <TableCell className="font-medium">
                        {formatarData(registro.data)}<br/>
                        <span className="text-xs text-muted-foreground">
                          {diaDaSemana(registro.data)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(registro.statusDia)}
                      </TableCell>
                      <TableCell className="text-center">{registro.entradaExtra || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaEntradaManha || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaSaidaAlmoco || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaRetornoAlmoco || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaSaidaTarde || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaSaidaExtra || '-'}</TableCell>
                      <TableCell className="text-right">
                        {podeEditar && !cartaoPonto?.fechado && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => iniciarEdicao(registro)}
                            disabled={registro.bloqueado}
                          >
                            Editar
                          </Button>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      
      {podeVerResumo && cartaoPonto && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumo de Horas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium">Horas normais</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasNormais)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas extras (50%)</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras50)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas extras (80%)</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras80)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas extras domingo/feriado (110%)</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasExtras110)}</p>
              </div>
              <div>
                <h3 className="font-medium">Horas noturnas</h3>
                <p className="text-xl">{formatarMinutosParaHora(cartaoPonto.totalHorasNoturno)}</p>
              </div>
              <div>
                <h3 className="font-medium">Quantidade de lanches</h3>
                <p className="text-xl">{cartaoPonto.totalLanches} ({cartaoPonto.totalLanches * 5} reais)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
