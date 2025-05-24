
import React from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Navigation } from '@/components/Navigation';
import { UniversePage } from './UniversePage';
import { useLocation } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { PublicShows } from './PublicShows';
import { MyUniverses } from './MyUniverses';

const Index = () => {
  const location = useLocation();
  
  const renderContent = () => {
    switch (location.pathname) {
      case '/dashboard':
        return <Dashboard />;
      case '/public/shows':
        return <PublicShows />;
      case '/my/shows':
        return <PublicShows />;
      case '/my/universes':
        return <MyUniverses />;
      default:
        return <UniversePage />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 w-full">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </AuthProvider>
  );
};

export default Index;
