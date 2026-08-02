import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Send, Loader, CheckCircle, AlertTriangle, MessageCircle, Clock, Heart } from 'lucide-react';

function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formState, setFormState] = useState({ status: 'idle', message: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ status: 'loading', message: '' });
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!accessKey) {
      setFormState({ status: 'error', message: 'Form not configured. Add VITE_WEB3FORMS_KEY to your .env file.' });
      return;
    }
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_key: accessKey, ...formData, subject: formData.subject || 'New message from TripGenie Contact Form' }),
      });
      const result = await res.json();
      if (result.success) {
        setFormState({ status: 'success', message: 'Thank you! Your message has been sent.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else { throw new Error(result.message); }
    } catch {
      setFormState({ status: 'error', message: 'There was an issue sending your message. Please try again.' });
    }
  };

  const INFO = [
    { icon: Mail,  title: 'Email',         content: 'arnavv0592@gmail.com', href: 'mailto:arnavv0592@gmail.com' },
    { icon: Phone, title: 'Phone',          content: '+91 9931271488',       href: 'tel:+919931271488' },
    { icon: Clock, title: 'Response Time',  content: 'Within 24 hours',      href: null },
  ];

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', paddingTop: '72px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>Let's Connect</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', color: '#f5f0e8', margin: '0 0 16px', lineHeight: 0.9 }}>
            GET IN <span style={{ color: 'var(--orange)' }}>TOUCH</span>
          </h1>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Have questions about your travel plans? Want to collaborate? I'd love to hear from you!
          </p>
        </motion.div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '40px', alignItems: 'start' }}>

          {/* Left — Info */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {/* Intro card */}
            <div className="glass-card" style={{ padding: '32px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(216,83,42,0.15)', border: '2px solid rgba(216,83,42,0.3)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Heart size={24} style={{ color: 'var(--orange)' }} />
              </div>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '26px', color: '#f5f0e8', marginBottom: '12px' }}>Let's Create Something Amazing</h2>
              <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                Whether you have questions about travel planning or want to collaborate on innovative projects, I'm here to help make it happen.
              </p>
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {INFO.map(item => (
                <div key={item.title} className="glass-card-dark" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '12px' }}>
                  <div style={{ width: '42px', height: '42px', background: 'rgba(216,83,42,0.12)', border: '1px solid rgba(216,83,42,0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={18} style={{ color: 'var(--orange)' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: '3px' }}>{item.title}</div>
                    {item.href
                      ? <a href={item.href} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}>{item.content}</a>
                      : <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', color: '#f5f0e8' }}>{item.content}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              {[{ icon: Github, href: 'https://github.com/Nishu2119y', label: 'GitHub' }, { icon: Linkedin, href: '#', label: 'LinkedIn' }, { icon: MessageCircle, href: '#', label: 'Chat' }].map(s => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }} className="social-icon">
                  <s.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div className="glass-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ padding: '40px' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: '#f5f0e8', margin: '0 0 6px' }}>SEND A MESSAGE</h2>
            <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: '14px', marginBottom: '32px' }}>Fill out the form and I'll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', display: 'block', marginBottom: '6px' }}>Your Name</label>
                  <input id="name" type="text" value={formData.name} onChange={handleChange} required className="input-dark" placeholder="Arnav" />
                </div>
                <div>
                  <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input id="email" type="email" value={formData.email} onChange={handleChange} required className="input-dark" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', display: 'block', marginBottom: '6px' }}>Subject</label>
                <input id="subject" type="text" value={formData.subject} onChange={handleChange} required className="input-dark" placeholder="How can I help?" />
              </div>
              <div>
                <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', display: 'block', marginBottom: '6px' }}>Message</label>
                <textarea id="message" value={formData.message} onChange={handleChange} required rows="6" className="input-dark" placeholder="Your message..." style={{ resize: 'vertical' }} />
              </div>

              <motion.button type="submit" disabled={formState.status === 'loading'} className="btn-primary" whileHover={{ scale: formState.status === 'loading' ? 1 : 1.02, y: formState.status === 'loading' ? 0 : -2 }} whileTap={{ scale: 0.98 }}
                style={{ justifyContent: 'center', fontSize: '14px', padding: '14px', opacity: formState.status === 'loading' ? 0.7 : 1 }}>
                {formState.status === 'loading'
                  ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader size={16} /></motion.div> Sending...</>
                  : <><Send size={16} /> Send Message</>}
              </motion.button>
            </form>

            {formState.status === 'success' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(22,160,80,0.12)', border: '1px solid rgba(22,160,80,0.3)', padding: '14px 18px', borderRadius: '10px', color: '#4ade80' }}>
                <CheckCircle size={18} /><span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' }}>{formState.message}</span>
              </motion.div>
            )}
            {formState.status === 'error' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', padding: '14px 18px', borderRadius: '10px', color: '#f87171' }}>
                <AlertTriangle size={18} /><span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' }}>{formState.message}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;
