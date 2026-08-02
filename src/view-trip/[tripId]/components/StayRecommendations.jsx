import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hotel, Star, MapPin, IndianRupee,
  ExternalLink, ChevronDown, ChevronUp,
  RefreshCw, AlertCircle, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { generateStays } from '../../../service/AIModal';

const stayCache = {};
const FILTERS = ['All', 'Budget', 'Luxury'];

function StayCard({ stay, index }) {
  const isLuxury = stay.type === 'Luxury';
  const stars = parseFloat(stay.rating) || 0;
  const bookingUrl = stay.bookingLink || `https://www.booking.com/search.html?ss=${encodeURIComponent(stay.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="group relative glass-card-light overflow-hidden border-l-4 border-l-transparent hover:border-l-orange-500 transition-all"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
            isLuxury ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {isLuxury ? 'Premium' : 'Value'}
          </div>
          <div className="flex items-center gap-1 text-orange-500 font-heading text-xs">
            <Star size={10} fill="currentColor" /> {stay.rating}
          </div>
        </div>

        <h4 className="font-heading text-lg text-white mb-2 line-clamp-1">{stay.name}</h4>
        <p className="text-[11px] text-white/40 leading-relaxed mb-4 line-clamp-2 italic font-body">"{stay.description}"</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] text-white/20 uppercase tracking-widest">Starts from</span>
            <div className="flex items-center text-white font-heading text-lg">
              <IndianRupee size={12} className="text-orange-500" />
              <span>{stay.price}</span>
            </div>
          </div>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function StayRecommendations({ location, dayLabel }) {
  const cacheKey = location?.toLowerCase?.() || location;
  const [stays, setStays] = useState(stayCache[cacheKey] || null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchStays = async () => {
    if (stays) { setExpanded((p) => !p); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await generateStays(location);
      if (!Array.isArray(data) || data.length === 0) throw new Error('No stays returned.');
      stayCache[cacheKey] = data;
      setStays(data);
      setExpanded(true);
      toast.success(`Stays for ${location} ready! 🏨`);
    } catch (err) {
      console.error(err);
      setError('Stays currently unavailable.');
      toast.error('Failed to load stays.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = stays
    ? filter === 'All' ? stays : stays.filter((s) => s.type === filter)
    : [];

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Hotel size={16} className="text-orange-500" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Live Recommendations</span>
        </div>

        <button
          onClick={fetchStays}
          disabled={loading}
          className="text-[10px] font-bold text-orange-500/60 hover:text-orange-500 uppercase tracking-widest flex items-center gap-2"
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw size={12} />
            </motion.div>
          ) : expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Collapse' : stays ? 'Explore' : 'Discover'}
        </button>
      </div>

      {!stays && !loading && (
        <button
          onClick={fetchStays}
          className="w-full py-6 rounded-2xl border border-dashed border-white/10 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all group"
        >
           <span className="group-hover:text-orange-500 transition-colors">Find top rated stays in {location}</span>
        </button>
      )}

      <AnimatePresence>
        {expanded && stays && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mb-6">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[9px] font-bold px-4 py-2 rounded-full border tracking-widest uppercase transition-all ${
                    filter === f ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-white/40 hover:bg-white/5'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x no-scrollbar">
              {filtered.map((stay, i) => (
                <div key={i} className="min-w-[280px] sm:min-w-[320px] snap-center">
                  <StayCard stay={stay} index={i} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StayRecommendations;

