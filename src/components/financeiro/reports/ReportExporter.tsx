
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportExporterProps {
  data: any[];
  filename: string;
  title: string;
  columns: Array<{
    key: string;
    label: string;
    format?: (value: any) => string;
  }>;
}

const ReportExporter: React.FC<ReportExporterProps> = ({ 
  data, 
  filename, 
  title, 
  columns 
}) => {
  const exportToExcel = () => {
    try {
      const formattedData = data.map(item => {
        const row: any = {};
        columns.forEach(col => {
          const value = item[col.key];
          row[col.label] = col.format ? col.format(value) : value;
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
      
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      toast.success('Relatório exportado para Excel com sucesso!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Erro ao exportar relatório para Excel');
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(title, 14, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
      
      // Prepare table data
      const tableColumns = columns.map(col => col.label);
      const tableRows = data.map(item => 
        columns.map(col => {
          const value = item[col.key];
          return col.format ? col.format(value) : String(value || '');
        })
      );
      
      // Add table
      (doc as any).autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [139, 92, 246] }
      });
      
      doc.save(`${filename}.pdf`);
      toast.success('Relatório exportado para PDF com sucesso!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Erro ao exportar relatório para PDF');
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhum dado disponível para exportação
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button onClick={exportToExcel} variant="outline">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel
        </Button>
        <Button onClick={exportToPDF} variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportExporter;
