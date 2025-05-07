
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Funcionario } from '@/types/funcionario';
import jsPDF from 'jspdf';

/**
 * Opens a print window with the given HTML content and document title
 */
export const openPrintWindow = (html: string, title: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return false;
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
          }
          .document-content {
            max-width: 800px;
            margin: 0 auto;
          }
          .signature-line {
            margin-top: 50px;
            border-top: 1px solid #000;
            width: 250px;
            text-align: center;
            padding-top: 5px;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none;
            }
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="document-content">${html}</div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Fechar</button>
        </div>
        <script>
          // Auto print
          window.onload = function() {
            setTimeout(() => window.print(), 500);
          };
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  return true;
};

/**
 * Generates a PDF document for the given content and funcionario
 */
export const generatePDF = (
  title: string,
  content: string,
  funcionario: Funcionario,
  includeSignature: boolean = true
) => {
  const doc = new jsPDF();
  
  // Set font and size
  doc.setFont('helvetica');
  doc.setFontSize(12);
  
  // Add the document title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Add the company information
  doc.text('CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA.', 20, 30);
  doc.text('Avenida General Aldo Bonde, nº 551 - Contorno', 20, 35);
  doc.text('(42) 3239 4358 / (42) 9 99161 9031 (ambos com whats)', 20, 40);
  doc.text('CEP 84 060- 170 Ponta Grossa - Paraná', 20, 45);
  doc.text('CNPJ: 02.205.149/0001-32 I.E. 90150007-05', 20, 50);
  
  // Add a separator line
  doc.line(20, 55, 190, 55);
  
  // Add the document content
  const splitText = doc.splitTextToSize(content, 170);
  doc.text(splitText, 20, 65);
  
  // Add signature line if requested
  if (includeSignature) {
    doc.text('Assinatura do Funcionário', 20, 160);
    doc.line(20, 155, 100, 155);
    
    // Add date
    const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
    doc.text(currentDate, 20, 170);
  }
  
  return doc;
};

/**
 * Function to replace template variables with actual data
 */
export const replaceTemplateVariables = (
  content: string,
  funcionario: Funcionario
): string => {
  let processedContent = content;
  
  // Replace variables with actual data
  processedContent = processedContent.replace(/\{NOME\}/g, funcionario.dadosPessoais.nome || '');
  processedContent = processedContent.replace(/\{CPF\}/g, funcionario.dadosPessoais.cpf || '');
  processedContent = processedContent.replace(/\{RG\}/g, funcionario.dadosPessoais.rg || '');
  
  // Data de admissão
  processedContent = processedContent.replace(/\{DATA_ADMISSAO\}/g, 
    funcionario.dadosProfissionais.dataAdmissao 
      ? format(funcionario.dadosProfissionais.dataAdmissao, 'dd/MM/yyyy', { locale: ptBR })
      : ''
  );
  
  // Cargo e salário
  processedContent = processedContent.replace(/\{CARGO\}/g, funcionario.dadosProfissionais.cargo || '');
  processedContent = processedContent.replace(/\{SALARIO\}/g, 
    funcionario.dadosProfissionais.salario 
      ? funcionario.dadosProfissionais.salario.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      : ''
  );
  
  // Endereço completo
  const endereco = funcionario.endereco 
    ? `${funcionario.endereco.rua}, ${funcionario.endereco.numero}${
        funcionario.endereco.complemento ? ', ' + funcionario.endereco.complemento : ''
      } - ${funcionario.endereco.bairro}, ${funcionario.endereco.cidade}/${funcionario.endereco.uf}, CEP: ${funcionario.endereco.cep}`
    : '';
  processedContent = processedContent.replace(/\{ENDERECO\}/g, endereco);
  
  // Data atual
  processedContent = processedContent.replace(/\{DATA_ATUAL\}/g, format(new Date(), 'dd/MM/yyyy', { locale: ptBR }));
  
  // Nome da empresa
  processedContent = processedContent.replace(/\{EMPRESA\}/g, 'CONSERVIAS TRANSPORTES E PAVIMENTAÇÃO LTDA');
  
  return processedContent;
};
