
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Bell, Search, X, LogOut, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

function getPageTitle(pathname: string): string {
  switch (pathname) {
    case '/app':
      return 'Dashboard';
    case '/app/obras':
      return 'Obras';
    case '/app/frota':
      return 'Frota';
    case '/app/patrimonio':
      return 'Patrimônio';
    case '/app/financeiro':
      return 'Financeiro';
    case '/app/configuracoes':
      return 'Configurações';
    default:
      if (pathname.startsWith('/app/funcionarios')) return 'Funcionários';
      return 'Painel de Controle';
  }
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'ASO próximo do vencimento',
      description: 'João Silva - vence em 7 dias',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Manutenção preventiva',
      description: 'Caminhão XYZ-1234 - agendada para amanhã',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Conta a pagar vencendo',
      description: 'Fornecedor ABC - vence hoje',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { profile, signOut, isLoading } = useSecureAuth();

  // Get user initials for avatar
  const getInitials = () => {
    if (!profile || !profile.name) return 'U';
    
    const names = profile.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (!profile) return 'Usuário';
    switch (profile.role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'operator': return 'Operador';
      default: return 'Usuário';
    }
  };

  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast.success('Notificação marcada como lida');
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <h1 className="font-semibold text-lg">{pageTitle}</h1>
      
      <div className="ml-auto flex items-center gap-2">
        {showSearch ? (
          <div className="flex items-center">
            <Input
              placeholder="Buscar..."
              className="w-[200px] md:w-[300px]"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificações</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notificações
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs h-6"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={cn(
                  "cursor-pointer",
                  !notification.isRead && "bg-blue-50 border-l-2 border-l-blue-500"
                )}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-medium text-sm",
                      !notification.isRead && "font-semibold"
                    )}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}z</p>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length === 0 && (
              <DropdownMenuItem disabled>
                <p className="text-center text-muted-foreground">Nenhuma notificação</p>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.name || (isLoading ? 'Carregando...' : 'Usuário')}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email || (isLoading ? 'Carregando...' : 'Email')}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {getRoleDisplay()}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
