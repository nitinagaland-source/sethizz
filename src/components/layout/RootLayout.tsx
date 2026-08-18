// src/components/layout/RootLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';
import { Footer } from './Footer';
import { ScrollToTop } from '../utils/ScrollToTop';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFB] flex flex-col text-[#0F0F14] selection:bg-[#BFDBFE] selection:text-[#1E3A8A]">
      <ScrollToTop />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by 72px on lg desktop) */}
      <div className="lg:pl-[72px] flex flex-col min-h-screen flex-1">
        <TopBar />

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pt-0 sm:pt-6 pb-20 md:pb-12">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
};
