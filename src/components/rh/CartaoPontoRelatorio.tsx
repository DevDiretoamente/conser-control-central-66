
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Printer, Download, PieChart } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CartaoPonto, 
  RegistroPonto, 
  formatarMinutosParaHora,
  calcularResumoHoras,
  ResumoHoras 
} from '@/types/cartaoPonto';
import { User } from '@/types/auth';

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
  const [resumo, setResumo] = useState<ResumoHoras | null>(null);

  // Calculate summary whenever cartão ponto changes
  useEffect(() => {
    if (cartaoPonto) {
      const novoResumo = calcularResumoHoras(cartaoPonto);
      setResumo(novoResumo);
    } else {
      setResumo(null);
    }
  }, [cartaoPonto]);

  const handleFuncionarioChange = (value: string) => {
    onChangeFuncionario(value);
  };

  const handleMesChange = (value: string) => {
    onChangeMes(parseInt(value, 10));
  };

  const handleAnoChange = (value: string) => {
    onChangeAno(parseInt(value, 10));
  };

  const exportarPDF = () => {
    if (!cartaoPonto || !resumo) return;
    
    const funcionario = funcionarios.find(f => f.id === funcionarioSelecionadoId);
    if (!funcionario) return;

    const doc = new jsPDF();
    const nomeMes = format(new Date(ano, mes - 1, 1), 'MMMM', { locale: ptBR });
    
    // Title
    doc.setFontSize(16);
    doc.text(`Relatório de Horas - ${nomeMes.toUpperCase()} / ${ano}`, 14, 20);
    
    // Employee info
    doc.setFontSize(12);
    doc.text(`Funcionário: ${funcionario.name}`, 14, 30);
    
    // Summary table
    const summaryData = [
      ['Horas Normais', formatarMinutosParaHora(resumo.totalNormal)],
      ['Horas Extras 50%', formatarMinutosParaHora(resumo.totalExtra50)],
      ['Horas Extras 80%', formatarMinutosParaHora(resumo.totalExtra80)],
      ['Horas Extras 110%', formatarMinutosParaHora(resumo.totalExtra110)],
      ['Horas Noturnas', formatarMinutosParaHora(resumo.totalNoturno)],
      ['Lanches', `${resumo.totalLanches} (R$ ${resumo.valorLanches.toFixed(2)})`]
    ];
    
    autoTable(doc, {
      head: [['Tipo', 'Total']],
      body: summaryData,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    // Detail table
    const detailsData = cartaoPonto.registros.map(registro => {
      const date = new Date(registro.data);
      const diaSemana = format(date, 'EEE', { locale: ptBR });
      const dia = format(date, 'dd/MM');
      
      return [
        dia,
        diaSemana,
        registro.statusDia === 'normal' 
          ? `${registro.horaEntradaManha || '-'} - ${registro.horaSaidaAlmoco || '-'} / ${registro.horaRetornoAlmoco || '-'} - ${registro.horaSaidaTarde || '-'}`
          : getStatusLabel(registro.statusDia),
        registro.statusDia === 'normal' 
          ? (registro.totalHorasNormais ? formatarMinutosParaHora(registro.totalHorasNormais) : '-')
          : '-',
        registro.statusDia === 'normal' 
          ? (registro.totalHorasExtras50 || registro.totalHorasExtras80 || registro.totalHorasExtras110 
              ? formatarMinutosParaHora((registro.totalHorasExtras50 || 0) + (registro.totalHorasExtras80 || 0) + (registro.totalHorasExtras110 || 0))
              : '-')
          : '-'
      ];
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    
    autoTable(doc, {
      head: [['Dia', 'DS', 'Horário', 'Normal', 'Extra']],
      body: detailsData,
      startY: finalY + 15,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });
    
    // Signatures
    const signY = (doc as any).lastAutoTable.finalY + 30;
    doc.line(20, signY, 90, signY);
    doc.line(120, signY, 190, signY);
    
    doc.text('Assinatura do Funcionário', 25, signY + 10);
    doc.text('Assinatura do Responsável', 125, signY + 10);
    
    // Footer with generation date
    doc.setFontSize(8);
    doc.text(
      `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 
      14, 
      doc.internal.pageSize.height - 10
    );
    
    // Save PDF
    const pdfName = `relatorio-${funcionario.name.toLowerCase().replace(/\s+/g, '-')}-${mes}-${ano}.pdf`;
    doc.save(pdfName);
  };

  const imprimirPDF = () => {
    if (!cartaoPonto || !resumo) return;
    
    const funcionario = funcionarios.find(f => f.id === funcionarioSelecionadoId);
    if (!funcionario) return;

    const doc = new jsPDF();
    const nomeMes = format(new Date(ano, mes - 1, 1), 'MMMM', { locale: ptBR });
    
    // Title
    doc.setFontSize(16);
    doc.text(`Relatório de Horas - ${nomeMes.toUpperCase()} / ${ano}`, 14, 20);
    
    // Employee info
    doc.setFontSize(12);
    doc.text(`Funcionário: ${funcionario.name}`, 14, 30);
    
    // Summary table
    const summaryData = [
      ['Horas Normais', formatarMinutosParaHora(resumo.totalNormal)],
      ['Horas Extras 50%', formatarMinutosParaHora(resumo.totalExtra50)],
      ['Horas Extras 80%', formatarMinutosParaHora(resumo.totalExtra80)],
      ['Horas Extras 110%', formatarMinutosParaHora(resumo.totalExtra110)],
      ['Horas Noturnas', formatarMinutosParaHora(resumo.totalNoturno)],
      ['Lanches', `${resumo.totalLanches} (R$ ${resumo.valorLanches.toFixed(2)})`]
    ];
    
    autoTable(doc, {
      head: [['Tipo', 'Total']],
      body: summaryData,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    // Detail table
    const detailsData = cartaoPonto.registros.map(registro => {
      const date = new Date(registro.data);
      const diaSemana = format(date, 'EEE', { locale: ptBR });
      const dia = format(date, 'dd/MM');
      
      return [
        dia,
        diaSemana,
        registro.statusDia === 'normal' 
          ? `${registro.horaEntradaManha || '-'} - ${registro.horaSaidaAlmoco || '-'} / ${registro.horaRetornoAlmoco || '-'} - ${registro.horaSaidaTarde || '-'}`
          : getStatusLabel(registro.statusDia),
        registro.statusDia === 'normal' 
          ? (registro.totalHorasNormais ? formatarMinutosParaHora(registro.totalHorasNormais) : '-')
          : '-',
        registro.statusDia === 'normal' 
          ? (registro.totalHorasExtras50 || registro.totalHorasExtras80 || registro.totalHorasExtras110 
              ? formatarMinutosParaHora((registro.totalHorasExtras50 || 0) + (registro.totalHorasExtras80 || 0) + (registro.totalHorasExtras110 || 0))
              : '-')
          : '-'
      ];
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    
    autoTable(doc, {
      head: [['Dia', 'DS', 'Horário', 'Normal', 'Extra']],
      body: detailsData,
      startY: finalY + 15,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });
    
    // Signatures
    const signY = (doc as any).lastAutoTable.finalY + 30;
    doc.line(20, signY, 90, signY);
    doc.line(120, signY, 190, signY);
    
    doc.text('Assinatura do Funcionário', 25, signY + 10);
    doc.text('Assinatura do Responsável', 125, signY + 10);
    
    // Footer with generation date
    doc.setFontSize(8);
    doc.text(
      `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 
      14, 
      doc.internal.pageSize.height - 10
    );
    
    // Open print dialog
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      normal: 'Normal',
      falta_injustificada: 'Falta Injustificada',
      falta_justificada: 'Falta Justificada',
      atestado: 'Atestado Médico',
      ferias: 'Férias',
      dispensado: 'Dispensado',
      feriado: 'Feriado',
      folga: 'Folga'
    };
    
    return labels[status] || status;
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Relatório de Horas</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={exportarPDF} 
              variant="outline" 
              size="sm"
              disabled={!cartaoPonto || !resumo}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={imprimirPDF}
              variant="default" 
              size="sm"
              disabled={!cartaoPonto || !resumo}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="funcionario">Funcionário</Label>
            <Select 
              value={funcionarioSelecionadoId} 
              onValueChange={handleFuncionarioChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Funcionários</SelectLabel>
                  {funcionarios.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mes">Mês</Label>
            <Select 
              value={mes.toString()} 
              onValueChange={handleMesChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Meses</SelectLabel>
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <SelectItem key={m} value={m.toString()}>
                      {format(new Date(2000, m - 1, 1), 'MMMM', { locale: ptBR })}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ano">Ano</Label>
            <Select 
              value={ano.toString()} 
              onValueChange={handleAnoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Anos</SelectLabel>
                  {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(a => (
                    <SelectItem key={a} value={a.toString()}>{a}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {resumo && cartaoPonto ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Resumo de Horas</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Horas Normais</p>
                  <p className="text-xl font-semibold">{formatarMinutosParaHora(resumo.totalNormal)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Extras 50%</p>
                  <p className="text-xl font-semibold">{formatarMinutosParaHora(resumo.totalExtra50)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Extras 80%</p>
                  <p className="text-xl font-semibold">{formatarMinutosParaHora(resumo.totalExtra80)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Extras 110%</p>
                  <p className="text-xl font-semibold">{formatarMinutosParaHora(resumo.totalExtra110)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Noturnas</p>
                  <p className="text-xl font-semibold">{formatarMinutosParaHora(resumo.totalNoturno)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Lanches</p>
                  <p className="text-xl font-semibold">{resumo.totalLanches}</p>
                  <p className="text-xs text-muted-foreground">(R$ {resumo.valorLanches.toFixed(2)})</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-4">Detalhamento Diário</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Dia</th>
                      <th className="p-2 text-left">DS</th>
                      <th className="p-2 text-left">Horário</th>
                      <th className="p-2 text-center">Normal</th>
                      <th className="p-2 text-center">Extra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartaoPonto.registros.map((registro, idx) => {
                      const date = new Date(registro.data);
                      const diaSemana = format(date, 'EEE', { locale: ptBR });
                      const dia = format(date, 'dd/MM');
                      
                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                          <td className="p-2">{dia}</td>
                          <td className="p-2">{diaSemana}</td>
                          <td className="p-2">
                            {registro.statusDia === 'normal' 
                              ? `${registro.horaEntradaManha || '-'} - ${registro.horaSaidaAlmoco || '-'} / ${registro.horaRetornoAlmoco || '-'} - ${registro.horaSaidaTarde || '-'}`
                              : getStatusLabel(registro.statusDia)
                            }
                          </td>
                          <td className="p-2 text-center">
                            {registro.statusDia === 'normal' 
                              ? (registro.totalHorasNormais ? formatarMinutosParaHora(registro.totalHorasNormais) : '-')
                              : '-'
                            }
                          </td>
                          <td className="p-2 text-center">
                            {registro.statusDia === 'normal' 
                              ? (registro.totalHorasExtras50 || registro.totalHorasExtras80 || registro.totalHorasExtras110 
                                  ? formatarMinutosParaHora((registro.totalHorasExtras50 || 0) + (registro.totalHorasExtras80 || 0) + (registro.totalHorasExtras110 || 0))
                                  : '-')
                              : '-'
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <PieChart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhum dado disponível</h3>
            <p className="text-muted-foreground mt-2">
              Selecione um funcionário, mês e ano para visualizar o relatório.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
