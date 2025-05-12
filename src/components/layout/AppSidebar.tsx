
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '../Logo';
import {
  Users,
  Building,
  Briefcase,
  FileText,
  Settings,
  Truck,
  LayoutDashboard,
  Clock,
  Building2,
  BadgeCheck,
  UserCog,
  Mail,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, PermissionLevel, PermissionArea } from '@/types/auth';

// Completely redesigned sidebar that's always visible
const AppSidebar = ({ isCollapsed = false }) => {
  const { user, logout, hasSpecificPermission } = useAuth();

  // Styled navigation link component
  const NavItem = ({ to, icon: Icon, label, hasPermission = true }) => {
    if (!hasPermission) return null;
    
    return (
      <NavLink
        to={to}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-4 py-3 mb-1 rounded-md transition-all",
          "text-white hover:bg-sidebar-accent",
          isActive ? "bg-sidebar-accent font-medium" : "bg-transparent"
        )}
      >
        <Icon size={20} className="flex-shrink-0 text-white" />
        {!isCollapsed && <span>{label}</span>}
      </NavLink>
    );
  };
  
  // Styled section heading
  const SectionHeading = ({ children }) => (
    !isCollapsed && (
      <h2 className="px-4 pt-6 pb-2 text-xs font-semibold text-white/70 uppercase tracking-wider">
        {children}
      </h2>
    )
  );

  // HR section with a visible user
  const rhSection = (
    <div className="mt-2">
      <SectionHeading>Recursos Humanos</SectionHeading>
      <div className="space-y-1">
        <NavItem 
          to="/funcionarios" 
          icon={Users} 
          label="Funcionários" 
          hasPermission={hasSpecificPermission('funcionarios', 'read')} 
        />
        <NavItem 
          to="/funcionarios/exames" 
          icon={FileText} 
          label="Exames Médicos" 
          hasPermission={hasSpecificPermission('exames', 'read')}
        />
        <NavItem 
          to="/rh/cartao-ponto" 
          icon={Clock} 
          label="Cartão Ponto" 
          hasPermission={hasSpecificPermission('cartaoponto', 'read')}
        />
      </div>
    </div>
  );

  // Config section
  const configSection = (
    <div className="mt-2">
      <SectionHeading>Configurações</SectionHeading>
      <div className="space-y-1">
        <NavItem 
          to="/funcoes" 
          icon={Briefcase} 
          label="Funções" 
          hasPermission={hasSpecificPermission('funcoes', 'read')}
        />
        <NavItem 
          to="/setores" 
          icon={Building} 
          label="Setores" 
          hasPermission={hasSpecificPermission('setores', 'read')}
        />
        <NavItem 
          to="/clinicas" 
          icon={Building2} 
          label="Clínicas" 
          hasPermission={hasSpecificPermission('clinicas', 'read')}
        />
        <NavItem 
          to="/exames" 
          icon={BadgeCheck} 
          label="Exames" 
          hasPermission={hasSpecificPermission('exames', 'read')}
        />
        <NavItem 
          to="/configuracoes/usuarios" 
          icon={UserCog} 
          label="Usuários" 
          hasPermission={hasSpecificPermission('usuarios', 'read')}
        />
        <NavItem 
          to="/configuracoes/emails" 
          icon={Mail} 
          label="E-mails" 
          hasPermission={hasSpecificPermission('configuracoes', 'read')}
        />
      </div>
    </div>
  );

  // Main dashboard links
  const mainLinks = (
    <div className="mt-6">
      <div className="space-y-1">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem 
          to="/obras" 
          icon={Building} 
          label="Obras" 
          hasPermission={hasSpecificPermission('obras', 'read')}
        />
        <NavItem 
          to="/frota" 
          icon={Truck} 
          label="Frota" 
          hasPermission={hasSpecificPermission('frota', 'read')}
        />
        <NavItem 
          to="/patrimonio" 
          icon={Briefcase} 
          label="Patrimônio" 
          hasPermission={hasSpecificPermission('patrimonio', 'read')}
        />
        <NavItem 
          to="/financeiro" 
          icon={FileText} 
          label="Financeiro" 
          hasPermission={hasSpecificPermission('financeiro', 'read')}
        />
        <NavItem 
          to="/exames" 
          icon={Stethoscope} 
          label="Exames" 
          hasPermission={hasSpecificPermission('exames', 'read')}
        />
      </div>
    </div>
  );

  return (
    <div 
      className={cn(
        "bg-gradient-to-b from-sidebar-primary to-sidebar-background fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo section */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Logo />
      </div>
      
      {/* Navigation sections - always visible */}
      <nav className="flex-1 space-y-2 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent">
        {mainLinks}
        {rhSection}
        {configSection}
      </nav>

      {/* User info - always visible */}
      <div className="mt-auto border-t border-sidebar-border p-4 bg-sidebar-accent/30">
        {user && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-xs text-white/70">{user.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppSidebar;
