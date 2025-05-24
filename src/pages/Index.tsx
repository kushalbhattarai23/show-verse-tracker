
import React from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Navigation } from '@/components/Navigation';
import { UniversePage } from './UniversePage';

const Index = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UniversePage />
        </main>
      </div>
    </AuthProvider>
  );
};

export default Index;
