import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const LazyDestinationCard = ({ destination, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      { rootMargin: '100px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => cardRef.current && observer.unobserve(cardRef.current);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 8) * 0.1, duration: 0.8 }}
      className="relative group bg-[#1e1e2e]/40 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:bg-[#1e1e2e]/60 hover:border-orange-500/20"
    >
      <Link to={`/destination/${destination.name.toLowerCase().replace(/ /g, '-')}`} className="block text-decoration-none">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <AnimatePresence>
            {isVisible && (
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="w-full h-full object-cover" 
                src={destination.img} 
                alt={destination.name} 
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {destination.tags && destination.tags.slice(0, 1).map(t => (
              <div key={t} className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-orange-500/20">
                {t}
              </div>
            ))}
          </div>

          <div className="absolute top-6 right-6">
             <div className="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white/40 group-hover:text-orange-500 group-hover:border-orange-500/30 transition-all">
                <ArrowUpRight size={18} />
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-1 h-3 bg-orange-500 rounded-full" />
                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">{destination.country}</span>
              </div>
              <h3 className="font-heading text-3xl text-white mb-2 leading-none">{destination.name}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-white/20 block mb-1">Starting At</span>
              <div className="font-heading text-3xl text-orange-500">
                {formatPrice(destination.price)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-orange-500 fill-orange-500" />
                  <span className="text-[12px] font-bold text-white">{destination.rating}</span>
               </div>
               <span className="text-[10px] text-white/30 uppercase tracking-widest">{destination.climate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/20 group-hover:text-orange-500/60 transition-colors">
               <Sparkles size={12} />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Curated</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const DestinationGrid = ({ destinations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {destinations.map((d, i) => (
        <LazyDestinationCard key={d.id} destination={d} index={i} />
      ))}
    </div>
  );
};

export default DestinationGrid;
