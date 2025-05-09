
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  CartaoPonto,
  RegistroPonto,
  formatarMinutosParaHora,
  calcularResumoHoras,
  StatusDia
} from '@/types/cartaoPonto';
import { User } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface CartaoPontoRelatorioProps {
  funcionarios: User[];
  funcionarioSelecionadoId: string;
  onChangeFuncionario: (id: string) => void;
  cartaoPonto: CartaoPonto | null;
  mes: number;
  ano: number;
  onChangeMes: (mes: number) => void;
  onChangeAno: (ano: number) => void;
}

export const CartaoPontoRelatorio: React.FC<CartaoPontoRelatorioProps> = ({
  funcionarios,
  funcionarioSelecionadoId,
  onChangeFuncionario,
  cartaoPonto,
  mes,
  ano,
  onChangeMes,
  onChangeAno
}) => {
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
  
  // Função para renderizar status
  const renderStatus = (status: StatusDia) => {
    const statusMap: Record<StatusDia, string> = {
      'normal': 'Normal',
      'falta_injustificada': 'Falta Injustificada',
      'falta_justificada': 'Falta Justificada',
      'atestado': 'Atestado',
      'ferias': 'Férias',
      'dispensado': 'Dispensado',
      'feriado': 'Feriado',
      'folga': 'Folga'
    };
    
    return statusMap[status] || status;
  };
  
  // Relatório em PDF
  const gerarRelatorioPDF = () => {
    if (!cartaoPonto || !funcionarioSelecionado) return;
    
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(16);
    doc.text('Relatório de Cartão Ponto', 105, 15, { align: 'center' });
    
    // Informações do funcionário
    doc.setFontSize(12);
    doc.text(`Funcionário: ${funcionarioSelecionado.name}`, 14, 25);
    doc.text(`Período: ${meses.find(m => m.valor === mes)?.nome} / ${ano}`, 14, 32);
    
    // Status
    doc.text(`Status: ${cartaoPonto.validado ? 'Validado' : cartaoPonto.fechado ? 'Fechado' : 'Aberto'}`, 14, 39);
    if (cartaoPonto.validadoPor) {
      doc.text(`Validado por: ${cartaoPonto.validadoPor} em ${new Date(cartaoPonto.dataValidacao || '').toLocaleDateString()}`, 14, 46);
    }
    
    // Tabela de registros
    const registrosOrdenados = [...cartaoPonto.registros].sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );
    
    // Converter para formato de tabela do jsPDF-AutoTable
    const tableData = registrosOrdenados.map(r => [
      `${formatarData(r.data)} (${diaDaSemana(r.data)})`,
      renderStatus(r.statusDia),
      r.entradaExtra || '-',
      r.horaEntradaManha || '-',
      r.horaSaidaAlmoco || '-',
      r.horaRetornoAlmoco || '-',
      r.horaSaidaTarde || '-',
      r.horaSaidaExtra || '-',
      r.temDireitoLanche ? 'Sim' : 'Não',
      formatarMinutosParaHora(r.totalHorasExtras50 || 0),
      formatarMinutosParaHora(r.totalHorasExtras80 || 0),
      formatarMinutosParaHora(r.totalHorasExtras110 || 0)
    ]);
    
    // @ts-ignore - jsPDF-AutoTable não tem tipos
    doc.autoTable({
      head: [['Dia', 'Status', 'E.Extra', 'Entrada', 'S.Almoço', 'R.Almoço', 'Saída', 'S.Extra', 'Lanche', 'Extra 50%', 'Extra 80%', 'Extra 110%']],
      body: tableData,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] },
      styles: { fontSize: 8 }
    });
    
    // Resumo
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.text('Resumo:', 14, finalY);
    
    doc.setFontSize(10);
    doc.text(`Horas Normais: ${formatarMinutosParaHora(cartaoPonto.totalHorasNormais)}`, 14, finalY + 7);
    doc.text(`Horas Extras (50%): ${formatarMinutosParaHora(cartaoPonto.totalHorasExtras50)}`, 14, finalY + 14);
    doc.text(`Horas Extras (80%): ${formatarMinutosParaHora(cartaoPonto.totalHorasExtras80)}`, 14, finalY + 21);
    doc.text(`Horas Extras (110%): ${formatarMinutosParaHora(cartaoPonto.totalHorasExtras110)}`, 14, finalY + 28);
    doc.text(`Horas Noturnas: ${formatarMinutosParaHora(cartaoPonto.totalHorasNoturno)}`, 14, finalY + 35);
    doc.text(`Quantidade de Lanches: ${cartaoPonto.totalLanches}`, 14, finalY + 42);
    doc.text(`Valor dos Lanches: R$ ${cartaoPonto.totalLanches * 5},00`, 14, finalY + 49);
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
      doc.text(`Gerado em ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 285);
    }
    
    // Salvar PDF
    doc.save(`cartao_ponto_${funcionarioSelecionado.name.replace(/\s+/g, '_')}_${mes}_${ano}.pdf`);
  };
  
  return (
    <div className="space-y-6">
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
      
      {funcionarioSelecionado && cartaoPonto && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Relatório de Cartão Ponto: {funcionarioSelecionado.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {meses.find(m => m.valor === mes)?.nome} / {ano}
              </p>
            </div>
            
            <Button variant="outline" onClick={gerarRelatorioPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumo de Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  <p className="text-xl">{cartaoPonto.totalLanches}</p>
                </div>
                <div>
                  <h3 className="font-medium">Valor dos lanches</h3>
                  <p className="text-xl">R$ {cartaoPonto.totalLanches * 5},00</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-xl">
                    <Badge variant={cartaoPonto.fechado ? "destructive" : cartaoPonto.validado ? "secondary" : "default"}>
                      {cartaoPonto.validado ? "Validado" : cartaoPonto.fechado ? "Fechado" : "Aberto"}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="overflow-x-auto">
            <h3 className="text-lg font-medium mb-2">Registros detalhados</h3>
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
                  <TableHead className="text-center">Lanche</TableHead>
                  <TableHead className="text-center">H. Extra 50%</TableHead>
                  <TableHead className="text-center">H. Extra 80%</TableHead>
                  <TableHead className="text-center">H. Extra 110%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartaoPonto.registros
                  .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                  .map((registro) => (
                    <TableRow key={registro.id}
                      className={
                        registro.statusDia === 'folga' || registro.statusDia === 'feriado'
                        ? 'bg-muted/20'
                        : registro.statusDia === 'falta_injustificada'
                        ? 'bg-destructive/10'
                        : ''
                      }
                    >
                      <TableCell className="font-medium">
                        {formatarData(registro.data)}<br/>
                        <span className="text-xs text-muted-foreground">
                          {diaDaSemana(registro.data)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          registro.statusDia === 'normal' 
                            ? 'default'
                            : registro.statusDia === 'falta_injustificada'
                            ? 'destructive'
                            : registro.statusDia === 'falta_justificada' || registro.statusDia === 'atestado'
                            ? 'secondary'
                            : 'outline'
                        }>
                          {renderStatus(registro.statusDia)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{registro.entradaExtra || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaEntradaManha || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaSaidaAlmoco || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaRetornoAlmoco || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaSaidaTarde || '-'}</TableCell>
                      <TableCell className="text-center">{registro.horaSaidaExtra || '-'}</TableCell>
                      <TableCell className="text-center">
                        {registro.temDireitoLanche ? 'Sim' : 'Não'}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatarMinutosParaHora(registro.totalHorasExtras50 || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatarMinutosParaHora(registro.totalHorasExtras80 || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatarMinutosParaHora(registro.totalHorasExtras110 || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
