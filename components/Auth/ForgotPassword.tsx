
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { api } from '../../services/api';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.forgotPassword(email);
            setIsSent(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send reset email.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <AuthLayout title="Reset Link Sent" subtitle="Check your email for instructions.">
                <div className="space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="bg-emerald-50 p-4 rounded-full text-emerald-600">
                            <CheckCircle size={48} />
                        </div>
                    </div>
                    <p className="text-slate-600">
                        We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Please click the link in the email to set a new password.
                    </p>
                    <Link to="/login" className="flex items-center justify-center space-x-2 text-indigo-600 font-bold hover:underline">
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Forgot Password?" subtitle="No worries, we'll send you reset instructions.">
            <form onSubmit={handleReset} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
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
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                    {isLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                    ) : (
                        <>
                            <span>Send Reset Link</span>
                            <Send size={20} />
                        </>
                    )}
                </button>

                <div className="text-center">
                    <Link to="/login" className="flex items-center justify-center space-x-2 text-slate-500 font-bold text-sm hover:text-indigo-600 transition-colors">
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
