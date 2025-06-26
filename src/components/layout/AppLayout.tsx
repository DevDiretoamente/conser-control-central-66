
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Header from './Header';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2 } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { isLoading, isAuthenticated, profile } = useSecureAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    console.log('AppLayout - Current route:', location.pathname);
  }, [location]);

  console.log('AppLayout - Auth State:', { isLoading, isAuthenticated, hasProfile: !!profile });

  // Se ainda está carregando a autenticação, mostra loading
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderiza o layout (deixa o roteamento lidar com isso)
  if (!isAuthenticated) {
    console.log('AppLayout - User not authenticated, rendering outlet');
    return <Outlet />;
  }

  // Renderiza o layout completo para usuários autenticados
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <AppSidebar isCollapsed={isSidebarCollapsed} />
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 overflow-auto`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="container mx-auto p-6 max-w-7xl pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
