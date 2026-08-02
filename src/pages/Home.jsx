import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Globe, Zap, Shield, Heart, Star, Users, MapPin } from 'lucide-react';
import SearchBar from '../components/custom/SearchBar';

const MOODS = [
  { icon: '🏔️', label: 'Adventure', sub: 'Into the Wild', color: '#3b82f6' },
  { icon: '🏖️', label: 'Beach',     sub: 'Sun & Serenity', color: '#10b981' },
  { icon: '🎭', label: 'Culture',   sub: 'Art & Heritage', color: '#f59e0b' },
  { icon: '🌆', label: 'City Life', sub: 'Urban Escapes',  color: '#8b5cf6' },
  { icon: '🍽️', label: 'Culinary',  sub: 'Taste the World',color: '#ef4444' },
  { icon: '🧘', label: 'Wellness',  sub: 'Rest & Recharge',color: '#06b6d4' },
];

const FEATURES = [
  { icon: Zap,    title: 'Lightning Fast',  desc: 'Full itineraries in under 10 seconds',     accent: '#3b82f6' },
  { icon: Globe,  title: 'Global Coverage', desc: '200+ destinations with local insights',      accent: '#10b981' },
  { icon: Shield, title: 'Safe & Secure',   desc: 'Your data encrypted and never shared',       accent: '#8b5cf6' },
  { icon: Heart,  title: 'Personalised',    desc: 'AI learns your style for better trips',      accent: '#f59e0b' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const DESTINATIONS = [
  { name: 'Santorini', country: 'Greece', rating: 4.9, img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', tag: 'Romantic' },
  { name: 'Bali', country: 'Indonesia', rating: 4.8, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', tag: 'Tropical' },
  { name: 'Swiss Alps', country: 'Switzerland', rating: 4.9, img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600', tag: 'Adventure' },
];

function Home() {
  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=90)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,6,23,0.4), var(--dark))' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 80px', width: '100%' }}>
          {/* Label */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
              background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '100px', padding: '6px 16px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)' }}>
            <Sparkles size={14} style={{ color: 'var(--blue)' }} />
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--blue)' }}>
              Next-Gen AI Travel Planner
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(80px, 14vw, 160px)', lineHeight: 0.9,
              letterSpacing: '0.03em', background: 'linear-gradient(to right, var(--blue), var(--teal))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px', filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))' }}>
            TRAVEL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 300,
              letterSpacing: '0.08em', color: 'rgba(245, 240, 232, 0.85)', marginBottom: '48px', textTransform: 'uppercase' }}>
            Your adventure, <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>Our passion</em>
          </motion.p>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} style={{ maxWidth: '900px' }}>
            <SearchBar />
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: '40px', marginTop: '48px', flexWrap: 'wrap' }}>
            {[['50K+', 'Travelers'], ['200+', 'Places'], ['10s', 'AI Build'], ['99%', 'Joy Rate']].map(([num, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: 'var(--blue)', lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginTop: '2px' }}>{lbl}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Find Your Mood ── */}
      <section style={{ padding: '100px 24px', background: 'var(--dark)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>Find Your Mood</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', color: '#f5f0e8', marginBottom: '12px' }}>
              TRAVEL YOUR <span className="shimmer-text">WAY</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {MOODS.map((m, i) => (
              <motion.div key={m.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${m.color}33`,
                  borderRadius: '16px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: `0 10px 30px ${m.color}0a`
                }}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>{m.icon}</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: '6px' }}>{m.label}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#f5f0e8' }}>{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Destinations ── */}
      <section style={{ padding: '100px 24px', background: 'var(--midnight)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="section-label section-label-left" style={{ marginBottom: '12px' }}>Top Picks</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', color: '#f8fafc', margin: 0 }}>
                FEATURED <span style={{ color: 'var(--blue)' }}>DESTINATIONS</span>
              </h2>
            </div>
            <Link to="/search-results">
              <motion.button className="btn-outline" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ fontSize: '12px' }}>
                View All <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {DESTINATIONS.map((d, i) => (
              <motion.div key={d.name} className="travel-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ background: 'rgba(255,255,255,0.03)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Link to={`/destination/${d.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
                    <img className="travel-card-img" src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--dark) 0%, transparent 100%)' }} />
                    <div className="tag tag-blue" style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#93c5fd' }}>{d.tag}</div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', color: '#f5f0e8', margin: '0 0 2px' }}>{d.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(245,240,232,0.4)', fontSize: '13px' }}>
                          <MapPin size={12} style={{ color: 'var(--orange)' }} />{d.country}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '4px 10px' }}>
                        <Star size={12} style={{ color: 'var(--blue)', fill: 'var(--blue)' }} />
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', color: '#f5f0e8' }}>{d.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '100px 24px', background: 'var(--dark)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>TripGenie Intelligence</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', color: '#f8fafc' }}>
              REVOLUTIONIZING <span style={{ color: 'var(--teal)' }}>YOUR TRAVELS</span>
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="glass-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, background: 'rgba(255,255,255,0.08)' }}
                style={{ padding: '32px', borderColor: 'rgba(255,77,0,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ width: '52px', height: '52px', background: `${f.accent}1a`, border: `1px solid ${f.accent}4d`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: `0 0 15px ${f.accent}33` }}>
                  <f.icon size={22} style={{ color: f.accent }} />
                </div>
                <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', color: '#f5f0e8', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Odyssey History ── */}
      <RecentTripsSection />

      {/* ── CTA ── */}
      <section style={{ padding: '120px 24px', background: 'linear-gradient(to bottom, var(--dark), var(--midnight))' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '20px' }}>Join the Movement</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', color: '#f5f0e8', lineHeight: 0.95, marginBottom: '24px' }}>
              THE FUTURE OF<br /><span className="shimmer-text">ADVENTURE</span>
            </h2>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
              <Link to="/create-trip">
                <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ fontSize: '14px', padding: '16px 40px', background: 'var(--blue)', border: 'none', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>
                   Plan My Odyssey Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Sub-component for Recent Trips
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../service/firebase';
import { useState, useEffect } from 'react';

function RecentTripsSection() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTrips = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const anonIds = JSON.parse(localStorage.getItem('anonymousTrips') || '[]');

      try {
        let fetchedTrips = [];

        if (user) {
          // Logged in user: Fetch by email
          const q = query(
            collection(db, 'AITrips'),
            where('userEmail', '==', user.email),
            limit(3)
          );
          const snap = await getDocs(q);
          snap.forEach(doc => fetchedTrips.push({ id: doc.id, ...doc.data() }));
        } else if (anonIds.length > 0) {
          // Anonymous user: Fetch by specific IDs from localStorage
          // Firestore doesn't support 'where id in [...]' easily for anonymous docs without specific field
          // We'll fetch them individually or use a limit
          for (const id of anonIds.slice(0, 3)) {
            const docSnap = await getDocs(query(collection(db, 'AITrips'), where('id', '==', id)));
            if (!docSnap.empty) {
               fetchedTrips.push({ id: docSnap.docs[0].id, ...docSnap.docs[0].data() });
            }
          }
        }

        // Sort by date
        fetchedTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTrips(fetchedTrips);
      } catch (error) {
        console.error("Error fetching recent trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTrips();
  }, []);

  if (loading) return null;

  // If no history, we could show a "Start your first trip" card or nothing. 
  // User specifically asked "where is history", so let's show an empty state if they are on Home.
  if (trips.length === 0) {
    return (
      <section style={{ padding: '60px 24px', background: 'var(--dark)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
           <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>Your History</div>
           <h3 className="font-heading text-4xl text-white/20 uppercase tracking-widest">No Recent Odysseys Found</h3>
           <p className="text-white/10 text-xs mt-4">Generate your first plan to start your travel log.</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '100px 24px', background: 'var(--dark)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="section-label section-label-left" style={{ marginBottom: '12px' }}>Resume Journey</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', color: '#f8fafc', margin: 0 }}>
              RECENT <span style={{ color: 'var(--blue)' }}>ODYSSEYS</span>
            </h2>
          </div>
          <Link to="/dashboard">
            <motion.button className="btn-outline" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ fontSize: '12px' }}>
              Full Dashboard <ArrowRight size={14} />
            </motion.button>
          </Link>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {trips.map((trip, i) => (
            <motion.div 
              key={trip.id} 
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-[#1e1e2e]/40 border border-white/5 rounded-[2.5rem] overflow-hidden"
            >
              <Link to={`/view-trip/${trip.id}`} className="block h-full">
                <div className="h-48 relative overflow-hidden">
                   <img 
                     src={trip.TripData?.locationImageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                     alt={trip.userSelection?.location?.label}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                   <div className="absolute top-6 left-6">
                      <div className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                        {trip.userSelection?.budget}
                      </div>
                   </div>
                </div>
                <div className="p-8">
                  <h3 className="font-heading text-3xl text-white mb-2 leading-none">{trip.userSelection?.location?.label.split(',')[0]}</h3>
                  <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500/50" /> {trip.userSelection?.noOfDays} Days</span>
                     <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500/50" /> {new Date(trip.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-orange-500/20 transition-all">
                     <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{trip.userSelection?.travelers}</span>
                     </div>
                     <div className="text-blue-500 flex items-center gap-2 group-hover:gap-4 transition-all">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Resume</span>
                        <ArrowRight size={14} />
                     </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Clock, Calendar } from 'lucide-react';

export default Home;
