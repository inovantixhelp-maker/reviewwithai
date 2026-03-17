
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, MapPin, ChevronRight, Check, Phone } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { api } from '../../services/api';
import { SubscriptionPlan, UserRole, Business } from '../../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const bizId = crypto.randomUUID();
      const newBusiness: Business = {
        id: bizId,
        name: businessName,
        googlePlaceId: 'gen-' + Math.random().toString(36).substr(2, 9),
        googleMapsUrl: 'https://maps.google.com/',
        plan: SubscriptionPlan.NONE,
        status: 'INACTIVE',
        expiryDate: Date.now(),
        totalScans: 0,
        totalReviews: 0,
        settings: {
          enabled: true,
          rewardType: 'THANK_YOU',
          customMessage: 'Thank you for your feedback!',
          couponCode: 'WELCOME20'
        }
      };

      await api.addBusiness(newBusiness);

      const metadata = {
        name,
        mobile,
        role: UserRole.OWNER,
        businessId: bizId
      };

      await api.register(email, password, metadata);

      const newUser = {
        email,
        name,
        mobile,
        role: UserRole.OWNER,
        businessId: bizId
      };

      sessionStorage.setItem('current_user', JSON.stringify(newUser));
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please check your connection or try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Get Started" subtitle="Create your owner account and launch your system.">
      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}
        <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="text"
                placeholder="Your Cafe Name"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="email"
                placeholder="john@company.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
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
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-700 font-medium">
            After setup, you can link your specific Google Maps profile in the dashboard settings.
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-100"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
          ) : (
            <>
              <span>Launch System</span>
              <ChevronRight size={20} />
            </>
          )}
        </button>

        <div className="pt-4 text-center">
          <p className="text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
