
import { SubscriptionPlan } from './types';

export const PLANS = [
  {
    id: SubscriptionPlan.BASIC,
    name: 'Starter',
    price: '₹999/mo',
    features: ['1 QR Code', 'Smart Filtering', 'Basic Analytics'],
    restrictions: ['No Coupons', 'No AI'],
    color: 'indigo'
  },
  {
    id: SubscriptionPlan.GROWTH,
    name: 'Growth',
    price: '₹2,499/mo',
    features: ['Everything in Basic', 'Coupon/Reward System', 'Detailed Analytics', 'Email Alerts'],
    color: 'violet'
  },
  {
    id: SubscriptionPlan.ENTERPRISE,
    name: 'Enterprise',
    price: '₹4,999/mo',
    features: ['Manage 5 Locations', 'AI Review Reply', 'White-label Support', 'Priority Support'],
    color: 'fuchsia'
  }
];

export const MOCK_BUSINESS: any = {
  id: 'biz-123',
  name: 'Burger Palace',
  googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  googleMapsUrl: 'https://maps.google.com/?cid=12345',
  plan: SubscriptionPlan.GROWTH,
  status: 'ACTIVE',
  settings: {
    rewardType: 'COUPON',
    couponText: 'Show this code at counter for 15% OFF: BURGER15'
  }
};

export const MOCK_FEEDBACKS: any[] = [
  { id: 'f1', rating: 2, comment: 'Cold food served.', customerName: 'John Doe', timestamp: Date.now() - 86400000, resolved: false },
  { id: 'f2', rating: 1, comment: 'Staff was very rude.', customerName: 'Alice Smith', timestamp: Date.now() - 172800000, resolved: true },
  { id: 'f3', rating: 3, comment: 'Average taste, expected more.', customerName: 'Bob Brown', timestamp: Date.now() - 43200000, resolved: false },
];
