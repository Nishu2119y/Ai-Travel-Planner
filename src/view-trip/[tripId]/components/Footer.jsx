import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Instagram, Twitter, Youtube, Facebook, Github, Heart } from 'lucide-react';

const COLS = [
  { heading: 'Explore', links: [{ label: 'Destinations', href: '/search-results' }, { label: 'Find Your Mood', href: '/search-results' }, { label: 'Itinerary Builder', href: '/itinerary-builder' }, { label: 'My Trips', href: '/my-trips' }] },
  { heading: 'Company', links: [{ label: 'About', href: '/contact-us' }, { label: 'Contact', href: '/contact-us' }, { label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }] },
  { heading: 'Contact', links: [{ label: 'arnavv0592@gmail.com', href: 'mailto:arnavv0592@gmail.com' }, { label: '+91 9931271488', href: 'tel:+919931271488' }, { label: 'Help Center', href: '#' }] },
];

const SOCIALS = [
  { icon: Github,    href: 'https://github.com/Nishu2119y', color: '#D8532A' },
  { icon: Instagram, href: '#', color: '#D8532A' },
  { icon: Twitter,   href: '#', color: '#1B8A9C' },
  { icon: Youtube,   href: '#', color: '#D84242' },
  { icon: Facebook,  href: '#', color: '#3B5BA5' },
];

function Footer() {
  return (
    <footer style={{ background: '#0a0f14', borderTop: '1px solid rgba(216,83,42,0.15)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: '48px', marginBottom: '56px' }}>

          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--orange)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={18} color="white" />
              </div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.06em', color: '#f5f0e8' }}>
                <span style={{ color: 'var(--orange)' }}>TRIP</span>GENIE
              </span>
            </Link>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', lineHeight: 1.7, color: 'rgba(245,240,232,0.45)', marginBottom: '24px', maxWidth: '260px' }}>
              Crafting extraordinary journeys through the power of artificial intelligence.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {SOCIALS.map(s => (
                <motion.a key={s.href + s.color} href={s.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(216,83,42,0.08)', border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  <s.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Other columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <h4 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '20px', margin: '0 0 20px' }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.href} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: 'rgba(245,240,232,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--orange)'}
                      onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.5)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(245,240,232,0.06)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.25)', margin: 0 }}>
            © {new Date().getFullYear()} TripGenie AI. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>
            Made with{' '}
            <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
            </motion.span>
            {' '}by <span style={{ color: 'var(--orange)', fontWeight: 600 }}>Arnav</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;