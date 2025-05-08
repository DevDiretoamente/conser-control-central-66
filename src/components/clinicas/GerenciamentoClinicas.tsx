
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface Clinica {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  contato: string;
  observacoes: string;
  ativo: boolean;
}

const clinicasIniciais: Clinica[] = [
  {
    id: '1',
    nome: 'RP Medicina e Segurança do Trabalho',
    endereco: 'Av. Pedro Lessa, 1500 - Aparecida, Santos - SP',
    telefone: '(13) 3322-1234',
    email: 'contato@rpmedicina.com.br',
    contato: 'Dra. Ana Silva',
    observacoes: 'Clínica especializada em exames ocupacionais.',
    ativo: true
  },
  {
    id: '2',
    nome: 'Sindiconvenios',
    endereco: 'Rua João Pessoa, 320 - Centro, Santos - SP',
    telefone: '(13) 3211-5678',
    email: 'atendimento@sindiconvenios.com.br',
    contato: 'Dr. Roberto Almeida',
    observacoes: 'Clínica conveniada ao sindicato.',
    ativo: true
  }
];

const GerenciamentoClinicas: React.FC = () => {
  const [clinicas, setClinicas] = useState<Clinica[]>(clinicasIniciais);
  const [clinicaEmEdicao, setClinicaEmEdicao] = useState<Clinica | null>(null);
  const [novaClinica, setNovaClinica] = useState<Clinica>({
    id: '',
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    contato: '',
    observacoes: '',
    ativo: true
  });
  const [dialogoAberto, setDialogoAberto] = useState<boolean>(false);
  const [dialogoExclusao, setDialogoExclusao] = useState<boolean>(false);
  const [clinicaParaExcluir, setClinicaParaExcluir] = useState<string>('');

  const handleAdicionarClinica = () => {
    setClinicaEmEdicao(null);
    setNovaClinica({
      id: '',
      nome: '',
      endereco: '',
      telefone: '',
      email: '',
      contato: '',
      observacoes: '',
      ativo: true
    });
    setDialogoAberto(true);
  };

  const handleEditarClinica = (clinica: Clinica) => {
    setClinicaEmEdicao(clinica);
    setNovaClinica({...clinica});
    setDialogoAberto(true);
  };

  const handleExcluirClinica = (id: string) => {
    setClinicaParaExcluir(id);
    setDialogoExclusao(true);
  };

  const confirmarExclusao = () => {
    const novasClinicas = clinicas.filter(c => c.id !== clinicaParaExcluir);
    setClinicas(novasClinicas);
    toast.success('Clínica excluída com sucesso');
    setDialogoExclusao(false);
  };

  const handleSalvar = () => {
    if (!novaClinica.nome || !novaClinica.endereco || !novaClinica.telefone) {
      toast.error('Preencha os campos obrigatórios: Nome, Endereço e Telefone');
      return;
    }

    if (clinicaEmEdicao) {
      // Editar clínica existente
      const novasClinicas = clinicas.map(c => 
        c.id === clinicaEmEdicao.id ? novaClinica : c
      );
      setClinicas(novasClinicas);
      toast.success('Clínica atualizada com sucesso');
    } else {
      // Adicionar nova clínica
      const novaId = String(Date.now());
      const novasClinicas = [...clinicas, {...novaClinica, id: novaId}];
      setClinicas(novasClinicas);
      toast.success('Clínica adicionada com sucesso');
    }
    
    setDialogoAberto(false);
  };

  const handleToggleAtivo = (id: string, novoStatus: boolean) => {
    const novasClinicas = clinicas.map(c => 
      c.id === id ? {...c, ativo: novoStatus} : c
    );
    setClinicas(novasClinicas);
    toast.success(`Clínica ${novoStatus ? 'ativada' : 'desativada'} com sucesso`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Clínicas de Medicina do Trabalho</h2>
        <Button onClick={handleAdicionarClinica}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Clínica
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Clínicas Cadastradas</CardTitle>
          <CardDescription>
            Gerencie as clínicas parceiras para realização de exames médicos ocupacionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinicas.map((clinica) => (
                  <TableRow key={clinica.id}>
                    <TableCell className="font-medium">{clinica.nome}</TableCell>
                    <TableCell>{clinica.telefone}</TableCell>
                    <TableCell>{clinica.contato}</TableCell>
                    <TableCell>
                      <Badge variant={clinica.ativo ? "outline" : "secondary"}>
                        {clinica.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditarClinica(clinica)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleExcluirClinica(clinica.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Diálogo para adicionar/editar clínica */}
      <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{clinicaEmEdicao ? 'Editar Clínica' : 'Adicionar Nova Clínica'}</DialogTitle>
            <DialogDescription>
              {clinicaEmEdicao 
                ? 'Atualize as informações da clínica conforme necessário.' 
                : 'Preencha os dados para adicionar uma nova clínica.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid gap-4 py-4 px-1">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="nome">Nome da Clínica*</Label>
                <Input 
                  id="nome" 
                  value={novaClinica.nome} 
                  onChange={(e) => setNovaClinica({...novaClinica, nome: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="endereco">Endereço*</Label>
                <Input 
                  id="endereco" 
                  value={novaClinica.endereco} 
                  onChange={(e) => setNovaClinica({...novaClinica, endereco: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone*</Label>
                  <Input 
                    id="telefone" 
                    value={novaClinica.telefone} 
                    onChange={(e) => setNovaClinica({...novaClinica, telefone: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={novaClinica.email} 
                    onChange={(e) => setNovaClinica({...novaClinica, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="contato">Nome do Contato</Label>
                <Input 
                  id="contato" 
                  value={novaClinica.contato} 
                  onChange={(e) => setNovaClinica({...novaClinica, contato: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea 
                  id="observacoes" 
                  value={novaClinica.observacoes} 
                  onChange={(e) => setNovaClinica({...novaClinica, observacoes: e.target.value})}
                  className="resize-none"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="ativo"
                  checked={novaClinica.ativo}
                  onCheckedChange={(checked) => setNovaClinica({...novaClinica, ativo: checked})}
                />
                <Label htmlFor="ativo">Clínica ativa</Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAberto(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmação de exclusão */}
      <Dialog open={dialogoExclusao} onOpenChange={setDialogoExclusao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta clínica? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoExclusao(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarExclusao}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciamentoClinicas;
