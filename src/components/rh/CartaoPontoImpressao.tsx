
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, ChevronLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@/types/auth';

interface CartaoPontoImpressaoProps {
  funcionarios: User[];
  funcionarioSelecionadoId: string;
  onChangeFuncionario: (id: string) => void;
  mes: number;
  ano: number;
  onChangeMes: (mes: number) => void;
  onChangeAno: (ano: number) => void;
  onBack?: () => void;
}

const CartaoPontoImpressao: React.FC<CartaoPontoImpressaoProps> = ({
  funcionarios,
  funcionarioSelecionadoId,
  onChangeFuncionario,
  mes: initialMes,
  ano: initialAno,
  onChangeMes,
  onChangeAno,
  onBack,
}) => {
  const [mes, setMes] = useState(initialMes || new Date().getMonth() + 1);
  const [ano, setAno] = useState(initialAno || new Date().getFullYear());
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState(funcionarioSelecionadoId || '');
  const { toast } = useToast();

  useEffect(() => {
    // Em uma implementação real, buscaríamos os funcionários da API
    // Por enquanto usamos dados mockados definidos acima
  }, []);

  const getNomeMes = (mesNum: number) => {
    const data = new Date();
    data.setMonth(mesNum - 1);
    return format(data, 'MMMM', { locale: ptBR });
  };

  const getDiasDaSemana = () => {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  };

  const getDiasDoMes = (mes: number, ano: number) => {
    const numDias = new Date(ano, mes, 0).getDate();
    const dias = [];
    
    for (let i = 1; i <= numDias; i++) {
      const data = new Date(ano, mes - 1, i);
      const diaSemana = data.getDay();
      dias.push({
        dia: i,
        diaSemana,
        ehFimDeSemana: diaSemana === 0 || diaSemana === 6
      });
    }
    
    return dias;
  };

  const gerarPDF = (imprimir: boolean = false) => {
    const funcionario = funcionarios.find(f => f.id === selectedFuncionarioId);
    
    if (!funcionario) {
      toast({
        title: "Erro",
        description: "Selecione um funcionário para gerar o cartão ponto",
        variant: "destructive"
      });
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const diasDoMes = getDiasDoMes(mes, ano);
    const nomeMes = getNomeMes(mes);
    
    // Configurações
    const margemEsquerda = 10;
    const margemSuperior = 10;
    const larguraUtil = pdf.internal.pageSize.width - (margemEsquerda * 2);
    
    // Título
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONSERVIAS CONSTRUÇÃO CIVIL LTDA', margemEsquerda, margemSuperior);
    
    pdf.setFontSize(14);
    pdf.text(`CARTÃO PONTO - ${nomeMes.toUpperCase()} / ${ano}`, margemEsquerda, margemSuperior + 10);

    // Dados do funcionário
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Funcionário: ${funcionario.name}`, margemEsquerda, margemSuperior + 20);
    
    // Tabela de horários
    const linhaInicial = margemSuperior + 30;
    const alturaLinha = 10;
    const larguraColunaDia = 15;
    const larguraColunaDiaSemana = 15;
    const larguraColunaHorario = (larguraUtil - larguraColunaDia - larguraColunaDiaSemana) / 4;
    
    // Cabeçalho da tabela
    pdf.setFillColor(220, 220, 220);
    pdf.rect(margemEsquerda, linhaInicial, larguraUtil, alturaLinha, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dia', margemEsquerda + 3, linhaInicial + 6);
    pdf.text('DS', margemEsquerda + larguraColunaDia + 3, linhaInicial + 6);
    
    pdf.text('Entrada', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + 15, linhaInicial + 6);
    pdf.text('Almoço', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + larguraColunaHorario + 15, linhaInicial + 6);
    pdf.text('Retorno', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + (larguraColunaHorario * 2) + 15, linhaInicial + 6);
    pdf.text('Saída', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + (larguraColunaHorario * 3) + 15, linhaInicial + 6);
    
    // Linhas da tabela
    pdf.setFont('helvetica', 'normal');
    
    let posicaoY = linhaInicial + alturaLinha;
    const diasSemana = getDiasDaSemana();
    
    diasDoMes.forEach((dia, index) => {
      // Verificar se precisamos de uma nova página
      if (posicaoY > pdf.internal.pageSize.height - 20) {
        pdf.addPage();
        posicaoY = margemSuperior;
        
        // Repetir cabeçalho na nova página
        pdf.setFillColor(220, 220, 220);
        pdf.rect(margemEsquerda, posicaoY, larguraUtil, alturaLinha, 'F');
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Dia', margemEsquerda + 3, posicaoY + 6);
        pdf.text('DS', margemEsquerda + larguraColunaDia + 3, posicaoY + 6);
        
        pdf.text('Entrada', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + 15, posicaoY + 6);
        pdf.text('Almoço', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + larguraColunaHorario + 15, posicaoY + 6);
        pdf.text('Retorno', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + (larguraColunaHorario * 2) + 15, posicaoY + 6);
        pdf.text('Saída', margemEsquerda + larguraColunaDia + larguraColunaDiaSemana + (larguraColunaHorario * 3) + 15, posicaoY + 6);
        
        posicaoY += alturaLinha;
      }
      
      // Alternar cores das linhas
      if (index % 2 === 0) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margemEsquerda, posicaoY, larguraUtil, alturaLinha, 'F');
      }
      
      // Destacar fins de semana
      if (dia.ehFimDeSemana) {
        pdf.setFillColor(230, 230, 250); // Cor lilás bem clara
        pdf.rect(margemEsquerda, posicaoY, larguraUtil, alturaLinha, 'F');
      }
      
      // Dia e dia da semana
      pdf.text(dia.dia.toString().padStart(2, '0'), margemEsquerda + 3, posicaoY + 6);
      pdf.text(diasSemana[dia.diaSemana], margemEsquerda + larguraColunaDia + 3, posicaoY + 6);
      
      // Bordas das células para campos de preenchimento manual
      const posX1 = margemEsquerda + larguraColunaDia + larguraColunaDiaSemana;
      const posX2 = posX1 + larguraColunaHorario;
      const posX3 = posX2 + larguraColunaHorario;
      const posX4 = posX3 + larguraColunaHorario;
      
      pdf.line(posX1, posicaoY, posX1, posicaoY + alturaLinha);
      pdf.line(posX2, posicaoY, posX2, posicaoY + alturaLinha);
      pdf.line(posX3, posicaoY, posX3, posicaoY + alturaLinha);
      pdf.line(posX4, posicaoY, posX4, posicaoY + alturaLinha);
      pdf.line(posX4 + larguraColunaHorario, posicaoY, posX4 + larguraColunaHorario, posicaoY + alturaLinha);
      
      // Linha horizontal inferior
      pdf.line(margemEsquerda, posicaoY + alturaLinha, margemEsquerda + larguraUtil, posicaoY + alturaLinha);
      
      posicaoY += alturaLinha;
    });
    
    // Assinaturas
    posicaoY += 10;
    pdf.text("Data: _____/_____/_____", margemEsquerda, posicaoY);
    
    posicaoY += 20;
    const larguraAssinatura = 80;
    pdf.line(margemEsquerda, posicaoY, margemEsquerda + larguraAssinatura, posicaoY);
    pdf.text("Assinatura do Funcionário", margemEsquerda + 15, posicaoY + 5);
    
    pdf.line(margemEsquerda + larguraUtil - larguraAssinatura, posicaoY, margemEsquerda + larguraUtil, posicaoY);
    pdf.text("Assinatura do Responsável", margemEsquerda + larguraUtil - larguraAssinatura + 10, posicaoY + 5);
    
    // Observações
    posicaoY += 15;
    pdf.setFontSize(10);
    pdf.text("Observações:", margemEsquerda, posicaoY);
    
    posicaoY += 5;
    pdf.line(margemEsquerda, posicaoY, margemEsquerda + larguraUtil, posicaoY);
    
    posicaoY += 5;
    pdf.line(margemEsquerda, posicaoY, margemEsquerda + larguraUtil, posicaoY);
    
    posicaoY += 5;
    pdf.line(margemEsquerda, posicaoY, margemEsquerda + larguraUtil, posicaoY);
    
    // Rodapé
    const posicaoRodape = pdf.internal.pageSize.height - 10;
    pdf.setFontSize(8);
    pdf.text(`Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, margemEsquerda, posicaoRodape);
    
    if (imprimir) {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    } else {
      const nomeArquivo = `cartao-ponto-${funcionario.name.replace(/\s+/g, '-').toLowerCase()}-${mes}-${ano}.pdf`;
      pdf.save(nomeArquivo);
      
      toast({
        title: "PDF Gerado",
        description: `O arquivo ${nomeArquivo} foi baixado com sucesso.`,
        variant: "default"
      });
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle>Cartão Ponto para Impressão</CardTitle>
          </div>
          <div>
            <Button 
              onClick={() => gerarPDF(false)}
              variant="outline" 
              size="sm"
              className="mr-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button 
              onClick={() => gerarPDF(true)} 
              variant="default" 
              size="sm"
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
              value={selectedFuncionarioId}
              onValueChange={setSelectedFuncionarioId}
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
              onValueChange={(value) => setMes(parseInt(value))}
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
              onValueChange={(value) => setAno(parseInt(value))}
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
        
        <div className="bg-muted/30 p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2">Pré-visualização</h3>
          <p className="text-sm text-muted-foreground">
            Aqui será exibida uma prévia do cartão ponto que será gerado para {selectedFuncionarioId ? funcionarios.find(f => f.id === selectedFuncionarioId)?.name : "o funcionário selecionado"}.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            O cartão ponto será gerado para o mês de {getNomeMes(mes)} de {ano}.
          </p>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground italic">
              Para visualizar o cartão ponto completo, clique em "Baixar PDF" ou "Imprimir".
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartaoPontoImpressao;
