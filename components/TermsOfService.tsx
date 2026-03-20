
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Scale, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            <section className="pt-32 pb-20 bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Terms of <span className="text-gradient">Service</span></h1>
                    <p className="text-lg text-slate-500">Effective Date: February 19, 2026</p>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-16 rounded-[2rem] shadow-xl border border-slate-100">
                    <div className="prose prose-slate max-w-none">

                        <div className="flex items-center gap-4 mb-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <Scale className="text-indigo-600" size={32} />
                            <div>
                                <h3 className="font-bold text-slate-900 m-0">Agreement to Terms</h3>
                                <p className="text-slate-600 text-sm m-0">By using Review With AI, you agree to follow our service rules and guidelines.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">1. Use of Service</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            Review With AI provides a platform for managing customer reviews and feedback. You are responsible for any activity that occurs through your account and you agree to use the service in compliance with all applicable laws.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">2. Account Registration</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            To use certain features, you must register for an account. You must provide accurate and complete information and keep your account password secure.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">3. Fees and Payment</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            Subscription fees are billed in advance on a recurring and periodic basis. You can cancel your subscription at any time via your dashboard settings.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of Review With AI and its licensors.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            In no event shall Review With AI be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">6. Governing Law</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Review With AI operates.
                        </p>

                        <div className="mt-12 p-6 bg-slate-900 text-white rounded-2xl">
                            <h3 className="text-xl font-bold mb-2">Need clarification?</h3>
                            <p className="text-slate-400 mb-0">Our legal team is here to help. Reach out at legal@reviewwithai.com</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsOfService;
