import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlaceMetadata } from '../../../service/placeService';
import TravelGuide from './TravelGuide';
import { Clock, DollarSign, Star, MapPin, ExternalLink, Calendar, Plus, CheckCircle2 } from 'lucide-react';
import { useBudget } from '../../../context/BudgetContext';
import { toast } from 'sonner';

function PlaceCardItem({ place }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [cost, setCost] = useState('');
  const { addItem, addedItems } = useBudget();

  const isAlreadyAdded = addedItems.some(item => item.name === place.placeName);

  useEffect(() => {
    if (place?.placeName) { 
      setLoading(true);
      getPlaceMetadata(place.placeName).then(data => {
        setMetadata(data);
        setLoading(false);
      }); 
    }
  }, [place]);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsAdding(true);
  };

  const submitCost = (e) => {
    e.preventDefault();
    const numericCost = parseFloat(cost.replace(/[^0-9.]/g, '')) || 0;
    addItem({ name: place.placeName, cost: numericCost });
    setIsAdding(false);
    setCost('');
    toast.success(`${place.placeName} added to your tracker!`);
  };

  if (!place) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`;

  return (
    <div className="relative group flex flex-col h-full bg-[#1e1e2e]/40 border border-white/5 rounded-3xl overflow-hidden transition-all hover:bg-[#1e1e2e]/60 hover:border-orange-500/20">
      
      {/* Top Media Bar */}
      <div className="relative h-56 overflow-hidden">
        {loading ? (
          <div className="w-full h-full skeleton-premium" />
        ) : (
          <>
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover"
              src={metadata?.photoUrl || place.placeImageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'}
              alt={place.placeName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            
            {/* Quick Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
               {metadata?.rating && (
                 <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                    <Star size={12} className="text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-bold text-white">{metadata.rating}</span>
                 </div>
               )}
            </div>

            {/* Add to Trip Action */}
            <div className="absolute top-4 right-4">
              <AnimatePresence mode="wait">
                {isAlreadyAdded ? (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-10 h-10 bg-green-500/20 backdrop-blur-md border border-green-500/40 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    <CheckCircle2 size={20} />
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddClick}
                    className="w-10 h-10 bg-orange-500 border border-orange-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/20"
                  >
                    <Plus size={20} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-heading text-xl text-white tracking-wide">{place.placeName}</h3>
           <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin size={16} className="text-white/20 hover:text-orange-500 transition-colors" />
           </a>
        </div>
        
        <p className="text-[11px] font-bold text-orange-500/80 uppercase tracking-[0.2em] mb-3">
          {place.cleanSummary || "A must-visit local gem"}
        </p>

        <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-6 italic">
          "{place.placeDetails}"
        </p>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
           <div className="flex gap-4">
              <div className="flex flex-col">
                 <span className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Time to explore</span>
                 <div className="flex items-center gap-1.5 text-white/80">
                    <Clock size={12} className="text-orange-500" />
                    <span className="text-[10px] font-bold">{place.timeToTravel}</span>
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Estimated Cost</span>
                 <div className="flex items-center gap-1.5 text-white/80">
                    <DollarSign size={12} className="text-green-500" />
                    <span className="text-[10px] font-bold">{place.ticketPricing}</span>
                 </div>
              </div>
           </div>
           <TravelGuide placeName={place.placeName} />
        </div>
      </div>

      {/* Inline Cost Input Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#121212]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
             <h4 className="font-heading text-xl text-white mb-2">Track Expense</h4>
             <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Estimated cost for {place.placeName}</p>
             <form onSubmit={submitCost} className="w-full max-w-[200px]">
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g. 500"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-orange-500 text-3xl font-display text-white text-center outline-none pb-2 mb-6"
                />
                <div className="flex gap-3">
                   <button 
                     type="button" 
                     onClick={() => setIsAdding(false)}
                     className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 py-2 bg-orange-500 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
                   >
                     Confirm
                   </button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PlaceCardItem;
