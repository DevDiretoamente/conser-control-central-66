
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import {
  Calendar,
  AlertTriangle,
  Save,
  Edit,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RegistroPonto, StatusDia } from '@/types/cartaoPonto';
import { User } from '@/types/auth';
import StatusBadge from './StatusBadge';

interface RegistroDiarioProps {
  registro: RegistroPonto;
  registroTemp: Partial<RegistroPonto>;
  podeEditar: boolean;
  cartaoFechado: boolean;
  getShortDayOfWeek: (date: string) => string;
  handleStatusChange: (value: StatusDia, registro: RegistroPonto) => void;
  setRegistroTemp: (registro: Partial<RegistroPonto>) => void;
  iniciarEdicao: (registro: RegistroPonto) => void;
  cancelarEdicao: () => void;
  salvarEdicao: (registro: RegistroPonto) => void;
}

const RegistroDiario: React.FC<RegistroDiarioProps> = ({
  registro,
  registroTemp,
  podeEditar,
  cartaoFechado,
  getShortDayOfWeek,
  handleStatusChange,
  setRegistroTemp,
  iniciarEdicao,
  cancelarEdicao,
  salvarEdicao
}) => {
  // Status options
  const statusOptions: { valor: StatusDia, nome: string }[] = [
    { valor: 'normal', nome: 'Normal' },
    { valor: 'falta_injustificada', nome: 'Falta Injustificada' },
    { valor: 'atestado', nome: 'Atestado' },
    { valor: 'ferias', nome: 'Férias' },
    { valor: 'dispensado', nome: 'Dispensado' },
    { valor: 'feriado', nome: 'Feriado' },
    { valor: 'a_disposicao', nome: 'À Disposição' }
  ];

  return (
    <Card className="mb-4 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Registro do dia {new Date(registro.data).getDate()}
            <span className="text-muted-foreground font-normal text-sm">
              ({getShortDayOfWeek(registro.data)})
            </span>
          </CardTitle>
          <StatusBadge status={registro.statusDia} />
        </div>
        
        <CardDescription>
          {registro.bloqueado ? (
            <span className="flex items-center gap-1 text-amber-500">
              <AlertTriangle className="h-4 w-4" /> 
              Registro bloqueado para edição
            </span>
          ) : (
            podeEditar && !cartaoFechado ? 
              "Edite os campos abaixo e salve as alterações" : 
              "Visualizando registro de ponto"
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status do dia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status do dia</label>
            <Select 
              value={registroTemp.statusDia || registro.statusDia} 
              onValueChange={(value: StatusDia) => handleStatusChange(value, registro)}
              disabled={!podeEditar || cartaoFechado || registro.bloqueado}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.valor} value={status.valor}>
                    {status.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Textarea 
              value={registroTemp.observacoes !== undefined ? registroTemp.observacoes : registro.observacoes || ''}
              onChange={(e) => setRegistroTemp({...registroTemp, observacoes: e.target.value})}
              disabled={!podeEditar || cartaoFechado || registro.bloqueado}
              placeholder="Observações adicionais"
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>
        
        {/* Horários */}
        {(registroTemp.statusDia || registro.statusDia) === 'normal' && (
          <div>
            <div className="flex items-center mb-4">
              <div className="h-px flex-1 bg-border"></div>
              <span className="px-3 text-sm text-muted-foreground">Horários do dia</span>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Entrada Extra
                </label>
                <Input 
                  type="time"
                  value={registroTemp.entradaExtra !== undefined ? registroTemp.entradaExtra : registro.entradaExtra || ''}
                  onChange={(e) => setRegistroTemp({...registroTemp, entradaExtra: e.target.value})}
                  disabled={!podeEditar || cartaoFechado || registro.bloqueado}
                  className="text-center"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Entrada
                </label>
                <Input 
                  type="time"
                  value={registroTemp.horaEntradaManha !== undefined ? registroTemp.horaEntradaManha : registro.horaEntradaManha || ''}
                  onChange={(e) => setRegistroTemp({...registroTemp, horaEntradaManha: e.target.value})}
                  disabled={!podeEditar || cartaoFechado || registro.bloqueado}
                  className="text-center"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Saída Almoço
                </label>
                <Input 
                  type="time"
                  value={registroTemp.horaSaidaAlmoco !== undefined ? registroTemp.horaSaidaAlmoco : registro.horaSaidaAlmoco || ''}
                  onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaAlmoco: e.target.value})}
                  disabled={!podeEditar || cartaoFechado || registro.bloqueado}
                  className="text-center"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Retorno Almoço
                </label>
                <Input 
                  type="time"
                  value={registroTemp.horaRetornoAlmoco !== undefined ? registroTemp.horaRetornoAlmoco : registro.horaRetornoAlmoco || ''}
                  onChange={(e) => setRegistroTemp({...registroTemp, horaRetornoAlmoco: e.target.value})}
                  disabled={!podeEditar || cartaoFechado || registro.bloqueado}
                  className="text-center"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Saída
                </label>
                <Input 
                  type="time"
                  value={registroTemp.horaSaidaTarde !== undefined ? registroTemp.horaSaidaTarde : registro.horaSaidaTarde || ''}
                  onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaTarde: e.target.value})}
                  disabled={!podeEditar || cartaoFechado || registro.bloqueado}
                  className="text-center"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Saída Extra
                </label>
                <Input 
                  type="time"
                  value={registroTemp.horaSaidaExtra !== undefined ? registroTemp.horaSaidaExtra : registro.horaSaidaExtra || ''}
                  onChange={(e) => setRegistroTemp({...registroTemp, horaSaidaExtra: e.target.value})}
                  disabled={!podeEditar || cartaoFechado || registro.bloqueado}
                  className="text-center"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-end space-x-2">
        {podeEditar && !cartaoFechado && !registro.bloqueado && Object.keys(registroTemp).length > 0 && (
          <>
            <Button 
              variant="outline" 
              onClick={cancelarEdicao}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              onClick={() => salvarEdicao(registro)}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </>
        )}
        
        {podeEditar && !cartaoFechado && !registro.bloqueado && Object.keys(registroTemp).length === 0 && (
          <Button
            variant="outline" 
            onClick={() => iniciarEdicao(registro)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Editar Registro
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RegistroDiario;
