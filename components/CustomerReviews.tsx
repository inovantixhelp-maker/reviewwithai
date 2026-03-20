import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface GoogleReview {
    text: string;
    rating: number;
    publishAt: string;
    name: string;
    reviewId: string;
}

const CustomerReviews: React.FC<{ business: any, globalSettings: any }> = ({ business, globalSettings }) => {
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviewsFromSerpApi = async () => {
        if (!globalSettings?.serpapiToken) {
            setError("SerpApi Key missing. Please set it in Admin > System Setup.");
            return;
        }
        if (!business?.googlePlaceId) {
            setError("Google Place ID is required for fetching reviews (Set it in Google Integration).");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const apiKey = globalSettings.serpapiToken;
            const placeId = business.googlePlaceId;

            // SerpApi Google Maps Reviews API (through custom Netlify Proxy to avoid CORS)
            const proxyUrl = `/.netlify/functions/get-reviews?place_id=${placeId}&api_key=${apiKey}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.status}`);
            }

            const data = await response.json();
            
            // Map data from SerpApi format
            if (data.reviews && Array.isArray(data.reviews)) {
                const mappedReviews: GoogleReview[] = data.reviews.map((r: any) => ({
                    reviewId: r.id || Math.random().toString(),
                    text: r.snippet || '',
                    rating: r.rating || 5,
                    publishAt: r.date || 'Recently',
                    name: r.user?.name || 'Google User'
                })).filter(r => r.text || r.rating > 0); 

                setReviews(mappedReviews.slice(0, 10)); // Limit to matching UI
            } else {
                console.warn("Unexpected data format from SerpApi:", data);
                setReviews([]);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError(err.message || "Could not fetch reviews.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (business?.googlePlaceId && globalSettings?.serpapiToken) {
            fetchReviewsFromSerpApi();
        }
    }, [business?.googlePlaceId, globalSettings?.serpapiToken]);

    return (
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-lg">Latest Google Reviews</h3>
                        <p className="text-xs text-slate-500 font-medium">Real-time reviews from Google Maps (via SerpApi)</p>
                    </div>
                </div>
                <button 
                    onClick={fetchReviewsFromSerpApi}
                    disabled={loading}
                    className="p-2 hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={20} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error ? (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center space-x-3 text-rose-600">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            ) : loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-slate-100 h-10 w-10"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                                <div className="h-3 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-10">
                    <MessageSquare size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-medium text-sm">No reviews found yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="border-b border-slate-50 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100">
                                        {review.name?.charAt(0) || 'G'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{review.name}</p>
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className={`${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                            ))}
                                            <span className="text-[10px] text-slate-400 ml-2">{review.publishAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                "{review.text || 'No review text provided.'}"
                            </p>
                        </div>
                    ))}
                    <div className="pt-2">
                        <a 
                            href={business.googleMapsUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center"
                        >
                            View all reviews on Google Maps
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerReviews;
