
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { UserPlus, Settings, Zap, LifeBuoy, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">How It <span className="text-gradient">Works</span></h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        A simple and transparent process designed to deliver results efficiently. From signup to 5-star reviews in minutes.
                    </p>
                </div>
            </section>

            {/* Steps Sections */}
            <section className="py-20 bg-slate-50 relative overflow-hidden bg-dotted">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">

                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[100px] bottom-[100px] left-1/2 w-1 bg-gradient-to-b from-blue-200 via-indigo-200 to-transparent -translate-x-1/2 -z-10"></div>

                    {[
                        {
                            step: "01",
                            title: "Sign Up / Get Started",
                            desc: "Create your account in 2 minutes. Choose your plan and set up your business profile with your logo and brand colors.",
                            icon: UserPlus,
                            align: "left"
                        },
                        {
                            step: "02",
                            title: "Setup & Configuration",
                            desc: "Our system automatically generates a unique QR code for your business. You can customize the landing page questions and feedback flow.",
                            icon: Settings,
                            align: "right"
                        },
                        {
                            step: "03",
                            title: "Execution",
                            desc: "Place the QR code at your counter or on tables. Customers scan it to leave feedback. Positive ratings go to Google; negative feedback comes to you privately.",
                            icon: Zap,
                            align: "left"
                        },
                        {
                            step: "04",
                            title: "Monitoring & Support",
                            desc: "Track every scan and review in real-time on your dashboard. Our support team is available 24/7 to help you optimize your strategy.",
                            icon: LifeBuoy,
                            align: "right"
                        }
                    ].map((item, i) => (
                        <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${item.align === 'right' ? 'md:flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
                            <div className="flex-1 text-center md:text-left">
                                <div className={`hidden md:flex items-center gap-4 mb-4 ${item.align === 'right' ? 'md:flex-row-reverse md:text-right' : ''}`}>
                                    <span className="text-6xl font-black text-slate-200">{item.step}</span>
                                    <h2 className="text-3xl font-bold text-slate-900">{item.title}</h2>
                                </div>
                                {/* Mobile Title */}
                                <div className="md:hidden flex flex-col items-center mb-4">
                                    <span className="text-5xl font-black text-slate-200 mb-2">{item.step}</span>
                                    <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                                </div>

                                <p className={`text-lg text-slate-600 leading-relaxed ${item.align === 'right' ? 'md:text-right' : ''}`}>
                                    {item.desc}
                                </p>
                            </div>

                            {/* Visual Circle */}
                            <div className="relative">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white z-20 relative animate-float">
                                    <item.icon size={48} className="text-blue-600" />
                                </div>
                                {/* Pulse Effect */}
                                <div className="absolute top-0 left-0 w-full h-full bg-blue-100 rounded-full animate-ping opacity-20 duration-1000 z-10"></div>
                            </div>

                            <div className="flex-1 hidden md:block"></div> {/* Spacer */}
                        </div>
                    ))}
                </div>
            </section>

            {/* Visual Workflow Diagram */}
            <section className="py-24 bg-white overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-16">The Workflow</h2>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0">

                        {/* Node 1 */}
                        <div className="flex flex-col items-center w-64 animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-float">
                                <UserPlus size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Customer Scans</h3>
                            <p className="text-sm text-slate-500">QR Code access to feedback form</p>
                        </div>

                        {/* Arrow */}
                        <div className="h-12 w-1 md:h-1 md:w-24 bg-slate-200 relative hidden md:block">
                            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full"></div>
                        </div>

                        {/* Node 2 */}
                        <div className="flex flex-col items-center w-64 animate-in fade-in duration-700 delay-300">
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 animate-float" style={{ animationDelay: '0.5s' }}>
                                <Zap size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Smart Filter</h3>
                            <p className="text-sm text-slate-500">Analyzes star rating instantly</p>
                        </div>

                        {/* Arrow Split */}
                        <div className="h-12 w-1 md:h-1 md:w-24 bg-slate-200 relative hidden md:block">
                            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full"></div>
                        </div>

                        {/* Node 3 */}
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
                            <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100 w-64 text-left glass-card">
                                <div className="bg-green-500 p-2 rounded-lg text-white"><Star size={16} fill="white" /></div>
                                <div>
                                    <div className="font-bold text-slate-800">5 Stars</div>
                                    <div className="text-xs text-slate-500">Redirect to Google</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-red-50 p-4 rounded-xl border border-red-100 w-64 text-left glass-card">
                                <div className="bg-red-500 p-2 rounded-lg text-white"><CheckCircle size={16} /></div>
                                <div>
                                    <div className="font-bold text-slate-800">1-3 Stars</div>
                                    <div className="text-xs text-slate-500">Private Feedback</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-20">
                        <Link to="/register" className="inline-flex items-center bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-xl hover:-translate-y-1">
                            Get Started Now <ArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;
