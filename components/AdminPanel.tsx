
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Settings, ShieldCheck, Search, Plus, Edit2, Power, PowerOff,
  LogOut, QrCode, Upload, X, CheckCircle2, LayoutDashboard, BarChart4,
  Ticket, Tag, MessageSquareWarning, Mail, Key, Globe, ExternalLink,
  ChevronRight, ArrowUpRight, DollarSign, Eye, Trash2, Check, Hash, ToggleLeft,
  Calendar, MapPin, Percent, CreditCard, Copy, Link as LinkIcon, Info, AlertCircle,
  TrendingDown, HeartPulse, Activity, BellRing, Star, MessageSquare, Filter,
  Paperclip, Send, UserCircle, CheckCircle, RotateCw, Map, Phone, Clock, MessageCircle, Menu
} from 'lucide-react';
import { api } from '../services/api';
import { SubscriptionPlan, Business, Plan, Coupon, Transaction, Ticket as TicketType, PlanFeature, FeatureType, DiscountType, Feedback, TicketMessage, UserRole } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dash' | 'clients' | 'plans' | 'coupons' | 'feedback' | 'support' | 'settings' | 'payments' | 'livechat' | 'profile'>('dash');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [liveMessages, setLiveMessages] = useState<any[]>([]);

  // Plan Builder State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Business Modal State
  const [isBizModalOpen, setIsBizModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Partial<Business> | null>(null);

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  // Support / Ticket States
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [replyText, setReplyText] = useState('');
  const [adminReplyAttachment, setAdminReplyAttachment] = useState<string | null>(null);

  // Live Chat State
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null); // Message ID being edited
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUser = JSON.parse(sessionStorage.getItem('current_user') || '{}');

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000); // Polling for live updates
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket, selectedChatUser, liveMessages]);

  const refreshData = async () => {
    try {
      const [allBiz, gSettings, allPlans, allCoupons, allTickets, allFeedbacks, allUsers, allTxns, allLiveMsgs] = await Promise.all([
        api.getAllBusinesses(),
        api.getGlobalSettings(),
        api.getPlans(),
        api.getCoupons(),
        api.getTickets(),
        api.getAllFeedbacks(),
        api.getAllUsers(),
        api.getTransactions(),
        api.getLiveChatMessages()
      ]);

      setBusinesses(allBiz);
      setGlobalSettings(gSettings);
      setPlans(allPlans);
      setCoupons(allCoupons);
      setTickets(allTickets);
      setFeedbacks(allFeedbacks);
      setUsers(allUsers);
      setTransactions(allTxns);
      setLiveMessages(allLiveMsgs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  const handleImpersonate = async (bizId: string) => {
    // Current impersontation logic in storage.ts was:
    // 1. Get biz owner user
    // 2. set 'current_user' to that user
    // 3. return true

    // We need to fetch the owner for this business
    // We can assume 1 owner per business for now or just find the first user with role OWNER and this bizId
    const targetUser = users.find(u => u.businessId === bizId && u.role === UserRole.OWNER);
    if (targetUser) {
      // Set session storage (frontend state)
      sessionStorage.setItem('current_user', JSON.stringify(targetUser));
      navigate('/dashboard');
    } else {
      alert('No owner found for this business to impersonate.');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    let nextStatus: 'ACTIVE' | 'DISABLED' | 'INACTIVE' = 'ACTIVE';
    if (currentStatus === 'ACTIVE') nextStatus = 'DISABLED';
    else if (currentStatus === 'DISABLED') nextStatus = 'INACTIVE';
    else nextStatus = 'ACTIVE';

    await api.updateBusiness(id, { status: nextStatus });
    refreshData();
  };

  const resolveFeedback = async (id: string, currentStatus: boolean) => {
    // We need current status to toggle, or just assume we setting to resolved?
    // The previous implementation of resolveFeedback toggled or set to true?
    // storage.ts: resolveFeedback(id) -> set resolved=true.
    // api.ts: resolveFeedback(id, currentStatus) -> toggles.
    // Let's passed false to force toggle true if we assume it was pending.
    // Better: find the feedback in state.
    const fb = feedbacks.find(f => f.id === id);
    if (fb) {
      await api.resolveFeedback(id, fb.resolved);
      refreshData();
    }
  };

  // Support Handlers
  const handleSendReply = async () => {
    if ((!replyText && !adminReplyAttachment) || !selectedTicket) return;

    const newMessage: TicketMessage = {
      id: crypto.randomUUID(),
      senderId: currentUser.email || 'admin@smartreview.com',
      senderName: 'Super Admin',
      text: replyText,
      timestamp: Date.now(),
      attachment: adminReplyAttachment || undefined,
      role: UserRole.ADMIN
    };

    await api.addTicketMessage(selectedTicket.id, newMessage);

    // Refresh
    const t = await api.getTicketDetails(selectedTicket.id);
    if (t) {
      setSelectedTicket(t);
      // Also update list in background
      const allTickets = await api.getTickets();
      setTickets(allTickets);
    }

    setReplyText('');
    setAdminReplyAttachment(null);
  };

  // Live Chat Handlers
  const handleSendChat = async () => {
    if (!chatInput.trim() || !selectedChatUser) return;

    if (editingMessage) {
      // Edit existing message
      await api.updateLiveChatMessage(editingMessage, chatInput);
      setEditingMessage(null);
    } else {
      // Send new message
      const newMessage = {
        id: crypto.randomUUID(),
        senderId: 'ADMIN',
        senderName: 'Super Admin',
        receiverId: selectedChatUser,
        text: chatInput,
        timestamp: Date.now(),
        role: UserRole.ADMIN,
        isRead: false
      };
      await api.addLiveChatMessage(newMessage as any);
    }
    setChatInput('');
    refreshData();
  };

  const deleteChatMessage = async (msgId: string) => {
    if (confirm('Delete this message?')) {
      await api.deleteLiveChatMessage(msgId);
      refreshData();
    }
  };

  const startEditMessage = (msg: any) => {
    setChatInput(msg.text);
    setEditingMessage(msg.id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminReplyAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTicketStatus = async (status: 'OPEN' | 'RESOLVED') => {
    if (!selectedTicket) return;
    await api.updateTicketStatus(selectedTicket.id, status);

    // Refresh
    const t = await api.getTicketDetails(selectedTicket.id);
    if (t) setSelectedTicket(t);

    const all = await api.getTickets();
    setTickets(all);
  };

  const handleSelectTicket = async (ticket: TicketType) => {
    try {
      const fullTicket = await api.getTicketDetails(ticket.id);
      if (fullTicket) {
        setSelectedTicket(fullTicket);
      }
    } catch (err) {
      console.error('Error loading ticket details:', err);
    }
  };

  const handleVerifyPayment = async (trxId: string, status: 'SUCCESS' | 'FAILED') => {
    try {
      await api.updateTransactionStatus(trxId, status);
      await refreshData();
      alert(`Payment ${status === 'SUCCESS' ? 'Approved' : 'Rejected'} successfully.`);
    } catch (err: any) {
      console.error(err);
      alert('Failed to update payment status: ' + (err.message || 'Unknown error'));
    }
  };

  // Chat Calculations
  const getChatUsers = () => {
    // Unique users who have sent messages OR received messages
    const userIds = new Set<string>();
    liveMessages.forEach(m => {
      if (m.senderId !== 'ADMIN') userIds.add(m.senderId);
      if (m.receiverId !== 'ADMIN' && m.receiverId) userIds.add(m.receiverId);
    });
    return Array.from(userIds).map(uid => {
      const userBiz = businesses.find(b => b.id === uid);
      const lastMsg = liveMessages.filter(m => m.senderId === uid || m.receiverId === uid).sort((a, b) => b.timestamp - a.timestamp)[0];
      return {
        id: uid,
        name: userBiz?.name || 'Unknown Client',
        lastMessage: lastMsg?.text || '',
        timestamp: lastMsg?.timestamp || 0
      };
    }).sort((a, b) => b.timestamp - a.timestamp);
  };

  const selectedChatMessages = selectedChatUser
    ? liveMessages.filter(m => m.senderId === selectedChatUser || m.receiverId === selectedChatUser).sort((a, b) => a.timestamp - b.timestamp)
    : [];

  // Plan Builder Functions
  const handleOpenPlanBuilder = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(JSON.parse(JSON.stringify(plan)));
    } else {
      setEditingPlan({ id: crypto.randomUUID(), name: '', price: 0, features: [] });
    }
    setIsPlanModalOpen(true);
  };

  const addFeatureRow = () => {
    if (!editingPlan) return;
    const newFeature: PlanFeature = { id: crypto.randomUUID(), name: 'New Feature', type: 'CHECKBOX', value: false };
    setEditingPlan({ ...editingPlan, features: [...editingPlan.features, newFeature] });
  };

  const updateFeatureRow = (index: number, updates: Partial<PlanFeature>) => {
    if (!editingPlan) return;
    const newFeatures = [...editingPlan.features];
    newFeatures[index] = { ...newFeatures[index], ...updates };
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  const removeFeatureRow = (index: number) => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, features: editingPlan.features.filter((_, i) => i !== index) });
  };

  const savePlan = async () => {
    if (editingPlan) {
      await api.savePlan(editingPlan);
      setIsPlanModalOpen(false);
      refreshData();
    }
  };

  // Coupon Builder Functions
  const handleOpenCouponModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon({ ...coupon });
    } else {
      setEditingCoupon({
        id: crypto.randomUUID(), code: '', discountType: 'PERCENTAGE', discountValue: 0,
        startDate: Date.now(), endDate: Date.now() + (30 * msInDay),
        applicablePlans: plans.map(p => p.id), isRecurring: false, status: 'ACTIVE',
        usageCount: 0, revenueGenerated: 0, maxUsagePerUser: 1
      });
    }
    setIsCouponModalOpen(true);
  };

  const saveCoupon = async () => {
    if (editingCoupon && editingCoupon.code) {
      await api.saveCoupon(editingCoupon as Coupon);
      setIsCouponModalOpen(false);
      refreshData();
    }
  };

  const copyCouponLink = (code: string) => {
    const url = `${window.location.origin}/#/register?coupon=${code}`;
    navigator.clipboard.writeText(url);
    alert('Coupon link copied!');
  };

  const handleOpenBizModal = (biz?: Business) => {
    if (biz) {
      setEditingBiz({ ...biz });
    } else {
      setEditingBiz({
        id: '',
        name: '',
        googleMapsUrl: '',
        googlePlaceId: '',
        plan: SubscriptionPlan.NONE,
        status: 'ACTIVE',
        expiryDate: Date.now() + (30 * msInDay),
        totalScans: 0,
        totalReviews: 0,
        settings: { rewardType: 'THANK_YOU', couponCode: '', customMessage: '' }
      });
    }
    setIsBizModalOpen(true);
  };

  const saveBusiness = async () => {
    if (editingBiz && editingBiz.name) {
      if (editingBiz.id) {
        await api.updateBusiness(editingBiz.id, editingBiz);
      } else {
        const newBiz: Business = {
          id: crypto.randomUUID(),
          name: editingBiz.name || '',
          googlePlaceId: editingBiz.googlePlaceId || '',
          googleMapsUrl: editingBiz.googleMapsUrl || '',
          plan: editingBiz.plan || SubscriptionPlan.NONE,
          status: editingBiz.status || 'ACTIVE',
          expiryDate: editingBiz.expiryDate || Date.now() + (30 * msInDay),
          totalScans: 0,
          totalReviews: 0,
          fullAddress: '',
          businessImage: '',
          settings: editingBiz.settings || { enabled: true, rewardType: 'COUPON', customMessage: '', couponCode: '' }
        };
        await api.addBusiness(newBiz);
      }
      setIsBizModalOpen(false);
      refreshData();
    }
  };

  // Logic Helpers
  const msInDay = 24 * 60 * 60 * 1000;
  const calculateHealthScore = (bizId: string) => {
    const biz = businesses.find(b => b.id === bizId);
    if (!biz) return 0;
    const bizFeedbacks = feedbacks.filter(f => f.businessId === bizId);
    const totalReviews = biz.totalReviews || 0;
    if (totalReviews === 0 && bizFeedbacks.length === 0) return 100;
    return Math.round((totalReviews / (totalReviews + bizFeedbacks.length)) * 100);
  };

  const getCriticalAlerts = () => {
    const last24h = Date.now() - msInDay;
    return businesses.map(biz => ({
      ...biz,
      negCount: feedbacks.filter(f => f.businessId === biz.id && f.timestamp > last24h).length
    })).filter(b => b.negCount >= 3);
  };

  const criticalAlerts = getCriticalAlerts();
  const filteredTickets = tickets.filter(t => ticketStatusFilter === 'ALL' ? true : t.status === ticketStatusFilter);

  const totalReviews = businesses.reduce((acc, b) => acc + (b.totalReviews || 0), 0);
  const totalScans = businesses.reduce((acc, b) => acc + (b.totalScans || 0), 0);
  const conversionRate = totalScans > 0 ? Math.round((totalReviews / totalScans) * 100) : 0;
  const currentMRR = businesses.filter(b => b.status === 'ACTIVE').reduce((acc, b) => {
    const plan = plans.find(p => p.id === b.planId);
    return acc + (plan?.price || 0);
  }, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm lg:hidden flex flex-col p-6 animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-red-600 to-rose-700 p-2 rounded-lg"><ShieldCheck size={20} className="text-white" /></div>
              <span className="font-black text-white text-xl">Admin Panel</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white/10 p-2 rounded-full text-white"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <nav className="space-y-1">
              <NavItem active={activeTab === 'dash'} onClick={() => { setActiveTab('dash'); setIsMobileMenuOpen(false) }} icon={LayoutDashboard} label="Global Overview" />
              <NavItem active={activeTab === 'clients'} onClick={() => { setActiveTab('clients'); setIsMobileMenuOpen(false) }} icon={Users} label="Business Directory" />
              <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">SaaS Engine</div>
              <NavItem active={activeTab === 'plans'} onClick={() => { setActiveTab('plans'); setIsMobileMenuOpen(false) }} icon={BarChart4} label="Plan Builder" />
              <NavItem active={activeTab === 'coupons'} onClick={() => { setActiveTab('coupons'); setIsMobileMenuOpen(false) }} icon={Tag} label="Coupon Codes" />
              <NavItem active={activeTab === 'payments'} onClick={() => { setActiveTab('payments'); setIsMobileMenuOpen(false) }} icon={CreditCard} label="Payment Requests" alertCount={transactions.filter(t => t.status === 'PENDING').length} />
              <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Data</div>
              <NavItem active={activeTab === 'feedback'} onClick={() => { setActiveTab('feedback'); setIsMobileMenuOpen(false) }} icon={MessageSquareWarning} label="Negative Monitor" alertCount={criticalAlerts.length} />
              <NavItem active={activeTab === 'support'} onClick={() => { setActiveTab('support'); setIsMobileMenuOpen(false) }} icon={MessageSquare} label="Support Tickets" alertCount={tickets.filter(t => t.status === 'OPEN').length} />
              <NavItem active={activeTab === 'livechat'} onClick={() => { setActiveTab('livechat'); setIsMobileMenuOpen(false) }} icon={MessageCircle} label="Live Chat" alertCount={liveMessages.filter(m => !m.isRead && m.senderId !== 'ADMIN').length} />
              <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">System</div>
              <NavItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false) }} icon={Settings} label="White-Label Setup" />
              <NavItem active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false) }} icon={UserCircle} label="My Admin Profile" />
            </nav>
          </div>
          <button onClick={handleLogout} className="mt-auto w-full flex items-center space-x-3 p-4 bg-rose-600/10 text-rose-400 rounded-xl font-bold">
            <LogOut size={20} />
            <span>Sign Out Control</span>
          </button>
        </div>
      )}

      {/* Super Admin Sidebar Desktop */}
      <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col p-6 overflow-y-auto shrink-0 transition-all duration-300">
        <div className="mb-10 flex items-center space-x-3 px-2 group cursor-pointer" onClick={() => setActiveTab('profile')}>
          <div className="bg-gradient-to-br from-red-600 to-rose-700 p-2.5 rounded-xl shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
            <UserCircle size={24} className="text-white" />
          </div>
          <div className="overflow-hidden">
            <span className="font-black text-lg tracking-tighter uppercase block truncate">{currentUser.name || 'Super Admin'}</span>
            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase truncate">{currentUser.email || 'Platform Control'}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem active={activeTab === 'dash'} onClick={() => setActiveTab('dash')} icon={LayoutDashboard} label="Global Overview" />
          <NavItem active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} icon={Users} label="Business Directory" />
          <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">SaaS Engine</div>
          <NavItem active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} icon={BarChart4} label="Plan Builder" />
          <NavItem active={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')} icon={Tag} label="Coupon Codes" />
          <NavItem active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon={CreditCard} label="Payment Requests" alertCount={transactions.filter(t => t.status === 'PENDING').length} />
          <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Data</div>
          <NavItem active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={MessageSquareWarning} label="Negative Monitor" alertCount={criticalAlerts.length} />
          <NavItem active={activeTab === 'support'} onClick={() => setActiveTab('support')} icon={MessageSquare} label="Support Tickets" alertCount={tickets.filter(t => t.status === 'OPEN').length} />
          <NavItem active={activeTab === 'livechat'} onClick={() => setActiveTab('livechat')} icon={MessageCircle} label="Live Chat" alertCount={liveMessages.filter(m => !m.isRead && m.senderId !== 'ADMIN').length} />
          <div className="pt-4 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">System</div>
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="White-Label Setup" />
          <NavItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserCircle} label="My Admin Profile" />
        </nav>

        <button onClick={handleLogout} className="mt-8 flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors font-bold text-sm">
          <LogOut size={18} />
          <span>Exit Panel</span>
        </button>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50 flex flex-col">
        {/* Mobile Top Header */}
        <header className="lg:hidden bg-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-3 text-white">
            <div className="bg-rose-600 p-2 rounded-lg shadow-lg shadow-rose-900/20"><ShieldCheck size={18} /></div>
            <span className="font-black tracking-tight">Admin<span className="text-rose-500">Panel</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-white bg-slate-800 rounded-xl border border-slate-700 shadow-sm"><Menu size={20} /></button>
        </header>

        <div className="flex-1 p-4 md:p-8">
          {activeTab === 'dash' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-slate-900">Global Dashboard</h1>
                  <p className="text-slate-500 font-medium">Platform-wide health & revenue tracking.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-black uppercase">Current MRR</div>
                    <div className="text-xl font-bold">₹{currentMRR.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Reviews" value={totalReviews < 1000 ? totalReviews.toString() : (totalReviews / 1000).toFixed(1) + 'k'} sub="All time" color="indigo" />
                <StatCard label="Avg conversion" value={conversionRate + '%'} sub="Across all brands" color="emerald" />
                <StatCard label="Live Locations" value={businesses.length.toString()} sub="Active subscriptions" color="blue" />
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-8">Revenue Growth (6 Months)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="rev" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Plan Builder Tab */}
          {activeTab === 'plans' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Plan Builder</h2>
                  <p className="text-slate-500">Define subscription tiers and custom feature limits.</p>
                </div>
                <button onClick={() => handleOpenPlanBuilder()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-indigo-100">
                  <Plus size={20} />
                  <span>Create New Tier</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                        <div className="text-3xl font-black text-indigo-600 mt-1">₹{plan.price}<span className="text-xs text-slate-400 font-bold uppercase tracking-widest">/mo</span></div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenPlanBuilder(plan)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => api.deletePlan(plan.id).then(refreshData)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      {plan.features.map(f => (
                        <div key={f.id} className="flex items-center space-x-3 text-sm">
                          <div className={`p-1 rounded-full ${f.type === 'CHECKBOX' ? (f.value ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400') : 'bg-indigo-100 text-indigo-600'}`}>
                            {f.type === 'CHECKBOX' ? <Check size={12} /> : <Hash size={12} />}
                          </div>
                          <span className="font-medium text-slate-600">{f.name}:</span>
                          <span className="font-bold text-slate-900">{f.type === 'CHECKBOX' ? (f.value ? 'Yes' : 'No') : f.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Coupon Codes</h2>
                  <p className="text-slate-500">Track and manage promo codes for business acquisitions.</p>
                </div>
                <button onClick={() => handleOpenCouponModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-xl shadow-indigo-100">
                  <Plus size={20} />
                  <span>New Discount Code</span>
                </button>
              </div>
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4">Performance</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map(coupon => (
                      <tr key={coupon.id} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-black text-slate-900 uppercase tracking-widest">{coupon.code}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{coupon.isRecurring ? 'Every Month' : 'First Month Only'}</div>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-800">
                          {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                        </td>
                        <td className="px-6 py-5 text-[10px] text-slate-400 font-black uppercase">
                          {coupon.usageCount} Usages / ₹{coupon.revenueGenerated.toLocaleString()} Rev
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${coupon.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {coupon.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => copyCouponLink(coupon.code)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><LinkIcon size={18} /></button>
                            <button onClick={() => handleOpenCouponModal(coupon)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg"><Edit2 size={18} /></button>
                            <button onClick={() => api.deleteCoupon(coupon.id).then(refreshData)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Negative Monitor Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Negative Monitor</h2>
                  <p className="text-slate-500">Critical 1-3 star feedbacks from all platform clients.</p>
                </div>
                <div className="bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase flex items-center space-x-2 animate-pulse">
                  <HeartPulse size={16} />
                  <span>Live Health Monitoring</span>
                </div>
              </div>

              {criticalAlerts.length > 0 && (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-[32px] p-6">
                  <h3 className="flex items-center space-x-2 text-rose-600 font-black uppercase text-xs mb-4">
                    <BellRing size={18} />
                    <span>Critical: High Complaint Volume (Last 24h)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {criticalAlerts.map(biz => (
                      <div key={biz.id} className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between">
                        <div>
                          <p className="font-black text-slate-900">{biz.name}</p>
                          <p className="text-[10px] font-bold text-rose-500 uppercase">{biz.negCount} Negative Feedbacks Received</p>
                        </div>
                        <button onClick={() => handleImpersonate(biz.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Eye size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {businesses.map(biz => {
                  const score = calculateHealthScore(biz.id);
                  return (
                    <div key={biz.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${score > 80 ? 'bg-emerald-100 text-emerald-600' : score > 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                        {score}%
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</p>
                        <p className="font-bold text-slate-900 truncate max-w-[120px]">{biz.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                      <tr>
                        <th className="px-8 py-5">Business</th>
                        <th className="px-8 py-5">Rating & Comment</th>
                        <th className="px-8 py-5 hidden md:table-cell">Status</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feedbacks.sort((a, b) => b.timestamp - a.timestamp).map(f => {
                        const biz = businesses.find(b => b.id === f.businessId);
                        return (
                          <tr key={f.id} className={`hover:bg-slate-50 transition-colors ${!f.resolved ? 'bg-red-50/20' : ''}`}>
                            <td className="px-8 py-6">
                              <p className="font-bold text-slate-900">{biz?.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{f.customerName}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex space-x-1 mb-1">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className={s <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />)}
                              </div>
                              <p className="text-xs text-slate-500 italic">"{f.comment}"</p>
                            </td>
                            <td className="px-8 py-6 hidden md:table-cell">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${f.resolved ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {f.resolved ? 'Resolved' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button onClick={() => resolveFeedback(f.id, f.resolved)} className={`p-2 rounded-xl transition-all ${f.resolved ? 'text-slate-400' : 'bg-emerald-600 text-white'}`}>
                                <CheckCircle size={18} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Support Desk</h2>
                  <p className="text-slate-500">Provide assistance to business owners and resolve tickets.</p>
                </div>
                <div className="flex space-x-2">
                  {['ALL', 'OPEN', 'RESOLVED'].map(f => (
                    <button key={f} onClick={() => setTicketStatusFilter(f as any)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${ticketStatusFilter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                    {filteredTickets.map(t => (
                      <button key={t.id} onClick={() => handleSelectTicket(t)} className={`w-full p-6 text-left hover:bg-slate-50 transition-colors flex flex-col space-y-3 ${selectedTicket?.id === t.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''}`}>
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${t.status === 'OPEN' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{t.status}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>{t.priority}</span>
                        </div>
                        <h4 className="font-black text-slate-800 line-clamp-1">{t.subject}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{t.clientName}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-xl flex flex-col overflow-hidden">
                  {selectedTicket ? (
                    <>
                      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{selectedTicket.subject}</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase">{selectedTicket.clientName}</p>
                        </div>
                        <button onClick={() => handleUpdateTicketStatus(selectedTicket.status === 'OPEN' ? 'RESOLVED' : 'OPEN')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase">
                          {selectedTicket.status === 'OPEN' ? 'Mark Resolved' : 'Reopen Ticket'}
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
                        {selectedTicket.messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.role === UserRole.ADMIN ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[70%] space-y-2">
                              <div className={`p-5 rounded-3xl text-sm font-medium ${msg.role === UserRole.ADMIN ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                                {msg.text}
                                {msg.attachment && <img src={msg.attachment} className="mt-4 rounded-xl max-h-64 object-contain" alt="Attachment" />}
                              </div>
                              <div className={`text-[10px] font-bold text-slate-400 ${msg.role === UserRole.ADMIN ? 'text-right' : 'text-left'}`}>{new Date(msg.timestamp).toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="p-8 border-t border-slate-100">
                        <div className="flex items-end space-x-4">
                          <label className="p-4 bg-slate-50 text-slate-400 rounded-2xl cursor-pointer border border-slate-100"><Paperclip size={24} /><input type="file" className="hidden" onChange={handleFileChange} /></label>
                          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type official reply..." className="flex-1 p-5 bg-slate-50 border border-slate-200 rounded-[32px] outline-none font-bold text-sm resize-none" rows={1} />
                          <button onClick={handleSendReply} className="p-5 bg-indigo-600 text-white rounded-full"><Send size={24} /></button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-16 text-center opacity-40">
                      <Ticket size={100} className="mb-6" />
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Support Desk</h3>
                      <p className="max-w-md mx-auto font-medium text-slate-500 mt-4">Select a ticket to provide assistance to business owners.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Plan Builder Modal */}
          {isPlanModalOpen && editingPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-2xl font-black text-slate-900">Configure Plan Tier</h3>
                  <button onClick={() => setIsPlanModalOpen(false)}><X size={24} className="text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tier Name</label>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} placeholder="e.g. Pro" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Price (₹)</label>
                      <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={editingPlan.price} onChange={(e) => setEditingPlan({ ...editingPlan, price: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Features</label><button onClick={addFeatureRow} className="text-indigo-600 text-xs font-black flex items-center space-x-1"><Plus size={14} /><span>Add Feature</span></button></div>
                    <div className="space-y-3">
                      {editingPlan.features.map((f, i) => (
                        <div key={f.id} className="flex items-center space-x-4 p-4 bg-white border border-slate-200 rounded-2xl">
                          <input className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm font-bold" value={f.name} onChange={(e) => updateFeatureRow(i, { name: e.target.value })} placeholder="Feature" />
                          <select className="text-xs font-black uppercase text-slate-500 bg-slate-50 border-none rounded-lg p-1" value={f.type} onChange={(e) => updateFeatureRow(i, { type: e.target.value as any, value: e.target.value === 'CHECKBOX' ? false : 0 })}>
                            <option value="CHECKBOX">Toggle</option>
                            <option value="NUMBER">Limit</option>
                          </select>
                          {f.type === 'CHECKBOX' ? <button onClick={() => updateFeatureRow(i, { value: !f.value })} className={`p-1.5 rounded-lg ${f.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Check size={18} /></button> : <input type="number" className="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" value={f.value} onChange={(e) => updateFeatureRow(i, { value: parseInt(e.target.value) || 0 })} />}
                          <button onClick={() => removeFeatureRow(i)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex space-x-4">
                  <button onClick={() => setIsPlanModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                  <button onClick={savePlan} className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {/* Coupon Builder Modal */}
          {isCouponModalOpen && editingCoupon && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-2xl font-black text-slate-900">Configure Coupon</h3>
                  <button onClick={() => setIsCouponModalOpen(false)}><X size={24} className="text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Coupon Code</label>
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black uppercase tracking-widest text-lg" value={editingCoupon.code} onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER50" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Discount Value</label>
                      <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={editingCoupon.discountValue} onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={editingCoupon.discountType} onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })}>
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed (₹)</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div><p className="font-black text-slate-800 text-xs uppercase tracking-widest">Recurring</p><p className="text-[10px] text-slate-400 font-bold">Apply every month?</p></div>
                    <button onClick={() => setEditingCoupon({ ...editingCoupon, isRecurring: !editingCoupon.isRecurring })} className={`w-12 h-6 rounded-full p-1 transition-colors ${editingCoupon.isRecurring ? 'bg-indigo-600' : 'bg-slate-300'}`}><div className={`bg-white w-4 h-4 rounded-full transition-transform ${editingCoupon.isRecurring ? 'translate-x-6' : 'translate-x-0'}`} /></button>
                  </div>
                </div>
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex space-x-4">
                  <button onClick={() => setIsCouponModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                  <button onClick={saveCoupon} className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs">Save Coupon</button>
                </div>
              </div>
            </div>
          )}

          {/* Directory/Clients Tab */}
          {activeTab === 'clients' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Business Directory</h2>
                  <p className="text-slate-500">Manage all businesses on the platform.</p>
                </div>
                <button onClick={() => handleOpenBizModal()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2"><Plus size={20} /><span>Manual Entry</span></button>
              </div>
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Business</th>
                        <th className="px-6 py-4">Owner Contact</th>
                        <th className="px-6 py-4 hidden md:table-cell">Plan</th>
                        <th className="px-6 py-4 hidden sm:table-cell">Expiry</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {businesses.map(biz => {
                        const owner = users.find(u => u.businessId === biz.id);
                        return (
                          <tr key={biz.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <div className="font-bold text-slate-800">{biz.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{biz.id}</div>
                                </div>
                                {biz.googleMapsUrl && (
                                  <a href={biz.googleMapsUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-600 transition-colors">
                                    <MapPin size={14} />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              {owner ? (
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-slate-700">{owner.name}</div>
                                  <div className="flex items-center space-x-1.5 text-indigo-600 font-medium text-[11px]">
                                    <Phone size={10} />
                                    <span>{owner.mobile || 'No Mobile'}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-300 text-[10px] italic">No Owner Linked</span>
                              )}
                            </td>
                            <td className="px-6 py-5 hidden md:table-cell"><span className="text-[10px] font-black px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">{biz.plan}</span></td>
                            <td className="px-6 py-5 text-xs font-bold hidden sm:table-cell">{new Date(biz.expiryDate).toLocaleDateString()}</td>
                            <td className="px-6 py-5">
                              <button
                                onClick={() => toggleStatus(biz.id, biz.status)}
                                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${biz.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' :
                                  biz.status === 'INACTIVE' ? 'bg-amber-50 text-amber-600' :
                                    'bg-rose-50 text-rose-600'
                                  }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${biz.status === 'ACTIVE' ? 'bg-emerald-500' :
                                  biz.status === 'INACTIVE' ? 'bg-amber-500' :
                                    'bg-rose-500'
                                  }`} />
                                <span>{biz.status}</span>
                              </button>
                            </td>
                            <td className="px-6 py-5 text-right"><div className="flex justify-end space-x-2"><button onClick={() => handleImpersonate(biz.id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl"><Eye size={18} /></button><button onClick={() => handleOpenBizModal(biz)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl"><Edit2 size={18} /></button></div></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Business Edit Modal */}
          {isBizModalOpen && editingBiz && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-2xl font-black text-slate-900">{editingBiz.id ? 'Edit Client' : 'Add New Client'}</h3>
                  <button onClick={() => setIsBizModalOpen(false)}><X size={24} className="text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Business Name</label>
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={editingBiz.name} onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })} />
                  </div>

                  <div className="space-y-4 p-5 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
                    <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                      <Map size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Maps Integration</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Google Maps URL</label>
                      <div className="flex space-x-2">
                        <input
                          className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium"
                          value={editingBiz.googleMapsUrl}
                          onChange={(e) => setEditingBiz({ ...editingBiz, googleMapsUrl: e.target.value })}
                          placeholder="https://maps.google.com/..."
                        />
                        {editingBiz.googleMapsUrl && (
                          <a href={editingBiz.googleMapsUrl} target="_blank" rel="noreferrer" className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Google Place ID (Optional)</label>
                      <input
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                        value={editingBiz.googlePlaceId}
                        onChange={(e) => setEditingBiz({ ...editingBiz, googlePlaceId: e.target.value })}
                        placeholder="ChIJ..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plan</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={editingBiz.plan} onChange={(e) => setEditingBiz({ ...editingBiz, plan: e.target.value as any })}>
                        {Object.values(SubscriptionPlan).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiry</label>
                      <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={new Date(editingBiz.expiryDate || 0).toISOString().split('T')[0]} onChange={(e) => setEditingBiz({ ...editingBiz, expiryDate: new Date(e.target.value).getTime() })} />
                    </div>
                  </div>
                </div>
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex space-x-4">
                  <button onClick={() => setIsBizModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-xs">Cancel</button>
                  <button onClick={saveBusiness} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Save Profile</button>
                </div>
              </div>
            </div>
          )}

          {/* White Label Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-slate-900">System Setup</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingsBox icon={Globe} title="Brand Assets">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Brand Name</label>
                  <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={globalSettings?.brandName} onChange={(e) => api.updateGlobalSettings({ brandName: e.target.value })} />
                </SettingsBox>
                <SettingsBox icon={Key} title="API Integrations">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Google Maps API</label>
                  <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </SettingsBox>
              </div>
            </div>
          )}

          {/* Payment Verification Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Payment Verification</h2>
                  <p className="text-sm md:text-base text-slate-500">Verify and approve manual UPI transaction requests.</p>
                </div>
                <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3 w-fit">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock size={16} /></div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">{transactions.filter(t => t.status === 'PENDING').length} Pending Requests</span>
                </div>
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                    <tr>
                      <th className="px-8 py-5">Client / Business</th>
                      <th className="px-8 py-5">Plan & Amount</th>
                      <th className="px-8 py-5">UTR / Txn ID</th>
                      <th className="px-8 py-5">Proof</th>
                      <th className="px-8 py-5 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.sort((a, b) => b.date - a.date).map(trx => (
                      <tr key={trx.id} className={`hover:bg-slate-50 transition-colors ${trx.status === 'PENDING' ? 'bg-amber-50/20' : ''}`}>
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{trx.businessName}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">ID: {trx.businessId}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-black text-slate-900">₹{trx.amount}</div>
                          <div className="text-[10px] font-black text-indigo-600 uppercase">{trx.planId} Plan</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-mono text-xs font-bold text-slate-600 tracking-wider bg-slate-100 px-3 py-1 rounded-lg w-fit">
                            {trx.utr}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(trx.date).toLocaleString()}</div>
                        </td>
                        <td className="px-8 py-6">
                          {trx.screenshot ? (
                            <button onClick={() => window.open(trx.screenshot, '_blank')} className="group relative">
                              <img src={trx.screenshot} className="w-12 h-12 object-cover rounded-xl border border-slate-200" alt="Proof" />
                              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye size={16} className="text-white" />
                              </div>
                            </button>
                          ) : (
                            <span className="text-slate-300 italic text-xs">No Proof</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          {trx.status === 'PENDING' ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleVerifyPayment(trx.id, 'FAILED')}
                                className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase hover:bg-rose-50 transition-all"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleVerifyPayment(trx.id, 'SUCCESS')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                              >
                                Verify & Activate
                              </button>
                            </div>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${trx.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {trx.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-20 text-center opacity-30">
                          <CreditCard size={64} className="mx-auto mb-4" />
                          <p className="font-black text-xl">No Transaction Requests Yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4">
                {transactions.sort((a, b) => b.date - a.date).map(trx => (
                  <div key={trx.id} className={`bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 ${trx.status === 'PENDING' ? 'ring-2 ring-amber-500/20' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-black text-slate-900 text-lg leading-tight">{trx.businessName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">ID: {trx.businessId}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${trx.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : trx.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                        {trx.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan & Amount</div>
                        <div className="text-base font-black text-slate-900">₹{trx.amount}</div>
                        <div className="text-[10px] font-black text-indigo-600 uppercase">{trx.planId}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">UTR / Date</div>
                        <div className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded w-fit mb-1">{trx.utr}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{new Date(trx.date).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proof:</div>
                        {trx.screenshot ? (
                          <button onClick={() => window.open(trx.screenshot, '_blank')} className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
                            <img src={trx.screenshot} className="w-8 h-8 object-cover rounded-lg border border-slate-200" alt="Proof" />
                            <span>View Image</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 italic text-[10px]">No Proof</span>
                        )}
                      </div>
                    </div>

                    {trx.status === 'PENDING' && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => handleVerifyPayment(trx.id, 'FAILED')}
                          className="py-3.5 border border-rose-200 text-rose-600 rounded-2xl text-xs font-black uppercase active:scale-95 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(trx.id, 'SUCCESS')}
                          className="py-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                        >
                          Verify & Activate
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="bg-white p-12 rounded-[32px] border border-slate-100 text-center opacity-30">
                    <CreditCard size={48} className="mx-auto mb-4" />
                    <p className="font-black text-lg">No Transaction Requests</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Live Chat Tab */}
          {activeTab === 'livechat' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Live Chat</h2>
                  <p className="text-slate-500">Real-time client communication.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Active Conversations</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                    {getChatUsers().length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase">No active chats</div>
                    ) : (
                      getChatUsers().map(u => (
                        <button key={u.id} onClick={() => setSelectedChatUser(u.id)} className={`w-full p-6 text-left hover:bg-slate-50 transition-colors flex items-center space-x-4 ${selectedChatUser === u.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''}`}>
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">{u.name.charAt(0)}</div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-black text-slate-800 truncate">{u.name}</h4>
                              <span className="text-[10px] font-bold text-slate-400">{new Date(u.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{u.lastMessage}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-xl flex flex-col overflow-hidden">
                  {selectedChatUser ? (
                    <>
                      <div className="p-6 border-b border-slate-100 flex items-center space-x-4 bg-slate-50/50">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black">{businesses.find(b => b.id === selectedChatUser)?.name.charAt(0)}</div>
                        <div>
                          <h3 className="font-black text-slate-900">{businesses.find(b => b.id === selectedChatUser)?.name}</h3>
                          <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span className="text-xs font-bold text-emerald-600 uppercase">Live</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                        {selectedChatMessages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.senderId === 'ADMIN' ? 'justify-end' : 'justify-start'} group`}>
                            <div className={`max-w-[70%] ${msg.senderId === 'ADMIN' ? 'order-1' : 'order-2'}`}>
                              <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm relative group-hover:shadow-md transition-all ${msg.senderId === 'ADMIN' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                                {msg.text}
                              </div>
                              <div className={`mt-1 text-[10px] font-bold text-slate-400 flex items-center space-x-2 ${msg.senderId === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {msg.senderId === 'ADMIN' && (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <button onClick={() => startEditMessage(msg)} className="text-indigo-600 hover:underline">Edit</button>
                                    <button onClick={() => deleteChatMessage(msg.id)} className="text-rose-600 hover:underline">Delete</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="p-6 border-t border-slate-100">
                        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-3xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            placeholder={editingMessage ? "Edit message..." : "Type a message..."}
                            className="flex-1 bg-transparent p-3 outline-none font-medium text-slate-700 placeholder:text-slate-400"
                          />
                          {editingMessage && <button onClick={() => { setEditingMessage(null); setChatInput(''); }} className="p-2 text-xs font-bold text-slate-400 uppercase hover:text-slate-600">Cancel</button>}
                          <button onClick={handleSendChat} className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-16 text-center opacity-40">
                      <MessageCircle size={80} className="mb-6 text-slate-300" />
                      <h3 className="text-2xl font-black text-slate-900">Select a Conversation</h3>
                      <p className="max-w-xs mx-auto font-medium text-slate-500 mt-2">Choose a client from the list to start chatting.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Admin Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl pt-8 space-y-8 animate-in fade-in duration-500 pb-20">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Admin Profile</h2>
                <p className="text-slate-500 font-medium">Manage your administrative credentials and platform identity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-5xl font-black mb-6 shadow-xl shadow-slate-200">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <h3 className="text-xl font-black text-slate-900">{currentUser.name || 'Super Admin'}</h3>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Platform Root</p>

                    <div className="w-full mt-8 pt-8 border-t border-slate-50 space-y-4">
                      <div className="flex items-center justify-between text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Role</span>
                        <span className="text-xs font-bold px-2 py-1 bg-red-50 text-red-600 rounded-lg">SUPER_ADMIN</span>
                      </div>
                      <div className="flex items-center justify-between text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                        <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">ACTIVE</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32" />
                    <h4 className="font-black text-lg mb-2 relative z-10">Security Tip</h4>
                    <p className="text-indigo-100 text-xs leading-relaxed relative z-10 font-medium">
                      Always use a strong password and logout when accessing from public networks to maintain platform integrity.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center space-x-3 text-slate-900 mb-2">
                      <UserCircle size={20} className="text-indigo-600" />
                      <h4 className="font-black text-sm uppercase tracking-widest">Personal Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Full Name</label>
                        <input
                          type="text"
                          readOnly
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900"
                          value={currentUser.name || 'Not Set'}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email Address</label>
                        <input
                          type="email"
                          readOnly
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900"
                          value={currentUser.email || 'admin@smartreview.com'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        readOnly
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900"
                        value={currentUser.mobile || '+91 75328 78132'}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center space-x-3 text-slate-900 mb-2">
                      <Key size={20} className="text-indigo-600" />
                      <h4 className="font-black text-sm uppercase tracking-widest">Auth Credentials</h4>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                      <AlertCircle className="text-amber-600 mt-0.5" size={18} />
                      <p className="text-xs text-amber-800 font-medium">
                        Password updates require re-authentication. Please contact root database administrator if you have lost access.
                      </p>
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                      Update Password Policy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ active, onClick, icon: Icon, label, alertCount }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all relative ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <Icon size={18} />
    <span className="font-bold text-sm">{label}</span>
    {alertCount > 0 && <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{alertCount}</span>}
    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

const StatCard = ({ label, value, sub, color }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-3 text-${color}-600 opacity-10`}><BarChart4 size={64} /></div>
    <div className="text-[10px] text-slate-400 font-black uppercase mb-1">{label}</div>
    <div className="text-3xl font-black text-slate-900">{value}</div>
    <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1"><ArrowUpRight size={14} className="text-emerald-500" /><span>{sub}</span></div>
  </div>
);

const SettingsBox = ({ icon: Icon, title, children }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
    <div className="flex items-center space-x-3 text-indigo-600"><Icon size={20} /><h3 className="font-black text-slate-800 uppercase text-xs">{title}</h3></div>
    {children}
  </div>
);

const revenueData = [{ name: 'Jan', rev: 45000 }, { name: 'Feb', rev: 52000 }, { name: 'Mar', rev: 48000 }, { name: 'Apr', rev: 61000 }, { name: 'May', rev: 75000 }, { name: 'Jun', rev: 92000 }];

export default AdminPanel;
