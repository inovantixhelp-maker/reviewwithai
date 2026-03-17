
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Search, Book, MessageSquare, Zap, PlayCircle, HelpCircle, ChevronRight } from 'lucide-react';

const HelpCenter = () => {
    const categories = [
        { title: "Getting Started", icon: Zap, count: 12, color: "bg-blue-500" },
        { title: "Dashboard & Analytics", icon: Book, count: 8, color: "bg-indigo-500" },
        { title: "QR Code Setup", icon: PlayCircle, count: 15, color: "bg-purple-500" },
        { title: "Billing & Plans", icon: MessageSquare, count: 6, color: "bg-green-500" },
    ];

    const faqs = [
        "How do I customize my review landing page?",
        "Where can I find my QR code download link?",
        "How do I connect my Google Business profile?",
        "What happens if a customer leaves a 1-star review?",
        "Can I manage multiple locations from one account?"
    ];

    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            {/* Header / Search */}
            <section className="pt-32 pb-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-8">How can we <span className="text-blue-400">help you?</span></h1>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                        <input
                            type="text"
                            placeholder="Search for articles, guides, and more..."
                            className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white border-0 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-2xl text-lg text-slate-900"
                        />
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-slate-400 text-sm font-medium">
                        <span>Popular:</span>
                        {["QR Setup", "Google Login", "Billing", "Negative Feedback"].map(kw => (
                            <button key={kw} className="text-slate-300 hover:text-white transition-colors">#{kw}</button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, i) => (
                        <div key={i} className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                            <div className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <cat.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                            <p className="text-slate-500 text-sm">{cat.count} articles</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top FAQs */}
            <section className="py-24 bg-white rounded-t-[4rem] shadow-2xl relative z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <HelpCircle size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Suggested Articles</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="group p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer flex items-center justify-between">
                                <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">{faq}</span>
                                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" size={20} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-slate-50 rounded-[3rem] border border-slate-200 text-center">
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Still need help?</h3>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">Our support team is available 24/7. Average response time is under 15 minutes.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">Contact Support</button>
                            <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all active:scale-95">Live Chat</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HelpCenter;
