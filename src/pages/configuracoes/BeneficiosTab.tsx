import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Beneficio } from '@/types/cartaoPonto';
import { beneficioService } from '@/services/beneficioService';
import { Save, Edit, AlertCircle, CheckCircle } from 'lucide-react';

const BeneficiosTab: React.FC = () => {
  const [cestaBasica, setCestaBasica] = useState<Beneficio | null>(null);
  const [lanche, setLanche] = useState<Beneficio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCestaBasica, setEditingCestaBasica] = useState(false);
  const [editingLanche, setEditingLanche] = useState(false);
  const [valorCestaBasica, setValorCestaBasica] = useState('0');
  const [valorLanche, setValorLanche] = useState('0');
  const [observacoesCestaBasica, setObservacoesCestaBasica] = useState('');
  const [observacoesLanche, setObservacoesLanche] = useState('');

  useEffect(() => {
    loadBeneficios();
  }, []);

  const loadBeneficios = async () => {
    setLoading(true);
    try {
      const cestaBasicaData = await beneficioService.getByTipo('cesta_basica');
      const lancheData = await beneficioService.getByTipo('lanche');
      
      setCestaBasica(cestaBasicaData);
      setLanche(lancheData);
      
      if (cestaBasicaData) {
        setValorCestaBasica(cestaBasicaData.valor.toString());
        setObservacoesCestaBasica(cestaBasicaData.observacoes || '');
      }
      
      if (lancheData) {
        setValorLanche(lancheData.valor.toString());
        setObservacoesLanche(lancheData.observacoes || '');
      }
    } catch (error) {
      console.error('Erro ao carregar benefícios:', error);
      toast.error('Erro ao carregar benefícios. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCestaBasica = async () => {
    setSaving(true);
    try {
      const valorNumerico = parseFloat(valorCestaBasica);
      if (isNaN(valorNumerico) || valorNumerico < 0) {
        toast.error('Valor inválido para cesta básica.');
        return;
      }

      if (cestaBasica) {
        await beneficioService.update(cestaBasica.id, {
          valor: valorNumerico,
          observacoes: observacoesCestaBasica
        });
      } else {
        await beneficioService.create({
          tipo: 'cesta_basica',
          valor: valorNumerico,
          observacoes: observacoesCestaBasica,
          dataAtualizacao: new Date().toISOString()
        });
      }
      
      toast.success('Valor da cesta básica atualizado com sucesso!');
      setEditingCestaBasica(false);
      await loadBeneficios();
    } catch (error) {
      console.error('Erro ao salvar valor da cesta básica:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLanche = async () => {
    setSaving(true);
    try {
      const valorNumerico = parseFloat(valorLanche);
      if (isNaN(valorNumerico) || valorNumerico < 0) {
        toast.error('Valor inválido para lanche.');
        return;
      }

      if (lanche) {
        await beneficioService.update(lanche.id, {
          valor: valorNumerico,
          observacoes: observacoesLanche
        });
      } else {
        await beneficioService.create({
          tipo: 'lanche',
          valor: valorNumerico,
          observacoes: observacoesLanche,
          dataAtualizacao: new Date().toISOString()
        });
      }
      
      toast.success('Valor do lanche atualizado com sucesso!');
      setEditingLanche(false);
      await loadBeneficios();
    } catch (error) {
      console.error('Erro ao salvar valor do lanche:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vale Cesta Básica</CardTitle>
          <CardDescription>
            Configure o valor padrão da cesta básica para todos os funcionários elegíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!editingCestaBasica ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Valor Atual</Label>
                    <div className="text-2xl font-bold">
                      {cestaBasica ? formatCurrency(cestaBasica.valor) : 'Não definido'}
                    </div>
                    {cestaBasica && (
                      <p className="text-sm text-muted-foreground">
                        Última atualização: {formatDate(cestaBasica.dataAtualizacao)}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => setEditingCestaBasica(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
                
                {cestaBasica?.observacoes && (
                  <div>
                    <Label>Observações</Label>
                    <p className="text-sm text-muted-foreground mt-1">{cestaBasica.observacoes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="valorCestaBasica">Valor (R$)</Label>
                  <Input
                    id="valorCestaBasica"
                    type="number"
                    min="0"
                    step="0.01"
                    value={valorCestaBasica}
                    onChange={(e) => setValorCestaBasica(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="obsCestaBasica">Observações (opcional)</Label>
                  <Input
                    id="obsCestaBasica"
                    value={observacoesCestaBasica}
                    onChange={(e) => setObservacoesCestaBasica(e.target.value)}
                    placeholder="Adicione informações sobre este benefício"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingCestaBasica(false);
                      if (cestaBasica) {
                        setValorCestaBasica(cestaBasica.valor.toString());
                        setObservacoesCestaBasica(cestaBasica.observacoes || '');
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveCestaBasica}
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vale Lanche</CardTitle>
          <CardDescription>
            Configure o valor do lanche por dia trabalhado com hora extra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!editingLanche ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Valor Atual</Label>
                    <div className="text-2xl font-bold">
                      {lanche ? formatCurrency(lanche.valor) : 'Não definido'}
                    </div>
                    {lanche && (
                      <p className="text-sm text-muted-foreground">
                        Última atualização: {formatDate(lanche.dataAtualizacao)}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => setEditingLanche(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
                
                {lanche?.observacoes && (
                  <div>
                    <Label>Observações</Label>
                    <p className="text-sm text-muted-foreground mt-1">{lanche.observacoes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="valorLanche">Valor (R$)</Label>
                  <Input
                    id="valorLanche"
                    type="number"
                    min="0"
                    step="0.01"
                    value={valorLanche}
                    onChange={(e) => setValorLanche(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="obsLanche">Observações (opcional)</Label>
                  <Input
                    id="obsLanche"
                    value={observacoesLanche}
                    onChange={(e) => setObservacoesLanche(e.target.value)}
                    placeholder="Adicione informações sobre este benefício"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingLanche(false);
                      if (lanche) {
                        setValorLanche(lanche.valor.toString());
                        setObservacoesLanche(lanche.observacoes || '');
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveLanche}
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regras de Elegibilidade</CardTitle>
          <CardDescription>
            Informações sobre como os benefícios são aplicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/50">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Vale Cesta Básica</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Concedido a todos os funcionários que não tiveram faltas injustificadas no mês.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/50">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Vale Lanche</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Concedido para cada dia em que o funcionário realizar horas extras.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border rounded-md bg-amber-50">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-700">Importante</h4>
                <p className="text-sm text-amber-600 mt-1">
                  Os valores configurados aqui serão aplicados automaticamente aos funcionários elegíveis conforme as regras acima.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeneficiosTab;
