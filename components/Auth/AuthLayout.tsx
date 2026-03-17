
import React from 'react';
import { Layout, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center">
        <Link to="/" className="mb-6 group flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-100 mb-4">
          <Layout className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-2 text-center max-w-xs">{subtitle}</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
        {children}
      </div>
      
      <p className="mt-8 text-slate-400 text-xs font-medium">
        &copy; 2024 SmartReview SaaS. Secure & Encrypted.
      </p>
    </div>
  );
};

export default AuthLayout;
