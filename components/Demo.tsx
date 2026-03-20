
import React, { useState } from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Play, Laptop, Smartphone, Mail, ArrowRight, CheckCircle, BarChart, CreditCard, PieChart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Demo = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Demo request submitted!');
    };

    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tigher tracking-tight">
                        Experience the Platform <br />
                        <span className="text-blue-500">In Action</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        See how Review With AI transforms customer feedback into your biggest growth engine.
                    </p>
                </div>
            </section>

            {/* Demo Options Section */}
            <section className="py-24 bg-white relative -mt-10 rounded-t-[3rem] z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* Option 1 & 2: Live Demo & Video */}
                        <div className="space-y-12">
                            {/* Live Demo Card */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                    <Laptop size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Live Interactive Demo</h3>
                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    Jump straight into a fully populated demo account. Explore the dashboard, analytics, and settings at your own pace.
                                </p>
                                <Link to="/dashboard" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                    Try Live Demo <ArrowRight className="ml-2" size={20} />
                                </Link>
                            </div>

                            {/* Video Demo Embed */}
                            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer aspect-video flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10"></div>
                                {/* Placeholder for YouTube Video */}
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-20 group-hover:scale-110 transition-transform duration-300 border-2 border-white/50">
                                    <Play size={32} className="text-white fill-white ml-2" />
                                </div>
                                <div className="absolute bottom-6 left-6 z-20">
                                    <h4 className="text-white font-bold text-lg">Platform Walkthrough</h4>
                                    <p className="text-slate-300 text-sm">2 min overview</p>
                                </div>
                            </div>
                        </div>

                        {/* Option 3: Request Guided Demo Form */}
                        <div className="bg-white border border-slate-100 shadow-2xl shadow-slate-200 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Mail size={24} /></div>
                                    <h3 className="text-2xl font-bold text-slate-900">Request Guided Demo</h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                placeholder="john@company.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Company Name</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                            placeholder="Business Inc."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Message (Optional)</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-32 resize-none"
                                            placeholder="Tell us about your specific needs..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center group">
                                        Schedule Demo
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <p className="text-center text-xs text-slate-400 mt-4">
                                        By submitting, you agree to our Terms & Privacy Policy.
                                    </p>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Screenshots Showcase */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Powerful Tools at Your Fingertips</h2>
                        <p className="text-slate-600 mt-4">Everything you need to manage your online reputation effectively.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Main Dashboard",
                                desc: "Your command center for reviews.",
                                icon: BarChart,
                                color: "bg-blue-500",
                                mockup: (
                                    <div className="w-full h-full p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div className="h-2 w-16 bg-slate-200 rounded"></div>
                                            <div className="h-2 w-8 bg-blue-400 rounded"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="h-16 bg-blue-50 rounded-xl border border-blue-100 flex flex-col justify-center p-2">
                                                <div className="h-1.5 w-10 bg-blue-200 rounded mb-1.5"></div>
                                                <div className="h-3 w-6 bg-blue-600 rounded"></div>
                                            </div>
                                            <div className="h-16 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center p-2">
                                                <div className="h-1.5 w-10 bg-indigo-200 rounded mb-1.5"></div>
                                                <div className="h-3 w-6 bg-indigo-600 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                                            <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                                            <div className="flex-1 flex items-end gap-1">
                                                {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                title: "Mobile Optimized",
                                desc: "Manage reviews on the go.",
                                icon: Smartphone,
                                color: "bg-indigo-500",
                                mockup: (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                        <div className="w-32 h-64 bg-slate-900 rounded-[2.5rem] p-2 border-2 border-slate-800 shadow-xl relative overflow-hidden">
                                            <div className="w-16 h-1 bg-slate-800 rounded-full absolute top-3 left-1/2 -translate-x-1/2 z-10"></div>
                                            <div className="bg-white w-full h-full rounded-[2rem] p-4 flex flex-col items-center gap-4 text-center">
                                                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">RAI</div>
                                                <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-current" />)}
                                                </div>
                                                <div className="flex-1 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
                                                <div className="w-full h-8 bg-blue-600 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                title: "Detailed Analytics",
                                desc: "Deep dive into your performance.",
                                icon: PieChart,
                                color: "bg-green-500",
                                mockup: (
                                    <div className="w-full h-full p-4 flex flex-col gap-4">
                                        <div className="flex justify-between gap-4">
                                            <div className="flex-1 aspect-square bg-slate-50 rounded-full border-8 border-indigo-500 border-r-green-500 border-b-yellow-400 relative">
                                                <div className="absolute inset-2 bg-white rounded-full shadow-inner flex items-center justify-center">
                                                    <div className="h-2 w-8 bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center gap-2">
                                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><div className="h-1.5 w-12 bg-slate-100 rounded"></div></div>
                                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><div className="h-1.5 w-12 bg-slate-100 rounded"></div></div>
                                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div><div className="h-1.5 w-12 bg-slate-100 rounded"></div></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
                                                <div className="h-1.5 w-10 bg-slate-100 rounded mb-2"></div>
                                                <div className="h-4 w-16 bg-blue-500/20 rounded"></div>
                                            </div>
                                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
                                                <div className="h-1.5 w-10 bg-slate-100 rounded mb-2"></div>
                                                <div className="h-4 w-16 bg-green-500/20 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        ].map((item, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-[2rem] transform rotate-1 group-hover:rotate-3 transition-transform"></div>
                                <div className="relative bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm group-hover:-translate-y-2 transition-transform duration-300">
                                    <div className="aspect-[4/3] bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                                        {item.mockup}
                                    </div>
                                    <div className="px-2 pb-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                                            <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-white`}>
                                                <item.icon size={14} />
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Demo;
