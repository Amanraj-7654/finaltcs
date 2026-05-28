import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Programming from './pages/Programming';
import QuestionDetail from './pages/QuestionDetail';
import Contests from './pages/Contests';
import ContestDetail from './pages/ContestDetail';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

// Detects if we're on the coding workspace route
const CODING_ROUTE_PATTERN = /^\/programming\/\d+/;

const AppShell: React.FC = () => {
  const location = useLocation();
  const isCodingPage = CODING_ROUTE_PATTERN.test(location.pathname);

  return (
    <div className={`flex flex-col ${isCodingPage ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-slate-50 relative overflow-x-hidden`}>
      <div className="fixed inset-0 bg-pattern pointer-events-none"></div>
      <Navbar />
      <Toaster position="top-right" />
      <main className={`relative ${isCodingPage ? 'flex-1 overflow-hidden' : 'flex-grow page-fade-in'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/programming" element={<Programming />} />
          <Route path="/programming/:id" element={<QuestionDetail />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:id" element={<ContestDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/admin-dashboard" element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      {/* Hide footer on the coding workspace */}
      {!isCodingPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
};

export default App;
