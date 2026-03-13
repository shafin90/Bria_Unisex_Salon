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
import { TenantProvider, useTenant } from './shared/context/TenantContext';

// Platform View
import PlatformLanding from './shared/components/Platform/PlatformLanding';
import PlatformLayout from './shared/components/Layout/PlatformLayout';
import PlatformOverview from './shared/components/Platform/PlatformOverview';
import TenantManager from './shared/components/Platform/TenantManager';
import AuditLogManager from './shared/components/Platform/AuditLogManager';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const { tenant, loadingTenant } = useTenant();

  if (loading || loadingTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === 'Super Admin';

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Global Platform Route */}
          <Route path="/" element={<PlatformLanding />} />

          {/* Super Admin Dashboard Routes */}
          {isAuthenticated && isSuperAdmin ? (
            <Route path="/platform/*" element={
              <PlatformLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PlatformOverview />} />
                  <Route path="tenants" element={<TenantManager />} />
                  <Route path="audit-logs" element={<AuditLogManager />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </PlatformLayout>
            } />
          ) : (
            <Route path="/platform/*" element={<Navigate to="/" replace />} />
          )}

          {/* Public Routes scoped to Tenant */}
          <Route path="/t/:salonName" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          <Route path="/t/:salonName/book" element={
            <PublicLayout>
              <BookAppointment />
            </PublicLayout>
          } />
          <Route path="/t/:salonName/review" element={
            <PublicLayout>
              <SubmitReview />
            </PublicLayout>
          } />

          {/* Admin Routes scoped to Tenant */}
          <Route path="/t/:salonName/admin/login" element={<Login />} />
          
          {isAuthenticated ? (
            <Route path="/t/:salonName/admin/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="services" element={<Services />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="users" element={<Users />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="packages" element={<Packages />} />
                  <Route path="waitlist" element={<Waitlist />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="stylists" element={<Stylists />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            } />
          ) : (
            <Route path="/t/:salonName/admin/*" element={<Navigate to="login" replace />} />
          )}

          {/* Legacy / Direct Link Fallbacks to Root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </TenantProvider>
  );
}

export default App;