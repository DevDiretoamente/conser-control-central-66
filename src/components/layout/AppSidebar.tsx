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
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed?: boolean;
  requiredRole?: UserRole;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  isCollapsed = false,
  requiredRole
}) => {
  const { hasPermission } = useAuth();
  
  // Don't render the item if the user doesn't have the required role
  if (requiredRole && !hasPermission(requiredRole)) {
    return null;
  }
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-foreground",
          isActive 
            ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/70"
        )
      }
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
};

interface AppSidebarProps {
  isCollapsed?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed = false }) => {
  const { user, logout } = useAuth();

  const rhItems = [
    {
      title: "Funcionários",
      icon: <Users className="h-5 w-5" />,
      link: "/funcionarios",
      permission: { area: 'funcionarios', level: 'read' as PermissionLevel },
    },
    {
      title: "Exames Médicos",
      icon: <FileText className="h-5 w-5" />,
      link: "/funcionarios/exames",
      permission: { area: 'exames', level: 'read' as PermissionLevel },
    },
    {
      title: "Cartão Ponto",
      icon: <Clock className="h-5 w-5" />,
      link: "/rh/cartao-ponto",
      permission: { area: 'cartaoponto', level: 'read' as PermissionLevel },
    },
  ];

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
      <nav className="flex-1 space-y-1 px-2 py-3 overflow-y-auto">
        <div className="mb-4">
          {!isCollapsed && (
            <h2 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/60">
              MÓDULOS
            </h2>
          )}
          <div className="space-y-1">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
            <SidebarItem to="/funcionarios" icon={Users} label="Recursos Humanos" isCollapsed={isCollapsed} requiredRole="operator" />
            <SidebarItem to="/obras" icon={Building} label="Obras" isCollapsed={isCollapsed} requiredRole="operator" />
            <SidebarItem to="/frota" icon={Truck} label="Frota" isCollapsed={isCollapsed} requiredRole="operator" />
            <SidebarItem to="/patrimonio" icon={Briefcase} label="Patrimônio" isCollapsed={isCollapsed} requiredRole="operator" />
            <SidebarItem to="/financeiro" icon={FileText} label="Financeiro" isCollapsed={isCollapsed} requiredRole="manager" />
          </div>
        </div>

        <div className="pt-2">
          {!isCollapsed && (
            <h2 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/60">
              SISTEMA
            </h2>
          )}
          <div className="space-y-1">
            <SidebarItem to="/configuracoes" icon={Settings} label="Configurações" isCollapsed={isCollapsed} requiredRole="admin" />
          </div>
        </div>
      </nav>

      <div className="mt-auto border-t border-sidebar-border p-4">
        {user && !isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center font-medium text-sidebar-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppSidebar;
