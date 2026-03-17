
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Info } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { api } from '../../services/api';
import { UserRole } from '../../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await api.login(email, password);

      if (user) {
        // Simple session storage for demo - Supabase handles auth state but we keep this for app logic compatibility
        sessionStorage.setItem('current_user', JSON.stringify(user));

        if (user.role === UserRole.ADMIN) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (type: 'owner' | 'admin') => {
    if (type === 'owner') {
      setEmail('owner@smartreview.com');
      setPassword('pass123');
    } else {
      setEmail('admin@smartreview.com');
      setPassword('admin123');
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to manage your reputation.">
      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              placeholder="owner@smartreview.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-100"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
          ) : (
            <>
              <span>Login to Account</span>
              <LogIn size={20} />
            </>
          )}
        </button>



        <div className="pt-2 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register Business</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
