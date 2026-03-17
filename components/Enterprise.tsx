
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Building2, Globe, Users, ShieldCheck, Zap, ArrowRight, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Enterprise = () => {
    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden bg-dotted">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            Enterprise Solution
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                            Scale Your <br />
                            <span className="text-gradient brightness-150">Brand Reputation</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
                            Centralized review management for franchises, multi-location brands, and large enterprises. Built for speed, security, and global scale.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                                Contact Sales
                            </button>
                            <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all">
                                Download Whitepaper
                            </button>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 border border-white/10 rounded-[3rem] p-4 bg-white/5 backdrop-blur-sm shadow-2xl">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Success Rate", val: "99.9%", icon: ShieldCheck },
                                { label: "Global Reach", val: "50+ Countries", icon: Globe },
                                { label: "Active Brands", val: "500+", icon: Building2 },
                                { label: "Automation", val: "100%", icon: Zap }
                            ].map((stat, i) => (
                                <div key={i} className="p-8 bg-slate-800/50 rounded-[2rem] border border-white/5">
                                    <stat.icon className="text-blue-400 mb-4" size={32} />
                                    <h4 className="text-3xl font-black mb-1">{stat.val}</h4>
                                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise Features */}
            <section className="py-32 bg-white rounded-t-[5rem] -mt-20 relative z-10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-display">Enterprise-Grade <span className="text-gradient">Infrastructure</span></h2>
                        <p className="text-xl text-slate-600 leading-relaxed font-light">
                            We provide the tools and support needed to maintain a consistent brand voice across thousands of locations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Centralized Controls",
                                desc: "Manage thousands of locations from a single dashboard. Deploy global templates or customize by location.",
                                icon: Settings,
                                color: "bg-blue-600"
                            },
                            {
                                title: "Advanced Analytics",
                                desc: "Deep-dive reports with branch-by-branch comparisons, sentiment analysis, and regional performance tracking.",
                                icon: BarChart3,
                                color: "text-indigo-600"
                            },
                            {
                                title: "User Hierarchy",
                                desc: "Role-based access controls for managers, regional supervisors, and corporate executives with SSO support.",
                                icon: Users,
                                color: "text-green-600"
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all duration-500">
                                <item.icon className={`mb-8 ${i === 0 ? 'text-blue-600' : i === 1 ? 'text-indigo-600' : 'text-green-600'}`} size={48} />
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-8">{item.desc}</p>
                                <button className="flex items-center font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    Learn More <ArrowRight className="ml-2" size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600 rounded-full blur-[180px] opacity-10"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to grow your enterprise brand?</h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Get a customized demo and trial for your multi-location business today.</p>
                    <button className="px-12 py-6 bg-white text-slate-900 font-black rounded-2xl text-xl hover:bg-blue-50 transition-all shadow-2xl active:scale-95">Speak with an Expert</button>
                    <p className="mt-8 text-slate-500 font-bold uppercase tracking-widest text-xs">Used by world-class franchise groups</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Enterprise;
