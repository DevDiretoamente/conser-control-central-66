
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Funcionario, ExameRealizado, ExameMedico } from '@/types/funcionario';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, FilePlus, Calendar } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import DocumentUploader from './DocumentUploader';

// Mock exames available
const mockExamesMedicos: ExameMedico[] = [
  { 
    id: '1', 
    nome: 'Exame Admissional', 
    tipo: 'admissional',
    descricao: 'Exame para admissão do funcionário'
  },
  { 
    id: '2', 
    nome: 'Exame Periódico', 
    tipo: 'periodico',
    periodicidade: 12, // 12 months
    descricao: 'Exame periódico anual'
  },
  { 
    id: '3', 
    nome: 'Audiometria', 
    tipo: 'periodico',
    periodicidade: 6, // 6 months
    descricao: 'Exame de audiometria semestral'
  },
  { 
    id: '4', 
    nome: 'Exame Demissional', 
    tipo: 'demissional',
    descricao: 'Exame para desligamento do funcionário'
  },
];

interface ExameFormData {
  exameId: string;
  dataRealizado: Date;
  dataValidade: Date;
  resultado: string;
  documento: File | null;
}

interface ExamesMedicosTabProps {
  form: UseFormReturn<Funcionario>;
}

const ExamesMedicosTab: React.FC<ExamesMedicosTabProps> = ({ form }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExame, setCurrentExame] = useState<ExameFormData>({
    exameId: '',
    dataRealizado: new Date(),
    dataValidade: new Date(),
    resultado: 'Apto',
    documento: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  
  const examesRealizados = form.watch('examesRealizados') || [];
  
  const handleOpenDialog = (edit: boolean = false, index: number | null = null) => {
    if (edit && index !== null) {
      const exame = examesRealizados[index];
      setCurrentExame({
        exameId: exame.exameId,
        dataRealizado: exame.dataRealizado,
        dataValidade: exame.dataValidade,
        resultado: exame.resultado,
        documento: exame.documento || null
      });
      setIsEditing(true);
      setEditingIndex(index);
    } else {
      setCurrentExame({
        exameId: '',
        dataRealizado: new Date(),
        dataValidade: new Date(),
        resultado: 'Apto',
        documento: null
      });
      setIsEditing(false);
      setEditingIndex(null);
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveExame = () => {
    if (!currentExame.exameId) return;
    
    const newExame: ExameRealizado = {
      exameId: currentExame.exameId,
      dataRealizado: currentExame.dataRealizado,
      dataValidade: currentExame.dataValidade,
      resultado: currentExame.resultado,
      documento: currentExame.documento
    };
    
    if (isEditing && editingIndex !== null) {
      // Update existing exam
      const updatedExames = [...examesRealizados];
      updatedExames[editingIndex] = newExame;
      form.setValue('examesRealizados', updatedExames);
    } else {
      // Add new exam
      const updatedExames = [...examesRealizados, newExame];
      form.setValue('examesRealizados', updatedExames);
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteExame = () => {
    if (deletingIndex !== null) {
      const updatedExames = examesRealizados.filter((_, i) => i !== deletingIndex);
      form.setValue('examesRealizados', updatedExames);
      setDeletingIndex(null);
    }
  };
  
  const getExameById = (id: string): ExameMedico | undefined => {
    return mockExamesMedicos.find(exame => exame.id === id);
  };
  
  const isExameValido = (dataValidade: Date): boolean => {
    return new Date() < dataValidade;
  };
  
  // Calculate if exam will expire soon (within 30 days)
  const isExameExpiringSoon = (dataValidade: Date): boolean => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return !isExameValido(dataValidade) && today <= dataValidade && dataValidade <= thirtyDaysFromNow;
  };
  
  const setExameValidade = (exameId: string, dataRealizado: Date) => {
    const exame = getExameById(exameId);
    if (exame && exame.periodicidade) {
      const dataValidade = new Date(dataRealizado);
      dataValidade.setMonth(dataValidade.getMonth() + exame.periodicidade);
      setCurrentExame(prev => ({ ...prev, dataValidade }));
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Exames Médicos</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Exame
        </Button>
      </div>
      
      {examesRealizados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examesRealizados.map((exame, index) => {
            const exameInfo = getExameById(exame.exameId);
            const isValido = isExameValido(exame.dataValidade);
            const isExpiringSoon = isExameExpiringSoon(exame.dataValidade);
            
            return (
              <Card key={index} className={cn(
                !isValido ? "border-red-200 bg-red-50" : 
                isExpiringSoon ? "border-amber-200 bg-amber-50" : ""
              )}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{exameInfo?.nome || "Exame Médico"}</CardTitle>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleOpenDialog(true, index)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeletingIndex(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Data:</p>
                      <p>{format(exame.dataRealizado, "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Validade:</p>
                      <p>{format(exame.dataValidade, "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Resultado:</p>
                      <p>{exame.resultado}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status:</p>
                      <div>
                        {!isValido ? (
                          <Badge variant="destructive">Vencido</Badge>
                        ) : isExpiringSoon ? (
                          <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600">
                            Vence em breve
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                            Válido
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {exame.documento && (
                    <div className="mt-2 flex items-center gap-2">
                      <FilePlus className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-blue-500">Documento anexado</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center border border-dashed rounded-md p-8 bg-slate-50">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Nenhum exame médico registrado</p>
          <Button className="mt-4" onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Exame
          </Button>
        </div>
      )}
      
      {/* Dialog for adding/editing exams */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Exame Médico' : 'Adicionar Exame Médico'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do exame médico realizado pelo funcionário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exame-tipo">Tipo de Exame</Label>
              <Select
                value={currentExame.exameId}
                onValueChange={(value) => {
                  setCurrentExame(prev => ({ ...prev, exameId: value }));
                  setExameValidade(value, currentExame.dataRealizado);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o exame" />
                </SelectTrigger>
                <SelectContent>
                  {mockExamesMedicos.map(exame => (
                    <SelectItem key={exame.id} value={exame.id}>
                      {exame.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data do Exame</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !currentExame.dataRealizado && "text-muted-foreground"
                      )}
                    >
                      {currentExame.dataRealizado ? (
                        format(currentExame.dataRealizado, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={currentExame.dataRealizado}
                      onSelect={(date) => {
                        if (date) {
                          setCurrentExame(prev => ({ ...prev, dataRealizado: date }));
                          if (currentExame.exameId) {
                            setExameValidade(currentExame.exameId, date);
                          }
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Validade</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !currentExame.dataValidade && "text-muted-foreground"
                      )}
                    >
                      {currentExame.dataValidade ? (
                        format(currentExame.dataValidade, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={currentExame.dataValidade}
                      onSelect={(date) => {
                        if (date) {
                          setCurrentExame(prev => ({ ...prev, dataValidade: date }));
                        }
                      }}
                      disabled={(date) => date < currentExame.dataRealizado}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resultado">Resultado</Label>
              <Select
                value={currentExame.resultado}
                onValueChange={(value) => {
                  setCurrentExame(prev => ({ ...prev, resultado: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apto">Apto</SelectItem>
                  <SelectItem value="Apto com restrições">Apto com restrições</SelectItem>
                  <SelectItem value="Inapto">Inapto</SelectItem>
                  <SelectItem value="Inapto temporário">Inapto temporário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DocumentUploader
              label="Anexar Documento"
              description="PDF ou imagem do exame médico"
              onFileChange={(file) => {
                setCurrentExame(prev => ({ ...prev, documento: file }));
              }}
              value={currentExame.documento}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveExame}>
              {isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation dialog for deleting */}
      <AlertDialog open={deletingIndex !== null} onOpenChange={(open) => !open && setDeletingIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Exame</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de exame? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExame} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamesMedicosTab;
