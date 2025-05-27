
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
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<UniversePage />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/shows/public" element={<PublicShows />} />
              <Route path="/shows/my" element={<MyShows />} />
              <Route path="/universes/public" element={<PublicUniverses />} />
              <Route path="/universes/my" element={<MyUniverses />} />
              <Route path="/universe/:id" element={<UniversePage />} />
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
