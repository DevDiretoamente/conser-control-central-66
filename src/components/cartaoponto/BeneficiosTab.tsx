import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { beneficioService } from '@/services/beneficioService';
import { toast } from '@/hooks/use-toast';
import { Clock, ShoppingBag, Utensils } from 'lucide-react';

const BeneficiosTab: React.FC = () => {
  const [cestaBasica, setCestaBasica] = useState<number>(0);
  const [lanche, setLanche] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadBeneficios();
  }, []);

  const loadBeneficios = async () => {
    try {
      setLoading(true);
      const { cestaBasica, lanche } = await beneficioService.getCurrentValues();
      setCestaBasica(cestaBasica);
      setLanche(lanche);
    } catch (error) {
      console.error('Error loading beneficios:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os valores dos benefícios.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get existing benefits
      const benefits = await beneficioService.getAll();
      const cestaBasicaBenefit = benefits.find(b => b.tipo === 'cesta_basica');
      const lancheBenefit = benefits.find(b => b.tipo === 'lanche');
      
      // Update cesta básica
      if (cestaBasicaBenefit) {
        await beneficioService.update(cestaBasicaBenefit.id, { valor: cestaBasica });
      } else {
        await beneficioService.create({
          tipo: 'cesta_basica',
          valor: cestaBasica,
          observacoes: 'Valor da cesta básica',
          dataAtualizacao: new Date().toISOString()
        });
      }
      
      // Update lanche
      if (lancheBenefit) {
        await beneficioService.update(lancheBenefit.id, { valor: lanche });
      } else {
        await beneficioService.create({
          tipo: 'lanche',
          valor: lanche,
          observacoes: 'Valor do lanche da tarde',
          dataAtualizacao: new Date().toISOString()
        });
      }
      
      toast({
        title: 'Sucesso',
        description: 'Valores dos benefícios atualizados com sucesso.',
      });
    } catch (error) {
      console.error('Error saving beneficios:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar os valores dos benefícios.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gerenciamento de Benefícios</h3>
        <p className="text-sm text-muted-foreground">
          Configure os valores dos benefícios que serão aplicados aos funcionários.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cesta Básica
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cestaBasica">Valor (R$)</Label>
                <Input
                  id="cestaBasica"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cestaBasica}
                  onChange={(e) => setCestaBasica(Number(e.target.value))}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valor da cesta básica fornecida mensalmente aos funcionários elegíveis.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Regras de Elegibilidade</h4>
                <ul className="text-xs text-muted-foreground list-disc pl-5">
                  <li>Funcionário não deve ter faltas injustificadas no mês</li>
                  <li>Status deve estar ativo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lanche da Tarde
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lanche">Valor (R$)</Label>
                <Input
                  id="lanche"
                  type="number"
                  min="0"
                  step="0.01"
                  value={lanche}
                  onChange={(e) => setLanche(Number(e.target.value))}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valor do lanche fornecido aos funcionários quando fazem horas extras.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Regras de Elegibilidade</h4>
                <ul className="text-xs text-muted-foreground list-disc pl-5">
                  <li>Funcionário deve fazer mais de 1 hora extra no dia</li>
                  <li>Valor é creditado por dia de trabalho com hora extra elegível</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading || saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};

export default BeneficiosTab;
