import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPhoto } from '../../../service/photoAPI';
import { MapPin, Star, ExternalLink, Plus, CheckCircle2 } from 'lucide-react';
import { useBudget } from '../../../context/BudgetContext';
import { toast } from 'sonner';

function HotelCard({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [cost, setCost] = useState('');
  const { addItem, addedItems } = useBudget();

  const isAlreadyAdded = addedItems.some(item => item.name === hotel.hotelName);

  useEffect(() => {
    if (hotel?.hotelName) { getPhoto(hotel.hotelName).then(setPhotoUrl); }
  }, [hotel]);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((hotel?.hotelName || '') + ',' + (hotel?.hotelAddress || ''))}`;

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
  };

  const submitCost = (e) => {
    e.preventDefault();
    const numericCost = parseFloat(cost.replace(/[^0-9.]/g, '')) || 0;
    addItem({ name: hotel.hotelName, cost: numericCost });
    setIsAdding(false);
    setCost('');
    toast.success(`${hotel.hotelName} added to budget!`);
  };

  return (
    <div className="relative group bg-[#1e1e2e]/40 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:bg-[#1e1e2e]/60 hover:border-orange-500/20 h-full flex flex-col">
      
      {/* Media Content */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 1.2 }}
          className="w-full h-full object-cover"
          src={photoUrl || hotel?.hotelImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'}
          alt={hotel?.hotelName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        
        {/* Quality Badge */}
        <div className="absolute top-6 left-6">
           <div className="px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
              <Star size={12} className="text-orange-500 fill-orange-500" />
              <span className="text-[12px] font-bold text-white">{hotel?.rating}</span>
           </div>
        </div>

        {/* Action Button */}
        <div className="absolute top-6 right-6">
          <AnimatePresence mode="wait">
            {isAlreadyAdded ? (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-12 h-12 bg-green-500/20 backdrop-blur-md border border-green-500/40 rounded-full flex items-center justify-center text-green-500"
              >
                <CheckCircle2 size={24} />
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddClick}
                className="w-12 h-12 bg-orange-500 border border-orange-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/20"
              >
                <Plus size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="font-heading text-2xl text-white mb-2 leading-[1.1] tracking-tight">{hotel?.hotelName}</h3>
        
        <div className="flex items-start gap-2 mb-6">
           <MapPin size={14} className="text-orange-500 shrink-0 mt-1" />
           <p className="text-xs text-white/40 leading-relaxed font-body line-clamp-2">
             {hotel?.hotelAddress}
           </p>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between">
           <div>
              <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 block mb-1">Per Night</span>
              <span className="text-3xl font-heading text-orange-500">
                {hotel?.price?.startsWith('₹') || hotel?.price?.startsWith('€') || hotel?.price?.startsWith('$') ? hotel.price : `₹${hotel?.price}`}
              </span>
           </div>
           <a 
             href={mapsUrl} target="_blank" rel="noopener noreferrer"
             className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-orange-500"
           >
              <ExternalLink size={18} />
           </a>
        </div>
      </div>

      {/* Cost Input Overlay */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#121212]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
             <h4 className="font-heading text-2xl text-white mb-2">Log Booking</h4>
             <p className="text-[10px] text-white/40 uppercase tracking-widest mb-8">Total estimated cost for this stay</p>
             <form onSubmit={submitCost} className="w-full max-w-[200px]">
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g. 4500"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-orange-500 text-4xl font-display text-white text-center outline-none pb-4 mb-8"
                />
                <div className="flex gap-4">
                   <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white">Cancel</button>
                   <button type="submit" className="flex-1 py-3 bg-orange-500 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-500/20">Confirm</button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HotelCard;
