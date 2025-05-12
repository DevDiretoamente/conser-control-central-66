
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Header from './Header';

const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Ensure all links work correctly by handling direct navigation
  useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar isCollapsed={isSidebarCollapsed} />
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="container mx-auto p-6 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
