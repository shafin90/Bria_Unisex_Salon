import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Shared Components
import PublicLayout from './shared/components/Public/PublicLayout';
import Home from './shared/components/Public/Home';
import BookAppointment from './shared/components/Public/BookAppointment';
import SubmitReview from './shared/components/Public/SubmitReview';

// Shared Layout
import Layout from './shared/components/Layout/Layout';

// Feature Components
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Services from './features/services/Services';
import Bookings from './features/bookings/Bookings';
import Offers from './features/offers/Offers';
import Users from './features/users/Users';
import Reviews from './features/reviews/Reviews';
import Inventory from './features/inventory/Inventory';
import Portfolio from './features/portfolio/Portfolio';
import Packages from './features/packages/Packages';
import Waitlist from './features/waitlist/Waitlist';
import Chat from './features/chat/Chat';
import Stylists from './features/stylists/Stylists';

// Shared Context
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import { CartProvider } from './shared/context/CartContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          <Route path="/book" element={
            <PublicLayout>
              <BookAppointment />
            </PublicLayout>
          } />
          <Route path="/review" element={
            <PublicLayout>
              <SubmitReview />
            </PublicLayout>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          
          {isAuthenticated ? (
            <Route path="/admin/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/waitlist" element={<Waitlist />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/stylists" element={<Stylists />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </Layout>
            } />
          ) : (
            <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;