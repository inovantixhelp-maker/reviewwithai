
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CustomerView from './components/CustomerView';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import { Layout, ArrowRight, Star, Shield, Zap, Globe } from 'lucide-react';
import { UserRole } from './types';

// Fix: Use React.ReactNode instead of JSX.Element to resolve namespace issues
// Fix: Making children optional to resolve TypeScript prop missing error in Route element
const PrivateRoute = ({ children, role }: { children?: React.ReactNode, role: UserRole }) => {
  const userStr = sessionStorage.getItem('current_user');
  if (!userStr) return <Navigate to="/login" />;
  const user = JSON.parse(userStr);
  if (user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

import LandingPage from './components/LandingPage';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Demo from './components/Demo';
import Enterprise from './components/Enterprise';
import Blog from './components/Blog';
import SuccessStories from './components/SuccessStories';
import HelpCenter from './components/HelpCenter';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/customer" element={<CustomerView />} />
        <Route path="/b/:businessId" element={<CustomerView />} />


        <Route
          path="/dashboard"
          element={
            <PrivateRoute role={UserRole.OWNER}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role={UserRole.ADMIN}>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
