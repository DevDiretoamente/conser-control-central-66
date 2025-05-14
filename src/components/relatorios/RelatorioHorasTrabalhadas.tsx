
import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cartaoPontoService } from '@/services/cartaoPontoService';
import { funcionariosService } from '@/services/funcionariosService';
import { CartaoPonto } from '@/types/cartaoPonto';
import { Funcionario } from '@/types/funcionario';
import { Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDecimalHours } from '@/lib/utils';

interface RelatorioHorasTrabalhadasProps {
  mes: number;
  ano: number;
}

interface FuncionarioHoras {
  id: string;
  nome: string;
  totalHorasNormais: number;
  totalHorasExtras50: number;
  totalHorasExtras80: number;
  totalHorasExtras110: number;
  totalAjudaCusto: number;
}

const RelatorioHorasTrabalhadas: React.FC<RelatorioHorasTrabalhadasProps> = ({ mes, ano }) => {
  const [currentDate, setCurrentDate] = useState(new Date(ano, mes - 1));
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<FuncionarioHoras[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarDados();
  }, [currentDate]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Get all funcionarios
      const funcionarios = await funcionariosService.getAll();
      
      // Get cartaoPonto for each funcionario
      const dadosFuncionarios: FuncionarioHoras[] = [];
      
      for (const funcionario of funcionarios) {
        const registros = await cartaoPontoService.filter({
          funcionarioId: funcionario.id,
          dataInicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
          dataFim: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
        });
        
        if (registros.length > 0) {
          // Calculate hours
          const totalHorasNormais = registros.reduce((sum, r) => sum + ((r.totalHoras || 0) - (r.horasExtras || 0)), 0);
          const totalHorasExtras50 = registros.reduce((sum, r) => 
            sum + (r.taxaHoraExtra === 0.5 ? (r.horasExtras || 0) : 0), 0);
          const totalHorasExtras80 = registros.reduce((sum, r) => 
            sum + (r.taxaHoraExtra === 0.8 ? (r.horasExtras || 0) : 0), 0);
          const totalHorasExtras110 = registros.reduce((sum, r) => 
            sum + (r.taxaHoraExtra === 1.1 ? (r.horasExtras || 0) : 0), 0);
          
          // Add mock ajudaCusto for demonstration (this would come from your real data)
          const totalAjudaCusto = Math.random() > 0.5 ? Math.floor(Math.random() * 500) : 0;
          
          dadosFuncionarios.push({
            id: funcionario.id,
            nome: funcionario.dadosPessoais.nome,
            totalHorasNormais,
            totalHorasExtras50,
            totalHorasExtras80,
            totalHorasExtras110,
            totalAjudaCusto
          });
        }
      }
      
      setDados(dadosFuncionarios);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do relatório.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(`RELATÓRIO DE HORAS TRABALHADAS - ${format(currentDate, 'MMMM/yyyy').toUpperCase()}`, 14, 20);
      
      // Add company header
      doc.setFontSize(12);
      doc.text('CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA', 14, 30);
      doc.text('CNPJ: 02.205.149/0001-32', 14, 36);
      
      // Set table headers
      const columns = [
        { header: 'FUNCIONÁRIO', dataKey: 'nome' },
        { header: 'HORAS NORMAIS', dataKey: 'horasNormais' },
        { header: 'EXTRAS 50%', dataKey: 'extras50' },
        { header: 'EXTRAS 80%', dataKey: 'extras80' },
        { header: 'EXTRAS 110%', dataKey: 'extras110' },
        { header: 'AJUDA DE CUSTO', dataKey: 'ajudaCusto' },
      ];
      
      // Set table data
      const tableData = dados.map(f => ({
        nome: f.nome,
        horasNormais: formatDecimalHours(f.totalHorasNormais),
        extras50: formatDecimalHours(f.totalHorasExtras50),
        extras80: formatDecimalHours(f.totalHorasExtras80),
        extras110: formatDecimalHours(f.totalHorasExtras110),
        ajudaCusto: `R$ ${f.totalAjudaCusto.toFixed(2).replace('.', ',')}`
      }));
      
      // Add table to PDF
      (doc as any).autoTable({
        head: [columns.map(c => c.header)],
        body: tableData.map(row => [
          row.nome,
          row.horasNormais,
          row.extras50,
          row.extras80,
          row.extras110,
          row.ajudaCusto
        ]),
        startY: 45,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        footStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 40 },
      });
      
      // Add footer with date
      const pageCount = (doc as any).getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, doc.internal.pageSize.height - 10);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      
      // Save PDF
      doc.save(`Horas_Trabalhadas_${format(currentDate, 'MM_yyyy')}.pdf`);
      
      toast({
        title: 'Sucesso',
        description: 'Relatório exportado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível exportar o relatório.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-1">
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
          <Button onClick={handleExportPDF} className="flex items-center gap-1">
            <Download className="h-4 w-4 mr-1" />
            Exportar PDF
          </Button>
        </div>
      </div>
      
      <div className="print:block" ref={tableRef}>
        <div className="text-center print:mb-4 hidden print:block">
          <h1 className="text-xl font-bold">CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA</h1>
          <p className="text-sm">CNPJ: 02.205.149/0001-32</p>
          <h2 className="text-lg font-semibold mt-4">
            RELATÓRIO DE HORAS TRABALHADAS - {format(currentDate, 'MMMM/yyyy', { locale: ptBR }).toUpperCase()}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">FUNCIONÁRIO</th>
                <th className="border border-gray-300 p-2 text-center">HORAS NORMAIS</th>
                <th className="border border-gray-300 p-2 text-center">EXTRAS 50%</th>
                <th className="border border-gray-300 p-2 text-center">EXTRAS 80%</th>
                <th className="border border-gray-300 p-2 text-center">EXTRAS 110%</th>
                <th className="border border-gray-300 p-2 text-center">AJUDA DE CUSTO</th>
              </tr>
            </thead>
            <tbody>
              {dados.length > 0 ? (
                dados.map((funcionario) => (
                  <tr key={funcionario.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{funcionario.nome}</td>
                    <td className="border border-gray-300 p-2 text-center">{formatDecimalHours(funcionario.totalHorasNormais)}</td>
                    <td className="border border-gray-300 p-2 text-center">{formatDecimalHours(funcionario.totalHorasExtras50)}</td>
                    <td className="border border-gray-300 p-2 text-center">{formatDecimalHours(funcionario.totalHorasExtras80)}</td>
                    <td className="border border-gray-300 p-2 text-center">{formatDecimalHours(funcionario.totalHorasExtras110)}</td>
                    <td className="border border-gray-300 p-2 text-center text-red-500">
                      R$ {funcionario.totalAjudaCusto.toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-gray-300 p-4 text-center">
                    {loading ? 'Carregando dados...' : 'Nenhum registro encontrado para o período.'}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-semibold">
                <td className="border border-gray-300 p-2">TOTAL</td>
                <td className="border border-gray-300 p-2 text-center">
                  {formatDecimalHours(dados.reduce((sum, f) => sum + f.totalHorasNormais, 0))}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {formatDecimalHours(dados.reduce((sum, f) => sum + f.totalHorasExtras50, 0))}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {formatDecimalHours(dados.reduce((sum, f) => sum + f.totalHorasExtras80, 0))}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {formatDecimalHours(dados.reduce((sum, f) => sum + f.totalHorasExtras110, 0))}
                </td>
                <td className="border border-gray-300 p-2 text-center text-red-500">
                  R$ {dados.reduce((sum, f) => sum + f.totalAjudaCusto, 0).toFixed(2).replace('.', ',')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="text-right mt-4 text-sm text-gray-500 print:block hidden">
          Gerado em: {format(new Date(), 'dd/MM/yyyy HH:mm')}
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: landscape;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
};

export default RelatorioHorasTrabalhadas;
