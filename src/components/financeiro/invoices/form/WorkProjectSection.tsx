
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Work } from '@/types/financeiro';
import { useFormContext } from 'react-hook-form';

// Mock work/projects data
const mockWorks: Work[] = [
  {
    id: 'work1',
    name: 'Construção Residencial Vila Verde',
    description: 'Construção de condomínio residencial com 24 unidades',
    clientName: 'Incorporadora XYZ',
    status: 'in_progress',
    startDate: '2023-02-15',
    budget: 1200000,
    location: 'São Paulo, SP',
    createdAt: '2023-01-10',
    updatedAt: '2023-01-10',
    createdBy: 'user1'
  },
  {
    id: 'work2',
    name: 'Reforma Comercial Centro',
    description: 'Reforma de escritório comercial',
    clientName: 'Empresa ABC Ltda',
    status: 'in_progress',
    startDate: '2023-03-20',
    endDate: '2023-06-30',
    budget: 350000,
    location: 'Rio de Janeiro, RJ',
    createdAt: '2023-02-05',
    updatedAt: '2023-02-05',
    createdBy: 'user1'
  },
  {
    id: 'work3',
    name: 'Construção Industrial Zona Leste',
    description: 'Construção de galpão industrial',
    clientName: 'Indústrias XYZ',
    status: 'planning',
    startDate: '2023-07-01',
    budget: 2500000,
    location: 'Guarulhos, SP',
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
    createdBy: 'user1'
  }
];

interface WorkProjectSectionProps {
  disabled?: boolean;
}

const WorkProjectSection: React.FC<WorkProjectSectionProps> = ({ disabled = false }) => {
  const { control, setValue } = useFormContext();

  // Handle work selection and update the workName field
  const handleWorkChange = (workId: string) => {
    if (workId === 'none') {
      setValue('workName', '');
      return;
    }
    
    const selectedWork = mockWorks.find(work => work.id === workId);
    if (selectedWork) {
      setValue('workName', selectedWork.name);
    } else {
      setValue('workName', '');
    }
  };

  return (
    <FormField
      control={control}
      name="workId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Obra/Projeto</FormLabel>
          <Select
            disabled={disabled}
            value={field.value || 'none'}
            onValueChange={(value) => {
              field.onChange(value === 'none' ? '' : value);
              handleWorkChange(value);
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma obra ou projeto" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {mockWorks.map((work) => (
                <SelectItem key={work.id} value={work.id}>
                  {work.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WorkProjectSection;
export { mockWorks }; // Export for reuse in other components
