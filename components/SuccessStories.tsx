
import React from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Quote, Star, ArrowRight, ExternalLink, PlayCircle } from 'lucide-react';

const SuccessStories = () => {
    const stories = [
        {
            business: "The Coffee House",
            location: "New York, NY",
            rating: "4.9",
            reviews: "1,200+",
            story: "Before Review With AI, we struggled to get customers to leave feedback. Now, it's automatic. Our Google ranking jumped from page 3 to the #1 spot in just 2 months.",
            owner: "Marcus Chen",
            role: "Founder",
            image: "https://images.unsplash.com/photo-1501339817302-382d129f817b?w=800&q=80"
        },
        {
            business: "Elite Fit Gym",
            location: "Austin, TX",
            rating: "4.8",
            reviews: "850+",
            story: "The ability to catch negative feedback privately has been a game-changer. We've resolved over 50 member issues before they hit public sites.",
            owner: "Sarah Jenkins",
            role: "General Manager",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
        },
        {
            business: "Blue Ocean Seafood",
            location: "Miami, FL",
            rating: "5.0",
            reviews: "450+",
            story: "Our review volume tripled in the first 30 days. The QR codes on our tables make it so easy for diners to share their experience.",
            owner: "David Rossi",
            role: "Executive Chef",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
        }
    ];

    return (
        <div className="font-sans antialiased bg-slate-50 text-slate-900 scroll-smooth">
            <Navbar />

            <section className="pt-32 pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">Trusted by <span className="text-gradient">Local Gems</span></h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                        Discover how businesses like yours are using Review With AI to dominate their local markets and build lasting customer trust.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                    {stories.map((story, i) => (
                        <div key={i} className={`flex flex-col lg:flex-row gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-12 duration-1000`} style={{ animationDelay: `${i * 200}ms` }}>
                            <div className="flex-1 w-full">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-blue-600 rounded-[3rem] transform rotate-3 group-hover:rotate-1 transition-transform opacity-10"></div>
                                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[16/10]">
                                        <img src={story.image} alt={story.business} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                        <div className="absolute bottom-8 left-8 flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                                                <PlayCircle size={32} />
                                            </div>
                                            <span className="text-white font-bold tracking-wide">Watch Video Case Study</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-8">
                                <div className="flex text-yellow-400 gap-1">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={20} fill="currentColor" />)}
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 leading-tight">{story.business}</h2>
                                <div className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    <span>{story.location}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-blue-600">{story.reviews} Reviews</span>
                                </div>
                                <div className="relative">
                                    <Quote className="absolute -top-6 -left-6 text-blue-100" size={64} />
                                    <p className="text-xl text-slate-700 leading-relaxed relative z-10 italic">
                                        "{story.story}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 border-t border-slate-100 pt-8">
                                    <img src={`https://i.pravatar.cc/150?u=${story.owner}`} className="w-14 h-14 rounded-full border-2 border-white shadow-lg" alt={story.owner} />
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-0">{story.owner}</h4>
                                        <p className="text-slate-500 text-sm font-medium">{story.role}</p>
                                    </div>
                                    <button className="ml-auto p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                        <ExternalLink size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats / Proof */}
            <section className="py-24 bg-slate-900 text-white rounded-[5rem] mx-4 my-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-12 text-center">
                    <div>
                        <h3 className="text-6xl font-black text-blue-400 mb-2">350%</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Avg. Review Increase</p>
                    </div>
                    <div>
                        <h3 className="text-6xl font-black text-blue-400 mb-2">12k+</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Businesses Growing</p>
                    </div>
                    <div>
                        <h3 className="text-6xl font-black text-blue-400 mb-2">94%</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Customer Retention</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SuccessStories;
