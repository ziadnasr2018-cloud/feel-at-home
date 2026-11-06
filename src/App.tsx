import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StudentHousingChatbot } from './components/StudentHousingChatbot';
import { Home } from './pages/Home';
import { ExploreListings } from './pages/ExploreListings';
import { ListingDetails } from './pages/ListingDetails';
import { CreateListing } from './pages/CreateListing';
import { EditListing } from './pages/EditListing';
import { Roommates } from './pages/Roommates';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TrustSafety } from './pages/TrustSafety';

export default function App() {
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        {gmpQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}
        <div className="min-h-screen flex flex-col bg-stone-50/50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<ExploreListings />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/listings/:id/edit" element={<EditListing />} />
              <Route path="/roommates" element={<Roommates />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/safety" element={<TrustSafety />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <StudentHousingChatbot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

