import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchPlaces } from '../../../lib/search';
import { Compass, Utensils, Hotel, ArrowRight, Star, Plus, CheckCircle2 } from 'lucide-react';
import { useBudget } from '../../../context/BudgetContext';
import { toast } from 'sonner';

function RecommendedPlaces({ trip }) {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, addedItems } = useBudget();

  useEffect(() => {
    if (trip?.tavilyData) {
      setPlaces(trip.tavilyData.places || []);
      setHotels(trip.tavilyData.hotels || []);
      setRestaurants(trip.tavilyData.restaurants || []);
      setLoading(false);
      return;
    }

    const destination = trip?.userSelection?.location?.label || trip?.TripData?.location;
    if (!destination) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const results = await searchPlaces(destination);
        setPlaces(results.places || []);
        setHotels(results.hotels || []);
        setRestaurants(results.restaurants || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [trip]);

  const FlashCard = ({ item }) => {
    const isAlreadyAdded = addedItems.some(i => i.name === item.title);
    const [isAdding, setIsAdding] = useState(false);
    const [cost, setCost] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Image Proxy Logic: Convert to WebP and resize for performance
    const getOptimizedUrl = (url) => {
      if (!url) return `https://images.weserv.nl/?url=${encodeURIComponent(`source.unsplash.com/featured/?${item.title}`)}&w=500&output=webp&q=80`;
      // Remove protocol for weserv
      const cleanUrl = url.replace(/^https?:\/\//, '');
      return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=500&output=webp&q=80`;
    };

    const handleAdd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsAdding(true);
    };

    const submitCost = (e) => {
      e.preventDefault();
      const numericCost = parseFloat(cost.replace(/[^0-9.]/g, '')) || 500;
      addItem({ name: item.title, cost: numericCost });
      setIsAdding(false);
      toast.success(`${item.title} added to your odyssey!`);
    };

    return (
      <motion.div
        whileHover={{ y: -8 }}
        className="relative break-inside-avoid mb-6 rounded-3xl overflow-hidden group border border-white/5 shadow-2xl bg-[#1e1e2e]"
        style={{ 
          height: Math.random() > 0.5 ? '400px' : '320px',
          aspectRatio: '3/4' // Reserved space to prevent layout shift
        }}
      >
        {/* Optimized Background Image with Blur-Up */}
        <div className="absolute inset-0 image-container">
          <img 
            src={getOptimizedUrl(item.photoUrl)}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 blur-load ${isLoaded ? 'loaded' : ''}`}
            alt={item.title}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        
        {/* Glass Edge Effect */}
        <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-1.5">
                <Star size={10} className="text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-bold text-white">{item.rating || '4.5'}</span>
             </div>
             
             <button 
               onClick={handleAdd}
               className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/40 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
             >
                {isAlreadyAdded ? <CheckCircle2 size={16} /> : <Plus size={16} />}
             </button>
          </div>

          <div className="text-left">
            <h4 className="font-heading text-xl text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">{item.title}</h4>
            <p className="text-[10px] text-white/60 line-clamp-2 mb-4 font-body italic">"{item.content}"</p>
            <a 
              href={item.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              Explore <ArrowRight size={10} />
            </a>
          </div>
        </div>

        {/* Mini Cost Modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
            >
               <input 
                 autoFocus
                 type="text"
                 placeholder="Cost (₹)"
                 value={cost}
                 onChange={(e) => setCost(e.target.value)}
                 className="w-full bg-transparent border-b border-orange-500 text-2xl font-display text-white text-center outline-none mb-6"
               />
               <div className="flex gap-4">
                  <button onClick={() => setIsAdding(false)} className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Cancel</button>
                  <button onClick={submitCost} className="px-4 py-2 bg-orange-500 rounded-full text-[9px] font-bold text-white uppercase tracking-widest">Add</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const MasonryGrid = ({ title, icon: Icon, items }) => (
    <div className="mb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_20px_rgba(255,77,0,0.1)]">
          <Icon className="w-6 h-6 text-[#ff4d00]" />
        </div>
        <h3 className="text-2xl font-bold text-[#f5f0e8] font-heading tracking-wide uppercase">{title}</h3>
      </div>
      
      {loading ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="mb-6 h-64 bg-white/5 animate-pulse rounded-3xl border border-white/5" />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item, index) => (
            <FlashCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-white/20 italic p-12 glass-card-light text-center font-body rounded-[2rem] border-dashed border-white/10">
          Scanning global nodes for {title.toLowerCase()}...
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-32 p-10 sm:p-20 rounded-[3.5rem] border border-white/5 relative overflow-hidden bg-[#121212]">
        {/* Cinematic Backdrop */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 mb-20 text-center sm:text-left">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
             <span className="text-orange-500 uppercase tracking-[0.4em] text-[10px] font-bold">Pinterest-Style Intelligence</span>
          </div>
          <h2 className="text-6xl font-black text-[#f5f0e8] mb-6 font-display leading-[0.9]">LIVE RECOMMENDATIONS</h2>
          <p className="text-white/40 max-w-2xl font-body text-lg leading-relaxed">
            Real-time sensory mapping for <span className="text-white font-bold">{trip?.userSelection?.location?.label || trip?.TripData?.location}</span>. 
            Curated via neural travel nodes.
          </p>
        </div>
        
        <div className="relative z-10">
          <MasonryGrid title="Local Landmarks" icon={Compass} items={places} />
          <MasonryGrid title="Luxury Stays" icon={Hotel} items={hotels} />
          <MasonryGrid title="Dining Odyssey" icon={Utensils} items={restaurants} />
        </div>
    </div>
  );
}

export default RecommendedPlaces;
