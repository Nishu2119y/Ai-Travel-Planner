import React from 'react';
import { motion } from 'framer-motion';
import HotelCard from './HotelCard';
import { BedDouble } from 'lucide-react';

function Hotels({ trip }) {
  const hotels = trip?.TripData?.hotelOptions || trip?.TripData?.hotels || [];
  if (!hotels.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-16 mb-20"
    >
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(255,77,0,0.1)]">
          <BedDouble size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1 h-3 bg-orange-500 rounded-full" />
             <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Curated Stays</span>
          </div>
          <h2 className="font-heading text-4xl text-white tracking-wide">
            PREMIUM <span className="text-orange-500">ACCOMMODATIONS</span>
          </h2>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
        {hotels.map((hotel, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="min-w-[320px] max-w-[320px] snap-center"
          >
            <HotelCard hotel={hotel} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Hotels;
