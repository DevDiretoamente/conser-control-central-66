
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const examesMensaisData = [
  { month: 'Jan', realizados: 8, pendentes: 2 },
  { month: 'Fev', realizados: 12, pendentes: 3 },
  { month: 'Mar', realizados: 10, pendentes: 5 },
  { month: 'Abr', realizados: 15, pendentes: 1 },
  { month: 'Mai', realizados: 9, pendentes: 4 },
  { month: 'Jun', realizados: 13, pendentes: 2 },
];

const statusAsoData = [
  { name: 'Válidos', valor: 18, fill: '#10B981' },
  { name: 'Vence em 30 dias', valor: 5, fill: '#F59E0B' },
  { name: 'Vencidos', valor: 3, fill: '#EF4444' },
];

type StatisticsPanelProps = {
  title: string;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ title }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Exames Ocupacionais Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ChartContainer
              config={{
                realizados: { label: 'Realizados', color: '#3B82F6' },
                pendentes: { label: 'Pendentes', color: '#F59E0B' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={examesMensaisData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRealizados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPendentes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="realizados" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorRealizados)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pendentes" 
                    stroke="#F59E0B" 
                    fillOpacity={1} 
                    fill="url(#colorPendentes)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Status de ASO dos Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ChartContainer
              config={{
                validos: { label: 'Válidos', color: '#10B981' },
                venceEmBreve: { label: 'Vence em 30 dias', color: '#F59E0B' },
                vencidos: { label: 'Vencidos', color: '#EF4444' },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusAsoData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="valor" name="Quantidade" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;
