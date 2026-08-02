import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Plane, Train, Car, Info, Droplets } from 'lucide-react';

const EcoFriendlySuggestions = ({ tripData }) => {
  const { ecoScore = 7, carbonFootprint, ecoFriendlyTips } = tripData?.TripData || {};

  const getScoreColor = (score) => {
    if (score >= 7) return '#4dbb8a';
    if (score >= 4) return '#f0a330';
    return '#e87a52';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (ecoScore / 10) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card mt-12 p-8"
      style={{ border: '1px solid rgba(77, 187, 138, 0.2)' }}
    >
      <div className="flex flex-col md:flex-row justify-between gap-12">
        {/* Left: Score & Ring */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64" cy="64" r="45"
                fill="transparent"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <motion.circle
                cx="64" cy="64" r="45"
                fill="transparent"
                stroke={getScoreColor(ecoScore)}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="progress-ring-gradient"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-4xl text-white">{ecoScore}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-body">Eco Score</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-[#4dbb8a] mb-1">
              <Leaf size={14} />
              <span className="font-heading text-lg">Sustainable Choice</span>
            </div>
            <p className="text-[11px] text-white/30 font-body max-w-[150px]">Based on transportation and activity choices</p>
          </div>
        </div>

        {/* Middle: Footprint Comparison */}
        <div className="flex-1 space-y-6">
          <div className="section-label section-label-left">Carbon Footprint Comparison</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card-light p-5 flex items-center gap-5 border-l-4 border-red-500/50">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Plane size={24} />
              </div>
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">High Impact</div>
                <div className="font-heading text-xl text-white">{carbonFootprint?.flight || '450'} kg CO₂</div>
                <div className="text-[11px] text-white/20">Via Flight</div>
              </div>
            </div>

            <div className="glass-card-light p-5 flex items-center gap-5 border-l-4 border-[#4dbb8a]">
              <div className="w-12 h-12 rounded-xl bg-[#4dbb8a10] flex items-center justify-center text-[#4dbb8a]">
                <Train size={24} />
              </div>
              <div>
                <div className="text-[10px] text-[#4dbb8a] uppercase tracking-widest mb-1">Eco Friendly</div>
                <div className="font-heading text-xl text-white">{carbonFootprint?.train || '85'} kg CO₂</div>
                <div className="text-[11px] text-white/20">Via Train</div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-start gap-3 text-white/60 text-sm leading-relaxed">
              <Info size={16} className="text-orange-500 flex-shrink-0 mt-1" />
              <p>{ecoFriendlyTips || "Consider using public transit and staying in locally-owned boutique hotels to further reduce your footprint."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Gradient Definition */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="eco-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4dbb8a" />
            <stop offset="100%" stopColor="#2D9A6B" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default EcoFriendlySuggestions;

