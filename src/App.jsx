import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Insight from './pages/Insight';
import Report from './pages/Report';
import Profile from './pages/Profile';
import AdminManagement from './pages/AdminManagement';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-container selection:bg-white selection:text-black">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Protected App Routes (Dashboard Layout) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/insight" element={<Insight />} />
                <Route path="/report" element={<Report />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/management" element={<AdminManagement />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
