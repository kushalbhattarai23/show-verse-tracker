
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavigation } from './BottomNavigation';
import { SecondaryBottomNavigation } from './SecondaryBottomNavigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background relative">
      <SidebarProvider>
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col min-w-0 overflow-hidden w-full">
            <Header />
            <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto mt-16 pb-32 md:pb-0">
              {children || <Outlet />}
            </main>
            {/* Hide footer on mobile */}
            <div className="hidden md:block">
              <Footer />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <SecondaryBottomNavigation />
      <BottomNavigation />
    </div>
  );
};
