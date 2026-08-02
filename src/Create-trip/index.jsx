import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudegetOptions, SelectTravelersList } from '../constants/options';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { sendChatMessage } from '../service/AIModal';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MapPin, Calendar, Wallet, Users, Sparkles, ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../service/firebase';
import { generatePlan } from '../api/plan';
import { saveSearch } from '../service/historyService';

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.searchData) {
      setFormData(location.state.searchData);
      if (location.state?.autoRun) {
        // Option to auto-trigger generation if needed
      }
    }
  }, [location.state]);

  const steps = [
    { id: 'destination', title: 'Location', icon: MapPin, description: 'Where to?' },
    { id: 'duration', title: 'Dates', icon: Calendar, description: 'How long?' },
    { id: 'budget', title: 'Budget', icon: Wallet, description: 'How much?' },
    { id: 'travelers', title: 'Guests', icon: Users, description: 'Who\'s going?' }
  ];

  const isStepComplete = (stepIndex) => {
    switch (stepIndex) {
      case 0: return formData.location;
      case 1: return formData.noOfDays;
      case 2: return formData.budget;
      case 3: return formData.travelers;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onGenerateTrip = async () => {
    if (loading) return;
    try {
      if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData?.travelers) {
        toast.error("Please fill in all the fields.");
        return;
      }
      setLoading(true);
      setLoadingMessage('Crafting your perfect trip with AI…');
      
      const user = JSON.parse(localStorage.getItem('user'));
      const tripDocument = await generatePlan({ 
        ...formData, 
        userEmail: user?.email || 'anonymous'
      });
      
      // If generatePlan returned a cached trip, it will have an id.
      // Use that id instead of generating a new one to prevent duplicates.
      const finalDocId = tripDocument.id || Date.now().toString();

      // NEW: Use historyService to save search
      await saveSearch({
        ...formData,
        tripId: finalDocId
      }, user);

      // Only save if it's NOT a cached result (generatePlan handles saving new results)
      if (!tripDocument.isCached && !tripDocument.isDemo) {
        tripDocument.id = finalDocId;
        tripDocument.createdAt = new Date().toISOString();
        await setDoc(doc(db, "AITrips", finalDocId), tripDocument);
      }
      
      navigate('/view-trip/' + finalDocId);
    } catch (error) {
      toast.error(`Error: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-12" style={{ background: 'var(--dark)' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 mb-6 glass-card-light"
            style={{ padding: '8px 24px' }}
          >
            <Zap size={14} style={{ color: 'var(--orange)' }} />
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-light)' }}>AI Travel Planning</span>
          </motion.div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 84px)', color: '#f5f0e8', lineHeight: 1, marginBottom: '20px' }}>
            Plan Your <em className="shimmer-text">Next Escape</em>
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Step into the future of travel. Let our AI curate an immersive journey tailored to your unique spirit.
          </p>
        </motion.div>

        {/* Advanced SVG Stepper */}
        <div className="mb-20 px-4">
          <div className="relative flex justify-between items-center max-w-3xl mx-auto">
            {/* SVG Glowing Path */}
            <svg className="absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 pointer-events-none" style={{ overflow: 'visible' }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Background Path */}
              <line x1="0" y1="16" x2="100%" y2="16" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              {/* Glowing Progress Path */}
              <motion.line
                x1="0" y1="16" x2="100%" y2="16"
                stroke="var(--orange)"
                strokeWidth="2"
                strokeDasharray="100%"
                initial={{ strokeDashoffset: "100%" }}
                animate={{ strokeDashoffset: `${100 - (currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                filter="url(#glow)"
              />
            </svg>

            {steps.map((step, index) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div
                  className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    index <= currentStep 
                      ? 'border-orange-500 bg-orange-500/10 text-orange-500 shadow-[0_0_30px_rgba(255,77,0,0.3)]' 
                      : 'border-white/10 bg-[#0f0f1b] text-white/20'
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.15 : 1,
                    borderColor: index <= currentStep ? 'var(--orange)' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  {isStepComplete(index) ? <Check size={22} strokeWidth={3} /> : <step.icon size={22} />}
                </motion.div>
                <div className="absolute top-16 text-center whitespace-nowrap">
                   <span className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${index <= currentStep ? 'text-orange-500' : 'text-white/20'}`}>
                      {step.title}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-10 sm:p-16 mb-12 relative overflow-hidden rounded-[3rem]"
            style={{ 
              background: 'linear-gradient(145deg, rgba(30, 30, 46, 0.4), rgba(15, 15, 27, 0.6))',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              borderTop: '1px solid rgba(255, 77, 0, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 77, 0, 0.02)',
              backdropFilter: 'blur(30px)',
            }}
          >
            {/* Ambient light effect */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Content Logic ... */}
            {/* (Keep original content logic but with improved styling) */}
            
            {currentStep === 0 && (
              <div className="space-y-12">
                <div className="text-center">
                  <motion.h3 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-heading text-5xl md:text-6xl text-white mb-4 tracking-tight"
                  >
                    WHERE IS YOUR <span className="text-orange-500">SOUL</span> HEADING?
                  </motion.h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Enter any destination worldwide</p>
                </div>
                <div className="max-w-2xl mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-500/0 rounded-[20px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY || "dummy-key"}
                    selectProps={{
                      placeholder: "Search for a city, country, or landmark...",
                      onChange: (value) => handleInputChange('location', value),
                      menuPortalTarget: document.body,
                      styles: { 
                        control: (base, state) => ({ 
                          ...base, 
                          background: 'rgba(15, 15, 27, 0.8)', 
                          border: state.isFocused ? '1px solid rgba(255, 77, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '16px', padding: '12px 18px', color: '#fff',
                          boxShadow: state.isFocused ? '0 0 20px rgba(255, 77, 0, 0.1)' : 'none',
                          backdropFilter: 'blur(10px)',
                          '&:hover': { borderColor: 'rgba(255, 77, 0, 0.3)' }
                        }),
                        input: (base) => ({ ...base, color: '#fff', fontSize: '18px', fontWeight: '500' }),
                        placeholder: (base) => ({ ...base, color: 'rgba(255, 255, 255, 0.2)' }),
                        singleValue: (base) => ({ ...base, color: '#fff', fontSize: '18px', fontWeight: '600' }),
                        menu: (base) => ({ 
                          ...base, background: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', 
                          borderRadius: '16px', padding: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', marginTop: '12px'
                        }),
                        option: (base, state) => ({ 
                          ...base, 
                          background: state.isFocused ? 'rgba(255, 77, 0, 0.1)' : 'transparent',
                          color: state.isFocused ? '#ff4d00' : 'rgba(255,255,255,0.7)',
                          borderRadius: '10px', padding: '14px 20px', fontSize: '14px',
                          fontWeight: state.isFocused ? '600' : '400', cursor: 'pointer', transition: 'all 0.2s ease',
                        }),
                        indicatorsContainer: (base) => ({ ...base, display: 'none' }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-12">
                <div className="text-center">
                  <h3 className="font-heading text-5xl md:text-6xl text-white mb-4 tracking-tight">DAYS OF THE <span className="text-orange-500">ODYSSEY</span></h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">How many sunrises for this escape?</p>
                </div>
                <div className="max-w-xs mx-auto">
                  <input
                    type="number"
                    min="1"
                    placeholder="7"
                    value={formData.noOfDays || ''}
                    onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 text-center text-8xl font-display text-orange-500 outline-none focus:border-orange-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-12">
                <div className="text-center">
                  <h3 className="font-heading text-5xl md:text-6xl text-white mb-4 tracking-tight">SET YOUR <span className="text-orange-500">WALLET</span></h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Financial energy of the journey</p>
                </div>
                
                <div className="max-w-xl mx-auto mb-12 bg-black/20 p-8 rounded-[2rem] border border-white/5">
                   <div className="flex justify-between items-end mb-6">
                      <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Cap Limit</span>
                      <span className="text-4xl font-display text-orange-500">₹{(formData.budgetLimit || 50000).toLocaleString()}</span>
                   </div>
                   <input 
                      type="range" min="5000" max="500000" step="5000"
                      value={formData.budgetLimit || 50000}
                      onChange={(e) => handleInputChange('budgetLimit', parseInt(e.target.value))}
                      className="w-full accent-orange-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SelectBudegetOptions.map((item, index) => (
                    <motion.div
                      key={index}
                      onClick={() => handleInputChange('budget', item.title)}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`p-8 rounded-[2rem] cursor-pointer border transition-all ${
                        formData?.budget === item.title 
                        ? 'border-orange-500 bg-orange-500/10 shadow-[0_15px_40px_rgba(255,77,0,0.15)]' 
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-4">{item.icon}</div>
                        <h4 className="font-heading text-xl text-white mb-2 uppercase tracking-wide">{item.title}</h4>
                        <p className="text-white/30 text-[10px] leading-relaxed italic">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-12">
                <div className="text-center">
                  <h3 className="font-heading text-5xl md:text-6xl text-white mb-4 tracking-tight">MEMORIES <span className="text-orange-500">SHARED</span></h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Who breathes this air with you?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SelectTravelersList.map((item, index) => (
                    <motion.div
                      key={index}
                      onClick={() => handleInputChange('travelers', item.people)}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`p-8 rounded-[2rem] cursor-pointer border transition-all ${
                        formData?.travelers === item.people 
                        ? 'border-orange-500 bg-orange-500/10 shadow-[0_15px_40px_rgba(255,77,0,0.15)]' 
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-4">{item.icon}</div>
                        <h4 className="font-heading text-xl mb-2">{item.title}</h4>
                        <p className="text-white/30 text-[10px] italic">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-4">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft size={14} /> Previous Stage
          </motion.button>

          {currentStep < steps.length - 1 ? (
            <motion.button
              onClick={nextStep}
              disabled={!isStepComplete(currentStep)}
              whileHover={isStepComplete(currentStep) ? { scale: 1.05, boxShadow: '0 0 40px rgba(255,77,0,0.4)' } : {}}
              whileTap={isStepComplete(currentStep) ? { scale: 0.95 } : {}}
              className={`px-12 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-3 ${
                isStepComplete(currentStep) 
                ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              Continue Odyssey <ArrowRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              onClick={onGenerateTrip}
              disabled={loading || !isStepComplete(currentStep)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255,77,0,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-14 py-6 bg-orange-500 text-white rounded-full text-[12px] font-bold uppercase tracking-[0.4em] shadow-2xl shadow-orange-500/40 relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <AiOutlineLoading3Quarters className="animate-spin" /> Manifesting...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> Generate Destiny
                </div>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
