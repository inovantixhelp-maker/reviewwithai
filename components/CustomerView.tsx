
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MessageSquare, CheckCircle2, ChevronRight, AlertTriangle, ShieldAlert, CreditCard, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';

const CustomerView: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState<'rating' | 'feedback' | 'success'>('rating');

  // Category items matching the requested style (Dynamic from DB or fallback to static)
  const items = (business?.settings?.offers && business.settings.offers.length > 0)
    ? business.settings.offers
    : [
      { name: 'Automobile', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80', color: 'bg-yellow-400', actualPrice: '₹599', offerPrice: '₹449' },
      { name: 'Hardware & Components', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80', color: 'bg-blue-900', actualPrice: '₹299', offerPrice: '₹199' },
      { name: 'Business Services', image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e787?auto=format&fit=crop&w=300&q=80', color: 'bg-orange-500', actualPrice: '₹999', offerPrice: '₹799' },
      { name: 'Chemicals', image: 'https://images.unsplash.com/photo-1532187875605-2fe358a71408?auto=format&fit=crop&w=300&q=80', color: 'bg-purple-700', actualPrice: '₹450', offerPrice: '₹349' },
      { name: 'Hardware & Software', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80', color: 'bg-rose-500', actualPrice: '₹1500', offerPrice: '₹1200' },
      { name: 'Real Estate', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80', color: 'bg-cyan-500', actualPrice: '₹2500', offerPrice: '₹2100' },
      { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=80', color: 'bg-orange-600', actualPrice: '₹799', offerPrice: '₹599' },
    ];

  useEffect(() => {
    async function loadBusiness() {
      if (businessId) {
        const biz = await api.getBusiness(businessId);
        setBusiness(biz);
        if (biz) {
          api.incrementScanCount(businessId);
        }
      }
    }
    loadBusiness();
  }, [businessId]);

  if (!business) return <div className="p-8 text-center bg-slate-50 min-h-screen flex items-center justify-center">Loading...</div>;

  // Subscription Restriction Logic
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const gracePeriod = msInDay * 3;

  const isExpired = business.expiryDate < now;
  const isHardBlocked = business.status === 'DISABLED' || (business.expiryDate < (now - gracePeriod));
  const isSoftBlocked = !isHardBlocked && isExpired;

  if (isHardBlocked) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 text-center border-t-[12px] border-rose-600 animate-in zoom-in-95 duration-500">
          <div className="bg-rose-100 p-6 rounded-full w-fit mx-auto mb-8">
            <ShieldAlert size={64} className="text-rose-600 animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Subscription Expired</h1>
          <p className="text-slate-500 font-bold leading-relaxed mb-8">
            "Kshama karein, is vyapar ka Review With AI subscription expire ho chuka hai. Feedback system temporary taur par band kar diya gaya hai."
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Information</p>
            <p className="text-sm font-bold text-slate-800 uppercase">{business.name}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSoftBlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[40px] shadow-xl p-10 text-center border-t-[12px] border-amber-500 animate-in fade-in duration-500">
          <div className="bg-amber-100 p-6 rounded-full w-fit mx-auto mb-8">
            <AlertTriangle size={64} className="text-amber-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">System Maintenance</h1>
          <p className="text-slate-500 font-bold leading-relaxed">
            "Dhanyavad humein visit karne ke liye. Yeh feedback portal abhi maintenance mein hai aur jald hi wapas aayega."
          </p>
          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-300">
            <CreditCard size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Awaiting System Sync</span>
          </div>
        </div>
      </div>
    );
  }

  const handleRatingSubmit = () => {
    if (!rating) return;

    if (rating >= 4) {
      const newFeedback: any = {
        businessId: business.id,
        rating: rating,
        comment: '',
        customerName: 'Guest',
        customerMobile: '',
        timestamp: Date.now(),
        resolved: true
      };
      api.addFeedback(newFeedback as any);
      setTimeout(() => {
        window.open(business.googleMapsUrl, '_blank');
        setStep('success');
      }, 300);
    } else {
      setStep('feedback');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          {business.businessImage ? (
            <img src={business.businessImage} alt="Logo" className="w-10 h-10 rounded-xl object-contain shadow-sm border border-slate-100" />
          ) : (
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white text-2xl font-black italic">I</span>
            </div>
          )}
          <span className="font-black text-slate-800 tracking-tight text-lg uppercase">{business.name}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-full">
          <ShoppingBag size={20} className="text-slate-400" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-4 md:p-8 space-y-10 max-w-7xl mx-auto w-full">

        {/* Review Card */}
        <div className="w-full bg-white rounded-[40px] shadow-2xl p-6 md:p-2 text-center animate-slide-up border-b-8 border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20"></div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">How was your visit?</h1>
          <p className="text-slate-400 mb-4 font-bold uppercase text-[10px] tracking-[0.2em]">{business.name}</p>

          {step === 'rating' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Emojis Above Stars */}
              <div className="flex justify-between max-w-[280px] mx-auto text-4xl mb-[-15px] px-2">
                <span className={`transition-transform duration-300 ${(hoverRating || rating) === 1 ? 'scale-125' : 'scale-100 animate-pulse'}`}>😡</span>
                <span className={`transition-transform duration-300 ${(hoverRating || rating) === 3 ? 'scale-125' : 'scale-100 animate-pulse'}`}>😐</span>
                <span className={`transition-transform duration-300 ${(hoverRating || rating) === 5 ? 'scale-125' : 'scale-100 animate-pulse'}`}>😍</span>
              </div>

              {/* Stars */}
              <div className="flex justify-center space-x-2 md:space-x-3 pt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={48}
                      className={`transition-all duration-300 ${(hoverRating || rating || 0) >= star
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                        : 'text-slate-200'
                        }`}
                    />
                  </button>
                ))}
              </div>

              {/* Submit Button (Direct Feedback Button as requested) */}
              {rating && (
                <button
                  onClick={handleRatingSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[24px] flex items-center justify-center space-x-3 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-[0.98] animate-in zoom-in-95"
                >
                  <span className="uppercase tracking-widest text-sm">Submit Review</span>
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              )}

              {!rating && (
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest animate-pulse">Select a star to continue</p>
              )}
            </div>
          )}

          {step === 'feedback' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-left space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Personal Feedback for Manager
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Humein batayein hum kaise behtar kar sakte hain..."
                  className="w-full h-32 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all font-medium text-slate-800"
                />
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (business && rating) {
                    const newFeedback = {
                      businessId: business.id,
                      rating: rating,
                      comment: feedback,
                      customerName: name || 'Guest',
                      customerMobile: mobile || '',
                      timestamp: Date.now(),
                      resolved: false
                    };
                    api.addFeedback(newFeedback as any);
                  }
                  setStep('success');
                }}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] flex items-center justify-center space-x-3 shadow-xl transition-all"
              >
                <span className="uppercase tracking-widest text-sm text-center">Submit Privately</span>
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500 py-4">
              <div className="bg-emerald-50 p-8 rounded-full w-fit mx-auto relative">
                <CheckCircle2 size={80} className="text-emerald-500" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Dhanyavad!</h2>
                <p className="text-slate-500 font-bold leading-relaxed">
                  Apka feedback humare liye bahut keemti hai.
                </p>
              </div>
              {business.settings.rewardType === 'COUPON' && rating !== null && (
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 mt-6 relative overflow-hidden text-left shadow-2xl shadow-indigo-200">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-4">Your Exclusive Reward</p>
                    <p className="text-white font-black text-4xl mb-2">{business.settings.couponCode || 'WELCOME10'}</p>
                    <p className="text-indigo-200 text-xs font-bold italic">Dikhao isse counter par next visit mein!</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <ShoppingBag size={120} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Powered By & 5 Buttons Section */}
        <div className="w-full space-y-8 pb-10">
          {/* 5 Row Boxes (Large & High Impact - Uniform Design) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 w-full">
            {items.slice(0, 5).map((item: any, i) => (
              <div
                key={i}
                style={{ height: '200px' }}
                className="bg-white rounded-[24px] border border-slate-200 overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-xl hover:-translate-y-2 group"
              >
                {/* Top Section (Vibrant) */}
                <div className={`w-full h-[125px] ${item.color} relative p-3 flex items-center justify-center`}>
                  <div className="w-full h-full bg-white/20 rounded-xl overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all duration-500" />
                  </div>
                </div>

                {/* Bottom Section (Pricing Details) */}
                <div className="flex-1 bg-white p-3 space-y-1 flex flex-col justify-center">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">
                    {item.name}
                  </p>

                  <div className="flex items-center justify-between w-full h-8 px-1">
                    <div className="flex items-center space-x-1.5 whitespace-nowrap">
                      <span className="text-[10px] font-bold text-slate-400">Actual:</span>
                      <span className="text-[11px] font-bold text-slate-400 line-through decoration-slate-300">
                        {item.actualPrice}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 whitespace-nowrap">
                      <span className="text-[10px] font-bold text-slate-500">Offer:</span>
                      <span className="text-[11px] font-black text-indigo-600">
                        {item.offerPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-3 text-slate-300 pt-6">
            <div className="h-[1px] w-12 bg-slate-200"></div>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <MessageSquare size={14} />
              <span>Powered by Review With AI</span>
            </div>
            <div className="h-[1px] w-12 bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default CustomerView;
