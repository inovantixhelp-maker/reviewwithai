
import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12 text-sm">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6 text-white">
                        <img src="/logo.svg" alt="Review With AI Logo" className="h-8 w-8" />
                        <span className="font-bold text-xl">Review With <span className="text-blue-400">AI</span></span>
                    </div>
                    <p className="leading-relaxed opacity-70 mb-6">Helping local businesses grow with the power of authentic customer reviews.</p>
                    <div className="flex space-x-4">
                        {/* Social placeholders */}
                        <div className="w-8 h-8 bg-slate-800 rounded-lg hover:bg-blue-600 transition cursor-pointer flex items-center justify-center">X</div>
                        <div className="w-8 h-8 bg-slate-800 rounded-lg hover:bg-blue-600 transition cursor-pointer flex items-center justify-center">in</div>
                        <div className="w-8 h-8 bg-slate-800 rounded-lg hover:bg-blue-600 transition cursor-pointer flex items-center justify-center">fb</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Product</h4>
                    <ul className="space-y-3 opacity-70">
                        <li><Link to="/features" className="hover:text-blue-400 transition">Features</Link></li>
                        <li><Link to="/#pricing" className="hover:text-blue-400 transition">Pricing</Link></li>
                        <li><Link to="/enterprise" className="hover:text-blue-400 transition">Enterprise</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Resources</h4>
                    <ul className="space-y-3 opacity-70">
                        <li><Link to="/blog" className="hover:text-blue-400 transition">Blog</Link></li>
                        <li><Link to="/success-stories" className="hover:text-blue-400 transition">Success Stories</Link></li>
                        <li><Link to="/help" className="hover:text-blue-400 transition">Help Center</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Legal</h4>
                    <ul className="space-y-3 opacity-70">
                        <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
                        <li><Link to="/cookies" className="hover:text-blue-400 transition">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center opacity-40 text-xs">
                © {new Date().getFullYear()} Review With AI. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
