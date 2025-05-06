
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  User, MapPin, Phone, Briefcase, FileText, 
  CreditCard, Car, Shirt, File, Users, Check 
} from 'lucide-react';

interface VerticalTabProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  isCompleted?: boolean;
  isCurrent: boolean;
  onClick: (value: string) => void;
}

const VerticalTab: React.FC<VerticalTabProps> = ({
  value,
  label,
  icon,
  isCompleted = false,
  isCurrent,
  onClick
}) => {
  return (
    <button
      className={cn(
        "flex items-center w-full px-3 py-2.5 mb-1 rounded-md transition-colors text-left",
        isCurrent 
          ? "bg-primary text-primary-foreground font-medium" 
          : "hover:bg-accent",
        isCompleted && "text-green-600"
      )}
      onClick={() => onClick(value)}
    >
      <div className={cn(
        "mr-3 flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full",
        isCompleted ? "bg-green-100" : (isCurrent ? "bg-primary-foreground text-primary" : "bg-muted")
      )}>
        {isCompleted ? <Check size={14} /> : icon}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
};

interface VerticalTabsProps {
  defaultValue: string;
  onChange: (value: string) => void;
  completedSections?: string[];
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({ 
  defaultValue,
  onChange,
  completedSections = []
}) => {
  const [currentTab, setCurrentTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    onChange(value);
  };

  const tabs = [
    { value: "dados-pessoais", label: "Dados Pessoais", icon: <User size={14} /> },
    { value: "endereco", label: "Endereço", icon: <MapPin size={14} /> },
    { value: "contato", label: "Contato", icon: <Phone size={14} /> },
    { value: "funcao", label: "Função", icon: <Briefcase size={14} /> },
    { value: "dados-profissionais", label: "Dados Profissionais", icon: <FileText size={14} /> },
    { value: "cnh", label: "CNH", icon: <Car size={14} /> },
    { value: "dados-bancarios", label: "Dados Bancários", icon: <CreditCard size={14} /> },
    { value: "uniformes", label: "Uniformes", icon: <Shirt size={14} /> },
    { value: "documentos", label: "Documentos", icon: <File size={14} /> },
    { value: "dependentes", label: "Dependentes", icon: <Users size={14} /> },
  ];

  return (
    <div className="w-full flex flex-col">
      {tabs.map((tab) => (
        <VerticalTab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          icon={tab.icon}
          isCompleted={completedSections.includes(tab.value)}
          isCurrent={currentTab === tab.value}
          onClick={handleTabChange}
        />
      ))}
    </div>
  );
};

export default VerticalTabs;
