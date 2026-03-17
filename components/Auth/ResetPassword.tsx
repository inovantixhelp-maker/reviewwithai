
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Save } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { api } from '../../services/api';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await api.updatePassword(password);
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout title="Password Updated" subtitle="Security first. Your password has been changed.">
                <div className="space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="bg-emerald-50 p-4 rounded-full text-emerald-600">
                            <CheckCircle size={48} />
                        </div>
                    </div>
                    <p className="text-slate-600">
                        Redirecting you to login in a few seconds...
                    </p>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Set New Password" subtitle="Choose a strong password to secure your account.">
            <form onSubmit={handleReset} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
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

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="password"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <span>Update Password</span>
                            <Save size={20} />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
