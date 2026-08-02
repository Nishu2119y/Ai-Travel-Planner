import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const TRENDING_PLACES = [
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', desc: 'Neon Lights & Zen', img: 'https://images.unsplash.com/photo-1540959733332-e94e270b4d42?w=120' },
  { name: 'Bali', country: 'Indonesia', flag: '🇮🇩', desc: 'Island Spirit', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120' },
  { name: 'Paris', country: 'France', flag: '🇫🇷', desc: 'City of Lights', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=120' },
  { name: 'London', country: 'UK', flag: '🇬🇧', desc: 'Timeless Heritage', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=120' },
];

function SearchBar({ compact = false, initialValues = {} }) {
  const navigate = useNavigate();
  const [showTrending, setShowTrending] = useState(false);
  const [fields, setFields] = useState({
    destination: initialValues.destination || '',
    startDate:   initialValues.startDate   || '',
    endDate:     initialValues.endDate     || '',
    guests:      initialValues.guests      || '',
  });

  const handleChange = (key) => (e) => setFields(prev => ({ ...prev, [key]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fields.destination) params.set('destination', fields.destination);
    if (fields.startDate)   params.set('start', fields.startDate);
    if (fields.endDate)     params.set('end', fields.endDate);
    if (fields.guests)      params.set('guests', fields.guests);
    navigate(`/search-results?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 180px', position: 'relative' }}>
          <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--blue)', pointerEvents: 'none' }} />
          <input className="input-dark" value={fields.destination} onChange={handleChange('destination')} placeholder="Destination" style={{ paddingLeft: '36px', fontSize: '13px', height: '42px', borderRadius: '8px' }} />
        </div>
        <div style={{ flex: '1 1 130px', position: 'relative' }}>
          <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--blue)', pointerEvents: 'none' }} />
          <input className="input-dark" type="date" value={fields.startDate} onChange={handleChange('startDate')} style={{ paddingLeft: '36px', fontSize: '13px', height: '42px', borderRadius: '8px' }} />
        </div>
        <div style={{ flex: '1 1 130px', position: 'relative' }}>
          <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--blue)', pointerEvents: 'none' }} />
          <input className="input-dark" type="date" value={fields.endDate} onChange={handleChange('endDate')} style={{ paddingLeft: '36px', fontSize: '13px', height: '42px', borderRadius: '8px' }} />
        </div>
        <div style={{ flex: '0 0 100px', position: 'relative' }}>
          <Users size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--blue)', pointerEvents: 'none' }} />
          <input className="input-dark" type="number" min="1" max="20" value={fields.guests} onChange={handleChange('guests')} placeholder="Guests" style={{ paddingLeft: '36px', fontSize: '13px', height: '42px', borderRadius: '8px' }} />
        </div>
        <motion.button type="submit" className="btn-blue-circle" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} style={{ flexShrink: 0, width: '42px', height: '42px', background: 'var(--blue)' }}>
          <Search size={16} color="white" />
        </motion.button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch}>
      <motion.div
        className="search-bar-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ flexWrap: 'wrap', gap: '0', borderRadius: '16px', padding: '16px 20px', justifyContent: 'space-between' }}
      >
        {/* Destination */}
        <div style={{ flex: '2 1 200px', display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px', position: 'relative' }}>
          <MapPin size={18} style={{ color: 'var(--blue)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)', marginBottom: '2px' }}>Destination</div>
            <input
              className="search-field"
              value={fields.destination}
              onChange={handleChange('destination')}
              onFocus={() => setShowTrending(true)}
              onBlur={() => setTimeout(() => setShowTrending(false), 200)}
              placeholder="Search for perfect destination"
              style={{ padding: 0, fontSize: '14px', width: '100%' }}
            />
          </div>

          {/* Trending Dropdown */}
          <AnimatePresence>
            {showTrending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  marginTop: '12px', background: 'rgba(15,23,42,0.95)',
                  backdropFilter: 'blur(20px)', borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px',
                  zIndex: 100, boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '16px', padding: '8px 12px 0' }}>Trending Destinations</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {TRENDING_PLACES.map((place) => (
                    <motion.div
                      key={place.name}
                      whileHover={{ background: 'rgba(255,77,0,0.1)', x: 4 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px',
                        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onClick={() => {
                        setFields(prev => ({ ...prev, destination: `${place.name}, ${place.country}` }));
                        setShowTrending(false);
                      }}
                    >
                      <img src={place.img} alt={place.name} style={{ width: '48px', height: '48px', borderRadius: '100px', objectFit: 'cover', border: '2px solid rgba(59, 130, 246, 0.3)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', color: '#f5f0e8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="truncate">{place.name}</span>
                          <span style={{ fontSize: '12px' }}>{place.flag}</span>
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase', tracking: '0.1em' }}>{place.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="search-divider" />

        {/* Start Date */}
        <div style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px' }}>
          <Calendar size={18} style={{ color: 'var(--blue)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)', marginBottom: '2px' }}>Start Date</div>
            <input
              className="search-field"
              type="date"
              value={fields.startDate}
              onChange={handleChange('startDate')}
              style={{ padding: 0, fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>

        <div className="search-divider" />

        {/* End Date */}
        <div style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px' }}>
          <Calendar size={18} style={{ color: 'var(--blue)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)', marginBottom: '2px' }}>End Date</div>
            <input
              className="search-field"
              type="date"
              value={fields.endDate}
              onChange={handleChange('endDate')}
              style={{ padding: 0, fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>

        <div className="search-divider" />

        {/* Guests */}
        <div style={{ flex: '1 1 100px', display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 12px' }}>
          <Users size={18} style={{ color: 'var(--blue)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)', marginBottom: '2px' }}>Guests</div>
            <input
              className="search-field"
              type="number"
              min="1"
              max="20"
              value={fields.guests}
              onChange={handleChange('guests')}
              placeholder="Add no. of visitors"
              style={{ padding: 0, fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>

        {/* Search Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{ margin: '4px 0 4px 12px', width: '52px', height: '52px', borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
        >
          <Search size={20} color="white" />
        </motion.button>
      </motion.div>
    </form>
  );
}

export default SearchBar;
