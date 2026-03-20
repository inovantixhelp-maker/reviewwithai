
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Cookie, Info, Shield, CheckCircle } from 'lucide-react';

const CookiePolicy = () => {
    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            <section className="pt-32 pb-20 bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-display">Cookie <span className="text-gradient">Policy</span></h1>
                    <p className="text-lg text-slate-500">How we use cookies to improve your experience.</p>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-16 rounded-[2rem] shadow-xl border border-slate-100">
                    <div className="prose prose-slate max-w-none">

                        <div className="flex items-center gap-4 mb-10 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                            <Cookie className="text-yellow-600" size={32} />
                            <div>
                                <h3 className="font-bold text-slate-900 m-0">Respecting Your Preference</h3>
                                <p className="text-slate-600 text-sm m-0">We use cookies to ensure you get the best out of our platform while keeping your data private.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-4 font-display">What Are Cookies?</h2>
                        <p className="mb-8 text-slate-600 leading-relaxed">
                            Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences and understand how you interact with Review With AI.
                        </p>

                        <h2 className="text-2xl font-bold mb-6 font-display">Types of Cookies We Use</h2>

                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <Shield size={20} className="text-blue-500" /> Essential Cookies
                                </h3>
                                <p className="text-slate-600 text-sm mb-0">These are necessary for the website to function properly. They include cookies for secure login and account management.</p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <Cookie size={20} className="text-yellow-500" /> Performance Cookies
                                </h3>
                                <p className="text-slate-600 text-sm mb-0">These help us analyze how visitors use our site, allowing us to fix issues and improve page load times.</p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <Info size={20} className="text-indigo-500" /> Functional Cookies
                                </h3>
                                <p className="text-slate-600 text-sm mb-0">These remember your preferences, like your language settings or business profile customization choices.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mt-12 mb-4 font-display">Controlling Cookies</h2>
                        <p className="mb-6 text-slate-600 leading-relaxed">
                            Most web browsers allow you to control cookies through their settings. However, disabling essential cookies may limit your ability to use certain features of Review With AI.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CookiePolicy;
