import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Wallet, X, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRecentSearches, deleteSearch, clearAllSearches } from '../../service/historyService';

function RecentSearches({ user, onRefresh }) {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    const data = await getRecentSearches(user);
    setHistory(data);
  };

  const handleDelete = async (e, index) => {
    e.stopPropagation();
    const updated = await deleteSearch(index, user);
    setHistory(updated);
    if (onRefresh) onRefresh();
  };

  const handleClearAll = async () => {
    const updated = await clearAllSearches(user);
    setHistory(updated);
    if (onRefresh) onRefresh();
  };

  const handleCardClick = (search) => {
    if (search.tripId) {
      // Direct navigation to results if tripId exists
      navigate(`/view-trip/${search.tripId}`);
    } else {
      // Re-populate search state in create-trip
      navigate('/create-trip', { state: { searchData: search, autoRun: true } });
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
          <h2 className="font-heading text-2xl text-white uppercase tracking-wider">Recent Odysseys</h2>
        </div>
        <button 
          onClick={handleClearAll}
          className="text-[10px] font-bold text-white/20 hover:text-orange-500 transition-all uppercase tracking-[0.2em] flex items-center gap-2 group"
        >
          <Trash2 size={12} className="group-hover:rotate-12 transition-transform" /> Clear All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-2 px-2">
        <AnimatePresence mode="popLayout">
          {history.map((item, index) => (
            <motion.div
              key={`${item.timestamp}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => handleCardClick(item)}
              className="flex-shrink-0 w-72 bg-[#1e1e2e] border border-orange-500/20 hover:border-orange-500/60 rounded-[2rem] p-6 cursor-pointer transition-all group relative overflow-hidden"
              style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
            >
              {/* Subtle Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <button 
                onClick={(e) => handleDelete(e, index)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 text-white/20 hover:bg-orange-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <X size={10} strokeWidth={3} />
              </button>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-white font-heading text-xl truncate pr-2 leading-none mb-1">
                    {item.location?.label?.split(',')[0]}
                  </h3>
                  <p className="text-[10px] text-white/30 truncate font-bold uppercase tracking-widest">
                    {item.location?.label?.split(',')[1] || 'Global'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
                    <Calendar size={14} className="text-orange-500/40" />
                    {item.noOfDays}D
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
                    <Wallet size={14} className="text-orange-500/40" />
                    {item.budget?.slice(0, 3)}
                  </div>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all shadow-lg">
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RecentSearches;
