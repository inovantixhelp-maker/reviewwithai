import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, MessageCircle, X, Paperclip, Clock, CheckCircle } from 'lucide-react';
import { Ticket, TicketPriority, Message, UserRole } from '../../types';
import { api } from '../../services/api';

const SOCKET_URL = 'http://localhost:3000'; // Assume backend runs here

const SupportSection: React.FC<{ user: any }> = ({ user }) => {
    const [activeView, setActiveView] = useState<'tickets' | 'chat'>('tickets');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', priority: 'LOW' as TicketPriority, description: '' });
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [isConnected, setIsConnected] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const refreshData = async () => {
        if (user?.businessId) {
            const localTickets = await api.getTickets(user.businessId);
            setTickets(localTickets.sort((a, b) => b.lastUpdated - a.lastUpdated));

            const msgs = await api.getLiveChatMessages(user.businessId);
            setChatMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
        }
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 3000);
        return () => clearInterval(interval);
    }, [user, activeView]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, activeView]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCreateTicket = async () => {
        if (!newTicket.subject.trim() || !newTicket.description.trim()) {
            alert('Please fill in both subject and description.');
            return;
        }

        setIsSending(true);
        try {
            const ticket: Ticket = {
                id: crypto.randomUUID(),
                clientId: user.businessId,
                clientName: user.name,
                subject: newTicket.subject,
                description: newTicket.description,
                priority: newTicket.priority,
                category: 'OTHER',
                status: 'OPEN',
                createdAt: Date.now(),
                lastUpdated: Date.now(),
                messages: []
            };

            await api.saveTicket(ticket);
            await refreshData();
            setIsNewTicketOpen(false);
            setNewTicket({ subject: '', priority: 'LOW', description: '' });
            alert('Ticket created successfully!');
        } catch (err: any) {
            console.error(err);
            alert('Failed to create ticket: ' + (err.message || 'Unknown error'));
        } finally {
            setIsSending(false);
        }
    };

    const sendMessage = async () => {
        if (!messageInput.trim()) return;

        setIsSending(true);
        try {
            const msg: Message = {
                id: crypto.randomUUID(),
                senderId: user.businessId,
                senderName: user.name,
                receiverId: 'ADMIN',
                text: messageInput,
                timestamp: Date.now(),
                isRead: false,
                role: UserRole.CUSTOMER
            };

            await api.addLiveChatMessage(msg);
            await refreshData();
            setMessageInput('');
            scrollToBottom();
        } catch (err: any) {
            console.error(err);
            alert('Failed to send message: ' + (err.message || 'Unknown error'));
        } finally {
            setIsSending(false);
        }
    };

    const handleSelectTicket = async (ticket: Ticket) => {
        try {
            const details = await api.getTicketDetails(ticket.id);
            if (details) setSelectedTicket(details);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendTicketReply = async () => {
        if (!replyText.trim() || !selectedTicket) return;

        setIsSending(true);
        try {
            const msg: Message = {
                id: crypto.randomUUID(),
                senderId: user.businessId,
                senderName: user.name,
                receiverId: 'ADMIN',
                text: replyText,
                timestamp: Date.now(),
                isRead: false,
                role: UserRole.CUSTOMER,
                ticketId: selectedTicket.id
            };

            await api.addTicketMessage(selectedTicket.id, msg);
            const updated = await api.getTicketDetails(selectedTicket.id);
            if (updated) setSelectedTicket(updated);
            setReplyText('');
            await refreshData();
        } catch (err: any) {
            console.error(err);
            alert('Failed to send reply: ' + (err.message || 'Unknown error'));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto h-[700px] md:h-[600px] flex flex-col md:flex-row gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Sidebar / Mode Switcher */}
            <div className="w-full md:w-1/4 glass-card p-2 md:p-6 flex flex-row md:flex-col gap-2 rounded-2xl md:rounded-[32px] shrink-0">
                <button
                    onClick={() => { setActiveView('tickets'); setSelectedTicket(null); }}
                    className={`flex-1 md:flex-none p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-center md:justify-start md:space-x-3 transition-all font-bold ${activeView === 'tickets' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-500'}`}
                >
                    <Paperclip size={20} />
                    <span className="hidden sm:inline">My Tickets</span>
                </button>
                <button
                    onClick={() => setActiveView('chat')}
                    className={`flex-1 md:flex-none p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-center md:justify-start md:space-x-3 transition-all font-bold relative ${activeView === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-500'}`}
                >
                    <MessageCircle size={20} />
                    <span className="hidden sm:inline">Live Chat</span>
                    {isConnected && <span className="w-2 h-2 rounded-full bg-emerald-400 absolute right-2 md:right-8 top-1/2 -translate-y-1/2"></span>}
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 glass-card relative overflow-hidden rounded-2xl md:rounded-[32px] min-h-0">

                {/* TICKETS VIEW */}
                {activeView === 'tickets' && !selectedTicket && (
                    <div className="h-full flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Support <span className="text-gradient">Tickets</span></h3>
                                <p className="text-slate-500 font-medium">Track your issues and requests.</p>
                            </div>
                            <button onClick={() => setIsNewTicketOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-800 transition-colors">
                                <Plus size={18} />
                                <span>New Ticket</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-4">
                            {tickets.length === 0 ? (
                                <div className="text-center py-20 text-slate-400">
                                    <Paperclip size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="font-bold">No tickets yet.</p>
                                </div>
                            ) : (
                                tickets.map(ticket => (
                                    <div key={ticket.id} onClick={() => handleSelectTicket(ticket)} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{ticket.subject}</h4>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ticket.status === 'OPEN' ? 'bg-emerald-100 text-emerald-600' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>{ticket.status}</span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                                        <div className="flex items-center space-x-4 text-xs font-bold text-slate-400">
                                            <span className="flex items-center"><Clock size={12} className="mr-1" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            <span className={`flex items-center ${ticket.priority === 'HIGH' ? 'text-rose-500' : ticket.priority === 'MEDIUM' ? 'text-amber-500' : 'text-slate-400'
                                                }`}>Priority: {ticket.priority}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TICKET DETAIL VIEW */}
                {activeView === 'tickets' && selectedTicket && (
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 p-2"><Plus size={24} className="rotate-45" /></button>
                            <div className="flex-1 px-4">
                                <h3 className="font-black text-slate-900 truncate">{selectedTicket.subject}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedTicket.id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedTicket.status === 'OPEN' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{selectedTicket.status}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Issue Description</p>
                                <p className="text-sm font-medium text-indigo-900 leading-relaxed">{selectedTicket.description}</p>
                            </div>

                            <div className="space-y-4">
                                {selectedTicket.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === UserRole.CUSTOMER ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${msg.role === UserRole.CUSTOMER ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                                            {msg.text}
                                            <div className={`text-[10px] font-bold mt-1 ${msg.role === UserRole.CUSTOMER ? 'text-indigo-200' : 'text-slate-400'}`}>{new Date(msg.timestamp).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100">
                            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-transparent p-2 outline-none text-slate-700 font-medium placeholder:text-slate-400 resize-none h-12"
                                />
                                <button
                                    onClick={handleSendTicketReply}
                                    disabled={isSending || !replyText.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CHAT VIEW */}
                {activeView === 'chat' && (
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">Success Support</h4>
                                    <p className="text-xs font-bold text-emerald-500 flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === UserRole.CUSTOMER ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] space-y-2 ${msg.role === UserRole.CUSTOMER ? 'order-1' : 'order-2'}`}>
                                        <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm relative ${msg.role === UserRole.CUSTOMER
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                            }`}>
                                            {msg.text}
                                            {msg.attachment && (
                                                <img src={msg.attachment} alt="Attachment" className="mt-2 rounded-lg max-h-48 object-contain" />
                                            )}
                                        </div>
                                        <div className={`text-[10px] font-bold text-slate-400 ${msg.role === UserRole.CUSTOMER ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent p-2 outline-none text-slate-700 font-medium placeholder:text-slate-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* New Ticket Modal Overlay */}
                {isNewTicketOpen && (
                    <div className="absolute inset-0 z-50 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center p-8">
                        <div className="bg-white w-full max-w-md p-8 rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-900">New Support Ticket</h3>
                                <button onClick={() => setIsNewTicketOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none font-bold"
                                        placeholder="Brief summary of issue"
                                        value={newTicket.subject}
                                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                                    <div className="flex gap-2">
                                        {(['LOW', 'MEDIUM', 'HIGH'] as TicketPriority[]).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setNewTicket({ ...newTicket, priority: p })}
                                                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors ${newTicket.priority === p ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none font-medium h-32 resize-none"
                                        placeholder="Describe your issue in detail..."
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleCreateTicket} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700">Submit Ticket</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SupportSection;
