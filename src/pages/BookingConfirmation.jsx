import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Plane, Bed, Camera, CreditCard, Phone, Download, ArrowRight } from 'lucide-react';

const BOOKING = {
  ref: 'WL-2024-SAN-7842',
  flight: { from: 'New Delhi (DEL)', to: 'Santorini (JTR)', dep: 'Jun 12 · 02:30', arr: 'Jun 12 · 09:45', airline: 'Aegean Airlines', class: 'Economy', ref: 'AE-78421' },
  hotel: { name: 'Canaves Oia Suites', room: 'Infinity Pool Suite', checkIn: 'Jun 12', checkOut: 'Jun 19', ref: 'HOT-44821' },
  activities: ['Catamaran Sunset Cruise', 'Akrotiri Guided Tour', 'Wine Tasting at Venetsanos', 'Cooking Class'],
  payment: { flight: 1240, hotel: 4760, activities: 480, taxes: 245, total: 6725 },
};

function BookingConfirmation() {
  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '72px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ width: '80px', height: '80px', background: 'rgba(216,83,42,0.15)', border: '2px solid var(--orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={36} style={{ color: 'var(--orange)' }} />
          </motion.div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 72px)', color: '#f5f0e8', margin: '0 0 8px' }}>BOOKING CONFIRMED!</h1>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '15px', marginBottom: '16px' }}>Your Santorini adventure is all set. Get ready to explore!</p>
          <div className="glass-card-dark" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '100px' }}>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)' }}>Booking Reference: </span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: 'var(--orange)', letterSpacing: '0.1em' }}>{BOOKING.ref}</span>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* Flight */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '38px', height: '38px', background: 'rgba(216,83,42,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={18} style={{ color: 'var(--orange)' }} />
              </div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f0e8' }}>Flight Details</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#f5f0e8', lineHeight: 1 }}>DEL</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px', color: 'rgba(245,240,232,0.4)', marginTop: '2px' }}>New Delhi</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--orange)', marginBottom: '4px' }}>✈ ── ──</div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.08em' }}>7h 15m</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#f5f0e8', lineHeight: 1 }}>JTR</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px', color: 'rgba(245,240,232,0.4)', marginTop: '2px' }}>Santorini</div>
              </div>
            </div>
            {[['Departure', BOOKING.flight.dep], ['Arrival', BOOKING.flight.arr], ['Airline', BOOKING.flight.airline], ['Class', BOOKING.flight.class], ['Ref', BOOKING.flight.ref]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(245,240,232,0.05)', fontSize: '13px' }}>
                <span style={{ color: 'rgba(245,240,232,0.4)', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em' }}>{k}</span>
                <span style={{ color: '#f5f0e8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</span>
              </div>
            ))}
          </motion.div>

          {/* Hotel */}
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '38px', height: '38px', background: 'rgba(216,83,42,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bed size={18} style={{ color: 'var(--orange)' }} />
              </div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f0e8' }}>Accommodation</div>
            </div>
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" alt="Hotel" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', color: '#f5f0e8', margin: '0 0 4px' }}>{BOOKING.hotel.name}</h3>
            <div style={{ color: 'rgba(245,240,232,0.5)', fontSize: '13px', marginBottom: '16px' }}>{BOOKING.hotel.room}</div>
            {[['Check-in', BOOKING.hotel.checkIn], ['Check-out', BOOKING.hotel.checkOut], ['Duration', '7 nights'], ['Ref', BOOKING.hotel.ref]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(245,240,232,0.05)', fontSize: '13px' }}>
                <span style={{ color: 'rgba(245,240,232,0.4)', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em' }}>{k}</span>
                <span style={{ color: '#f5f0e8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Activities + Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '38px', height: '38px', background: 'rgba(216,83,42,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={18} style={{ color: 'var(--orange)' }} />
              </div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f0e8' }}>Booked Activities</div>
            </div>
            {BOOKING.activities.map((a, i) => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
                <CheckCircle size={14} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                <span style={{ color: 'rgba(245,240,232,0.75)', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '38px', height: '38px', background: 'rgba(216,83,42,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} style={{ color: 'var(--orange)' }} />
              </div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f0e8' }}>Payment Summary</div>
            </div>
            {[['Flights', BOOKING.payment.flight], ['Hotel (7 nights)', BOOKING.payment.hotel], ['Activities', BOOKING.payment.activities], ['Taxes & Fees', BOOKING.payment.taxes]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(245,240,232,0.05)', fontSize: '14px' }}>
                <span style={{ color: 'rgba(245,240,232,0.55)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k}</span>
                <span style={{ color: '#f5f0e8', fontFamily: "'Oswald', sans-serif" }}>${v.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', marginTop: '4px' }}>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f0e8' }}>Total Paid</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: 'var(--orange)' }}>${BOOKING.payment.total.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>

        {/* Support + Actions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="glass-card-dark" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '12px', flex: '1 1 200px' }}>
            <Phone size={18} style={{ color: 'var(--orange)' }} />
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>24/7 Support</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#f5f0e8' }}>+1 (800) TRIPGENIE</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <motion.button className="btn-outline" whileHover={{ scale: 1.03 }} style={{ fontSize: '13px', padding: '12px 24px' }}>
              <Download size={15} /> Download Itinerary
            </motion.button>
            <Link to="/my-trips">
              <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} style={{ fontSize: '13px', padding: '12px 24px' }}>
                View My Trips <ArrowRight size={15} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
