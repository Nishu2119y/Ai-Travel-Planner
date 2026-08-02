import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Cloud, Thermometer, Umbrella, Wind, Heart, Share2, Calendar, Users, ChevronRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const DEST_DATA = {
  default: {
    name: 'Santorini', country: 'Greece', rating: 4.9, reviews: 2847,
    img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=90',
    desc: 'A stunning volcanic island in the Cyclades, famous for its dramatic views, whitewashed architecture, and breathtaking sunsets over the Aegean Sea.',
    temp: '24°C', weather: 'Sunny', humidity: '52%', wind: '12 km/h',
    forecast: [
      { day: 'Mon', icon: '☀️', temp: '25°C' }, { day: 'Tue', icon: '⛅', temp: '23°C' },
      { day: 'Wed', icon: '☀️', temp: '26°C' }, { day: 'Thu', icon: '🌤️', temp: '24°C' },
      { day: 'Fri', icon: '☀️', temp: '27°C' },
    ],
    attractions: [
      { name: "Oia Village",       img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80', type: 'Landmark' },
      { name: "Red Beach",         img: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=80', type: 'Nature' },
      { name: "Akrotiri Ruins",    img: 'https://images.unsplash.com/photo-1602526430780-782d6b1783fa?w=400&q=80', type: 'History' },
      { name: "Caldera Viewpoint", img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80', type: 'Scenic' },
    ],
    hotels: [
      { name: 'Canaves Oia Suites', stars: 5, price: 680, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', amenities: ['Pool', 'Spa', 'Sea View'] },
      { name: 'Grace Hotel',        stars: 5, price: 520, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80', amenities: ['Pool', 'Restaurant', 'Bar'] },
      { name: 'Astra Suites',       stars: 4, price: 340, img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80', amenities: ['Breakfast', 'Sea View', 'Free WiFi'] },
    ],
  }
};

const TABS = ['Dining', 'Culture', 'Adventure', 'Shopping'];

function DestinationDetail() {
  const { id } = useParams();
  const dest = DEST_DATA.default;
  const [activeTab, setActiveTab] = useState('Dining');
  const [saved, setSaved] = useState(false);
  
  const { formatPrice } = useCurrency();

  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '72px' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
        <img src={dest.img} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0 }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/search-results">
            <motion.button whileHover={{ x: -3 }} className="glass-card-dark" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', border: 'none', cursor: 'pointer', color: '#f5f0e8', fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '8px' }}>
              <ArrowLeft size={16} /> Back
            </motion.button>
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => setSaved(!saved)}
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(15,20,26,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245,240,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Heart size={18} style={{ color: saved ? '#D8532A' : '#f5f0e8', fill: saved ? '#D8532A' : 'none' }} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }}
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(15,20,26,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245,240,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={18} style={{ color: '#f5f0e8' }} />
            </motion.button>
          </div>
        </div>

        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: '40px', left: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'rgba(245,240,232,0.7)', fontSize: '14px' }}>
            <MapPin size={14} style={{ color: 'var(--orange)' }} />{dest.country}
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 8vw, 90px)', color: '#f5f0e8', lineHeight: 0.9, marginBottom: '12px' }}>{dest.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>{[...Array(5)].map((_, i) => <Star key={i} size={14} style={{ color: '#f0a330', fill: '#f0a330' }} />)}</div>
            <span style={{ color: '#f5f0e8', fontFamily: "'Oswald', sans-serif" }}>{dest.rating} · {dest.reviews.toLocaleString()} reviews</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' }}>
        <div>
          {/* Description */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: '48px' }}>
            <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: '16px', lineHeight: 1.8 }}>{dest.desc}</p>
          </motion.div>

          {/* Weather */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: '48px' }}>
            <div className="section-label section-label-left" style={{ marginBottom: '20px' }}>Current Weather</div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', color: 'var(--orange)', lineHeight: 1 }}>{dest.temp}</div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)' }}>{dest.weather}</div>
                </div>
                {[
                  { icon: Umbrella,    label: 'Humidity', val: dest.humidity },
                  { icon: Wind,        label: 'Wind',     val: dest.wind },
                  { icon: Thermometer, label: 'Feels',    val: dest.temp },
                ].map(w => (
                  <div key={w.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(216,83,42,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <w.icon size={18} style={{ color: 'var(--orange)' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>{w.label}</div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', color: '#f5f0e8' }}>{w.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {dest.forecast.map(f => (
                  <div key={f.day} className="glass-card-dark" style={{ flex: '1 1 70px', textAlign: 'center', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>{f.day}</div>
                    <div style={{ fontSize: '22px', marginBottom: '4px' }}>{f.icon}</div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', color: '#f5f0e8' }}>{f.temp}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Attractions */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: '48px' }}>
            <div className="section-label section-label-left" style={{ marginBottom: '20px' }}>Must-See Attractions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {dest.attractions.map(a => (
                <motion.div key={a.name} className="travel-card" whileHover={{ y: -4 }} style={{ background: 'var(--dark-2)' }}>
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img className="travel-card-img" src={a.img} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div className="tag tag-orange" style={{ marginBottom: '6px' }}>{a.type}</div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', color: '#f5f0e8' }}>{a.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Experiences Tabs */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: '48px' }}>
            <div className="section-label section-label-left" style={{ marginBottom: '20px' }}>Recommended Experiences</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 20px', borderRadius: '100px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                    background: activeTab === tab ? 'var(--orange)' : 'transparent',
                    borderColor: activeTab === tab ? 'var(--orange)' : 'rgba(245,240,232,0.2)',
                    color: activeTab === tab ? '#fff' : 'rgba(245,240,232,0.6)',
                  }}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="glass-card" style={{ padding: '24px', minHeight: '100px', color: 'rgba(245,240,232,0.65)', fontSize: '14px', lineHeight: 1.7 }}>
              {activeTab === 'Dining' && '🍽️ Try the fresh seafood at Lycabettus terrace, sip local Assyrtiko wine at Venetsanos Winery, and enjoy sunset dinner at Ambrosia restaurant in Oia.'}
              {activeTab === 'Culture' && '🎭 Visit the Museum of Prehistoric Thera, explore the ancient ruins of Akrotiri, and watch traditional folk dancing at local festivals.'}
              {activeTab === 'Adventure' && '🧗 Hike the 10km trail from Fira to Oia, take a catamaran cruise around the caldera, or dive the underwater volcanic landscape.'}
              {activeTab === 'Shopping' && '🛍️ Browse local ceramics at artisan studios in Firostefani, pick up handwoven fabrics in Pyrgos, and explore the jewelry boutiques in Fira.'}
            </div>
          </motion.div>

          {/* Hotels */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="section-label section-label-left" style={{ marginBottom: '20px' }}>Recommended Accommodations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dest.hotels.map(h => (
                <div key={h.name} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <img src={h.img} alt={h.name} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', color: '#f5f0e8', margin: '0 0 4px' }}>{h.name}</h3>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>{[...Array(h.stars)].map((_, i) => <Star key={i} size={11} style={{ color: '#f0a330', fill: '#f0a330' }} />)}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {h.amenities.map(a => <span key={a} className="tag tag-teal">{a}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: 'var(--orange)' }}>{formatPrice(h.price)} <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Oswald'}}>/night</span></div>
                    <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px', marginTop: '8px' }}>Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sticky CTA Sidebar */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#f5f0e8', marginBottom: '4px' }}>Plan This Trip</div>
            <div style={{ color: 'rgba(245,240,232,0.5)', fontSize: '13px', marginBottom: '24px' }}>Get a personalised AI itinerary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(15,20,26,0.5)', borderRadius: '8px' }}>
                <Calendar size={16} style={{ color: 'var(--orange)' }} />
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>Duration</div>
                  <div style={{ color: '#f5f0e8', fontSize: '14px' }}>7 days recommended</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(15,20,26,0.5)', borderRadius: '8px' }}>
                <Users size={16} style={{ color: 'var(--orange)' }} />
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>Best For</div>
                  <div style={{ color: '#f5f0e8', fontSize: '14px' }}>Couples, Honeymooners</div>
                </div>
              </div>
            </div>
            <Link to="/create-trip">
              <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '14px' }}>
                Create AI Itinerary <ChevronRight size={15} />
              </motion.button>
            </Link>
            <Link to="/itinerary-builder">
              <motion.button className="btn-outline" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '12px', marginTop: '10px' }}>
                Manual Builder
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetail;
