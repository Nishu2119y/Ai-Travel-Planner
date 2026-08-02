import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Destinations', href: '/search-results' },
  { label: 'My History', href: '/dashboard' },
  { label: 'About', href: '/contact-us' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: scrolled
          ? 'rgba(2, 6, 23, 0.95)'
          : 'rgba(2, 6, 23, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(59, 130, 246, 0.2)'
          : '1px solid rgba(59, 130, 246, 0.1)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              width: '36px', height: '36px',
              background: 'var(--orange)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Plane size={18} color="white" />
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '22px',
              letterSpacing: '0.06em',
              color: '#f5f0e8',
            }}>
              <span style={{ color: 'var(--orange)' }}>TRIP</span>GENIE
            </span>
            <span style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '8px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(245, 240, 232, 0.45)',
              marginTop: '1px',
            }}>
              AI Travel Planner
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--orange)' : 'rgba(245, 240, 232, 0.75)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  position: 'relative',
                  paddingBottom: '4px',
                }}
                onMouseEnter={e => e.target.style.color = '#f5f0e8'}
                onMouseLeave={e => e.target.style.color = isActive ? 'var(--orange)' : 'rgba(245, 240, 232, 0.75)'}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      height: '2px',
                      background: 'var(--orange)',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/create-trip" className="hidden md:block">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: '12px', padding: '8px 20px' }}
            >
              <Plane size={14} />
              Plan a Trip
            </motion.button>
          </Link>

          {/* Mobile hamburger */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--cream)',
              cursor: 'pointer',
            }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen
                ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><X size={20} /></motion.div>
                : <motion.div key="menu" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><Menu size={20} /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              top: '72px', left: 0, right: 0,
              background: 'rgba(2, 6, 23, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.href}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: '15px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(245, 240, 232, 0.85)',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(216, 83, 42, 0.12)'; e.currentTarget.style.color = 'var(--orange)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(245, 240, 232, 0.85)'; }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
                <Link to="/create-trip">
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}>
                    <Plane size={15} />
                    Plan a Trip
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
