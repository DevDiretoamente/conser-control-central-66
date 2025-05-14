
import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cartaoPontoService } from '@/services/cartaoPontoService';
import { beneficioService } from '@/services/beneficioService';
import { funcionariosService } from '@/services/funcionariosService';
import { Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface RelatorioValeRefeicaoProps {
  mes: number;
  ano: number;
}

interface FuncionarioBeneficios {
  id: string;
  nome: string;
  cpf: string;
  elegivel: boolean;
  valorCestaBasica: number;
  valorLanche: number;
  totalBeneficios: number;
}

const RelatorioValeRefeicao: React.FC<RelatorioValeRefeicaoProps> = ({ mes, ano }) => {
  const [currentDate, setCurrentDate] = useState(new Date(ano, mes - 1));
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<FuncionarioBeneficios[]>([]);
  const [totalGeral, setTotalGeral] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarDados();
  }, [currentDate]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Get all funcionarios
      const funcionarios = await funcionariosService.getAll();
      
      // Get current benefit values
      const beneficioValues = await beneficioService.getCurrentValues();
      
      // Get cartaoPonto for each funcionario and calculate benefits
      const dadosFuncionarios: FuncionarioBeneficios[] = [];
      
      for (const funcionario of funcionarios) {
        // Get summary data for funcionario
        const summary = await cartaoPontoService.getSummary(
          funcionario.id,
          currentDate.getMonth() + 1,
          currentDate.getFullYear()
        );
        
        // Calculate benefits
        const valorCestaBasica = summary.elegibleValeAlimentacao ? beneficioValues.cestaBasica : 0;
        const valorLanche = summary.valorLanche;
        const totalBeneficios = valorCestaBasica + valorLanche;
        
        dadosFuncionarios.push({
          id: funcionario.id,
          nome: funcionario.dadosPessoais.nome,
          cpf: funcionario.dadosPessoais.cpf,
          elegivel: summary.elegibleValeAlimentacao,
          valorCestaBasica,
          valorLanche,
          totalBeneficios
        });
      }
      
      // Sort by name
      dadosFuncionarios.sort((a, b) => a.nome.localeCompare(b.nome));
      
      // Calculate total
      const total = dadosFuncionarios.reduce((sum, f) => sum + f.totalBeneficios, 0);
      
      setDados(dadosFuncionarios);
      setTotalGeral(total);
      
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
      doc.text(`RELATÓRIO DE VALE REFEIÇÃO - ${format(currentDate, 'MMMM/yyyy').toUpperCase()}`, 14, 20);
      
      // Add company header
      doc.setFontSize(12);
      doc.text('CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA', 14, 30);
      doc.text('CNPJ: 02.205.149/0001-32', 14, 36);
      
      // Set table headers
      const columns = [
        { header: 'FUNCIONÁRIO', dataKey: 'nome' },
        { header: 'CPF', dataKey: 'cpf' },
        { header: 'CESTA BÁSICA', dataKey: 'cestaBasica' },
        { header: 'LANCHES', dataKey: 'lanche' },
        { header: 'TOTAL', dataKey: 'total' },
      ];
      
      // Set table data
      const tableData = dados.map(f => ({
        nome: f.nome,
        cpf: f.cpf,
        cestaBasica: `R$ ${f.valorCestaBasica.toFixed(2).replace('.', ',')}`,
        lanche: `R$ ${f.valorLanche.toFixed(2).replace('.', ',')}`,
        total: `R$ ${f.totalBeneficios.toFixed(2).replace('.', ',')}`
      }));
      
      // Add table to PDF
      (doc as any).autoTable({
        head: [columns.map(c => c.header)],
        body: tableData.map(row => [
          row.nome,
          row.cpf,
          row.cestaBasica,
          row.lanche,
          row.total
        ]),
        startY: 45,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 40 },
      });
      
      // Add total row
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}`, 14, finalY);
      
      // Add footer with date
      const pageCount = (doc as any).getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, doc.internal.pageSize.height - 10);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      
      // Save PDF
      doc.save(`Vale_Refeicao_${format(currentDate, 'MM_yyyy')}.pdf`);
      
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
            RELATÓRIO DE VALE REFEIÇÃO - {format(currentDate, 'MMMM/yyyy', { locale: ptBR }).toUpperCase()}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">FUNCIONÁRIO</th>
                <th className="border border-gray-300 p-2 text-center">CPF</th>
                <th className="border border-gray-300 p-2 text-center">CESTA BÁSICA</th>
                <th className="border border-gray-300 p-2 text-center">LANCHES</th>
                <th className="border border-gray-300 p-2 text-center">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {dados.length > 0 ? (
                dados.map((funcionario) => (
                  <tr key={funcionario.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{funcionario.nome}</td>
                    <td className="border border-gray-300 p-2 text-center">{funcionario.cpf}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      R$ {funcionario.valorCestaBasica.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      R$ {funcionario.valorLanche.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      R$ {funcionario.totalBeneficios.toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border border-gray-300 p-4 text-center">
                    {loading ? 'Carregando dados...' : 'Nenhum registro encontrado para o período.'}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-semibold">
                <td colSpan={4} className="border border-gray-300 p-2 text-right">TOTAL GERAL</td>
                <td className="border border-gray-300 p-2 text-center">
                  R$ {totalGeral.toFixed(2).replace('.', ',')}
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

export default RelatorioValeRefeicao;
