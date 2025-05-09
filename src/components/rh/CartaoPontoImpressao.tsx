
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User } from '@/types/auth';
import { Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface CartaoPontoImpressaoProps {
  funcionarios: User[];
  funcionarioSelecionadoId: string;
  onChangeFuncionario: (id: string) => void;
  mes: number;
  ano: number;
  onChangeMes: (mes: number) => void;
  onChangeAno: (ano: number) => void;
}

export const CartaoPontoImpressao: React.FC<CartaoPontoImpressaoProps> = ({
  funcionarios,
  funcionarioSelecionadoId,
  onChangeFuncionario,
  mes,
  ano,
  onChangeMes,
  onChangeAno
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
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
  
  // Gerar dias do mês
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const diasPrimQuinzena = Array.from({ length: 15 }, (_, i) => i + 1);
  const diasSegQuinzena = Array.from({ length: diasNoMes - 15 }, (_, i) => i + 16);
  
  // Determinar dias de semana
  const diaDaSemana = (dia: number) => {
    const data = new Date(ano, mes - 1, dia);
    return data.getDay(); // 0 = domingo, 6 = sábado
  };
  
  // Gerar PDF de cartão ponto em branco para impressão
  const gerarCartaoPontoPDF = () => {
    if (!funcionarioSelecionado) return;
    
    const doc = new jsPDF();
    
    // Função auxiliar para criar as tabelas
    const criarTabelaQuinzena = (
      titulo: string, 
      dias: number[], 
      startY: number
    ) => {
      // Cabeçalho
      doc.setFontSize(14);
      doc.text(titulo, 105, startY, { align: 'center' });
      
      // Tabela de registro
      const tableData: any[][] = [];
      
      // Linha de cabeçalho com os dias
      dias.forEach(dia => {
        const diaStr = dia.toString().padStart(2, '0');
        const diaSemanaNum = diaDaSemana(dia);
        // Marcar finais de semana em cinza
        const estilo = diaSemanaNum === 0 || diaSemanaNum === 6 ? { fillColor: [220, 220, 220] } : {};
        
        tableData.push([
          { content: diaStr, styles: estilo },
          { content: '', styles: estilo }, // entrada extra
          { content: '', styles: estilo }, // entrada normal
          { content: '', styles: estilo }, // início intervalo
          { content: '', styles: estilo }, // fim intervalo
          { content: '', styles: estilo }, // saída normal
          { content: '', styles: estilo }, // saída extra
          { content: '', styles: estilo }, // extras
          { content: '', styles: estilo }, // 110%
          { content: '', styles: estilo }, // lanche
          { content: '', styles: estilo }, // visto
        ]);
      });
      
      // @ts-ignore - jsPDF-AutoTable não tem tipos
      doc.autoTable({
        head: [[
          { content: 'DIA', styles: { fillColor: [60, 60, 60], halign: 'center' } },
          { content: 'INÍCIO EXTRA', colSpan: 2, styles: { fillColor: [60, 60, 60], halign: 'center' } },
          { content: 'INÍCIO NORMAL', styles: { fillColor: [60, 60, 60], halign: 'center' } },
          { content: 'INTERVALO REFEIÇÃO', colSpan: 2, styles: { fillColor: [60, 60, 60], halign: 'center' } },
          { content: 'SAÍDA NORMAL', styles: { fillColor: [60, 60, 60], halign: 'center' } },
          { content: 'SAÍDA EXTRA', styles: { fillColor: [60, 60, 60], halign: 'center' } },
          { content: 'SOMA DIÁRIA DE EXTRAS', colSpan: 3, styles: { fillColor: [60, 60, 60], halign: 'center' } },
          { content: 'VISTO FUNCIONÁRIO', styles: { fillColor: [60, 60, 60], halign: 'center' } }
        ], 
        [
          { content: '', styles: { fillColor: [60, 60, 60] } },
          { content: 'INÍCIO\nEXTRA', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: 'INÍCIO\nNORMAL', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: 'INÍCIO', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: 'TÉRMINO', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: 'SAÍDA\nNORMAL', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: 'SAÍDA\nEXTRA', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: 'EXTRAS', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: '110%', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: 'LANCHE', styles: { fillColor: [120, 120, 120], halign: 'center' } },
          { content: '', styles: { fillColor: [120, 120, 120] } }
        ]],
        body: tableData,
        startY: startY + 10,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 1,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
          8: { cellWidth: 15 },
          9: { cellWidth: 15 },
          10: { cellWidth: 30 }
        }
      });
      
      // Adicionar linha de soma
      const finalY = (doc as any).lastAutoTable.finalY;
      
      // @ts-ignore - jsPDF-AutoTable não tem tipos
      doc.autoTable({
        body: [[
          { content: 'SOMA QUINZENA >>>', colSpan: 7, styles: { fontStyle: 'bold', halign: 'right' } },
          { content: '', styles: {} },
          { content: '', styles: {} },
          { content: '', styles: {} },
          { content: '', styles: {} }
        ]],
        startY: finalY,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 1,
        },
        columnStyles: {
          0: { cellWidth: 105 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 30 }
        }
      });
      
      if (titulo.includes('2ª')) {
        const finalY = (doc as any).lastAutoTable.finalY + 5;
        
        // Adicionar observações para a segunda quinzena
        // @ts-ignore - jsPDF-AutoTable não tem tipos
        doc.autoTable({
          body: [[
            { content: 'RESUMO DE HORAS', colSpan: 1, styles: { fontStyle: 'bold' } },
            { content: '', colSpan: 2, styles: {} }
          ], [
            { content: '50% →', styles: { fontStyle: 'bold' } },
            { content: '', colSpan: 2, styles: {} }
          ], [
            { content: '80% →', styles: { fontStyle: 'bold' } },
            { content: '', colSpan: 2, styles: {} }
          ], [
            { content: '110% →', styles: { fontStyle: 'bold' } },
            { content: '', colSpan: 2, styles: {} }
          ], [
            { content: '> 1 H.E. →', styles: { fontStyle: 'bold' } },
            { content: '', colSpan: 2, styles: {} }
          ]],
          startY: finalY,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 1,
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 140 }
          }
        });
        
        const resumoY = (doc as any).lastAutoTable.finalY + 5;
        
        // Horário de trabalho
        doc.setFontSize(10);
        doc.text('HORÁRIO DE TRABALHO - CONSERVIAS', 105, resumoY, { align: 'center' });
        doc.setFontSize(8);
        doc.text('Segunda a Quinta: 07:00 às 12:00 - 13:00 às 17:00', 105, resumoY + 5, { align: 'center' });
        doc.text('Sexta-feira: 07:00 às 12:00 - 13:00 às 16:00', 105, resumoY + 10, { align: 'center' });
        
        const assinaturaY = resumoY + 20;
        
        // Linhas para assinaturas
        doc.line(20, assinaturaY, 90, assinaturaY);
        doc.line(110, assinaturaY, 180, assinaturaY);
        
        doc.setFontSize(8);
        doc.text(funcionarioSelecionado.name, 55, assinaturaY + 5, { align: 'center' });
        doc.text(`DATA: _____ de ${meses.find(m => m.valor === mes)?.nome.toUpperCase()} de ${ano}.`, 145, assinaturaY + 5, { align: 'center' });
      }
      
      return (doc as any).lastAutoTable.finalY + 10;
    };
    
    // Cabeçalho principal
    doc.setFontSize(16);
    doc.text('CARTÃO PONTO INDIVIDUAL', 105, 15, { align: 'center' });
    
    // Logo no canto superior esquerdo
    doc.setFillColor(255, 255, 0);
    doc.rect(15, 15, 35, 15, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('CONSERVIAS', 32, 25, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    // Informações do funcionário
    // @ts-ignore - jsPDF-AutoTable não tem tipos
    doc.autoTable({
      body: [
        [
          { content: 'FUNCIONÁRIO:', styles: { fontStyle: 'bold' } }, 
          { content: funcionarioSelecionado.name }
        ],
        [
          { content: 'SETOR/FUNÇÃO:', styles: { fontStyle: 'bold' } }, 
          { content: 'A DEFINIR' } // Substituir por informação real se disponível
        ],
        [
          { content: 'MÊS:', styles: { fontStyle: 'bold' } }, 
          { content: meses.find(m => m.valor === mes)?.nome.toUpperCase() },
          { content: 'ANO:', styles: { fontStyle: 'bold' } }, 
          { content: ano.toString() }
        ],
        [
          { content: 'OBRA:', styles: { fontStyle: 'bold' } }, 
          { content: '' }
        ]
      ],
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 1,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 100 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 }
      }
    });
    
    // Primeira quinzena
    const finalY1 = criarTabelaQuinzena('1ª QUINZENA', diasPrimQuinzena, 70);
    
    // Adicionar observações primeira quinzena
    // @ts-ignore - jsPDF-AutoTable não tem tipos
    doc.autoTable({
      body: [[
        { content: 'OBSERVAÇÕES:', styles: { fontStyle: 'bold' } }
      ], [
        { content: '' }
      ]],
      startY: finalY1,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 1,
        minCellHeight: 10
      },
      columnStyles: {
        0: { cellWidth: 180 }
      }
    });
    
    // Nova página para a segunda quinzena
    doc.addPage();
    
    // Segunda quinzena
    criarTabelaQuinzena('2ª QUINZENA', diasSegQuinzena, 15);
    
    // Salvar ou imprimir o PDF
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
      
      <Card>
        <CardHeader>
          <CardTitle>Impressão de Cartão Ponto em Branco</CardTitle>
          <CardDescription>
            Gere cartões de ponto em branco para preenchimento manual
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center mb-4">
            {funcionarioSelecionado && (
              <Button onClick={gerarCartaoPontoPDF}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Cartão Ponto
              </Button>
            )}
          </div>
          
          <div ref={previewRef} className="bg-background p-4 border rounded-md">
            <div className="text-center mb-4 text-lg font-bold">
              CARTÃO PONTO INDIVIDUAL
            </div>
            
            <div className="flex justify-between mb-4">
              <div className="bg-yellow-300 px-3 py-1 font-bold">
                CONSERVIAS
              </div>
              
              <div className="flex-1 ml-4">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 font-semibold w-1/4">FUNCIONÁRIO:</td>
                      <td className="border px-2 py-1">{funcionarioSelecionado?.name || ''}</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">SETOR/FUNÇÃO:</td>
                      <td className="border px-2 py-1">A DEFINIR</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">MÊS:</td>
                      <td className="border px-2 py-1 flex justify-between">
                        <span>{meses.find(m => m.valor === mes)?.nome.toUpperCase()}</span>
                        <span className="font-semibold">ANO:</span>
                        <span>{ano}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">OBRA:</td>
                      <td className="border px-2 py-1"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-center mb-2 font-semibold">
              1ª QUINZENA
            </div>
            
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr>
                  <th className="border px-1 py-1 bg-gray-700 text-white" rowSpan={2}>DIA</th>
                  <th className="border px-1 py-1 bg-gray-700 text-white" colSpan={2}>MANHÃ</th>
                  <th className="border px-1 py-1 bg-gray-700 text-white" colSpan={2}>INTERVALO REFEIÇÃO</th>
                  <th className="border px-1 py-1 bg-gray-700 text-white" colSpan={2}>TARDE</th>
                  <th className="border px-1 py-1 bg-gray-700 text-white" colSpan={3}>SOMA DIÁRIA DE EXTRAS</th>
                  <th className="border px-1 py-1 bg-gray-700 text-white" rowSpan={2}>VISTO FUNCIONÁRIO</th>
                </tr>
                <tr>
                  <th className="border px-1 py-1 bg-gray-500 text-white">INÍCIO EXTRA</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">INÍCIO NORMAL</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">INÍCIO</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">TÉRMINO</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">SAÍDA NORMAL</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">SAÍDA EXTRA</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">EXTRAS</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">110%</th>
                  <th className="border px-1 py-1 bg-gray-500 text-white">LANCHE</th>
                </tr>
              </thead>
              <tbody>
                {diasPrimQuinzena.map(dia => (
                  <tr key={dia} className={diaDaSemana(dia) === 0 || diaDaSemana(dia) === 6 ? 'bg-gray-100' : ''}>
                    <td className="border px-1 py-1">{dia}</td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                    <td className="border px-1 py-1"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border px-1 py-1 text-right font-semibold" colSpan={7}>SOMA QUINZENA >>></td>
                  <td className="border px-1 py-1"></td>
                  <td className="border px-1 py-1"></td>
                  <td className="border px-1 py-1"></td>
                  <td className="border px-1 py-1"></td>
                </tr>
              </tfoot>
            </table>
            
            <div className="text-center mt-4 mb-2 font-semibold">
              2ª QUINZENA (Preview)
            </div>
            
            <p className="text-center text-sm mt-4">
              Clique em "Imprimir Cartão Ponto" para gerar o PDF completo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
