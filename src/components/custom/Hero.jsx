import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Globe2, Star, Zap, MapPin } from 'lucide-react';

// SVG corner ornament
const CornerOrnament = ({ className = '' }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M0 0 L24 0 L24 2 L2 2 L2 24 L0 24 Z" fill="currentColor" />
  </svg>
);

function Hero() {
  const stats = [
    { number: '50K+', text: 'Happy Travelers' },
    { number: '200+', text: 'Destinations' },
    { number: '10s', text: 'Planning Time' },
    { number: '99%', text: 'Satisfaction' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20 bg-dark">
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=90)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,6,23,0.4), var(--dark))' }} />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-10"
          style={{
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '8px 24px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '100px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
          }}
        >
          <Sparkles size={14} className="text-blue-500" />
          <span style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--blue)',
          }}>
            Next-Gen AI Travel Planner
          </span>
          <Sparkles size={14} className="text-blue-500" />
        </motion.div>

        {/* Main H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(80px, 14vw, 160px)',
            lineHeight: 0.9,
            letterSpacing: '0.03em',
            background: 'linear-gradient(to right, var(--blue), var(--teal))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '32px',
            filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))'
          }}
        >
          <span style={{ display: 'block', color: 'var(--blue)' }}>TRAVEL</span>
          <span className="shimmer-text" style={{ display: 'block', background: 'linear-gradient(90deg, var(--blue) 0%, var(--cream) 50%, var(--blue) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BEYOND
          </span>
          <span style={{ display: 'block', color: 'var(--teal)' }}>LIMITS</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 'clamp(20px, 3vw, 32px)',
            fontWeight: 300,
            letterSpacing: '0.08em',
            color: 'rgba(245, 240, 232, 0.85)',
            marginBottom: '48px',
            textTransform: 'uppercase'
          }}
        >
          Your adventure, <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>Our passion</em>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link to="/create-trip">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-10 py-4 flex items-center gap-3 text-sm font-heading tracking-widest uppercase"
              style={{ background: 'var(--blue)', border: 'none', boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
            >
              <Zap size={16} />
              Plan My Odyssey
              <ArrowRight size={16} />
            </motion.button>
          </Link>
          <Link to="/view-trip/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline px-10 py-4 flex items-center gap-3 text-sm font-heading tracking-widest uppercase"
            >
              <Globe2 size={16} />
              Explore Demo
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex flex-wrap justify-center gap-12"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '40px',
                color: 'var(--blue)',
                lineHeight: 1,
              }}>
                {s.number}
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.4)',
              }}>
                {s.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;