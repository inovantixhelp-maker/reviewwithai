
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import {
    BarChart2, Shield, Settings, Zap, LifeBuoy, CheckCircle,
    Smartphone, Database, Send, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden bg-dotted">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="inline-flex items-center px-4 py-2 border border-slate-700 bg-slate-800 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                        Feature Rich
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                        Powerful Features <br />
                        <span className="text-gradient brightness-150">Designed for Performance</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to manage reviews, engage customers, and grow your business on autopilot.
                    </p>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 bg-white -mt-20 relative z-20 rounded-t-[3rem] shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Smart Dashboard",
                            desc: "Get a bird's-eye view of your reputation. Track rating trends, recent feedback, and response rates in one clean interface.",
                            icon: BarChart2,
                            color: "text-blue-500",
                            bg: "bg-blue-50"
                        },
                        {
                            title: "Real-Time Analytics",
                            desc: "Monitor improved Google rankings and customer sentiment instantly. Data updates live as reviews come in.",
                            icon: Database,
                            color: "text-indigo-500",
                            bg: "bg-indigo-50"
                        },
                        {
                            title: "Secure System",
                            desc: "Bank-grade encryption for all customer data. We prioritize privacy and ensure GDPR compliance.",
                            icon: Shield,
                            color: "text-green-500",
                            bg: "bg-green-50"
                        },
                        {
                            title: "Easy Integration",
                            desc: "Works with major review platforms seamlessly. No complex coding required – setup takes minutes.",
                            icon: Settings,
                            color: "text-orange-500",
                            bg: "bg-orange-50"
                        },
                        {
                            title: "Automation",
                            desc: "Set rules to automatically respond to 5-star reviews or alert managers for negative feedback via WhatsApp.",
                            icon: Zap,
                            color: "text-yellow-500",
                            bg: "bg-yellow-50"
                        },
                        {
                            title: "24/7 Support",
                            desc: "Our dedicated support team is always available to assist you with setup, strategy, or technical issues.",
                            icon: LifeBuoy,
                            color: "text-red-500",
                            bg: "bg-red-50"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                <feature.icon size={28} className={feature.color} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-slate-50 relative overflow-hidden bg-dotted">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden grid md:grid-cols-2 glass-card">
                        <div className="p-12 md:p-20 flex flex-col justify-center bg-blue-600 text-white relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Why Choose SmartReview?</h2>
                                <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                                    We don't just collect reviews; we engineer growth. Our platform is built specifically for local businesses who need results without the complexity.
                                </p>
                                <Link to="/demo" className="inline-flex items-center text-blue-600 bg-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                                    Request a Demo <ArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-12 md:p-20 bg-white flex flex-col justify-center">
                            <ul className="space-y-6">
                                {[
                                    "Industry-leading 30% conversion rate from scan to review",
                                    "Direct integration with WhatsApp Business API",
                                    "Customizable QR designs to match your brand",
                                    "Multi-location management from one login",
                                    "Weekly performance reports delivered to your inbox"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                                        <div className="mt-1 bg-green-100 p-1 rounded-full text-green-600 flex-shrink-0 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                                            <CheckCircle size={16} />
                                        </div>
                                        <span className="text-slate-700 font-medium text-lg text-left">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;
