import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronUp, ChevronDown, Plus, Trash2, PieChart } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

const FloatingBudgetTracker = () => {
  const [expanded, setExpanded] = useState(false);
  const { totalBudget, remainingBudget, addedItems, removeItem } = useBudget();

  const percentage = totalBudget > 0 ? Math.max(0, (remainingBudget / totalBudget) * 100) : 0;
  const isCritical = percentage < 20;

  if (totalBudget <= 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-72 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 bg-gradient-to-br from-orange-500/10 to-transparent">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="font-heading text-lg text-white uppercase tracking-wider">Budget Status</h4>
                  <PieChart size={16} className="text-orange-500" />
               </div>
               
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest mb-2">
                       <span>Remaining</span>
                       <span>₹{remainingBudget.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={`h-full ${isCritical ? 'bg-red-500' : 'bg-orange-500'}`}
                          style={{ boxShadow: isCritical ? '0 0 10px rgba(239,68,68,0.5)' : '0 0 10px rgba(255,77,0,0.5)' }}
                       />
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                     <span className="text-[9px] text-white/20 uppercase tracking-widest">Total Limit</span>
                     <span className="text-sm font-bold text-white/60">₹{totalBudget.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            <div className="max-h-48 overflow-y-auto p-4 space-y-3 no-scrollbar">
               {addedItems.length === 0 ? (
                 <p className="text-[10px] text-white/20 text-center py-4 uppercase tracking-[0.2em]">No expenses tracked yet</p>
               ) : (
                 addedItems.map((item) => (
                   <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex flex-col">
                         <span className="text-xs text-white/80 font-bold line-clamp-1">{item.name}</span>
                         <span className="text-[10px] text-orange-500/60">₹{item.cost.toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                         <Trash2 size={12} />
                      </button>
                   </div>
                 ))
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-3 px-6 py-4 rounded-full border-2 shadow-2xl transition-all ${
          expanded 
          ? 'bg-orange-500 border-orange-400 text-white' 
          : 'bg-surface/80 backdrop-blur-md border-white/10 text-white hover:border-orange-500/50'
        }`}
      >
        <div className="relative">
          <Wallet size={20} />
          {addedItems.length > 0 && (
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-surface animate-pulse" />
          )}
        </div>
        <div className="flex flex-col items-start leading-none">
           <span className="text-[8px] uppercase tracking-widest opacity-60 mb-0.5">Budget</span>
           <span className="text-sm font-bold font-display">₹{remainingBudget.toLocaleString()}</span>
        </div>
        {expanded ? <ChevronDown size={16} className="opacity-40" /> : <ChevronUp size={16} className="opacity-40" />}
      </motion.button>
    </div>
  );
};

export default FloatingBudgetTracker;
