
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Index from './pages/Index';
import { Navigation } from './components/Navigation';
import { Toaster } from "@/components/ui/toaster"
import { AdminPortal } from './pages/AdminPortal';
import { PublicShows } from './pages/PublicShows';
import { MyShows } from './pages/MyShows';
import { PublicUniverses } from './pages/PublicUniverses';
import { MyUniverses } from './pages/MyUniverses';
import { UniversePage } from './pages/UniversePage';
import { UniversePage } from './pages/UniverseTestPage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ShowDetail } from './pages/ShowDetail';
import { Dashboard } from './pages/Dashboard';
import { UniverseDashboard } from './pages/UniverseDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/shows/public" element={<PublicShows />} />
              <Route path="/shows/my" element={<MyShows />} />
              <Route path="/universes/public" element={<PublicUniverses />} />
              <Route path="/universes/my" element={<MyUniverses />} />
              <Route path="/universe/:id" element={<UniverseTestPage />} />
              <Route path="/universe/:universeId/dashboard" element={<UniverseDashboard />} />
              <Route path="/show/:showId" element={<ShowDetail />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
