
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  Home,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
  Car,
  CircleCheck,
  FileBadge,
  FileCheck,
  Stethoscope,
  FileOutput
} from 'lucide-react';

interface VerticalTabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  completedSections?: string[];
}

const VerticalTabs: React.FC<VerticalTabsProps> = ({
  defaultValue = 'dados-pessoais',
  value,
  onChange,
  completedSections = [],
}) => {
  // Use the controlled value if provided, otherwise use internal state
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultValue);
  
  // Make sure we update the internal state when the controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalActiveTab(value);
    }
  }, [value]);
  
  const activeTab = value !== undefined ? value : internalActiveTab;

  const handleTabChange = (tabValue: string) => {
    setInternalActiveTab(tabValue);
    if (onChange) {
      onChange(tabValue);
    }
  };

  const tabs = [
    { id: 'dados-pessoais', label: 'Dados Pessoais', icon: <User className="h-5 w-5" /> },
    { id: 'endereco', label: 'Endereço', icon: <Home className="h-5 w-5" /> },
    { id: 'contato', label: 'Contato', icon: <Phone className="h-5 w-5" /> },
    { id: 'funcao', label: 'Função', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'dados-profissionais', label: 'Dados Profissionais', icon: <Building2 className="h-5 w-5" /> },
    { id: 'cnh', label: 'CNH', icon: <Car className="h-5 w-5" /> },
    { id: 'dados-bancarios', label: 'Dados Bancários', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'uniformes', label: 'Uniformes', icon: <BadgeCheck className="h-5 w-5" /> },
    { id: 'documentos', label: 'Documentos', icon: <FileText className="h-5 w-5" /> },
    { id: 'dependentes', label: 'Dependentes', icon: <Users className="h-5 w-5" /> },
    { id: 'documentos-impressao', label: 'Documentos para Impressão', icon: <FileOutput className="h-5 w-5" /> },
    { id: 'exames-medicos', label: 'Exames Médicos', icon: <Stethoscope className="h-5 w-5" /> },
    { id: 'epis', label: 'EPIs', icon: <ShieldCheck className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            activeTab === tab.id
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
          onClick={() => handleTabChange(tab.id)}
          type="button" // Important: prevent form submission when clicking tabs
        >
          {tab.icon}
          <span className="flex-1 text-left">{tab.label}</span>
          {completedSections.includes(tab.id) && (
            <CircleCheck className="h-4 w-4 text-green-500" />
          )}
        </button>
      ))}
    </div>
  );
};

export default VerticalTabs;
