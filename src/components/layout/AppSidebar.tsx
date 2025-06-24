
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
  Stethoscope,
  CreditCard,
} from 'lucide-react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';

const AppSidebar = ({ isCollapsed = false }) => {
  const { profile, isLoading, hasPermission } = useSecureAuth();

  console.log('AppSidebar - profile:', profile, 'isLoading:', isLoading);

  // Styled navigation link component
  const NavItem = ({ to, icon: Icon, label, resource = null, action = 'read' }) => {
    // Se não tem resource, sempre mostra (como Dashboard)
    // Se tem resource, verifica permissão - mas para admin sempre mostra
    const shouldShow = !resource || (profile?.role === 'admin') || hasPermission(resource, action);
    
    if (!shouldShow) return null;
    
    return (
      <NavLink
        to={to}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-4 py-3 mb-1 rounded-md transition-all",
          "text-white hover:bg-slate-700/50",
          isActive ? "bg-slate-700/70 font-medium" : "bg-transparent"
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

  return (
    <div 
      className={cn(
        "bg-gradient-to-b from-[#051630] to-[#02080f] fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800/50 overflow-hidden",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo section */}
      <div className="flex h-16 items-center border-b border-slate-700/50 px-4">
        <Logo />
      </div>
      
      {/* Navigation sections */}
      <nav className="flex-1 space-y-2 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {/* Main Links */}
        <div className="mt-6">
          <div className="space-y-1">
            <NavItem to="/app" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/app/funcionarios" icon={Users} label="Funcionários" resource="funcionarios" />
            <NavItem to="/app/obras" icon={Building} label="Obras" resource="obras" />
            <NavItem to="/app/frota" icon={Truck} label="Frota" resource="frota" />
            <NavItem to="/app/patrimonio" icon={Briefcase} label="Patrimônio" resource="patrimonio" />
            <NavItem to="/app/financeiro" icon={FileText} label="Financeiro" resource="financeiro" />
          </div>
        </div>

        {/* RH Section */}
        <div className="mt-2">
          <SectionHeading>Recursos Humanos</SectionHeading>
          <div className="space-y-1">
            <NavItem to="/app/funcionarios/exames" icon={Stethoscope} label="Exames Médicos" resource="exames" />
            <NavItem to="/app/rh/cartao-ponto" icon={Clock} label="Cartão Ponto" resource="cartaoponto" />
            <NavItem to="/app/beneficios" icon={CreditCard} label="Benefícios" resource="beneficios" />
            <NavItem to="/app/rh/relatorios" icon={FileText} label="Relatórios" resource="rh" />
          </div>
        </div>

        {/* Config Section */}
        <div className="mt-2">
          <SectionHeading>Configurações</SectionHeading>
          <div className="space-y-1">
            <NavItem to="/app/funcoes" icon={Briefcase} label="Funções" resource="funcoes" />
            <NavItem to="/app/setores" icon={Building} label="Setores" resource="setores" />
            <NavItem to="/app/clinicas" icon={Building2} label="Clínicas" resource="clinicas" />
            <NavItem to="/app/exames" icon={BadgeCheck} label="Exames" resource="exames" />
            <NavItem to="/app/configuracoes/usuarios" icon={UserCog} label="Usuários" resource="usuarios" />
            <NavItem to="/app/configuracoes/emails" icon={Mail} label="E-mails" resource="emails" />
          </div>
        </div>
      </nav>

      {/* User info */}
      <div className="mt-auto border-t border-slate-700/50 p-4 bg-slate-800/30">
        {profile ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-medium text-white">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-medium text-white text-sm">{profile.name}</p>
                <p className="text-xs text-white/70">{profile.email}</p>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 animate-pulse"></div>
            {!isCollapsed && (
              <div>
                <div className="h-4 bg-slate-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-slate-700 rounded animate-pulse w-20"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-medium text-white">
              A
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-medium text-white text-sm">Admin</p>
                <p className="text-xs text-white/70">Sistema</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppSidebar;
