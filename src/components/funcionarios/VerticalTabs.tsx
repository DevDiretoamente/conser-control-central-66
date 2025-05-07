
import React from 'react';
import { cn } from "@/lib/utils";
import {
  Contact,
  User,
  Home,
  Briefcase,
  CreditCard,
  Car,
  Building2,
  Shirt,
  FileText,
  Users,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

interface VerticalTabsProps {
  defaultValue: string;
  onChange: (value: string) => void;
  completedSections: string[];
}

const VerticalTabs: React.FC<VerticalTabsProps> = ({
  defaultValue,
  onChange,
  completedSections = []
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="mb-4 text-lg font-medium">Cadastro de Funcionário</h3>
      
      <TabItem
        value="dados-pessoais"
        icon={<User className="h-4 w-4" />}
        label="Dados Pessoais"
        currentValue={defaultValue}
        onClick={() => onChange("dados-pessoais")}
        completed={completedSections.includes("dados-pessoais")}
      />
      
      <TabItem
        value="endereco"
        icon={<Home className="h-4 w-4" />}
        label="Endereço"
        currentValue={defaultValue}
        onClick={() => onChange("endereco")}
        completed={completedSections.includes("endereco")}
      />
      
      <TabItem
        value="contato"
        icon={<Contact className="h-4 w-4" />}
        label="Contato"
        currentValue={defaultValue}
        onClick={() => onChange("contato")}
        completed={completedSections.includes("contato")}
      />
      
      <TabDivider label="Dados Profissionais" />
      
      <TabItem
        value="funcao"
        icon={<Briefcase className="h-4 w-4" />}
        label="Função"
        currentValue={defaultValue}
        onClick={() => onChange("funcao")}
        completed={completedSections.includes("funcao")}
      />
      
      <TabItem
        value="dados-profissionais"
        icon={<Building2 className="h-4 w-4" />}
        label="Registro Profissional"
        currentValue={defaultValue}
        onClick={() => onChange("dados-profissionais")}
        completed={completedSections.includes("dados-profissionais")}
      />
      
      <TabItem
        value="cnh"
        icon={<Car className="h-4 w-4" />}
        label="CNH"
        currentValue={defaultValue}
        onClick={() => onChange("cnh")}
        completed={completedSections.includes("cnh")}
      />
      
      <TabItem
        value="dados-bancarios"
        icon={<CreditCard className="h-4 w-4" />}
        label="Dados Bancários"
        currentValue={defaultValue}
        onClick={() => onChange("dados-bancarios")}
        completed={completedSections.includes("dados-bancarios")}
      />
      
      <TabItem
        value="uniformes"
        icon={<Shirt className="h-4 w-4" />}
        label="Uniformes"
        currentValue={defaultValue}
        onClick={() => onChange("uniformes")}
        completed={completedSections.includes("uniformes")}
      />
      
      <TabDivider label="Documentos e Dependentes" />
      
      <TabItem
        value="documentos"
        icon={<FileText className="h-4 w-4" />}
        label="Documentos"
        currentValue={defaultValue}
        onClick={() => onChange("documentos")}
        completed={completedSections.includes("documentos")}
      />
      
      <TabItem
        value="dependentes"
        icon={<Users className="h-4 w-4" />}
        label="Dependentes"
        currentValue={defaultValue}
        onClick={() => onChange("dependentes")}
        completed={completedSections.includes("dependentes")}
      />
      
      <TabDivider label="Segurança e Saúde" />
      
      <TabItem
        value="epis"
        icon={<ShieldCheck className="h-4 w-4" />}
        label="EPIs"
        currentValue={defaultValue}
        onClick={() => onChange("epis")}
        completed={completedSections.includes("epis")}
      />
      
      <TabItem
        value="exames-medicos"
        icon={<Stethoscope className="h-4 w-4" />}
        label="Exames Médicos"
        currentValue={defaultValue}
        onClick={() => onChange("exames-medicos")}
        completed={completedSections.includes("exames-medicos")}
      />
    </div>
  );
};

const TabItem = ({ 
  value, 
  icon, 
  label, 
  currentValue, 
  onClick,
  completed
}: { 
  value: string; 
  icon: React.ReactNode; 
  label: string; 
  currentValue: string;
  onClick: () => void;
  completed?: boolean;
}) => {
  const isActive = currentValue === value;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
        completed && !isActive && "text-green-600"
      )}
    >
      {icon}
      <span className="text-left">{label}</span>
      {completed && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            "h-4 w-4 ml-auto",
            isActive ? "text-primary" : "text-green-600"
          )}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      )}
    </button>
  );
};

const TabDivider = ({ label }: { label: string }) => {
  return (
    <div className="pt-3 pb-1">
      <p className="text-xs font-semibold text-muted-foreground mb-2 px-3">
        {label}
      </p>
      <div className="h-px bg-border" />
    </div>
  );
};

export default VerticalTabs;
