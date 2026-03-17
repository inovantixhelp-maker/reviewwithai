
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            <section className="pt-32 pb-20 bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Privacy <span className="text-gradient">Policy</span></h1>
                    <p className="text-lg text-slate-500">Last updated: February 19, 2026</p>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-16 rounded-[2rem] shadow-xl border border-slate-100">
                    <div className="prose prose-slate max-w-none">
                        <div className="flex items-center gap-4 mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                            <ShieldCheck className="text-blue-600" size={32} />
                            <div>
                                <h3 className="font-bold text-slate-900 m-0">Our Commitment</h3>
                                <p className="text-slate-600 text-sm m-0">Your privacy is our top priority. We only collect data that is necessary for your business growth.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-8">
                            <li>Business name and contact information</li>
                            <li>User profile information (name, email, password)</li>
                            <li>Customer feedback collected via QR codes</li>
                            <li>Payment information (processed securely via third parties)</li>
                        </ul>

                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            We use the information we collect to provide, maintain, and improve our services, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-8">
                            <li>Managing your business reviews and feedback</li>
                            <li>Sending technical notices and support messages</li>
                            <li>Generating analytics and performance reports</li>
                            <li>Responding to your comments and questions</li>
                        </ul>

                        <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. All data is encrypted at rest and in transit.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            <span className="font-bold text-blue-600 mt-2 block">privacy@smartreview.io</span>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
