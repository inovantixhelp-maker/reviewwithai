
import { supabase } from './supabase';
import {
    SubscriptionPlan,
    UserRole,
    GlobalSettings,
    Business,
    Plan,
    Coupon,
    Transaction,
    Ticket,
    Feedback,
    TicketMessage,
    Message
} from '../types';

// Helper to handle Supabase responses
const handleResponse = async <T>(promise: Promise<any>): Promise<T | null> => {
    const { data, error } = await promise;
    if (error) {
        console.error('Supabase Error:', error.message);
        throw error;
    }
    return data as T;
};

export const api = {
    // --- AUTH ---
    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        // Fetch profile
        if (data.user) {
            const profile = await api.getUserProfile(data.user.id);
            return { ...data.user, ...profile };
        }
        return data.user;
    },

    register: async (email: string, password: string, metadata: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: metadata.name,
                    role: metadata.role,
                } // Supabase stores this in raw_user_meta_data
            }
        });

        if (error) throw error;

        // We also create a profile in 'profiles' table if we have one
        if (data.user) {
            const profileData = {
                id: data.user.id,
                email: email,
                name: metadata.name,
                mobile: metadata.mobile,
                role: metadata.role,
                business_id: metadata.businessId
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .insert(profileData);

            if (profileError) {
                console.error('Error creating profile:', profileError);
                // Don't throw here strictly if auth succeeded, but it's bad state
            }
        }

        return data.user;
    },

    logout: async () => {
        await supabase.auth.signOut();
        sessionStorage.removeItem('current_user');
    },

    forgotPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/reset-password`,
        });
        if (error) throw error;
    },

    updatePassword: async (password: string) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
    },

    getUserProfile: async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (!data) return null;
        return {
            ...data,
            businessId: data.business_id // Map snake_case to CamelCase for app compatibility
        };
    },

    // --- USERS ---
    // Replaces storage.getUser(email) which was used for finding user by email
    // In Supabase, we can't search users strictly by email easily without Admin API.
    // But for the purpose of the app, we likely rely on "login".
    // Note: Old usage was storage.getUser(email) -> local check.
    // We should replace calls to getUser with auth state checks.

    updateUser: async (id: string, updates: any) => {
        // updates should be safe columns
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    getAllUsers: async () => {
        const { data } = await supabase.from('profiles').select('*');
        return (data || []).map(u => ({
            ...u,
            businessId: u.business_id
        }));
    },

    getUserByBusinessId: async (businessId: string) => {
        const { data } = await supabase.from('profiles').select('*').eq('business_id', businessId).single();
        if (!data) return null;
        return {
            ...data,
            businessId: data.business_id
        };
    },


    // --- BUSINESSES ---
    // storage.getBusiness(id)
    getBusiness: async (id: string): Promise<Business | null> => {
        if (!id) return null;
        const { data, error } = await supabase
            .from('businesses')
            .select(`
        *,
        plan_id,
        plans ( * )
       `) // Join usually requires relation, but plan_id is text foreign key
            .eq('id', id)
            .single();

        if (error) return null;

        // Transform DB snake_case to CamelCase if needed or just cast
        // The types in `types.ts` are CamelCase. Supabase returns snake_case usually unless we quote.
        // I defined schema with snake_case: `google_place_id`, `expiry_date`.
        // I need to map it.

        return mapBusinessFromDB(data);
    },

    addBusiness: async (business: Business) => {
        const dbBiz = mapBusinessToDB(business);
        const { error } = await supabase.from('businesses').insert(dbBiz);
        if (error) throw error;
    },

    updateBusiness: async (id: string, updates: Partial<Business>) => {
        const dbUpdates = mapBusinessToDB(updates as Business); // Partial mapping
        // Remove undefined
        Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

        const { error } = await supabase.from('businesses').update(dbUpdates).eq('id', id);
        if (error) throw error;
    },

    getAllBusinesses: async (): Promise<Business[]> => {
        const { data } = await supabase.from('businesses').select('*');
        return (data || []).map(mapBusinessFromDB);
    },

    deleteBusiness: async (id: string) => {
        // Clean up all associated data manually as some tables don't have cascade delete
        await supabase.from('tickets').delete().eq('client_id', id);
        await supabase.from('transactions').delete().eq('business_id', id);
        await supabase.from('profiles').delete().eq('business_id', id);
        // Feedbacks will be deleted automatically due to 'on delete cascade' in schema
        
        const { error } = await supabase.from('businesses').delete().eq('id', id);
        if (error) throw error;
    },

    incrementScanCount: async (businessId: string) => {
        // RPC is better, but read-update-write for MVP
        const { data } = await supabase.rpc('increment_scan_count', { row_id: businessId });
        // If RPC doesn't exist, we fallback to fetch-update
        if (!data) {
            // Fallback
            const biz = await api.getBusiness(businessId);
            if (biz) {
                await supabase.from('businesses').update({ total_scans: (biz.totalScans || 0) + 1 }).eq('id', businessId);
            }
        }
    },

    // --- FEEDBACKS ---
    getFeedbacks: async (businessId: string): Promise<Feedback[]> => {
        const { data } = await supabase
            .from('feedbacks')
            .select('*')
            .eq('business_id', businessId)
            .order('timestamp', { ascending: false });
        return (data || []).map(mapFeedbackFromDB);
    },

    addFeedback: async (feedback: Feedback) => {
        const dbFb = mapFeedbackToDB(feedback);
        // remove id if it is generated by DB? keeping it is fine if UUID
        const { error } = await supabase.from('feedbacks').insert(dbFb);
        if (error) throw error;
    },

    resolveFeedback: async (feedbackId: string, currentStatus: boolean) => {
        await supabase.from('feedbacks').update({ resolved: !currentStatus }).eq('id', feedbackId);
    },

    getAllFeedbacks: async () => {
        const { data } = await supabase.from('feedbacks').select('*');
        return (data || []).map(mapFeedbackFromDB);
    },

    // --- PLANS ---
    getPlans: async (): Promise<Plan[]> => {
        const { data } = await supabase.from('plans').select('*');
        // features is jsonb, auto-parsed.
        return (data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            features: p.features
        }));
    },

    savePlan: async (plan: Plan) => {
        const { error } = await supabase.from('plans').upsert({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            features: plan.features as any // jsonb
        });
        if (error) throw error;
    },

    deletePlan: async (id: string) => {
        await supabase.from('plans').delete().eq('id', id);
    },

    // --- COUPONS ---
    getCoupons: async (): Promise<Coupon[]> => {
        const { data } = await supabase.from('coupons').select('*');
        return (data || []).map(mapCouponFromDB);
    },

    saveCoupon: async (coupon: Coupon) => {
        const dbCoupon = mapCouponToDB(coupon);
        await supabase.from('coupons').upsert(dbCoupon);
    },

    deleteCoupon: async (id: string) => {
        await supabase.from('coupons').delete().eq('id', id);
    },

    // --- TICKETS ---
    getTickets: async (clientId?: string): Promise<Ticket[]> => {
        let query = supabase.from('tickets').select('*');
        if (clientId) {
            query = query.eq('client_id', clientId);
        }
        const { data } = await query;
        const tickets = (data || []).map(mapTicketFromDB);

        // Fetch messages for each ticket? 
        // Or fetch when viewing a ticket.
        // storage.ts getTickets included messages.
        // We'll fetch messages separately or join.
        // For now, let's just return tickets with empty messages array and fetch specifically if needed, 
        // BUT the types say messages: Message[].

        // We can join ticket_messages.
        // But doing N+1 queries is bad.
        // Let's trying joining.
        /*
        const { data } = await supabase.from('tickets').select('*, ticket_messages(*)');
        */

        // For simplicity, let's load tickets essentially. To match storage.ts behavior we might need messages.
        // I'll leave messages empty [] for list view optimization and assume detail view fetches messages.
        return tickets.map(t => ({ ...t, messages: [] }));
    },

    getTicketDetails: async (ticketId: string): Promise<Ticket | null> => {
        const { data } = await supabase.from('tickets').select('*').eq('id', ticketId).single();
        if (!data) return null;
        const ticket = mapTicketFromDB(data);

        const { data: msgs } = await supabase.from('ticket_messages').select('*').eq('ticket_id', ticketId).order('timestamp');
        ticket.messages = (msgs || []).map(mapMessageFromDB);
        return ticket;
    },

    saveTicket: async (ticket: Ticket) => {
        const dbTicket = mapTicketToDB(ticket);
        const { error } = await supabase.from('tickets').upsert(dbTicket);
        if (error) throw error;
    },

    addTicketMessage: async (ticketId: string, message: TicketMessage) => {
        const dbMsg = mapMessageToDB(message);
        dbMsg.ticket_id = ticketId;
        const { error: msgErr } = await supabase.from('ticket_messages').insert(dbMsg);
        if (msgErr) throw msgErr;
        // update ticket lastUpdated
        const { error: ticketErr } = await supabase.from('tickets').update({ last_updated: message.timestamp }).eq('id', ticketId);
        if (ticketErr) throw ticketErr;
    },

    updateTicketStatus: async (ticketId: string, status: string) => {
        await supabase.from('tickets').update({ status }).eq('id', ticketId);
    },

    // --- TRANSACTIONS ---
    getTransactions: async (businessId?: string): Promise<Transaction[]> => {
        let query = supabase.from('transactions').select('*');
        if (businessId) query = query.eq('business_id', businessId);
        const { data } = await query;
        return (data || []).map(mapTransactionFromDB);
    },

    addTransaction: async (transaction: Transaction) => {
        const dbTx = mapTransactionToDB(transaction);
        const { error } = await supabase.from('transactions').insert(dbTx);
        if (error) throw error;
    },

    updateTransactionStatus: async (transactionId: string, status: 'SUCCESS' | 'FAILED' | 'PENDING') => {
        const { error } = await supabase.from('transactions').update({ status }).eq('id', transactionId);
        if (error) throw error;
    },

    // --- GLOBAL SETTINGS ---
    getGlobalSettings: async (): Promise<GlobalSettings> => {
        const { data } = await supabase.from('global_settings').select('*').single();
        if (!data) return {
            brandName: 'Review With AI',
            supportEmail: 'support@reviewwithai.com',
            upiLink: '',
            googleApiKey: '',
            whatsappApiKey: '',
            serpapiToken: '',
            paymentQrCode: undefined
        }; // Defaults
        return mapGlobalSettingsFromDB(data);
    },

    updateGlobalSettings: async (settings: Partial<GlobalSettings>) => {
        const dbSettings = mapGlobalSettingsToDB(settings as GlobalSettings);
        await supabase.from('global_settings').update(dbSettings).eq('id', 1);
    },

    // --- LIVE CHAT ---
    getLiveChatMessages: async (businessId?: string): Promise<Message[]> => {
        let query = supabase.from('live_messages').select('*').order('timestamp', { ascending: true });

        // This logic is tricky. If businessId is provided, we want messages where they are sender OR receiver.
        // Supabase .or() syntax: .or(`sender_id.eq.${businessId},receiver_id.eq.${businessId}`)

        if (businessId) {
            query = query.or(`sender_id.eq.${businessId},receiver_id.eq.${businessId}`);
        }

        const { data } = await query;
        return (data || []).map(mapLiveMessageFromDB);
    },

    addLiveChatMessage: async (message: Message) => {
        const dbMsg = mapLiveMessageToDB(message);
        const { error } = await supabase.from('live_messages').insert(dbMsg);
        if (error) throw error;
    },

    updateLiveChatMessage: async (messageId: string, newText: string) => {
        await supabase.from('live_messages').update({ text: newText }).eq('id', messageId);
    },

    deleteLiveChatMessage: async (messageId: string) => {
        await supabase.from('live_messages').delete().eq('id', messageId);
    }
};

// --- MAPPERS ---
// Needed to convert snake_case (DB) <-> CamelCase (TS)

function mapBusinessFromDB(db: any): Business {
    return {
        id: db.id,
        name: db.name,
        googlePlaceId: db.google_place_id,
        googleMapsUrl: db.google_maps_url,
        plan: (db.plan_id || SubscriptionPlan.NONE) as SubscriptionPlan,
        status: db.status as any,
        expiryDate: db.expiry_date ? parseInt(db.expiry_date) : 0,
        totalScans: db.total_scans || 0,
        totalReviews: db.total_reviews || 0,
        settings: db.settings,
        fullAddress: db.full_address,
        businessImage: db.business_image
    };
}

function mapBusinessToDB(biz: Business): any {
    return {
        id: biz.id,
        name: biz.name,
        google_place_id: biz.googlePlaceId,
        google_maps_url: biz.googleMapsUrl,
        plan_id: biz.plan === SubscriptionPlan.NONE ? null : biz.plan,
        status: biz.status,
        expiry_date: biz.expiryDate,
        total_scans: biz.totalScans,
        total_reviews: biz.totalReviews,
        settings: biz.settings,
        full_address: biz.fullAddress,
        business_image: biz.businessImage
    };
}

function mapFeedbackFromDB(db: any): Feedback {
    return {
        id: db.id,
        businessId: db.business_id,
        rating: db.rating,
        comment: db.comment,
        customerName: db.customer_name,
        customerMobile: db.customer_mobile,
        timestamp: parseInt(db.timestamp),
        resolved: db.resolved
    };
}

function mapFeedbackToDB(fb: Feedback): any {
    return {
        id: fb.id,
        business_id: fb.businessId,
        rating: fb.rating,
        comment: fb.comment,
        customer_name: fb.customerName,
        customer_mobile: fb.customerMobile,
        timestamp: fb.timestamp,
        resolved: fb.resolved
    };
}

function mapCouponFromDB(db: any): Coupon {
    return {
        id: db.id,
        code: db.code,
        discountType: db.discount_type as any,
        discountValue: parseFloat(db.discount_value),
        startDate: parseInt(db.start_date),
        endDate: parseInt(db.end_date),
        applicablePlans: db.applicable_plans,
        isRecurring: db.is_recurring,
        status: db.status as any,
        usageCount: db.usage_count,
        revenueGenerated: parseFloat(db.revenue_generated),
        maxUsagePerUser: db.max_usage_per_user
    };
}

function mapCouponToDB(c: Coupon): any {
    return {
        id: c.id,
        code: c.code,
        discount_type: c.discountType,
        discount_value: c.discountValue,
        start_date: c.startDate,
        end_date: c.endDate,
        applicable_plans: c.applicablePlans,
        is_recurring: c.isRecurring,
        status: c.status,
        usage_count: c.usageCount,
        revenue_generated: c.revenueGenerated,
        max_usage_per_user: c.maxUsagePerUser
    };
}

function mapTicketFromDB(db: any): Ticket {
    return {
        id: db.id,
        clientId: db.client_id,
        clientName: db.client_name,
        subject: db.subject,
        description: db.description,
        category: db.category as any,
        priority: db.priority as any,
        status: db.status as any,
        createdAt: db.created_at ? parseInt(db.created_at) : Date.now(),
        lastUpdated: db.last_updated ? parseInt(db.last_updated) : Date.now(),
        messages: [] // Loaded separately
    };
}

function mapTicketToDB(t: Ticket): any {
    return {
        id: t.id,
        client_id: t.clientId,
        client_name: t.clientName,
        subject: t.subject,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
        created_at: t.createdAt,
        last_updated: t.lastUpdated
    };
}

function mapMessageFromDB(db: any): Message {
    return {
        id: db.id,
        ticketId: db.ticket_id,
        senderId: db.sender_id,
        senderName: db.sender_name,
        text: db.text,
        timestamp: parseInt(db.timestamp),
        isRead: db.is_read,
        role: db.role as UserRole,
        attachment: db.attachment
    };
}

function mapMessageToDB(m: Message & { ticket_id?: string }): any {
    return {
        id: m.id,
        ticket_id: m.ticketId,
        sender_id: m.senderId,
        sender_name: m.senderName,
        text: m.text,
        timestamp: m.timestamp,
        is_read: m.isRead,
        role: m.role,
        attachment: m.attachment
    };
}

function mapTransactionFromDB(db: any): Transaction {
    return {
        id: db.id,
        businessId: db.business_id,
        businessName: db.business_name,
        amount: parseFloat(db.amount),
        date: parseInt(db.date),
        status: db.status as any,
        couponUsed: db.coupon_used,
        planId: db.plan_id,
        utr: db.utr,
        screenshot: db.screenshot
    };
}

function mapTransactionToDB(t: Transaction): any {
    const obj: any = {
        business_id: t.businessId,
        business_name: t.businessName,
        amount: t.amount,
        date: t.date,
        status: t.status,
        coupon_used: t.couponUsed,
        plan_id: t.planId,
        utr: t.utr,
        screenshot: t.screenshot
    };
    if (t.id) {
        obj.id = t.id;
    }
    return obj;
}

function mapGlobalSettingsFromDB(db: any): GlobalSettings {
    return {
        brandName: db.brand_name,
        supportEmail: db.support_email,
        paymentQrCode: db.payment_qr_code,
        upiLink: db.upi_link,
        googleApiKey: db.google_api_key,
        whatsappApiKey: db.whatsapp_api_key,
        serpapiToken: db.apify_token
    };
}

function mapGlobalSettingsToDB(s: GlobalSettings): any {
    return {
        brand_name: s.brandName,
        support_email: s.supportEmail,
        payment_qr_code: s.paymentQrCode,
        upi_link: s.upiLink,
        google_api_key: s.googleApiKey,
        whatsapp_api_key: s.whatsappApiKey,
        apify_token: s.serpapiToken
    };
}

function mapLiveMessageFromDB(db: any): Message {
    return {
        id: db.id,
        senderId: db.sender_id,
        receiverId: db.receiver_id,
        senderName: db.sender_name,
        text: db.text,
        timestamp: db.timestamp ? parseInt(db.timestamp) : Date.now(),
        isRead: db.is_read,
        role: db.role as UserRole,
        attachment: db.attachment
    };
}

function mapLiveMessageToDB(m: Message): any {
    return {
        id: m.id,
        sender_id: m.senderId,
        receiver_id: m.receiverId,
        sender_name: m.senderName,
        text: m.text,
        timestamp: m.timestamp,
        is_read: m.isRead,
        role: m.role,
        attachment: m.attachment
    };
}
