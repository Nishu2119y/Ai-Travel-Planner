import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Sparkles, ChevronDown, ChevronUp,
  Lightbulb, BookOpen, Volume2, VolumeX,
  Crown, MapPin, AlertCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { generateGuide } from '../../../service/AIModal';

const guideCache = {};
const IS_PREMIUM = true;

function TravelGuide({ placeName }) {
  const [guide, setGuide] = useState(guideCache[placeName] || null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const isPremium = IS_PREMIUM;

  const fetchGuide = async () => {
    if (guide) {
      setExpanded((prev) => !prev);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await generateGuide(placeName);
      if (!data?.story || !Array.isArray(data?.hiddenFacts) || !Array.isArray(data?.tips)) {
        throw new Error('Incomplete guide data received.');
      }
      guideCache[placeName] = data;
      setGuide(data);
      setExpanded(true);
      toast.success(`Guide for ${placeName} ready! 🗺️`);
    } catch (err) {
      console.error('[TravelGuide] generation error:', err?.message || err);
      setError(err?.message?.includes('quota') 
        ? 'API quota exceeded. Please try again later.'
        : 'Failed to generate guide. Please try again.');
      toast.error('Could not generate guide. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!guide) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = [
      `Tour guide story for ${placeName}.`,
      guide.story,
      'Hidden facts.',
      ...guide.hiddenFacts,
      'Travel tips.',
      ...guide.tips,
    ].join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Crown className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-orange-500 font-bold tracking-[0.2em] uppercase">AI Intel</span>
            <span className="text-sm font-heading text-white tracking-wide">TRAVEL COMPANION</span>
          </div>
        </div>

        {isPremium && (
          <button
            onClick={fetchGuide}
            disabled={loading}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <RefreshCw size={18} />
              </motion.div>
            ) : expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>

      {/* Guide Trigger Button */}
      {isPremium && !guide && !loading && !error && (
        <div className="p-4">
          <button
            onClick={fetchGuide}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-dashed border-orange-500/30 text-orange-500/70 text-xs font-heading tracking-widest uppercase hover:bg-orange-500/5 hover:border-orange-500 transition-all group"
          >
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Generate Local Story
          </button>
        </div>
      )}

      {/* Loading & Error */}
      {loading && (
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-orange-500/60 text-xs font-bold uppercase tracking-widest">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Sparkles size={14} />
            </motion.div>
            Consulting Local archives...
          </div>
          <div className="space-y-2">
            {[90, 70, 85].map((w, i) => (
              <motion.div
                key={i}
                className="h-2 bg-white/5 rounded-full"
                style={{ width: `${w}%` }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence>
        {isPremium && expanded && guide && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Story */}
              <div className="glass-card-light p-5 border-l-2 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold">
                    <BookOpen size={12} /> The Local Lore
                  </div>
                  <button
                    onClick={handleSpeak}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                      speaking ? 'bg-orange-500 text-white' : 'bg-white/5 text-orange-500 hover:bg-white/10'
                    }`}
                  >
                    {speaking ? <VolumeX size={12} /> : <Volume2 size={12} />} {speaking ? 'Silence' : 'Narration'}
                  </button>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-body italic">"{guide.story}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hidden Facts */}
                <div className="glass-card-light p-5">
                  <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold mb-4">
                    <Lightbulb size={12} className="text-yellow-500" /> Hidden Facts
                  </div>
                  <ul className="space-y-3">
                    {guide.hiddenFacts.map((fact, i) => (
                      <li key={i} className="flex gap-3 text-xs text-white/60 leading-snug">
                        <span className="text-orange-500 font-bold">•</span> {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Travel Tips */}
                <div className="glass-card-light p-5">
                  <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold mb-4">
                    <MapPin size={12} className="text-green-500" /> Local Intel
                  </div>
                  <ul className="space-y-3">
                    {guide.tips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-xs text-white/60 leading-snug">
                        <span className="text-orange-500 font-bold">»</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TravelGuide;

