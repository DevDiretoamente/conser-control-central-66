
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import RelatorioHorasTrabalhadas from '@/components/relatorios/RelatorioHorasTrabalhadas';
import RelatorioValeRefeicao from '@/components/relatorios/RelatorioValeRefeicao';
import { Printer, Download, FileText } from 'lucide-react';

const RelatoriosPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize e exporte relatórios para a contabilidade
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="horas" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="horas">
            <FileText className="mr-2 h-4 w-4" />
            Horas Trabalhadas
          </TabsTrigger>
          <TabsTrigger value="beneficios">
            <FileText className="mr-2 h-4 w-4" />
            Vale Refeição
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="horas">
          <Card>
            <CardContent className="pt-6">
              <RelatorioHorasTrabalhadas 
                mes={currentDate.getMonth() + 1}
                ano={currentDate.getFullYear()}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="beneficios">
          <Card>
            <CardContent className="pt-6">
              <RelatorioValeRefeicao 
                mes={currentDate.getMonth() + 1}
                ano={currentDate.getFullYear()}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;
