import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard & Statement Upload';
      case '/transactions':
        return 'Transaction Review & Dispute';
      case '/human-review':
        return 'Human-in-Loop & Notifications';
      default:
        return 'Credit Card Statement Analysis';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          {getPageTitle()}
        </h1>
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 Proactive Agentic AI System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;