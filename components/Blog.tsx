
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const posts = [
        {
            title: "5 Strategies to Boost Your Google Reviews in 2026",
            excerpt: "Learn how to ethically and effectively increase your business ratings using smart QR technology and follow-up sequences.",
            author: "Sarah Johnson",
            date: "Feb 15, 2026",
            category: "Growth",
            image: "https://images.unsplash.com/photo-1556742049-04ff56f71295?w=800&q=80"
        },
        {
            title: "How to Handle Negative Feedback Like a Pro",
            excerpt: "Turning a bad review into a loyal customer is an art. Discover the templates and psychological triggers that work every time.",
            author: "Mark Davis",
            date: "Feb 10, 2026",
            category: "Reputation",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
        },
        {
            title: "The Future of Reputation Management for Local Business",
            excerpt: "AI is changing how customers interact with brands. Stay ahead of the curve with our latest industry trend report.",
            author: "Elena Rodriguez",
            date: "Jan 28, 2026",
            category: "Industry",
            image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80"
        }
    ];

    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            <section className="pt-32 pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Master Your <span className="text-gradient">Reputation</span></h1>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            Expert advice, industry insights, and success stories to help your local business thrive in the digital age.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-20">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="text" placeholder="Search articles..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg" />
                        </div>
                        <div className="flex gap-2">
                            {["Growth", "Reputation", "Tips", "Enterprise"].map(tag => (
                                <button key={tag} className="px-6 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95">{tag}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {posts.map((post, i) => (
                            <div key={i} className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">{post.category}</span>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h3>
                                    <p className="text-slate-500 leading-relaxed mb-6 flex-1">{post.excerpt}</p>
                                    <button className="flex items-center text-blue-600 font-bold group/btn">
                                        Read Full Article <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button className="px-10 py-5 rounded-3xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95">Load More Articles</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
