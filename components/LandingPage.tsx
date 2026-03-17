
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Star, CheckCircle, ArrowRight, Smartphone,
    BarChart2, Shield, MessageCircle, Zap, Globe, Users,
    ChevronDown, ChevronUp, Play, Layout, Plus, MessageSquare
} from 'lucide-react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Components ---

// 1. Navigation
// 1. Navigation (Replaced with imported Navbar)


// 2. Dashboard Mockup Component
const DashboardMockup = () => {
    const data = [
        { name: 'Mon', reviews: 4 },
        { name: 'Tue', reviews: 3 },
        { name: 'Wed', reviews: 7 },
        { name: 'Thu', reviews: 5 },
        { name: 'Fri', reviews: 9 },
        { name: 'Sat', reviews: 12 },
        { name: 'Sun', reviews: 15 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-medium text-slate-400">smartreview.app/dashboard</div>
                <div className="w-4"></div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="text-sm text-slate-500 font-medium mb-1">Total Reviews</div>
                        <div className="text-3xl font-black text-slate-800">1,248</div>
                        <div className="text-xs font-bold text-green-500 flex items-center mt-1">
                            <ArrowRight size={12} className="-rotate-45 mr-1" />
                            +12.5% vs last week
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500 font-medium mb-1">Average Rating</div>
                        <div className="text-3xl font-black text-slate-800 flex items-center justify-end gap-2">
                            4.9 <Star size={24} className="text-yellow-400 fill-current" />
                        </div>
                    </div>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="reviews" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReviews)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// 3. Hero Section
const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-dotted">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm tracking-wide border border-blue-100 shadow-sm animate-pulse">
                            <span className="flex h-2 w-2 relative mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            #1 Google Review Management Tool
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-tight">
                            Turn Customers Into <br />
                            <span className="text-gradient">5-Star Reviews</span>
                            <span className="text-yellow-400 ml-2 inline-block animate-bounce">⭐</span>
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                            Automate your reputation management with smart QR codes. Capture negative feedback privately and boost your Google ranking effortlessly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/register" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1">
                                Get Your QR Kit
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                            <Link to="/demo" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-2xl text-slate-700 bg-white border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50 transition-all">
                                <Play size={20} className="mr-2 fill-current" />
                                Book Free Demo
                            </Link>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 bg-cover bg-center`} style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${10 + i})` }}></div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex text-yellow-400 space-x-0.5">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <p className="text-sm font-semibold text-slate-600"><span className="font-bold text-slate-900">4.8/5</span> from 500+ Businesses</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-lg lg:max-w-xl perspective-1000 animate-in fade-in slide-in-from-right-8 duration-1000">
                        {/* Visual: Mockup */}
                        <div className="relative z-10 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 animate-float">
                            <DashboardMockup />
                            {/* Floating QR Card */}
                            <div className="absolute -bottom-10 -left-10 glass-card p-4 rounded-2xl w-48 shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
                                <div className="bg-slate-900 rounded-xl p-3 aspect-square flex items-center justify-center mb-3">
                                    <div className="grid grid-cols-3 gap-1 w-full h-full opacity-80">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className={`bg-white rounded-sm ${i % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-800 text-sm">Scan to Review</p>
                                    <div className="flex justify-center mt-1">
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                        <Star size={12} className="text-yellow-400 fill-current" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// 4. Problem & Solution
const Features = () => {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base font-bold text-blue-600 tracking-wide uppercase">The Problem</h2>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Why Businesses Lose Customers</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {[
                        { title: "No Reviews", desc: "Happy customers leave without feedback, while unhappy ones are loud.", icon: MessageSquare, color: "text-red-500", bg: "bg-red-50" },
                        { title: "Bad Reputation", desc: "One negative review can drop your rating and drive customers away.", icon: Shield, color: "text-orange-500", bg: "bg-orange-50" },
                        { title: "No Follow-up", desc: "Manually asking for reviews is awkward and often forgotten.", icon: Zap, color: "text-gray-500", bg: "bg-gray-50" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                <item.icon className={item.color} size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-600 rounded-[3rem] overflow-hidden text-white shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-50 -ml-20 -mb-20"></div>

                    <div className="relative z-10 px-8 py-16 md:p-20 text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Smart Review Solution</h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                Our intelligent system intercepts negative feedback before it goes public, while guiding happy customers directly to Google.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Smart Redirection Logic (5★ → Google, 1-3★ → Private)",
                                    "Instant WhatsApp Alerts for Managers",
                                    "Analytics Dashboard to Track Growth"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-center space-x-3">
                                        <div className="bg-blue-500 p-1 rounded-full"><CheckCircle size={16} /></div>
                                        <span className="font-medium">{text}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition shadow-lg">Experience It Now</button>
                        </div>
                        <div className="flex justify-center">
                            {/* Abstract Phone Mockup */}
                            <div className="bg-slate-900 border-8 border-slate-800 rounded-[3rem] p-4 w-72 h-[500px] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                                <div className="bg-white w-full h-full rounded-[2rem] overflow-hidden flex flex-col items-center pt-12 px-4 space-y-4">
                                    <div className="text-center">
                                        <h4 className="font-bold text-slate-900 text-lg">How was your visit?</h4>
                                        <div className="flex justify-center space-x-2 mt-2">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} className="text-slate-300" />)}
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-32 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                                        [Business Logo]
                                    </div>
                                    <div className="w-full bg-blue-600 text-white py-3 rounded-lg text-center font-bold text-sm">Submit Review</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// 5. How It Works
const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">How It Works</h2>
                    <p className="text-lg text-slate-600">3 simple steps to skyrocket your ratings.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { step: "01", title: "Place QR Code", desc: "Display our smart QR stand at your checkout counter or tables." },
                        { step: "02", title: "Customer Scans", desc: "They scan the code to leave quick feedback in under 10 seconds." },
                        { step: "03", title: "Rating Splitting", desc: "5-Star reviews go to Google. Complaints come to you privately." }
                    ].map((s, i) => (
                        <div key={i} className="relative group text-center">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100 shadow-sm">
                                {s.step}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                            <p className="text-slate-500 leading-relaxed px-4">{s.desc}</p>
                            {i !== 2 && <div className="hidden md:block absolute top-10 left-1/2 w-full h-[2px] bg-gradient-to-r from-blue-100 to-transparent -z-10 transform translate-x-1/2"></div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 6. Pricing Section
const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-slate-600 mt-4">No hidden fees. Cancel anytime.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Starter */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                        <h3 className="text-xl font-bold text-slate-900">Starter</h3>
                        <div className="my-4"><span className="text-4xl font-black text-slate-900">$29</span><span className="text-slate-500">/mo</span></div>
                        <p className="text-sm text-slate-500 mb-6">Perfect for small cafes & solo businesses.</p>
                        <Link to="/register" className="block w-full py-3 px-6 bg-slate-100 text-slate-700 font-bold text-center rounded-xl hover:bg-slate-200 transition">Start Free Trial</Link>
                        <ul className="mt-8 space-y-3 text-sm text-slate-600">
                            {['1 Location', '100 Reviews/mo', 'Basic Analytics', 'Email Support'].map((f, i) => (
                                <li key={i} className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> {f}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Pro - Featured */}
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-900 shadow-2xl relative transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                        <h3 className="text-xl font-bold text-white">Pro Growth</h3>
                        <div className="my-4"><span className="text-4xl font-black text-white">$79</span><span className="text-slate-400">/mo</span></div>
                        <p className="text-sm text-slate-400 mb-6">For growing businesses needing WhatsApp alerts.</p>
                        <Link to="/register" className="block w-full py-3 px-6 bg-blue-600 text-white font-bold text-center rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/50">Get Started Now</Link>
                        <ul className="mt-8 space-y-3 text-sm text-slate-300">
                            {['3 Locations', 'Unlimited Reviews', 'WhatsApp Alerts', 'Advanced Analytics', 'Priority Support'].map((f, i) => (
                                <li key={i} className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-400" /> {f}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                        <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
                        <div className="my-4"><span className="text-4xl font-black text-slate-900">$199</span><span className="text-slate-500">/mo</span></div>
                        <p className="text-sm text-slate-500 mb-6">For franchises and agencies.</p>
                        <button className="block w-full py-3 px-6 bg-slate-100 text-slate-700 font-bold text-center rounded-xl hover:bg-slate-200 transition">Contact Sales</button>
                        <ul className="mt-8 space-y-3 text-sm text-slate-600">
                            {['10+ Locations', 'API Access', 'White Label', 'Dedicated Manager', 'Custom Integration'].map((f, i) => (
                                <li key={i} className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> {f}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

// 7. Footer
// 7. Footer (Replaced with imported Footer)


// 8. FAQ Section
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        { q: "Does this violate Google's policies?", a: "No. We simply ask internal feedback first. If the customer had a good experience, we encourage them to share it on Google. This is a standard industry practice." },
        { q: "Can I customize the QR Code design?", a: "Yes! You can add your logo, change colors, and choose from multiple frame templates to match your brand." },
        { q: "Do I need technical skills?", a: "Not at all. Just print the QR code we generate and place it on your counter. We handle the rest." },
        { q: "Is there a contract?", a: "No. All plans are month-to-month and you can cancel at any time." },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Freqently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((f, i) => (
                        <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left px-6 py-4 flex justify-between items-center bg-white hover:bg-slate-50 font-bold text-slate-800"
                            >
                                {f.q}
                                {openIndex === i ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                            </button>
                            {openIndex === i && (
                                <div className="px-6 py-4 bg-slate-50 text-slate-600 leading-relaxed border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                    {f.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Main Landing Component ---

const LandingPage = () => {
    return (
        <div className="font-sans antialiased bg-white text-slate-900 scroll-smooth">
            <Navbar />
            <div id="home">
                <Hero />
            </div>
            <Features />
            <HowItWorks />

            {/* Demo Dashboard Preview Section - Extra Visual */}
            <section id="demo" className="py-24 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Powerful Analytics Dashboard</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Track your reputation in real-time. See who is reviewing you and identify trends before they become problems.</p>
                </div>
                <div className="relative max-w-6xl mx-auto">
                    {/* Abstract Dashboard Screen */}
                    <div className="bg-slate-800 rounded-t-2xl p-4 border border-slate-700 shadow-2xl mx-4 md:mx-0">
                        <div className="flex items-center space-x-2 mb-4 border-b border-slate-700 pb-4">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                            </div>
                            <div className="bg-slate-900 px-3 py-1 rounded-md text-xs text-slate-500 w-64">smartreview.app/analytics</div>
                        </div>

                        {/* Mock Dashboard Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] overflow-hidden opacity-90">
                            {/* Sidebar */}
                            <div className="hidden md:block col-span-1 bg-slate-900/50 rounded-xl p-4 space-y-3">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-slate-700/50 rounded-lg w-full"></div>)}
                            </div>
                            {/* Main Content */}
                            <div className="col-span-3 grid grid-cols-2 gap-4">
                                <div className="bg-slate-700/30 rounded-xl h-32 p-4">
                                    <div className="h-4 w-24 bg-slate-600 rounded mb-2"></div>
                                    <div className="h-10 w-16 bg-blue-500 rounded mb-2"></div>
                                </div>
                                <div className="bg-slate-700/30 rounded-xl h-32 p-4">
                                    <div className="h-4 w-24 bg-slate-600 rounded mb-2"></div>
                                    <div className="h-10 w-16 bg-green-500 rounded mb-2"></div>
                                </div>
                                <div className="col-span-2 bg-slate-700/30 rounded-xl h-64 p-4 flex items-end justify-between space-x-2">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="bg-blue-500/50 hover:bg-blue-500 rounded-t-sm w-full transition-all" style={{ height: `${Math.random() * 100}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>

                        <button className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-900/50 transition flex items-center">
                            <Play size={18} className="mr-2 fill-white" /> Watch Full Demo
                        </button>
                    </div>
                </div>
            </section>

            <Pricing />

            {/* Testimonials */}
            <section className="py-24 bg-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Trusted by 500+ Local Businesses</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { text: "Since using SmartReview, our Google rating went from 4.2 to 4.9 in just 3 months. It's magic!", author: "Sarah Jenkins", role: "Owner, The Coffee Spot" },
                            { text: "I love that negative reviews don't go public immediately. It gives me a chance to fix the issue.", author: "Mike Ross", role: "Manager, City Gym" },
                            { text: "The WhatsApp alerts are a lifesaver. I can respond to customers instantly even when I'm not at the store.", author: "Elena Rodriguez", role: "Founder, Bella Spa" }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 relative">
                                <div className="absolute -top-4 left-8 text-6xl text-indigo-200 font-serif leading-none">"</div>
                                <p className="text-slate-600 italic mb-6 relative z-10">{t.text}</p>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">{t.author[0]}</div>
                                    <div>
                                        <div className="font-bold text-slate-900">{t.author}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FAQ />

            {/* Final CTA */}
            <section className="py-20 bg-blue-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-black text-white mb-6">Start Growing Your Reviews Today</h2>
                    <p className="text-blue-100 text-xl mb-10">Join 500+ businesses taking control of their online reputation. Try it risk-free.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 shadow-xl transition transform hover:-translate-y-1">
                            Get Started for Free
                        </Link>
                        <button className="bg-blue-700 text-white border border-blue-500 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
                            Chat with Sales
                        </button>
                    </div>
                    <div className="mt-8 flex items-center justify-center space-x-2 text-blue-200 text-sm font-medium">
                        <Shield size={16} />
                        <span>07-Day Money-Back Guarantee</span>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Floating WhatsApp Button */}
            <a href="https://wa.me/+917532878132" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center animate-bounce duration-1000">
                <MessageCircle size={28} fill="white" />
            </a>
        </div>
    );
};

export default LandingPage;
