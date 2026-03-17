
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionPlan {
  NONE = 'NONE',
  BASIC = 'BASIC',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM'
}

export type FeatureType = 'CHECKBOX' | 'NUMBER' | 'TEXT';

export interface PlanFeature {
  id: string;
  name: string;
  type: FeatureType;
  value: any; // boolean for checkbox, number/string for others
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: PlanFeature[];
}

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: number;
  endDate: number;
  applicablePlans: string[]; // List of plan IDs
  isRecurring: boolean; // Discount every month vs first month
  status: 'ACTIVE' | 'DISABLED';
  usageCount: number;
  revenueGenerated: number;
  maxUsagePerUser: number;
}

export interface Transaction {
  id?: string;
  businessId: string;
  businessName: string;
  amount: number;
  date: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  couponUsed?: string;
  planId: string;
  utr: string;
  screenshot?: string; // base64 string
}

export interface Message {
  id: string;
  ticketId?: string; // Optional, if linked to a ticket
  senderId: string;
  receiverId?: string; // Optional for broadcast or specific checks
  senderName: string;
  text: string;
  timestamp: number;
  isRead?: boolean;
  role: UserRole;
  attachment?: string;
}

export type TicketMessage = Message;

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketCategory = 'BILLING' | 'TECHNICAL' | 'FEATURE' | 'OTHER';

export interface Ticket {
  id: string;
  clientId: string; // Changed from businessId to Generic client_id idea
  clientName: string; // Changed from businessName
  subject: string;
  description: string; // Added description
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: number;
  lastUpdated: number;
  messages: Message[];
}

export interface Business {
  id: string;
  name: string;
  googlePlaceId: string;
  googleMapsUrl: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'DISABLED' | 'INACTIVE';
  expiryDate: number; // Timestamp
  totalScans: number;
  totalReviews: number;
  settings: {
    enabled: boolean;
    rewardType: 'THANK_YOU' | 'COUPON';
    customMessage: string;
    couponCode: string;
  };
  fullAddress?: string;
  businessImage?: string; // base64
}

export interface GlobalSettings {
  brandName: string;
  supportEmail: string;
  paymentQrCode?: string; // base64 string
  upiLink: string;
  googleApiKey: string;
  whatsappApiKey: string;
}

export interface Feedback {
  id: string;
  businessId: string;
  rating: number;
  comment: string;
  customerName: string;
  customerMobile?: string;
  timestamp: number;
  resolved: boolean;
}
