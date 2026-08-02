import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoIosSend } from 'react-icons/io';
import { toast } from 'sonner';
import { getPhoto } from '../../../service/photoAPI';
import WeatherWidget from './WeatherWidget';
import { Calendar, DollarSign, Users, Share2, Zap } from 'lucide-react';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (trip?.userSelection?.location?.label) {
        const url = await getPhoto(trip.userSelection.location.label);
        setPhotoUrl(url);
      }
    };
    fetchPhoto();
  }, [trip]);

  const handleShare = async () => {
    const shareData = {
      title: 'Check out my AI-generated travel itinerary!',
      text: `I'm planning a trip to ${trip?.userSelection?.location?.label} for ${trip?.userSelection?.noOfDays} days.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) { await navigator.share(shareData); }
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch { toast.error('Failed to share trip.'); }
  };

  const TAGS = [
    { icon: '📅', val: `${trip?.userSelection?.noOfDays} Days`,                  color: 'rgba(27,139,100,0.15)', border: 'rgba(27,139,100,0.35)', text: '#4dbb8a' },
    { icon: '💰', val: trip?.userSelection?.budget,                               color: 'rgba(216,83,42,0.12)', border: 'rgba(216,83,42,0.35)',  text: '#e87a52' },
    { icon: '👥', val: `${trip?.userSelection?.travelers} Travelers`,             color: 'rgba(92,92,216,0.12)', border: 'rgba(92,92,216,0.35)',   text: '#9090e8' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '48px' }}>

      {/* Hero Image */}
      <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '16px', overflow: 'hidden', marginBottom: '28px' }}>
        <img
          src={photoUrl || trip?.TripData?.locationImageUrl || trip?.TripData?.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85'}
          alt={trip?.userSelection?.location?.label || 'Trip'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,20,26,0.7) 0%, transparent 55%)' }} />

        {/* Demo badge */}
        {trip?.isDemo && (
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(216,83,42,0.85)', backdropFilter: 'blur(8px)', borderRadius: '100px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} style={{ color: '#fff' }} />
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>Limit reached — Demo results</span>
          </div>
        )}

        {/* Share button */}
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ position: 'absolute', top: '16px', right: '16px', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(15,20,26,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(216,83,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--orange)' }}
        >
          <Share2 size={18} />
        </motion.button>

        {/* Location title on image */}
        <div style={{ position: 'absolute', bottom: '24px', left: '28px' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 72px)', color: '#f5f0e8', margin: 0, lineHeight: 0.95, textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
            {trip?.userSelection?.location?.label}
          </h1>
        </div>
      </div>

      {/* Tags row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {TAGS.map(t => t.val && (
          <div key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: t.color, border: `1px solid ${t.border}`, borderRadius: '100px', padding: '8px 16px' }}>
            <span style={{ fontSize: '14px' }}>{t.icon}</span>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: t.text, fontWeight: 500 }}>{t.val}</span>
          </div>
        ))}
      </div>

      {/* Weather widget */}
      <WeatherWidget destination={trip?.userSelection?.location?.label} />

      {/* Best Time to Visit */}
      {trip?.TripData?.bestTimeToVisit && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card" style={{ padding: '20px 24px', marginTop: '20px' }}>
          <div className="section-label section-label-left" style={{ marginBottom: '10px', fontSize: '11px' }}>Best Time to Visit</div>
          <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
            {trip.TripData.bestTimeToVisit}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default InfoSection;
