
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
  LayoutDashboard
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  isCollapsed = false 
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          "hover:bg-sidebar-accent/50",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
        )
      }
    >
      <Icon size={20} />
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
};

interface AppSidebarProps {
  isCollapsed?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed = false }) => {
  return (
    <div 
      className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar-background",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        {isCollapsed ? (
          <div className="mx-auto">
            <div className="bg-conserv-primary text-white font-bold p-1 rounded">C</div>
          </div>
        ) : (
          <Logo />
        )}
      </div>
      <nav className="flex-1 space-y-1 px-2 py-3">
        <div className="mb-4">
          {!isCollapsed && (
            <h2 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/60">
              MÓDULOS
            </h2>
          )}
          <div className="space-y-1">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
            <SidebarItem to="/funcionarios" icon={Users} label="Recursos Humanos" isCollapsed={isCollapsed} />
            <SidebarItem to="/obras" icon={Building} label="Obras" isCollapsed={isCollapsed} />
            <SidebarItem to="/frota" icon={Truck} label="Frota" isCollapsed={isCollapsed} />
            <SidebarItem to="/patrimonio" icon={Briefcase} label="Patrimônio" isCollapsed={isCollapsed} />
            <SidebarItem to="/financeiro" icon={FileText} label="Financeiro" isCollapsed={isCollapsed} />
          </div>
        </div>

        <div className="pt-2">
          {!isCollapsed && (
            <h2 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/60">
              SISTEMA
            </h2>
          )}
          <div className="space-y-1">
            <SidebarItem to="/configuracoes" icon={Settings} label="Configurações" isCollapsed={isCollapsed} />
          </div>
        </div>
      </nav>

      <div className="mt-auto border-t border-sidebar-border p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent" />
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Administrador</p>
              <p className="text-xs text-sidebar-foreground/60">admin@conservias.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppSidebar;
