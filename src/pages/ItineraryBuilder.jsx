import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin, Utensils, Camera, Bed, Save, Download, CheckCircle } from 'lucide-react';

const DAYS = Array.from({ length: 7 }, (_, i) => ({ day: i + 1, label: `Day ${i + 1}`, date: `Jun ${12 + i}` }));

const SAMPLE_ACTIVITIES = {
  1: [
    { time: 'Morning',   icon: '✈️', title: 'Arrive at Santorini Airport',    desc: 'Check in at Canaves Oia Suites', category: 'Travel' },
    { time: 'Afternoon', icon: '🍽️', title: 'Lunch at Lycabettus',             desc: 'Fresh seafood with caldera view', category: 'Dining' },
    { time: 'Evening',   icon: '🌅', title: 'Oia Sunset',                      desc: 'Watch the famous Santorini sunset', category: 'Sightseeing' },
  ],
  2: [
    { time: 'Morning',   icon: '🏛️', title: 'Akrotiri Archaeological Site',   desc: 'Explore the ancient Minoan ruins', category: 'Culture' },
    { time: 'Afternoon', icon: '🏖️', title: 'Red Beach',                       desc: 'Unique red volcanic sand beach', category: 'Beach' },
    { time: 'Evening',   icon: '🍷', title: 'Wine Tasting at Venetsanos',      desc: 'Local Assyrtiko wine experience', category: 'Dining' },
  ],
};

