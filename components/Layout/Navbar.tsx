
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Highlight active link
    const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600 font-medium';

    return (
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <span className="font-bold text-2xl text-slate-900 tracking-tight">SmartReview</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/how-it-works" className={`${isActive('/how-it-works')} transition`}>How it Works</Link>
                        <Link to="/features" className={`${isActive('/features')} transition`}>Features</Link>
                        <Link to="/demo" className={`${isActive('/demo')} transition`}>Demo</Link>
                        <a href="/#pricing" className="text-slate-600 hover:text-blue-600 font-medium transition">Pricing</a>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="text-slate-700 font-semibold hover:text-blue-600 transition">Log in</Link>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5">
                            Get Started
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link to="/how-it-works" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600" onClick={() => setIsOpen(false)}>How it Works</Link>
                        <Link to="/features" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600" onClick={() => setIsOpen(false)}>Features</Link>
                        <Link to="/demo" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600" onClick={() => setIsOpen(false)}>Demo</Link>
                        <div className="pt-4 flex flex-col space-y-3">
                            <Link to="/login" className="w-full text-center px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50" onClick={() => setIsOpen(false)}>Log in</Link>
                            <Link to="/register" className="w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md" onClick={() => setIsOpen(false)}>Get Started</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
