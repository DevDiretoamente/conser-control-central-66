
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';
import { Funcionario } from '@/types/funcionario';

interface ReportData {
  documentos?: DocumentoRH[];
  certificacoes?: Certificacao[];
  funcionarios?: Funcionario[];
  title: string;
  filters?: Record<string, any>;
}

export const reportExportService = {
  exportToPDF: async (data: ReportData): Promise<void> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Título
    doc.setFontSize(16);
    doc.text(data.title, pageWidth / 2, 20, { align: 'center' });
    
    // Data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    
    let yPosition = 45;
    
    // Filtros aplicados
    if (data.filters) {
      doc.setFontSize(12);
      doc.text('Filtros Aplicados:', 20, yPosition);
      yPosition += 10;
      
      Object.entries(data.filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          doc.setFontSize(10);
          doc.text(`${key}: ${value}`, 25, yPosition);
          yPosition += 7;
        }
      });
      yPosition += 10;
    }
    
    // Tabela de Documentos
    if (data.documentos && data.documentos.length > 0) {
      const documentosTableData = data.documentos.map(doc => [
        doc.titulo,
        doc.tipo,
        new Date(doc.dataDocumento).toLocaleDateString('pt-BR'),
        doc.status,
        doc.assinado ? 'Sim' : 'Não'
      ]);
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Título', 'Tipo', 'Data', 'Status', 'Assinado']],
        body: documentosTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Tabela de Certificações
    if (data.certificacoes && data.certificacoes.length > 0) {
      const certificacoesTableData = data.certificacoes.map(cert => [
        cert.nome,
        cert.entidadeCertificadora,
        cert.categoria,
        new Date(cert.dataObtencao).toLocaleDateString('pt-BR'),
        cert.dataVencimento ? new Date(cert.dataVencimento).toLocaleDateString('pt-BR') : 'N/A',
        cert.status
      ]);
      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Nome', 'Entidade', 'Categoria', 'Obtenção', 'Vencimento', 'Status']],
        body: certificacoesTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [40, 167, 69] }
      });
    }
    
    // Salvar o PDF
    doc.save(`${data.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  exportToExcel: async (data: ReportData): Promise<void> => {
    const workbook = XLSX.utils.book_new();
    
    // Aba de Documentos
    if (data.documentos && data.documentos.length > 0) {
      const documentosData = data.documentos.map(doc => ({
        'Título': doc.titulo,
        'Tipo': doc.tipo,
        'Descrição': doc.descricao,
        'Data do Documento': new Date(doc.dataDocumento).toLocaleDateString('pt-BR'),
        'Data de Vencimento': doc.dataVencimento ? new Date(doc.dataVencimento).toLocaleDateString('pt-BR') : '',
        'Status': doc.status,
        'Assinado': doc.assinado ? 'Sim' : 'Não',
        'Data de Assinatura': doc.dataAssinatura ? new Date(doc.dataAssinatura).toLocaleDateString('pt-BR') : '',
        'Observações': doc.observacoes || '',
        'Criado em': new Date(doc.criadoEm).toLocaleString('pt-BR')
      }));
      
      const documentosWS = XLSX.utils.json_to_sheet(documentosData);
      XLSX.utils.book_append_sheet(workbook, documentosWS, 'Documentos');
    }
    
    // Aba de Certificações
    if (data.certificacoes && data.certificacoes.length > 0) {
      const certificacoesData = data.certificacoes.map(cert => ({
        'Nome': cert.nome,
        'Entidade Certificadora': cert.entidadeCertificadora,
        'Categoria': cert.categoria,
        'Número': cert.numero || '',
        'Data de Obtenção': new Date(cert.dataObtencao).toLocaleDateString('pt-BR'),
        'Data de Vencimento': cert.dataVencimento ? new Date(cert.dataVencimento).toLocaleDateString('pt-BR') : '',
        'Status': cert.status,
        'Renovações': cert.renovacoes.length,
        'Observações': cert.observacoes || '',
        'Criado em': new Date(cert.criadoEm).toLocaleString('pt-BR')
      }));
      
      const certificacoesWS = XLSX.utils.json_to_sheet(certificacoesData);
      XLSX.utils.book_append_sheet(workbook, certificacoesWS, 'Certificações');
    }
    
    // Aba de Resumo
    const resumoData = [
      { 'Métrica': 'Total de Documentos', 'Valor': data.documentos?.length || 0 },
      { 'Métrica': 'Total de Certificações', 'Valor': data.certificacoes?.length || 0 },
      { 'Métrica': 'Data de Geração', 'Valor': new Date().toLocaleString('pt-BR') }
    ];
    
    const resumoWS = XLSX.utils.json_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(workbook, resumoWS, 'Resumo');
    
    // Salvar o arquivo
    XLSX.writeFile(workbook, `${data.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportStatistics: async (stats: Record<string, number>): Promise<void> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Título
    doc.setFontSize(16);
    doc.text('Relatório de Estatísticas - Documentos RH', pageWidth / 2, 20, { align: 'center' });
    
    // Data
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    
    let yPosition = 50;
    
    // Estatísticas
    doc.setFontSize(12);
    doc.text('Resumo Geral:', 20, yPosition);
    yPosition += 15;
    
    Object.entries(stats).forEach(([key, value]) => {
      doc.setFontSize(10);
      doc.text(`${key}: ${value}`, 25, yPosition);
      yPosition += 10;
    });
    
    doc.save(`estatisticas_documentos_rh_${new Date().toISOString().split('T')[0]}.pdf`);
  }
};