const HOTEL = { name: 'Canaves Oia Suites', room: 'Infinity Pool Suite', checkIn: 'Jun 12', checkOut: 'Jun 19', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80' };

const CATEGORY_COLORS = { Travel: '#D8532A', Dining: '#7C3D1B', Sightseeing: '#1B3B8A', Culture: '#3B1B8A', Beach: '#1B7A8C' };

function ItineraryBuilder() {
  const [activeDay, setActiveDay] = useState(1);
  const activities = SAMPLE_ACTIVITIES[activeDay] || SAMPLE_ACTIVITIES[1];

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '72px' }}>

      {/* Top bar */}
      <div style={{ background: 'rgba(26,26,46,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,77,0,0.1)', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-[2px] bg-[#ff4d00]" />
               <span className="text-[#ff4d00] uppercase tracking-[0.3em] text-[10px] font-bold">Mission: Santorini</span>
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px', color: '#f5f0e8', margin: 0, lineHeight: 1 }}>SANTORINI ODYSSEY</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button className="btn-outline" whileHover={{ scale: 1.05 }} style={{ fontSize: '11px', padding: '10px 24px', borderColor: 'rgba(255,255,255,0.1)' }}>
              <Download size={14} /> EXPORT PDF
            </motion.button>
            <Link to="/booking-confirmation">
              <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} style={{ fontSize: '11px', padding: '10px 24px', background: 'var(--orange)', border: 'none', boxShadow: '0 0 20px rgba(255,77,0,0.2)' }}>
                <CheckCircle size={14} /> INITIATE BOOKING
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '260px 1fr 300px', gap: '40px', alignItems: 'start' }}>

        {/* Day Selector Sidebar */}
        <div style={{ position: 'sticky', top: '120px' }}>
          <div className="section-label section-label-left" style={{ marginBottom: '24px' }}>Journey Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DAYS.map(d => (
              <motion.button key={d.day} onClick={() => setActiveDay(d.day)} whileHover={{ x: 6 }}
                style={{ textAlign: 'left', padding: '16px 20px', borderRadius: '12px', border: '1px solid', cursor: 'pointer', transition: 'all 0.3s',
                  background: activeDay === d.day ? 'rgba(255,77,0,0.1)' : 'rgba(255,255,255,0.02)',
                  borderColor: activeDay === d.day ? 'var(--orange)' : 'rgba(255,255,255,0.05)',
                }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: activeDay === d.day ? 'var(--orange)' : '#f5f0e8', lineHeight: 1 }}>{d.label}</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', color: activeDay === d.day ? 'rgba(255,77,0,0.6)' : 'rgba(245,240,232,0.3)', letterSpacing: '0.1em', marginTop: '4px', textTransform: 'uppercase' }}>{d.date}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-4 mb-8">
             <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#f5f0e8', margin: 0 }}>DAY {activeDay} INTEL</h2>
             <div className="flex-1 h-[1px] bg-gradient-to-r from-orange-500/30 to-transparent" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {['Morning', 'Afternoon', 'Evening'].map((slot, si) => {
              const activity = activities.find(a => a.time === slot);
              return (
                <div key={slot} style={{ display: 'flex', gap: '28px', position: 'relative' }}>
                  {/* Time indicator */}
                  <div style={{ width: '90px', flexShrink: 0, textAlign: 'right', paddingTop: '24px' }}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,77,0,0.5)', fontWeight: 'bold' }}>{slot}</div>
                  </div>

                  {/* Timeline line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--orange)', boxShadow: '0 0 10px var(--orange)', marginTop: '26px', flexShrink: 0 }} />
                    {si < 2 && <div style={{ width: '1px', flex: 1, background: 'linear-gradient(to bottom, var(--orange), transparent)', marginTop: '8px', marginBottom: '8px', minHeight: '60px' }} />}
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, paddingBottom: '32px', paddingTop: '12px' }}>
                    {activity ? (
                      <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={`${activeDay}-${slot}`}
                        style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <div style={{ fontSize: '32px', lineHeight: 1 }}>{activity.icon}</div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', color: '#f5f0e8', margin: 0, letterSpacing: '0.02em' }}>{activity.title}</h3>
                              <span style={{ fontSize: '9px', padding: '2px 10px', border: '1px solid rgba(255,77,0,0.3)', borderRadius: '100px', color: 'var(--orange)', textTransform: 'uppercase', fontWeight: 'bold' }}>{activity.category}</span>
                            </div>
                            <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>{activity.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button whileHover={{ scale: 1.01, borderColor: 'rgba(255,77,0,0.3)', background: 'rgba(255,77,0,0.02)' }}
                        style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px', background: 'transparent', transition: 'all 0.3s' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,77,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={18} style={{ color: 'var(--orange)' }} />
                        </div>
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Assign Activity to {slot}</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accommodation Panel */}
        <div style={{ position: 'sticky', top: '120px' }}>
          <div className="section-label section-label-left" style={{ marginBottom: '24px' }}>Base of Operations</div>
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <img src={HOTEL.img} alt={HOTEL.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--dark), transparent)', borderRadius: '12px' }} />
            </div>
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', color: '#f5f0e8', margin: '0 0 4px' }}>{HOTEL.name}</h3>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', color: 'rgba(255,77,0,0.6)', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{HOTEL.room}</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[['IN', HOTEL.checkIn], ['OUT', HOTEL.checkOut]].map(([lbl, val]) => (
                <div key={lbl} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>{lbl}</div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', color: '#f5f0e8' }}>{val}</div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <Bed size={16} style={{ color: 'var(--orange)' }} />
              <span>7 nights · <span style={{ color: '#f5f0e8', fontWeight: 'bold' }}>$4,760 total</span></span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: '24px', marginTop: '20px', background: 'transparent', borderStyle: 'dashed' }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>Tactical Add</div>
            <div className="flex flex-col gap-2">
               {[{ icon: Utensils, label: 'Add Dining' }, { icon: Camera, label: 'Add Spot' }].map(q => (
                 <motion.button key={q.label} whileHover={{ x: 4, color: 'var(--orange)', background: 'rgba(255,77,0,0.05)' }}
                   style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '8px', transition: 'all 0.2s' }}>
                   <q.icon size={16} style={{ color: 'var(--orange)' }} /> {q.label}
                 </motion.button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryBuilder;
