
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice, InvoiceItem } from '@/types/financeiro';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Define colors for chart categories
const COLORS = [
  '#8B5CF6', // Purple
  '#D946EF', // Pink
  '#EC4899', // Pink red
  '#F97316', // Orange  
  '#0EA5E9', // Blue
  '#10B981', // Green
  '#EAB308', // Yellow
  '#6366F1', // Indigo
  '#64748B', // Slate
];

interface ExpenseAnalyticsProps {
  invoices: Invoice[];
}

const ExpenseAnalytics: React.FC<ExpenseAnalyticsProps> = ({ invoices }) => {
  const [chartType, setChartType] = useState<'category' | 'work'>('category');

  // Extract and aggregate expense data by category
  const getCategoryData = () => {
    const categoryMap: Record<string, number> = {};
    
    invoices.forEach(invoice => {
      if (invoice.items && invoice.items.length > 0) {
        invoice.items.forEach(item => {
          const categoryName = item.categoryName || 'Não categorizado';
          categoryMap[categoryName] = (categoryMap[categoryName] || 0) + item.totalPrice;
        });
      }
    });
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value); // Sort by value descending
  };

  // Extract and aggregate expense data by work/project
  const getWorkData = () => {
    const workMap: Record<string, number> = {};
    
    invoices.forEach(invoice => {
      const workName = invoice.workName || 'Não associado';
      workMap[workName] = (workMap[workName] || 0) + invoice.totalAmount;
    });
    
    return Object.entries(workMap).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const chartData = chartType === 'category' ? getCategoryData() : getWorkData();
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Customize tooltip for recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Cut name if too long for bar chart
  const shortenName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Análise de Despesas</CardTitle>
        <Select value={chartType} onValueChange={(value: 'category' | 'work') => setChartType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Visualizar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Por Categoria</SelectItem>
            <SelectItem value="work">Por Obra/Projeto</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart for distribution visualization */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart for direct comparison */}
        <div className="h-[300px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.slice(0, 8)} // Only show top 8 for readability
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickFormatter={shortenName} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                name={chartType === 'category' ? "Despesa por Categoria" : "Despesa por Obra"} 
                fill="#8B5CF6" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseAnalytics;
