
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Header from './Header';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Loader2 } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isLoading, isAuthenticated } = useSecureAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  console.log('AppLayout - Auth State:', { isLoading, isAuthenticated });

  // Loading state
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

  // Not authenticated - let router handle redirect
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Authenticated layout
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
