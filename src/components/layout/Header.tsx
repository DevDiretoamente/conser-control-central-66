
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Bell, Search, X, LogOut } from 'lucide-react';
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

interface HeaderProps {
  toggleSidebar: () => void;
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
  const [showSearch, setShowSearch] = React.useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { profile, signOut } = useSecureAuth();

  // Get user initials for avatar
  const getInitials = () => {
    if (!profile || !profile.name) return 'U';
    
    const names = profile.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Get role display name
  const getRoleDisplay = () => {
    switch (profile?.role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'operator': return 'Operador';
      default: return 'Usuário';
    }
  };

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
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-conserv-danger text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="font-medium">ASO próximo do vencimento</p>
                <p className="text-sm text-muted-foreground">João Silva - vence em 7 dias</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Manutenção preventiva</p>
                <p className="text-sm text-muted-foreground">Caminhão XYZ-1234 - agendada para amanhã</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Conta a pagar vencendo</p>
                <p className="text-sm text-muted-foreground">Fornecedor ABC - vence hoje</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User menu */}
        {profile && (
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
                  <p className="text-sm font-medium leading-none">{profile.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile.email}
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
        )}
      </div>
    </header>
  );
};

export default Header;
