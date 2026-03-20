import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Settings, QrCode, MessageCircle, TrendingUp, CheckCircle, AlertCircle,
  Download, LayoutDashboard, Star, LogOut, CreditCard, ExternalLink,
  Clock, HelpCircle, ShieldAlert, Check, X, Menu, Phone, MapPin, Share2, Copy, ChevronRight, Upload, UserCircle, ShoppingBag
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { Plan, Ticket, TicketCategory, TicketPriority, Message, UserRole, Feedback, Transaction, SubscriptionPlan } from '../types';
import SupportSection from './Support/SupportSection';
import jsPDF from 'jspdf';
import QRCodeStyling from 'qr-code-styling';
import CustomerReviews from './CustomerReviews';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'feedbacks' | 'qr' | 'map' | 'settings' | 'offers' | 'billing' | 'support' | 'profile'>('overview');
  const [business, setBusiness] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [currentPlanDetails, setCurrentPlanDetails] = useState<Plan | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalScans: 0,
    googleRedirects: 0,
    privateFeedbacks: 0,
    couponsIssued: 0
  });

  // Settings State

  const [settingsForm, setSettingsForm] = useState<any>({
    enabled: false,
    customMessage: '',
    couponCode: '',
    offers: []
  });

  // Billing State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingTransactions, setBillingTransactions] = useState<Transaction[]>([]);
  const [billingStep, setBillingStep] = useState<'PLANS' | 'PAYMENT'>('PLANS');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  const [mapSearch, setMapSearch] = useState('');
  const [customQrUrl, setCustomQrUrl] = useState<string>('');

  useEffect(() => {
    if (business?.id) {
      const qrCode = new QRCodeStyling({
        width: 600,
        height: 600,
        data: `${window.location.origin}/#/b/${business.id}`,
        image: '/maps-pin.png',
        dotsOptions: { color: '#77ac23', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: 0.35 },
        cornersSquareOptions: { color: '#77ac23', type: 'extra-rounded' },
        cornersDotOptions: { color: '#77ac23', type: 'dot' }
      });
      qrCode.getRawData('png').then((blob) => {
        if (blob) {
          setCustomQrUrl(URL.createObjectURL(blob as Blob));
        }
      });
    }
  }, [business?.id]);

  const refreshData = async () => {
    const userStr = sessionStorage.getItem('current_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);

      try {
        const [biz, fbs, allPlans, gSettings] = await Promise.all([
          api.getBusiness(u.businessId),
          api.getFeedbacks(u.businessId),
          api.getPlans(),
          api.getGlobalSettings()
        ]);

        setBusiness(biz);
        setFeedbacks(fbs);
        setGlobalSettings(gSettings);
        setPlans(allPlans);

        if (biz) {
          const plan = allPlans.find(p => p.id === biz.plan);
          if (plan) setCurrentPlanDetails(plan);

          const txns = await api.getTransactions(biz.id);
          setBillingTransactions(txns);

          // Calculate Stats
          const privateFbs = fbs.filter((f: Feedback) => f.rating <= 3);
          setStats({
            totalScans: biz.totalScans || 0,
            googleRedirects: biz.totalReviews || 0, // Proxy
            privateFeedbacks: privateFbs.length,
            couponsIssued: Math.floor((biz.totalScans || 0) * 0.8) // Mocked for now based on scans
          });

          // Settings
          if (biz.settings) {
            setSettingsForm({
              enabled: biz.settings.enabled || false,
              customMessage: biz.settings.customMessage || '',
              couponCode: biz.settings.couponCode || '',
              offers: biz.settings.offers || []
            });
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    }
  };

  useEffect(() => {
    refreshData();
    // Simulate refresh every 30s
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const hasPurchased = billingTransactions.some(t => t.status === 'SUCCESS');
  const subscriptionLabel = hasPurchased ? 'Renewal' : 'Subscription';

  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPoster = async (format: 'PNG' | 'PDF') => {
    if (!business) return;
    setIsDownloading(true);
    try {
      // Load Great Vibes font for "Thank you" script text
      const gvFont = new FontFace(
        'Great Vibes',
        'url(https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN-XCg6UKDXlCZA.woff2)'
      );
      await gvFont.load().catch(() => null); // silently fallback if font fails
      document.fonts.add(gvFont);
      await document.fonts.ready;

      const W = 800, H = 1131;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;

      // ── 1. Load Background Image
      const bgImg = await new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = () => rej(new Error('Failed to load background image'));
        img.src = '/poster-bg.png';
      }).catch(() => null);

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);

      if (bgImg) {
        ctx.save();
        ctx.globalAlpha = 0.3; // Lighten the background image so stars/text stand out
        ctx.drawImage(bgImg, 0, 0, W, H);
        ctx.restore();
      } else {
        // Fallback to textured background
        ctx.fillStyle = 'rgba(0,0,0,0.018)';
        for (let x = 0; x < W; x += 6) for (let y = 0; y < H; y += 6) ctx.fillRect(x, y, 1, 1);
      }

      // ── 2. Outer border
      ctx.strokeStyle = 'rgba(26,26,26,0.1)'; ctx.lineWidth = 1; // Subtle border for colorful bg
      ctx.strokeRect(20, 20, W - 40, H - 40);

      // ── 3. Logo circle (pink) + business name SIDE BY SIDE
      const circleX = 260, circleY = 110, circleR = 45;
      ctx.fillStyle = '#fa92b1ff';
      ctx.beginPath(); ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 55px cursive,Georgia,serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((business?.name?.[0] || 'B').toUpperCase(), circleX, circleY + 2);

      // Business name to the right of circle — Great Vibes font (same as Thank you)
      const nameX = circleX + circleR + 20;
      ctx.fillStyle = '#1a1a1a';
      ctx.font = '44px "Great Vibes",cursive,Georgia,serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const bizName = business?.name || 'Your Business';
      ctx.fillText(bizName, nameX, circleY - 8);
      ctx.fillStyle = '#777'; ctx.font = '10px Arial,sans-serif';
      //ctx.letterSpacing = '2px';
      //ctx.fillText('PHO & BAGUETTE EXPRESS', nameX, circleY + 22);
      //ctx.letterSpacing = '0px';

      // ── 4. "Thank you" in Great Vibes script font
      ctx.fillStyle = '#1a1a1a';
      ctx.font = '115px "Great Vibes",cursive,Georgia,serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Thank you', W / 2, 185);

      // Sparkle (4-point star)
      ctx.fillStyle = '#1a1a1a'; ctx.save();
      ctx.translate(W / 2 + 225, 200);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.moveTo(0, 0); ctx.quadraticCurveTo(5, 13, 0, 26); ctx.quadraticCurveTo(-5, 13, 0, 0);
      }
      ctx.fill(); ctx.restore();

      // Small sparkle
      ctx.save(); ctx.translate(W / 2 + 248, 195);
      ctx.scale(0.45, 0.45); ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.moveTo(0, 0); ctx.quadraticCurveTo(5, 13, 0, 26); ctx.quadraticCurveTo(-5, 13, 0, 0);
      }
      ctx.fill(); ctx.restore();

      // "FOR YOUR SUPPORT"
      ctx.fillStyle = '#1a1a1a'; ctx.font = '500 20px cursive,Georgia,serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('FOR YOUR SUPPORT', W / 2, 305);

      // ── 5. Make our day prompt
      ctx.font = '500 25px Arial,sans-serif';
      ctx.fillText('Make our day by leaving us a review!', W / 2, 350);

      // ── 6. Google logo (coloured letters)
      const gColors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
      const gLetters = ['G', 'o', 'o', 'g', 'l', 'e'];
      ctx.font = 'bold 74px Arial,Helvetica,sans-serif'; ctx.textBaseline = 'top';
      let gW = 0; gLetters.forEach(l => { gW += ctx.measureText(l).width; });
      let gx = W / 2 - gW / 2;
      gLetters.forEach((l, i) => {
        ctx.fillStyle = gColors[i]; ctx.fillText(l, gx, 394); gx += ctx.measureText(l).width;
      });

      // ── 7. 5 Gold Stars
      for (let s = 0; s < 5; s++) {
        const sx = W / 2 - 110 + s * 55, sy = 478, sr = 23;
        ctx.fillStyle = '#FBBC05'; ctx.beginPath();
        for (let p = 0; p < 5; p++) {
          const a = (p * 4 * Math.PI) / 5 - Math.PI / 2;
          const ia = a + Math.PI / 5;
          p === 0 ? ctx.moveTo(sx + Math.cos(a) * sr, sy + Math.sin(a) * sr) : ctx.lineTo(sx + Math.cos(a) * sr, sy + Math.sin(a) * sr);
          ctx.lineTo(sx + Math.cos(ia) * (sr * 0.4), sy + Math.sin(ia) * (sr * 0.4));
        }
        ctx.closePath(); ctx.fill();
      }

      // ── 8. QR Code — Custom Premium Design (300px)
      const qrImg = await new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = customQrUrl || `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${window.location.origin}/#/b/${business.id}`)}&size=600x600&color=77ac23`;
      });

      const qrSz = 300, qrX = (W - qrSz) / 2, qrY = 522, qrP = 14;
      // White background for QR to ensure readability on colorful bg
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      const r = 40; // rounded white bg
      ctx.roundRect(qrX - qrP, qrY - qrP, qrSz + qrP * 2, qrSz + qrP * 2, r);
      ctx.fill();

      ctx.drawImage(qrImg, qrX, qrY, qrSz, qrSz);

      // ── 9. "Scan QR code or go to" — URL removed, only this line
      ctx.fillStyle = '#1a1a1a'; ctx.font = '500 26px Arial,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Scan QR code', W / 2, 855);

      // ── 10. Footer: fixed website + phone number — moved below illustration
      const footerY = 1028;
      ctx.fillStyle = '#000000ff'; ctx.font = '600 20px Arial,sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('reviewwithai.netlify.app', 65, footerY);
      ctx.textAlign = 'right';
      ctx.fillText('7532878132', W - 65, footerY);

      // ── 10b. Celebration illustration (people holding stars) — above footer URL
      const illuY = 878, illuH = 88;
      // Background panel (light)
      //ctx.fillStyle = 'rgba(255,255,255,0.7)';
      //ctx.fillRect(80, illuY, W - 160, illuH + 4);

      // Helper: draw a small star
      const drawStar = (cx: number, cy: number, r: number, clr: string) => {
        ctx.fillStyle = clr;
        ctx.beginPath();
        for (let p = 0; p < 5; p++) {
          const a = (p * 4 * Math.PI) / 5 - Math.PI / 2;
          const ia = a + Math.PI / 5;
          p === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
          ctx.lineTo(cx + Math.cos(ia) * (r * 0.4), cy + Math.sin(ia) * (r * 0.4));
        }
        ctx.closePath(); ctx.fill();
      };

      // Helper: draw a simple person figure (body color, arms up holding star)
      const drawPerson = (px: number, py: number, bodyClr: string, skinClr: string, starClr: string, starUp: boolean) => {
        const headR = 10;
        // Head
        ctx.fillStyle = skinClr;
        ctx.beginPath(); ctx.arc(px, py, headR, 0, Math.PI * 2); ctx.fill();
        // Body
        ctx.fillStyle = bodyClr;
        ctx.fillRect(px - 9, py + headR, 18, 32);
        // Legs
        ctx.fillStyle = bodyClr;
        ctx.fillRect(px - 9, py + headR + 32, 8, 22);
        ctx.fillRect(px + 1, py + headR + 32, 8, 22);
        // Left arm up
        ctx.strokeStyle = skinClr; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px - 9, py + headR + 8);
        ctx.lineTo(starUp ? px - 22 : px - 24, starUp ? py - 14 : py + 8);
        ctx.stroke();
        // Right arm up (holding star)
        ctx.beginPath();
        ctx.moveTo(px + 9, py + headR + 8);
        ctx.lineTo(px + 22, py - 16);
        ctx.stroke();
        // Star in right hand
        drawStar(px + 28, py - 28, 14, starClr);
      };

      // Draw 5 people
      const people = [
        { x: 120, clr: '#5b8c5a', skin: '#f5c89c', star: '#FBBC05', up: false },
        { x: 230, clr: '#e8834e', skin: '#c68642', star: '#FBBC05', up: true },
        { x: 340, clr: '#d45b6e', skin: '#f5c89c', star: '#FBBC05', up: false },
        { x: 450, clr: '#9b59b6', skin: '#8d5524', star: '#FBBC05', up: true },
        { x: 560, clr: '#3498db', skin: '#f5c89c', star: '#FBBC05', up: false },
      ];
      people.forEach(p => drawPerson(p.x, illuY + 72, p.clr, p.skin, p.star, p.up));

      // ── 11. Divider + "Powered by Rishi Raj"
      ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(65, 1065); ctx.lineTo(W - 65, 1065); ctx.stroke();

      ctx.fillStyle = '#555'; ctx.font = '500 16px Arial,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Powered by', W / 2 - 52, 1080);
      ctx.fillStyle = '#1a1a1a'; ctx.font = 'bold 18px Arial,sans-serif';
      ctx.fillText(' Rishi Raj', W / 2 + 28, 1079);

      // ── Export
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      if (format === 'PNG') {
        const link = document.createElement('a');
        link.download = `${(business.name || 'business').replace(/\s+/g, '-')}-QR-Poster.png`;
        link.href = dataUrl; link.click();
      } else {
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfW = pdf.internal.pageSize.getWidth();
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, (H * pdfW) / W);
        pdf.save(`${(business.name || 'business').replace(/\s+/g, '-')}-QR-Poster.pdf`);
      }
    } catch (err) {
      console.error('Poster generation failed:', err);
      alert('QR poster download failed. Please check your internet and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  const handleSaveSettings = async () => {
    if (business) {
      await api.updateBusiness(business.id, {
        settings: {
          ...business.settings,
          ...settingsForm
        }
      });
      alert('Settings saved successfully!');
      refreshData();
    }
  };

  const handleResolveFeedback = async (id: string, currentStatus: boolean) => {
    await api.resolveFeedback(id, currentStatus);
    refreshData();
  };

  const handleMapUpdate = async () => {
    // Mock update
    if (business && mapSearch) {
      await api.updateBusiness(business.id, {
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(mapSearch)}`,
        name: mapSearch
      });
      alert('Location updated!');
      refreshData();
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setBillingStep('PAYMENT');
    setPaymentProof(null);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedPlan || !business || !paymentProof) return;

    const newTxn: Transaction = {

      businessId: business.id,
      businessName: business.name,
      planId: selectedPlan.id,
      amount: selectedPlan.price,
      date: Date.now(),
      status: 'PENDING',
      utr: `UPI-${Math.floor(Math.random() * 1000000)}`, // Mock UTR generation
      screenshot: paymentProof
    };

    await api.addTransaction(newTxn);
    alert('Payment submitted! Plan will be active after admin verification.');
    setBillingStep('PLANS');
    setSelectedPlan(null);
    refreshData();
  };

  const handleOfferImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newOffers = [...(settingsForm.offers || [])];
        const item = newOffers[index] || {
          name: '',
          image: '',
          color: 'bg-indigo-600',
          actualPrice: '₹0',
          offerPrice: '₹0'
        };
        newOffers[index] = { ...item, image: reader.result as string };
        setSettingsForm({ ...settingsForm, offers: newOffers });
      };
      reader.readAsDataURL(file);
    }
  };

  // Access Logic
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const daysRemaining = business ? Math.ceil((business.expiryDate - now) / msInDay) : 0;
  const isExpired = business ? (business.expiryDate < now) : false;
  const isInactive = business ? (business.status === 'INACTIVE' || isExpired) : false;

  const getDayWiseData = () => {
    // Mock data for graph
    return [
      { name: 'Mon', scans: 45 }, { name: 'Tue', scans: 52 }, { name: 'Wed', scans: 38 },
      { name: 'Thu', scans: 65 }, { name: 'Fri', scans: 48 }, { name: 'Sat', scans: 85 }, { name: 'Sun', scans: 70 }
    ];
  };

  // Condition to block interactions
  const isLocked = isInactive && activeTab !== 'billing' && activeTab !== 'support' && activeTab !== 'profile';

  if (!business) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div></div>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm md:hidden flex flex-col p-6 animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
              <span className="font-black text-white text-xl">Review With <span className="text-amber-400">AI</span></span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white/10 p-2 rounded-full text-white"><X size={24} /></button>
          </div>
          <div className="space-y-2">
            <NavItem active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false) }} icon={LayoutDashboard} label="Overview" />
            <NavItem active={activeTab === 'feedbacks'} onClick={() => { setActiveTab('feedbacks'); setIsMobileMenuOpen(false) }} icon={AlertCircle} label="Feedback Inbox" badge={stats.privateFeedbacks} />
            <NavItem active={activeTab === 'qr'} onClick={() => { setActiveTab('qr'); setIsMobileMenuOpen(false) }} icon={QrCode} label="My QR Code" />
            <NavItem active={activeTab === 'map'} onClick={() => { setActiveTab('map'); setIsMobileMenuOpen(false) }} icon={MapPin} label="Google Integration" />
            <NavItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false) }} icon={Settings} label="Reward Settings" />
            <NavItem active={activeTab === 'offers'} onClick={() => { setActiveTab('offers'); setIsMobileMenuOpen(false) }} icon={ShoppingBag} label="Manage Offers" />
            <NavItem active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setIsMobileMenuOpen(false) }} icon={CreditCard} label={subscriptionLabel} />
            <NavItem active={activeTab === 'support'} onClick={() => { setActiveTab('support'); setIsMobileMenuOpen(false) }} icon={HelpCircle} label="Support" />
            <NavItem active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false) }} icon={UserCircle} label="My Profile" />
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="bg-slate-800 p-4 rounded-xl mb-4">
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">Current Plan</p>
              <p className="text-white font-black">{business?.plan === 'NONE' ? 'Select Plan' : business?.plan}</p>
              <p className={`text-xs mt-1 ${isExpired ? 'text-rose-400' : 'text-emerald-400'}`}>{daysRemaining} Days Left</p>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-4 bg-rose-600/10 text-rose-400 rounded-xl font-bold">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col p-6 shadow-2xl z-20 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-10 px-2">
          {business?.businessImage ? (
            <img src={business.businessImage} alt="Profile" className="w-12 h-12 rounded-xl object-cover shadow-lg shadow-indigo-500/30 border-2 border-indigo-500/50" />
          ) : (
            <div className="w-12 h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center border-2 border-indigo-400/30 shrink-0">
              <span className="text-white font-black text-xl">{user?.name ? user.name.charAt(0).toUpperCase() : 'C'}</span>
            </div>
          )}
          <div className="overflow-hidden">
            <h1 className="font-black text-lg tracking-tight leading-tight truncate text-white">{user?.name || 'Client'}</h1>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Business Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutDashboard} label="Overview" />
          <NavItem active={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')} icon={AlertCircle} label="Feedback Inbox" badge={stats.privateFeedbacks} />
          <NavItem active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} icon={QrCode} label="My QR Code" />
          <NavItem active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={MapPin} label="Google Integration" />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Reward Settings" />
          <NavItem active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} icon={ShoppingBag} label="Manage Offers" />
          <NavItem active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={CreditCard} label={subscriptionLabel} />
          <NavItem active={activeTab === 'support'} onClick={() => setActiveTab('support')} icon={HelpCircle} label="Support" />
          <NavItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserCircle} label="My Profile" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Plan</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${business.plan === 'GROWTH' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {business.plan === 'NONE' ? 'No Plan' : (isInactive ? `${business.plan} (Inactive)` : business.plan)}
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center mb-1">
              <Clock size={14} className="mr-2 text-slate-400" />
              {daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Expired'}
            </div>
            {(isExpired || business.plan === 'NONE') && <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('billing'); setBillingStep('PLANS'); }} className="text-xs text-rose-400 font-bold hover:underline">{hasPurchased ? 'Renew Now' : 'Subscribe Now'}</a>}
          </div>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-sm font-bold">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-30 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg"><MessageCircle size={18} className="text-white" /></div>
            <span className="font-black text-slate-900">{business.name}</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600"><Menu size={24} /></button>
        </header>

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-10 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center border-t-8 border-rose-500">
              <ShieldAlert size={48} className="text-rose-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-900 mb-2">Dashboard Locked</h2>
              <p className="text-slate-500 font-medium mb-6">Your subscription is inactive. Please renew to access these features.</p>
              <button onClick={() => setActiveTab('billing')} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">Go to Billing</button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{
                activeTab === 'overview' ? 'Dashboard Overview' :
                  activeTab === 'feedbacks' ? 'Feedback Inbox' :
                    activeTab === 'qr' ? 'My QR Assets' :
                      activeTab === 'map' ? 'Google Integration' :
                        activeTab === 'settings' ? 'Reward Controls' : subscriptionLabel
              }</h2>
              <p className="text-slate-500 font-medium">Welcome back, {user?.name}</p>
            </div>
            {activeTab === 'overview' && (
              <a href={business.googleMapsUrl} target="_blank" className="flex items-center space-x-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
                <ExternalLink size={18} />
                <span>View Live Page</span>
              </a>
            )}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard label="Total Scans" value={stats.totalScans} icon={QrCode} color="blue" />
                <StatCard label="Google Redirects" value={stats.googleRedirects} icon={Share2} color="emerald" />
                <StatCard label="Private Concerns" value={stats.privateFeedbacks} icon={ShieldAlert} color="rose" />
                <StatCard label="Coupons Issued" value={stats.couponsIssued} icon={CheckCircle} color="indigo" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-800 text-lg">Weekly Footfall</h3>
                    <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-1 outline-none"><option>Last 7 Days</option></select>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getDayWiseData()}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="scans" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-indigo-600 text-white p-8 rounded-[32px] relative overflow-hidden shadow-xl shadow-indigo-200">
                  <div className="relative z-10">
                    <h3 className="font-black text-2xl mb-2">My QR Code</h3>
                    <p className="text-indigo-200 text-sm font-medium mb-8">Scan to test, or download for print.</p>
                    <div className="bg-white p-4 rounded-2xl w-fit mb-6">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${window.location.origin}/#/b/${business.id}`)}&size=150x150`} className="w-32 h-32" />
                    </div>
                    <button onClick={() => setActiveTab('qr')} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
                      <Download size={18} />
                      <span>Download Options</span>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <CustomerReviews business={business} globalSettings={globalSettings} />
            </div>
          )}

          {/* FEEDBACKS TAB */}
          {activeTab === 'feedbacks' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-amber-900 font-bold text-sm">Negative Feedback Filter Active</p>
                  <p className="text-amber-700 text-xs mt-1">Showing only 1-3 star ratings. Address these immediately to improve your reputation.</p>
                </div>
              </div>

              <div className="grid gap-4">
                {feedbacks.filter(f => f.rating <= 3).length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100">
                    <CheckCircle size={64} className="mx-auto text-emerald-100 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">All Clear!</h3>
                    <p className="text-slate-500">No negative feedback pending.</p>
                  </div>
                ) : (
                  feedbacks.filter(f => f.rating <= 3).map(feedback => (
                    <div key={feedback.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={`${i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                          <span className="text-xs font-bold text-slate-400 ml-2">{new Date(feedback.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl mb-4 italic">"{feedback.comment}"</p>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs">
                            {feedback.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{feedback.customerName}</p>
                            <p className="text-xs text-slate-500">{feedback.customerMobile || 'No Number'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-3 shrink-0">
                        {feedback.customerMobile && (
                          <a href={`https://wa.me/${feedback.customerMobile.replace(/\D/g, '')}`} target="_blank" className="flex-1 flex items-center justify-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200">
                            <MessageCircle size={18} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        <button
                          onClick={() => handleResolveFeedback(feedback.id, feedback.resolved)}
                          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold border transition-colors ${feedback.resolved ? 'bg-slate-100 text-slate-400 border-transparent' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          {feedback.resolved ? <Check size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 mr-2"></div>}
                          <span>{feedback.resolved ? 'Resolved' : 'Mark Done'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* QR CODE TAB */}
          {/* QR CODE TAB */}
          {activeTab === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* LEFT SIDE: Download Options (Unchanged) */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-2xl mb-8">
                  <img src={customQrUrl || `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${window.location.origin}/#/b/${business.id}`)}&size=300x300`} className="w-56 h-56" alt="QR" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Your Smart QR</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-xs">Placed at the counter, this QR is your gateway to 5-star reviews.</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <button onClick={() => downloadPoster('PNG')} disabled={isDownloading} className="flex items-center justify-center space-x-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                    <Download size={18} /><span>{isDownloading ? 'Downloading...' : 'PNG'}</span>
                  </button>
                  <button onClick={() => downloadPoster('PDF')} disabled={isDownloading} className="flex items-center justify-center space-x-2 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Download size={18} /><span>{isDownloading ? 'Downloading...' : 'PDF'}</span>
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE: Customer Preview View (Unchanged) */}
              <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative z-10 w-full max-w-xs">
                  <div className="bg-slate-800 rounded-3xl border-8 border-slate-700 overflow-hidden shadow-2xl aspect-[9/16] relative">
                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6"><Star size={32} fill="currentColor" /></div>
                      <h4 className="text-slate-900 font-bold text-lg mb-2">How was your experience?</h4>
                      <p className="text-slate-400 text-xs mb-8">Rate us to help us improve.</p>
                      <div className="flex space-x-1 mb-8">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} className="text-slate-200 fill-slate-200" />)}
                      </div>
                      <div className="w-full h-10 bg-indigo-600 rounded-xl opacity-20"></div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full"></div>
                  </div>
                  <p className="text-center mt-6 font-bold text-slate-400 uppercase tracking-widest text-xs">Customer View Preview</p>
                </div>
              </div>

              {/* HIDDEN POSTER ELEMENT FOR EXACT "BUN MEE" / FIXED LAYOUT DOWNLOAD */}
              {/* Uses fixed+left-[-9999px] so html2canvas can render it at full size off-screen */}
              <div style={{ position: 'fixed', top: '-99999px', left: '-99999px', zIndex: -9999, pointerEvents: 'none' }}>
                <style>
                  {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700;900&display=swap');
          .poster-font-script { font-family: 'Great Vibes', cursive; }
          .poster-font-sans { font-family: 'Montserrat', sans-serif; }
          .paper-bg {
            background-color: #fff;
            background-image: linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('/poster-bg.png');
            background-size: cover;
            background-position: center;
          }
        `}
                </style>

                {/* Main Poster Container */}
                <div ref={posterRef} className="w-[800px] h-[1131px] paper-bg relative flex flex-col items-center p-[60px] overflow-hidden poster-font-sans text-[#1a1a1a]">

                  {/* Outer Black Border */}
                  <div className="absolute inset-5 border-[2px] border-[#1a1a1a] pointer-events-none z-10"></div>

                  {/* 1. Header (Side by Side to prevent name overlapping with logo) */}
                  <div className="flex items-center justify-center gap-[20px] w-full mt-[10px] mb-[40px] z-10">
                    <div className="w-[85px] h-[85px] rounded-full bg-[#ff5e8e] flex items-center justify-center text-white text-[55px] poster-font-script pt-1 shrink-0">
                      {business?.name?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div className="flex flex-col text-left max-w-[500px]">
                      <h1 className="text-[52px] poster-font-script leading-[0.9] m-0 break-words">
                        {business?.name || 'pooja juice corner'}
                      </h1>
                      <p className="text-[11px] font-bold tracking-[0.25em] uppercase mt-2 mb-0">
                        REVIEW & FEEDBACK EXPRESS
                      </p>
                    </div>
                  </div>

                  {/* 2. Main Title (Thank You) */}
                  <div className="flex flex-col items-center mb-[40px] z-10">
                    <div className="relative pr-[50px]">
                      <h2 className="text-[140px] leading-[0.8] poster-font-script m-0">
                        Thank you
                      </h2>
                      {/* Sparkles */}
                      <svg className="absolute -top-[20px] right-0 w-[55px] h-[55px] text-[#1a1a1a]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
                        <path d="M20 18L21.08 15.84L23.23 14.75L21.08 13.66L20 11.5L18.92 13.66L16.77 14.75L18.92 15.84L20 18Z" />
                      </svg>
                    </div>
                    <p className="text-[24px] font-medium tracking-[0.15em] uppercase mt-[25px] mb-0">
                      For Your Support
                    </p>
                  </div>

                  {/* 3. Prompt */}
                  <p className="text-[28px] font-medium tracking-wide mb-[30px] z-10">
                    Make our day by leaving us a review!
                  </p>

                  {/* 4. Google & Stars */}
                  <div className="flex flex-col items-center mb-[35px] z-10">
                    <div className="flex items-center space-x-1 mb-[5px] text-[75px] font-bold tracking-tighter" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">o</span>
                      <span className="text-[#FBBC05]">o</span>
                      <span className="text-[#4285F4]">g</span>
                      <span className="text-[#34A853]">l</span>
                      <span className="text-[#EA4335]">e</span>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <svg key={i} className="w-[45px] h-[45px] text-[#FBBC05] fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* 5. QR Code */}
                  <div className="p-[15px] bg-white border-[6px] border-[#1a1a1a] mb-[30px] z-10">
                    <img
                      src={customQrUrl || `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${window.location.origin}/#/b/${business?.id}`)}&size=400x400`}
                      crossOrigin="anonymous"
                      className="w-[220px] h-[220px] block"
                      alt="QR"
                    />
                  </div>

                  {/* 6. Scan Link Instruction (word-break break-all handles long URLs safely) */}
                  <div className="text-center w-full px-[40px] z-10">
                    <p className="text-[26px] mb-1">Scan QR code or go to</p>
                    <p className="text-[28px] font-bold break-all leading-[1.1]">
                      {window.location.host}/#/b/{business?.id || 'biz-12345'}
                    </p>
                  </div>

                  {/* 7. Footer Info (Absolute positioned so it stays fixed and doesn't collide with URL) */}
                  <div className="absolute bottom-[100px] left-[60px] right-[60px] flex justify-between items-center text-[22px] font-semibold text-[#2b5797] z-10">
                    <p className="truncate max-w-[45%] text-left m-0">
                      {business?.name ? business.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com' : 'poojajuicecorner.com'}
                    </p>
                    <p className="truncate max-w-[45%] text-right m-0">
                      {business?.mobile || '(952) 222-9999'}
                    </p>
                  </div>

                  {/* 8. Bottom Branding Credit (Absolute fixed to bottom) */}
                  <div className="absolute bottom-[30px] left-[60px] right-[60px] border-t border-[#ccc] pt-[20px] flex justify-center items-center text-[18px] font-medium text-[#555] z-10">
                    <p className="m-0 flex items-center justify-center">
                      Designed by
                      <span className="text-[#e63946] font-bold text-[22px] ml-[10px] flex items-center tracking-wide">
                        <span className="border-[2px] border-[#e63946] rounded-[4px] px-[5px] mr-[5px] text-[18px]">S</span> SKIPLI
                      </span>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* MAPS TAB */}
          {activeTab === 'map' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><MapPin size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Google Maps Integration</h3>
                    <p className="text-slate-500 font-medium">Link your business location strictly.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Search Your Business</label>
                    <div className="flex gap-3">
                      <input type="text" placeholder="e.g. Starbucks, Connaught Place" value={mapSearch} onChange={(e) => setMapSearch(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                      <button onClick={handleMapUpdate} className="bg-slate-900 text-white px-6 rounded-2xl font-bold hover:bg-slate-800">Search</button>
                    </div>
                    <p className="mt-3 text-xs text-slate-400 font-medium">We will automatically fetch the review URL for the selected location.</p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Current Linked Location</span>
                      <span className="text-emerald-500 text-xs font-black uppercase flex items-center"><Check size={12} className="mr-1" /> Active</span>
                    </div>
                    <p className="font-bold text-slate-900 text-lg truncate">{business.name}</p>
                    <a href={business.googleMapsUrl} target="_blank" className="text-blue-500 text-sm font-bold hover:underline truncate block mt-1">{business.googleMapsUrl}</a>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Google Place ID (Required for Reviews)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Place ID (e.g. ChIJN1t_t75uEmsRUte9Y-ByA94)"
                          value={business.googlePlaceId || ''}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setBusiness({ ...business, googlePlaceId: val });
                            await api.updateBusiness(business.id, { googlePlaceId: val });
                          }}
                          className="flex-1 bg-white border border-slate-200 p-2 rounded-lg outline-none text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-purple-50 p-4 rounded-2xl text-purple-600"><Settings size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Reward System</h3>
                    <p className="text-slate-500 font-medium">Incentivize customers to leave feedback.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                    <div>
                      <h4 className="font-bold text-slate-900">Enable Coupon Rewards</h4>
                      <p className="text-xs text-slate-500 mt-1">Show a coupon code after positive feedback.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settingsForm.enabled} onChange={(e) => setSettingsForm({ ...settingsForm, enabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {settingsForm.enabled && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Thank You Message</label>
                        <input
                          type="text"
                          value={settingsForm.customMessage}
                          onChange={(e) => setSettingsForm({ ...settingsForm, customMessage: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                          placeholder="e.g. Thanks for your review!"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Coupon Code</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 bg-green-100 rounded text-green-700"><CheckCircle size={14} /></div>
                          <input
                            type="text"
                            value={settingsForm.couponCode}
                            onChange={(e) => setSettingsForm({ ...settingsForm, couponCode: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 font-black tracking-widest uppercase text-lg"
                            placeholder="FLAT20"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button onClick={handleSaveSettings} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-transform">Save Changes</button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'offers' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-orange-50 p-4 rounded-2xl text-orange-600"><ShoppingBag size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Manage Product Offers</h3>
                    <p className="text-slate-500 font-medium">Customize the 5 highlight boxes shown at the bottom of your review page.</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const item = settingsForm.offers?.[index] || {
                        name: '',
                        image: '',
                        color: 'bg-indigo-600',
                        actualPrice: '₹0',
                        offerPrice: '₹0'
                      };
                      return (
                        <div key={index} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Offer Box {index + 1}</span>
                            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          </div>

                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Service/Product Name"
                              value={item.name}
                              onChange={(e) => {
                                const newOffers = [...(settingsForm.offers || [])];
                                newOffers[index] = { ...item, name: e.target.value };
                                setSettingsForm({ ...settingsForm, offers: newOffers });
                              }}
                              className="w-full text-xs font-bold p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex flex-col space-y-2">
                              {item.image ? (
                                <img src={item.image} className="w-full h-24 object-cover rounded-xl border border-slate-200" alt="Preview" />
                              ) : (
                                <div className="w-full h-24 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
                                  <Upload size={20} className="text-slate-400" />
                                </div>
                              )}
                              <label className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold text-center cursor-pointer hover:bg-indigo-100 transition-colors">
                                <span>{item.image ? 'Change Photo' : 'Upload Photo'}</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleOfferImageUpload(index, e)}
                                />
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Actual Price"
                                value={item.actualPrice}
                                onChange={(e) => {
                                  const newOffers = [...(settingsForm.offers || [])];
                                  newOffers[index] = { ...item, actualPrice: e.target.value };
                                  setSettingsForm({ ...settingsForm, offers: newOffers });
                                }}
                                className="w-full text-xs font-bold p-3 bg-white border border-slate-200 rounded-xl outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Offer Price"
                                value={item.offerPrice}
                                onChange={(e) => {
                                  const newOffers = [...(settingsForm.offers || [])];
                                  newOffers[index] = { ...item, offerPrice: e.target.value };
                                  setSettingsForm({ ...settingsForm, offers: newOffers });
                                }}
                                className="w-full text-xs font-bold p-3 bg-white border border-slate-200 rounded-xl outline-none"
                              />
                            </div>
                            <select
                              value={item.color}
                              onChange={(e) => {
                                const newOffers = [...(settingsForm.offers || [])];
                                newOffers[index] = { ...item, color: e.target.value };
                                setSettingsForm({ ...settingsForm, offers: newOffers });
                              }}
                              className="w-full text-[10px] font-bold p-3 bg-white border border-slate-200 rounded-xl outline-none"
                            >
                              <option value="bg-indigo-600">Indigo</option>
                              <option value="bg-rose-500">Rose</option>
                              <option value="bg-emerald-500">Emerald</option>
                              <option value="bg-amber-500">Amber</option>
                              <option value="bg-orange-500">Orange</option>
                              <option value="bg-blue-900">Navy</option>
                              <option value="bg-yellow-400">Yellow</option>
                              <option value="bg-purple-700">Purple</option>
                              <option value="bg-cyan-500">Cyan</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={handleSaveSettings} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">Update Offers</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && <SupportSection user={user} />}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProfileSection user={user} business={business} refreshData={refreshData} />
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Transaction History Section */}
              {billingTransactions.length > 0 && (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-8">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Payment History</h3>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Plan & Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {billingTransactions.sort((a, b) => b.date - a.date).map(txn => (
                        <tr key={txn.id || txn.utr} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-bold text-slate-700 text-xs">{new Date(txn.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="font-black text-slate-900">{txn.planId}</div>
                            <div className="text-[10px] text-slate-400">₹{txn.amount}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${txn.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' :
                              txn.status === 'FAILED' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-[10px] font-mono text-slate-400">{txn.utr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {billingStep === 'PLANS' ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900">Choose Your Plan</h2>
                    <p className="text-slate-500 font-medium mt-2">Scale your business with the right tools.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => {
                      const isActive = business.status === 'ACTIVE' && business.expiryDate > Date.now();
                      const isCurrent = business.plan !== 'NONE' && business.plan === plan.id && isActive;
                      return (
                        <div key={plan.id} className={`relative bg-white p-8 rounded-[40px] border shadow-xl flex flex-col transition-all hover:-translate-y-1 ${isCurrent ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}>
                          {isCurrent && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">Current Active</div>}
                          <div className="mb-6">
                            <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                            <div className="text-4xl font-black text-indigo-600 mt-2">₹{plan.price}<span className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">/mo</span></div>
                          </div>
                          <div className="space-y-4 flex-1 mb-8">
                            {plan.features.map(f => (
                              <div key={f.id} className="flex items-center space-x-3 text-sm">
                                <div className={`p-1 rounded-full ${f.type === 'CHECKBOX' ? (f.value ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400') : 'bg-indigo-100 text-indigo-600'}`}>
                                  <Check size={12} />
                                </div>
                                <span className="font-medium text-slate-600">{f.name}:</span>
                                <span className="font-bold text-slate-900">{f.type === 'CHECKBOX' ? (f.value ? '' : '') : f.value}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            disabled={isCurrent}
                            onClick={() => handleSelectPlan(plan)}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${isCurrent ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'}`}
                          >
                            {isCurrent ? 'Active Plan' : 'Select Plan'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <button onClick={() => setBillingStep('PLANS')} className="mb-6 flex items-center space-x-2 text-slate-400 font-bold hover:text-slate-600"><div className="p-2 bg-white rounded-full"><ChevronRight size={16} className="rotate-180" /></div><span>Back to Plans</span></button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-indigo-600 p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2">Complete Payment</h3>
                        <p className="text-indigo-200 font-medium mb-8">Scan QR to pay securely.</p>

                        <div className="bg-white p-6 rounded-3xl w-fit mb-8 mx-auto shadow-2xl">
                          {globalSettings?.paymentQrCode ? (
                            <img src={globalSettings.paymentQrCode} className="w-48 h-48 object-contain" alt="Payment QR" />
                          ) : (
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent((globalSettings?.upiLink || '').replace(/am=[^&]*/, `am=${selectedPlan?.price || 0}`))}&size=300x300`} className="w-48 h-48" alt="Payment QR" />
                          )}
                        </div>

                        <div className="text-center">
                          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Total Amount</div>
                          <div className="text-4xl font-black">₹{selectedPlan?.price}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl h-fit">
                      <h3 className="text-xl font-black text-slate-900 mb-6">Upload Receipt</h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selected Plan</label>
                          <div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-200">{selectedPlan?.name} (₹{selectedPlan?.price}/mo)</div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Proof (Screenshot)</label>
                          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${paymentProof ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {paymentProof ? (
                                <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                              ) : (
                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                              )}
                              <p className="text-xs font-bold text-slate-500">{paymentProof ? 'Receipt Uploaded' : 'Click to upload proof'}</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleProofUpload} />
                          </label>
                        </div>

                        <button
                          onClick={handleSubmitPayment}
                          disabled={!paymentProof}
                          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${paymentProof ? 'bg-slate-900 text-white shadow-xl hover:scale-[1.02]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                          Confirm Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon: Icon, label, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <Icon size={20} className={`transition-transform group-hover:scale-110 ${active ? 'text-indigo-200' : ''}`} />
    <span className="font-bold text-sm tracking-wide">{label}</span>
    {badge > 0 && <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const StatCard = ({ label, value, icon: Icon, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`${colors[color]} p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 ${colors[color].replace('text', 'bg').split(' ')[0]}`}></div>
    </div>
  );
};

export default Dashboard;

const ProfileSection = ({ user, business, refreshData }: any) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    mobile: user.mobile || '',
    email: user.email || '', // Readonly
    businessName: business.name || '',
    fullAddress: business.fullAddress || '',
    googleMapsUrl: business.googleMapsUrl || '',
    businessImage: business.businessImage || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, businessImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Save User Updates
      if (user.id) {
        await api.updateUser(user.id, {
          name: formData.name,
          mobile: formData.mobile
        });
      }

      // Save Business Updates
      await api.updateBusiness(business.id, {
        name: formData.businessName,
        fullAddress: formData.fullAddress,
        googleMapsUrl: formData.googleMapsUrl,
        businessImage: formData.businessImage
      });

      // Update Session Storage for immediate reflect
      const updatedUser = { ...user, name: formData.name, mobile: formData.mobile };
      sessionStorage.setItem('current_user', JSON.stringify(updatedUser));

      alert('Profile updated successfully!');
      refreshData();
    } catch (e) {
      console.error(e);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
          <UserCircle size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">My Profile</h3>
          <p className="text-slate-500 font-medium">Manage your personal and business details.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <label className="relative group cursor-pointer">
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-xl ${!formData.businessImage && 'bg-slate-100 flex items-center justify-center'}`}>
              {formData.businessImage ? (
                <img src={formData.businessImage} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <Upload size={32} className="text-slate-400" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-bold">Change Photo</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Personal Details</h4>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile</label>
              <input type="tel" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email (Read Only)</label>
              <input type="email" value={formData.email} disabled className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 font-bold cursor-not-allowed" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Business Details</h4>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Business Name</label>
              <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
              <input type="text" value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} placeholder="e.g. 123, MG Road, New Delhi" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Profile Link (Google Maps)</label>
              <input type="text" value={formData.googleMapsUrl} onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 text-xs" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:scale-[1.01] transition-transform">
          Save Changes
        </button>
      </div>
    </div>
  );
};
